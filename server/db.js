require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    connectionTimeoutMillis: 2000, 
    idleTimeoutMillis: 30000,

    lookup: (hostname, options, callback) => {
    // Force IPv4
    require('dns').lookup(hostname, { family: 4 }, callback);
  }
    
});

const query = (text, params) => pool.query(text, params);

module.exports = {
    query,
    pool,
};
