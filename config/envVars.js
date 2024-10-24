import dotenv from 'dotenv'

dotenv.config()

export const ENV_VARS = {
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT || 4444,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV
}