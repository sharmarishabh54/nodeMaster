require('dotenv').config()

const environment = process.env.ENVIRONMENT


module.exports = {
    environment: environment,
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    key: process.env.TOKEN_KEY
}