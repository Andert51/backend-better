import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { getEmployeeByUsername } from './employeeController.js'

export const login = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await getEmployeeByUsername(username)

        if(!user){
            res.status(401).json({
                error: true,
                message: 'Invalid username'
            })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid){
            res.status(401).json({
                error: true,
                message: 'Invalid password'
            })
        }

        const token = jwt.sign({
            userId: user.id,
            role: user.rol
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }

        )

    return res.json({ token })
        
    } catch (error) {
        res.status(401).json({
            error: true,
            message: 'Error: ' + error.message
        })
        
    }
}

export const logout = (req, res) => {
    res.json({
        error: false,
        message: 'Succesfull logout'
    })
}