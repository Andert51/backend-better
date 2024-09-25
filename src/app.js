import express from 'express'
import dotenv from 'dotenv'
import employeeRoutes from './routes/employeeRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import errorHandler from './middleware/errorHandler.js'
import rateLimitMiddleware from './middleware/rateLimit.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(rateLimitMiddleware)
app.use('/api/employee', employeeRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3020
app.listen(PORT, () => {
    console.log(`@Nint Server Running in 🚀: ${PORT}`)
})