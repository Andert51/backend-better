import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import EmployeeRepository from '../repositories/employeeRepository.js'
import employeeModel from '../models/employeeModel.js'
import { sendPasswordResetEmail } from '../utils/emailService.js'

const employeeRepository = new EmployeeRepository()
const secret = process.env.JWT_SECRET
const saltRound = 10 // Mientras mas grande el numero mas compleja la encriptacion, pero no puede ser cualquier numero

class EmployeeService {
    async createEmployee(data, file) {
        const existEmployee = await employeeRepository.getEmployeeByUsername(data.username)
        if (existEmployee){
            throw new Error('Username already exists!')
        }

        const hashedPass = await bcrypt.hash(data.password, saltRound)

        const newEmployee = new employeeModel(
            null,
            data.name,
            data.patsur,
            data.matsur,
            data.adress,
            data.phone,
            data.city,
            data.state,
            data.username,
            hashedPass,
            data.rol,
            null
        )

        const employeeId = await employeeRepository.createEmployee(newEmployee)

        if (file) {
            const image = `${employeeId}_image.png`
            const imagePath = path.join('src', 'userImages', image)
            fs.writeFileSync(imagePath, file.buffer)
            await employeeRepository.updateEmployee(employeeId, {image: image})

        }
    }

    async updateEmployee(id, data, file) {
        const existEmployee = await employeeRepository.getEmployeeById(id)
        if (existEmployee) {
            throw new Error('Employee not found')
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, saltRound)
        }

        if(file){
            const image = `${id}_image.png`
            const imagePath = path.join('src', 'userImages', image)
            fs.writeFileSync(imagePath, file.buffer)
            data.image = image
        }

        await  employeeRepository.updateEmployee(id, data)
    }

    async  deleteEmployee(id) {
        const existEmployee = await employeeRepository.getEmployeeById(id)
        if (!existEmployee) {
            throw new Error('Employee not found')
        }

        await  employeeRepository.deleteEmployee(id)
    }

    async getAllEmployee(){
        return await employeeRepository.getAllEmployee()
    }

    async  getEmployeeById(id){
        return await employeeRepository.getEmployeeById(id)
    }

    async getEmployeeByUsername(username){
        return await employeeRepository.getEmployeeByUsername(username)
    }

    async  getEmployeeByRol(rol){
        return await employeeRepository.getEmployeeByRol(rol)
    }

    async generatePasswordResetToken(username){
        const existEmployee = await  employeeRepository.getEmployeeByUsername(username)
        if (!existEmployee) {
            throw new Error('User does not exists')
        }
        const token = jwt.sign({id:existEmployee.id}, secret, {expiresIn: '1h'})
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`

    }

    async  resetPassword(token, newPassword){
        try {
            const decoded = jwt.verify(token, secret)
            const hashedPassword = await bcrypt.hash(newPassword, saltRound)
            await  employeeRepository.updateEmployee(decoded.id, {password: hashedPassword})
            
        } catch (error) {
            throw new Error('Error resetting password, token expired')
            
        }
    }


}

export  default EmployeeService