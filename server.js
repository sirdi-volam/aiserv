import express from 'express'

import authRoutes from './routes/auth.route.js'
import { ENV_VARS } from './config/envVars.js'
import { connectDB } from './config/db.js'

const api = express()

const PORT = ENV_VARS.PORT

api.use(express.json())

api.use("/api/v1/auth", authRoutes)

api.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
  connectDB()
})