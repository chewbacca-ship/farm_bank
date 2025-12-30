const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { query, pool } = require('./db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const resend = require('./lib/resend');
const app = express();
const PORT = process.env.PORT || 3000;
const clientURL = process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: clientURL }));
app.use(express.json());

function jwtRequired(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const numberFrom = (value) => (value === null || value === undefined ? 0 : parseFloat(value));
const toIsoString = (value) => (value ? new Date(value).toISOString() : null);
const computeFundingProgress = (raised, goal) => (goal > 0 ? parseFloat(((raised / goal) * 100).toFixed(2)) : 0);

function computeInvestmentReturn(investment) {
    const principal = numberFrom(investment.amount_invested);
    const startDate = new Date(investment.investment_date);
    if (!startDate || principal <= 0) return principal;

    const now = new Date();
    const elapsedMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth()); //eventually 12 will be changed to match each investment's duration_months

    const annualRate = numberFrom(investment.expected_return) / 100;
    const monthlyRate = annualRate / 12;

    return Number((principal * Math.pow(1 + monthlyRate, elapsedMonths)).toFixed(2));
}

async function withTransaction(handler) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await handler(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        
        client.release();
    }
}

async function getAccountForUser(client, userId, { forUpdate = false } = {}) {
    const lock = forUpdate ? 'FOR UPDATE' : '';
    const result = await client.query(
        `SELECT id, user_id, wallet_balance FROM accounts WHERE user_id = $1 ${lock}`,
        [userId]
    );
    return result.rows[0];
}

async function getOpportunityById(client, opportunityId, { forUpdate = false } = {}) {
    const lock = forUpdate ? 'FOR UPDATE' : '';
    const result = await client.query(
        `SELECT * FROM investment_opportunities WHERE id = $1 ${lock}`,
        [opportunityId]
    );
    return result.rows[0];
}

async function getInvestmentById(client, investmentId, userId, { forUpdate = false } = {}) {
    const lock = forUpdate ? 'FOR UPDATE' : '';
    const result = await client.query(
        `SELECT * FROM investments WHERE id = $1 AND user_id = $2 ${lock}`,
        [investmentId, userId]
    );
    return result.rows[0];
}

async function getInvestmentByOpportunity(client, userId, opportunityId, { forUpdate = false } = {}) {
    const lock = forUpdate ? 'FOR UPDATE' : '';
    const result = await client.query(
        `SELECT * FROM investments WHERE user_id = $1 AND opportunity_id = $2 ${lock}`,
        [userId, opportunityId]
    );
    return result.rows[0];
}

async function refreshInvestorCount(client, opportunityId) {
    const result = await client.query(
        `SELECT COUNT(*) AS count FROM (
            SELECT DISTINCT user_id
            FROM investments
            WHERE opportunity_id = $1 AND amount_invested > 0
        ) investor_counts`,
        [opportunityId]
    );
    const investorCount = parseInt(result.rows[0]?.count || '0', 10);
    await client.query(
        `UPDATE investment_opportunities SET investor_count = $1 WHERE id = $2`,
        [investorCount, opportunityId]
    );
    return investorCount;
}

async function adjustOpportunityTotals(client, opportunityId, deltaAmount) {
    const updatedResult = await client.query(
        `UPDATE investment_opportunities
         SET amount_raised = GREATEST(COALESCE(amount_raised, 0) + $1, 0)
         WHERE id = $2
         RETURNING *`,
        [deltaAmount, opportunityId]
    );

    const opportunity = updatedResult.rows[0];
    if (!opportunity) {
        throw new HttpError(404, 'Investment opportunity not found');
    }

    const investorCount = await refreshInvestorCount(client, opportunityId);
    opportunity.investor_count = investorCount;
    opportunity.funding_progress = computeFundingProgress(
        numberFrom(opportunity.amount_raised),
        numberFrom(opportunity.funding_goal)
    );
    return opportunity;
}

