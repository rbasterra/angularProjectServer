require ('dotenv').config();

const config = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    SESSION_SECRET: process.env.SESSION_SECRET
}

module.exports = config;