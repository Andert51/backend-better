import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import EmployeeRepository from '../repositories/employeeRepository.js'
const employeeRepository = new EmployeeRepository()

export const login = async (req, res) => {
    const { username, password } = req.body
    console.log('@Nint body =>', username, password)

    try {
        const user = await employeeRepository.getEmployeeByUsername(username)

        if(!user){
            res.status(401).json({
                error: true,
                message: 'Invalid username'
            })
        }
        console.log('@Nint user =>', user)
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
        return res.status(200).json({
            success: true,
            token: token
        })
        
    } catch (error) {
        res.status(401).json({
            error: true,
            message: 'Error: ' + error.message
        })
        
    }
}

export const getUser = async (req, res) => {
    try {
        const userId = req.user.userId
        const user = await employeeRepository.getEmployeeById(userId)

        if(!user){
            return res.status(404).json({
                error: true,
                message: 'User not found'
            })
        }

        const { password, ...userWithoutPassword} =  user
        res.json(userWithoutPassword)

        } catch (error) {
            console.error(error)
            res.status(500).json({msg: 'Error obtaining user'})

        
    }

}

export const logout = (req, res) => {
    res.json({
        error: false,
        message: 'Succesfull logout'
    })
}