function buildInvestmentPayload(investmentRow, opportunityRow = {}) {
    const fundingGoal = numberFrom(opportunityRow.funding_goal);
    const amountRaised = numberFrom(opportunityRow.amount_raised);

    const currentValue = computeInvestmentReturn(investmentRow);

    return {
        id: investmentRow.id,
        opportunity_id: investmentRow.opportunity_id,
        title: opportunityRow.title,
        description: opportunityRow.description,
        category: opportunityRow.category,
        amount_invested: numberFrom(investmentRow.amount_invested),
        expected_return: numberFrom(investmentRow.expected_return),
        status: investmentRow.status,
        investment_date: toIsoString(investmentRow.investment_date),
        end_date: toIsoString(investmentRow.end_date || investmentRow.endate),
        funding_goal: fundingGoal,
        amount_raised: amountRaised,
        funding_progress: computeFundingProgress(amountRaised, fundingGoal),
        actual_return: currentValue,
        location: opportunityRow.location,
        duration_months: opportunityRow.duration_months,
    };
}

app.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        if (!data.username || !data.email || !data.password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUsername = await query('SELECT 1 FROM users WHERE username = $1', [data.username]);
        if (existingUsername.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const existingEmail = await query('SELECT 1 FROM users WHERE email = $1', [data.email]);
        if (existingEmail.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const insertQuery = `
            INSERT INTO users (first_name, last_name, username, email, phone_number, password_hash, investment_range, experience_level, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, first_name, last_name, username, email, phone_number, role
        `;

        const userResult = await query(insertQuery, [
            data.first_name || '',
            data.last_name || '',
            data.username || '',
            data.email || '',
            data.phone_number || 0,
            passwordHash,
            data.investment_range || '',
            data.experience_level || '',
            data.role || 'investor'
        ]);

        const newUser = userResult.rows[0];

        const insertAccountQuery = `
            INSERT INTO accounts (user_id, wallet_balance)
            VALUES ($1, $2)
            RETURNING *;
        `;

        const accountResult = await query(insertAccountQuery, [newUser.id, 100000.00]);
        const newAccount = accountResult.rows[0];

        const accessToken = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            access_token: accessToken,
            user: {
                id: newUser.id,
                username: newUser.username,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone_number: newUser.phone_number,
                role: newUser.role
            },
            account: {
                wallet_balance: parseFloat(newAccount.wallet_balance)
            }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Missing username or password' });
        }

        const userResult = await query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const accessToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Signin successful',
            access_token: accessToken,
            user: {
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/opportunities', jwtRequired, async (req, res) => {
    try {
        const result = await query('SELECT * FROM investment_opportunities');
        const data = result.rows.map(o => {
            const amountRaised = numberFrom(o.amount_raised);
            const fundingGoal = numberFrom(o.funding_goal);
            return {
                id: o.id,
                title: o.title,
                category: o.category,
                risk_level: o.risk_level,
                description: o.description,
                expected_return: o.expected_return,
                duration_months: o.duration_months,
                min_investment: o.min_investment,
                investor_count: o.investor_count,
                amount_raised: amountRaised,
                funding_goal: fundingGoal,
                key_highlights: o.key_highlights,
                location: o.location,
                icon: o.icon,
                funding_progress: computeFundingProgress(amountRaised, fundingGoal)
            };
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/profile', jwtRequired, async (req, res) => {
    try {
        const userId = req.userId;

        const userResult = await query(
            `SELECT id, first_name, last_name, username, email, phone_number, role, created_at
             FROM users
             WHERE id = $1`,
            [userId]
        );
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const accountResult = await query(
            `SELECT id, wallet_balance FROM accounts WHERE user_id = $1`,
            [userId]
        );
        const account = accountResult.rows[0];

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const totalAssetValueResult = await query(
            `SELECT COALESCE(SUM(current_value), 0) AS total_value
             FROM assets
             WHERE account_id = $1`,
            [account.id]
        );
        const totalInvestmentValue = numberFrom(totalAssetValueResult.rows[0]?.total_value);

        const investmentResult = await query(
            `SELECT i.*, o.title, o.category, o.risk_level, o.description, o.location,
                    o.funding_goal, o.amount_raised, o.duration_months, o.icon
             FROM investments i
             JOIN investment_opportunities o ON i.opportunity_id = o.id
             WHERE i.user_id = $1`,
            [userId]
        );

        const investments = investmentResult.rows.map(inv => {
            const fundingGoal = numberFrom(inv.funding_goal);
            const amountRaised = numberFrom(inv.amount_raised);
            const currentValue = computeInvestmentReturn(inv);

            return {
                id: inv.id,
                opportunity_id: inv.opportunity_id,
                title: inv.title,
                description: inv.description,
                category: inv.category,
                risk_level: inv.risk_level,
                amount_invested: numberFrom(inv.amount_invested),
                currentValue: currentValue,
                expected_return: numberFrom(inv.expected_return),
                status: inv.status,
                investment_date: toIsoString(inv.investment_date),
                end_date: toIsoString(inv.end_date || inv.endate),
                funding_goal: fundingGoal,
                amount_raised: amountRaised,
                funding_progress: computeFundingProgress(amountRaised, fundingGoal),
                location: inv.location,
                icon: inv.icon,
                duration_months: inv.duration_months
            };
        });

        res.json({
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role,
                created_at: toIsoString(user.created_at)
            },
            account: {
                id: account.id,
                wallet_balance: parseFloat(account.wallet_balance),
                total_investment_value: totalInvestmentValue
            },
            investments
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/investment/add', jwtRequired, async (req, res) => {
    const { opportunity_id: opportunityId, amount } = req.body || {};

    if (!opportunityId) {
        return res.status(400).json({ error: 'Missing required field: opportunity_id' });
    }

    const investmentAmount = numberFrom(amount);
    if (!Number.isFinite(investmentAmount) || investmentAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount provided' });
    }

    try {
        const result = await withTransaction(async (client) => {
            const account = await getAccountForUser(client, req.userId, { forUpdate: true });
            if (!account) {
                throw new HttpError(400, 'Account not found for user');
            }

            const opportunity = await getOpportunityById(client, opportunityId, { forUpdate: true });
            if (!opportunity) {
                throw new HttpError(404, 'Investment opportunity not found');
            }

            if (investmentAmount < numberFrom(opportunity.min_investment)) {
                throw new HttpError(400, `Minimum investment is ${numberFrom(opportunity.min_investment)}`);
            }

            if (numberFrom(account.wallet_balance) < investmentAmount) {
                throw new HttpError(400, 'Insufficient wallet balance');
            }

            await client.query(
                `UPDATE accounts SET wallet_balance = wallet_balance - $1 WHERE id = $2`,
                [investmentAmount, account.id]
            );

            const existingInvestment = await getInvestmentByOpportunity(client, req.userId, opportunityId, { forUpdate: true });
            let investmentRow;
            if (existingInvestment) {
                const updated = await client.query(
                    `UPDATE investments
                     SET amount_invested = amount_invested + $1
                     WHERE id = $2
                     RETURNING *`,
                    [investmentAmount, existingInvestment.id]
                );
                investmentRow = updated.rows[0];
            } else {
                const inserted = await client.query(
                    `INSERT INTO investments (user_id, opportunity_id, amount_invested, expected_return, status)
                     VALUES ($1, $2, $3, $4, 'active')
                     RETURNING *`,
                    [req.userId, opportunityId, investmentAmount, opportunity.expected_return]
                );
                investmentRow = inserted.rows[0];
            }

            const updatedOpportunity = await adjustOpportunityTotals(client, opportunityId, investmentAmount);
            const updatedAccount = await client.query(
                `SELECT wallet_balance FROM accounts WHERE id = $1`,
                [account.id]
            );

            return {
                investment: buildInvestmentPayload(investmentRow, updatedOpportunity),
                remaining_balance: numberFrom(updatedAccount.rows[0].wallet_balance)
            };
        });

        res.status(201).json({
            message: 'Investment added/updated successfully',
            ...result
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error adding investment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/investment/update', jwtRequired, async (req, res) => {
    const { investment_id: investmentId, amount } = req.body || {};

    if (!investmentId) {
        return res.status(400).json({ error: 'Missing investment_id' });
    }

    const additionalAmount = numberFrom(amount);
    if (!Number.isFinite(additionalAmount) || additionalAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount provided' });
    }

    try {
        const result = await withTransaction(async (client) => {
            const account = await getAccountForUser(client, req.userId, { forUpdate: true });
            if (!account) {
                throw new HttpError(404, 'Account not found for user');
            }

            const investment = await getInvestmentById(client, investmentId, req.userId, { forUpdate: true });
            if (!investment) {
                throw new HttpError(404, 'Investment not found');
            }

            const opportunity = await getOpportunityById(client, investment.opportunity_id, { forUpdate: true });
            if (!opportunity) {
                throw new HttpError(404, 'Investment opportunity not found');
            }

            if (additionalAmount < numberFrom(opportunity.min_investment)) {
                throw new HttpError(400, 'Amount must be greater than minimum required investment');
            }

            if (numberFrom(account.wallet_balance) < additionalAmount) {
                throw new HttpError(400, 'Insufficient wallet balance');
            }

            await client.query(
                `UPDATE accounts SET wallet_balance = wallet_balance - $1 WHERE id = $2`,
                [additionalAmount, account.id]
            );

            const updatedInvestment = await client.query(
                `UPDATE investments
                 SET amount_invested = amount_invested + $1
                 WHERE id = $2
                 RETURNING *`,
                [additionalAmount, investment.id]
            );

            const updatedOpportunity = await adjustOpportunityTotals(client, investment.opportunity_id, additionalAmount);
            const updatedAccount = await client.query(
                `SELECT wallet_balance FROM accounts WHERE id = $1`,
                [account.id]
            );

            return {
                investment: buildInvestmentPayload(updatedInvestment.rows[0], updatedOpportunity),
                wallet_balance: numberFrom(updatedAccount.rows[0].wallet_balance)
            };
        });

        res.json({
            message: 'Investment updated successfully',
            ...result
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error updating investment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/investment/withdraw', jwtRequired, async (req, res) => {
    const { investment_id: investmentId, withdrawal_amount, amount, reason } = req.body || {};

    if (!investmentId) {
        return res.status(400).json({ error: 'Missing investment id' });
    }

    const withdrawAmount = numberFrom(withdrawal_amount ?? amount);
    if (!Number.isFinite(withdrawAmount) || withdrawAmount <= 0) {
        return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    try {
        const result = await withTransaction(async (client) => {
            const account = await getAccountForUser(client, req.userId, { forUpdate: true });
            if (!account) {
                throw new HttpError(404, 'Account not found for user');
            }

            const investment = await getInvestmentById(client, investmentId, req.userId, { forUpdate: true });
            if (!investment) {
                throw new HttpError(404, 'Investment not found');
            }

            const opportunity = await getOpportunityById(client, investment.opportunity_id, { forUpdate: true });
            if (!opportunity) {
                throw new HttpError(404, 'Investment opportunity not found');
            }

            if (withdrawAmount > numberFrom(investment.amount_invested)) {
                throw new HttpError(400, 'Withdrawal exceeds invested amount');
            }

            const remainingAfter = numberFrom(investment.amount_invested) - withdrawAmount;
            if (remainingAfter > 0 && remainingAfter < numberFrom(opportunity.min_investment)) {
                throw new HttpError(
                    400,
                    `You must keep at least the minimum investment (${numberFrom(opportunity.min_investment)}), or withdraw everything.`
                );
            }

            let amountToReturn = 0;
            let updatedInvestmentRow;

            if (investment.status === 'completed') {
                if (Math.abs(withdrawAmount - numberFrom(investment.amount_invested)) > 0.0001) {
                    throw new HttpError(400, 'Completed investments must be fully withdrawn');
                }
                amountToReturn = numberFrom(investment.amount_invested);
                const updated = await client.query(
                    `UPDATE investments SET amount_invested = 0, status = 'withdrawn' WHERE id = $1 RETURNING *`,
                    [investment.id]
                );
                updatedInvestmentRow = updated.rows[0];
            } else if (investment.status === 'active') {
                const penaltyRate = 0.05;
                amountToReturn = withdrawAmount * (1 - penaltyRate);
                const remainingAmount = Math.max(0, numberFrom(investment.amount_invested) - withdrawAmount);
                const newStatus = remainingAmount <= 0 ? 'withdrawn' : 'active';
                const updated = await client.query(
                    `UPDATE investments SET amount_invested = $1, status = $2 WHERE id = $3 RETURNING *`,
                    [remainingAmount, newStatus, investment.id]
                );
                updatedInvestmentRow = updated.rows[0];
            } else {
                throw new HttpError(400, `Investment already ${investment.status}`);
            }

            await adjustOpportunityTotals(client, investment.opportunity_id, -withdrawAmount);

            const updatedAccount = await client.query(
                `UPDATE accounts SET wallet_balance = wallet_balance + $1 WHERE id = $2 RETURNING wallet_balance`,
                [amountToReturn, account.id]
            );

            return {
                withdrawn_amount: withdrawAmount,
                returned_to_wallet: amountToReturn,
                remaining_investment: numberFrom(updatedInvestmentRow.amount_invested),
                status: updatedInvestmentRow.status,
                wallet_balance: numberFrom(updatedAccount.rows[0].wallet_balance),
                reason: reason || null
            };
        });

        res.json({
            message: 'Withdrawal successful',
            ...result
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error withdrawing investment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/investment/transfer', jwtRequired, async (req, res) => {
    const { investment_id: investmentId, recipient_email, amount, note } = req.body || {};

    if (!investmentId || !recipient_email || amount === undefined) {
        return res.status(400).json({ error: 'Missing required field: investment_id, recipient_email or amount' });
    }

    const transferAmount = numberFrom(amount);
    if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
        return res.status(400).json({ error: 'Invalid transfer amount' });
    }

    try {
        const result = await withTransaction(async (client) => {
            const account = await getAccountForUser(client, req.userId, { forUpdate: true });
            if (!account) {
                throw new HttpError(404, 'Account not found for user');
            }

            const investment = await getInvestmentById(client, investmentId, req.userId, { forUpdate: true });
            if (!investment) {
                throw new HttpError(404, 'Investment not found');
            }

            if (!['active', 'completed'].includes(investment.status)) {
                throw new HttpError(400, `Cannot transfer investment with status ${investment.status}`);
            }

            if (transferAmount > numberFrom(investment.amount_invested)) {
                throw new HttpError(400, 'Transfer amount exceeds invested amount');
            }

            const recipientResult = await client.query('SELECT id FROM users WHERE email = $1', [recipient_email]);
            const recipient = recipientResult.rows[0];
            if (!recipient) {
                throw new HttpError(404, 'Recipient not found');
            }

            if (recipient.id === req.userId) {
                throw new HttpError(400, 'Cannot transfer investment to yourself');
            }

            const recipientAccountResult = await client.query(
                'SELECT id FROM accounts WHERE user_id = $1',
                [recipient.id]
            );
            const recipientAccount = recipientAccountResult.rows[0];
            if (!recipientAccount) {
                throw new HttpError(404, 'Recipient does not have an investment account');
            }

            let remainingAmount = numberFrom(investment.amount_invested) - transferAmount;
            let transferredAmount = transferAmount;

            if (transferAmount === numberFrom(investment.amount_invested)) {
                await client.query(
                    `UPDATE investments SET user_id = $1, status = 'active' WHERE id = $2`,
                    [recipient.id, investment.id]
                );
                remainingAmount = 0;
            } else {
                await client.query(
                    `UPDATE investments SET amount_invested = amount_invested - $1 WHERE id = $2`,
                    [transferAmount, investment.id]
                );

                const recipientExisting = await getInvestmentByOpportunity(client, recipient.id, investment.opportunity_id, { forUpdate: true });
                if (recipientExisting) {
                    await client.query(
                        `UPDATE investments SET amount_invested = amount_invested + $1 WHERE id = $2`,
                        [transferAmount, recipientExisting.id]
                    );
                } else {
                    await client.query(
                        `INSERT INTO investments (user_id, opportunity_id, amount_invested, expected_return, status)
                         VALUES ($1, $2, $3, $4, 'active')`,
                        [recipient.id, investment.opportunity_id, transferAmount, investment.expected_return]
                    );
                }
            }

            await adjustOpportunityTotals(client, investment.opportunity_id, 0);

            return {
                transfer: {
                    investment_id: investment.id,
                    opportunity_id: investment.opportunity_id,
                    transferred_amount: transferredAmount,
                    remaining_amount: Math.max(0, remainingAmount),
                    recipient_account_id: recipientAccount.id,
                    note: note || null
                }
            };
        });

        res.json({
            message: 'Investment transferred successfully',
            ...result
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error transferring investment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/investment/exit', jwtRequired, async (req, res) => {
    const { investment_id: investmentId, reason } = req.body || {};

    if (!investmentId) {
        return res.status(400).json({ error: 'Missing investment id' });
    }

    try {
        const result = await withTransaction(async (client) => {
            const account = await getAccountForUser(client, req.userId, { forUpdate: true });
            if (!account) {
                throw new HttpError(404, 'Account not found for user');
            }

            const investment = await getInvestmentById(client, investmentId, req.userId, { forUpdate: true });
            if (!investment) {
                throw new HttpError(404, 'Investment not found');
            }

            if (investment.status !== 'active') {
                throw new HttpError(400, `Only active investments can be exited (current status: ${investment.status})`);
            }

            const withdrawAmount = numberFrom(investment.amount_invested);
            if (withdrawAmount <= 0) {
                throw new HttpError(400, 'Nothing to withdraw from this investment');
            }

            const penaltyRate = 0.05;
            const amountToReturn = withdrawAmount * (1 - penaltyRate);

            await client.query(
                `UPDATE investments SET amount_invested = 0, status = 'withdrawn' WHERE id = $1`,
                [investment.id]
            );

            await adjustOpportunityTotals(client, investment.opportunity_id, -withdrawAmount);

            const updatedAccount = await client.query(
                `UPDATE accounts SET wallet_balance = wallet_balance + $1 WHERE id = $2 RETURNING wallet_balance`,
                [amountToReturn, account.id]
            );

            return {
                withdrawn_amount: withdrawAmount,
                returned_to_wallet: amountToReturn,
                wallet_balance: numberFrom(updatedAccount.rows[0].wallet_balance),
                status: 'withdrawn',
                reason: reason || null
            };
        });

        res.json({
            message: 'Investment exited successfully',
            ...result
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error exiting investment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/payment', jwtRequired, async (req, res) => {
    const { price_amount, price_currency, pay_amount, pay_currency, order_id } = req.body || {};

    if (price_amount === undefined || !pay_currency) {
        return res.status(400).json({ error: 'Missing payment details' });
    }

    const depositAmount = numberFrom(price_amount);
    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
        return res.status(400).json({ error: 'Invalid payment amount' });
    }

    try {
        const paymentPayload = await withTransaction(async (client) => {
            const account = await getAccountForUser(client, req.userId, { forUpdate: true });
            if (!account) {
                throw new HttpError(404, 'Account not found for user');
            }

            const updatedAccount = await client.query(
                `UPDATE accounts SET wallet_balance = wallet_balance + $1 WHERE id = $2 RETURNING wallet_balance`,
                [depositAmount, account.id]
            );

            const paymentId = `pay_${crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex')}`;

            return {
                payment_id: paymentId,
                invoice_url: `${clientURL}/payments/${order_id || paymentId}`,
                pay_address: `${pay_currency || 'btc'}_${crypto.randomBytes(10).toString('hex')}`,
                pay_amount: pay_amount || 0,
                pay_currency: (pay_currency || 'btc').toLowerCase(),
                price_amount: depositAmount,
                price_currency: (price_currency || 'usd').toLowerCase(),
                status: 'pending',
                wallet_balance: numberFrom(updatedAccount.rows[0].wallet_balance),
                created_at: new Date().toISOString()
            };
        });

        res.status(201).json(paymentPayload);
    } catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
