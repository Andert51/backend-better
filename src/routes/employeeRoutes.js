import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { check } from 'express-validator'
import multer from 'multer'
import {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getAllEmployee,
    getEmployeeById,
    getEmployeeByUsername,
    getEmployeeByRol
} from '../controllers/employeeController.js'

const upload = multer ({ storage: multer.memoryStorage()})
const router = express.Router()

router.post(
    '/create',
    // middleware
    upload.single('image'),
    [
        check('name').notEmpty().withMessage('Name is required'), // Validaciones a los campos, se uso handlevalidation en controlador de empleaddos 
        check('username').notEmpty().withMessage('Username is required'),
        check('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    ],
    createEmployee
)

router.put('/update/:id', authMiddleware, upload.single('image'), updateEmployee) 
router.delete('/delete/:id', authMiddleware, deleteEmployee)
router.get('/', authMiddleware, getAllEmployee)
router.get('/employee/:id', authMiddleware, getEmployeeById)
router.get('/rol/:rol', authMiddleware, getEmployeeByRol)
router.get('/username/:username', authMiddleware, getEmployeeByUsername)

export default router
