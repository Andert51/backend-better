import { Router } from 'express'
import { login, logout } from '../controllers/authController.js'
import { check } from 'express-validator'

const router = Router()

router.post(
    '/login',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty()
    ],
    login 
)

router.post( '/logout', logout)

export default router