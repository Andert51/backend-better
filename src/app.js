import express from 'express'
import dotenv from 'dotenv'
import errorHandler from './middleware/errorHandler.js'
import rateLimitMiddleware from './middleware/rateLimit.js'
import routes from './routes/index.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(rateLimitMiddleware)
app.use('/api/v1', routes) // El v1 es una practica de programacion para versionar las rutas
app.use(errorHandler)

const PORT = process.env.PORT || 3020
app.listen(PORT, () => {
    console.log(`@Nint Server Running in 🚀: ${PORT}`)
})