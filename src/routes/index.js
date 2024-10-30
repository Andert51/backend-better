import { Router } from "express"
import employeeRoutes from "./employeeRoutes.js"
import authRoutes from "./authRoutes.js"

const router = Router()

// En app se necesita una ruta base, este archivo canalizara las rutas

router.use('/employee', employeeRoutes)
router.use('/auth', authRoutes)

export default router
