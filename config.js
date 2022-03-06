require ('dotenv').config();

const config = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL
}

module.exports = config;