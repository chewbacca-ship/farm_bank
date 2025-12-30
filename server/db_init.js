const { query } = require('./db'); // Import query function from db.js

async function createTables() {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(80) UNIQUE NOT NULL,
      last_name VARCHAR(80) UNIQUE NOT NULL,
      username VARCHAR(80) UNIQUE NOT NULL,
      email VARCHAR(120) UNIQUE NOT NULL,
      phone_number BIGINT NOT NULL, 
      password_hash VARCHAR(128) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      investment_range VARCHAR(50),
      experience_level VARCHAR(50),
      role VARCHAR(20) DEFAULT 'investor' NOT NULL
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      wallet_balance NUMERIC(10, 2) DEFAULT 100000.00 NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assets (
      id SERIAL PRIMARY KEY,
      account_id INT REFERENCES accounts(id) ON DELETE CASCADE,
      asset_icon VARCHAR(100),
      asset_name VARCHAR(100) NOT NULL,
      asset_type VARCHAR(50) NOT NULL,  
      asset_symbol VARCHAR(50),
      quantity NUMERIC(10, 6) NOT NULL,
      purchase_price NUMERIC(10, 2) NOT NULL,
      current_value NUMERIC(10, 2) NOT NULL,
      purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS investment_opportunities (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      category VARCHAR(100) NOT NULL,
      risk_level VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      expected_return NUMERIC(5, 2) NOT NULL,
      duration_months INT NOT NULL,
      min_investment NUMERIC(12, 2) NOT NULL,
      investor_count INT DEFAULT 0,
      amount_raised NUMERIC(12, 2) DEFAULT 0.00,
      funding_goal NUMERIC(12, 2) NOT NULL,
      key_highlights TEXT,
      location TEXT,
      icon TEXT
    );

    CREATE TABLE IF NOT EXISTS investments (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id INT REFERENCES investment_opportunities(id) ON DELETE CASCADE,
      amount_invested NUMERIC(12, 2) NOT NULL,
      investment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      endate TIMESTAMP,
      expected_return NUMERIC(12, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'active' NOT NULL
    );
  `;

  try {
    console.log('⏳ Creating tables...');
    await query(createTablesQuery);
    console.log('✅ Tables created successfully');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
  }
}

createTables()
  .catch(err => console.error('Initialization error:', err))
  .finally(() => process.exit());
