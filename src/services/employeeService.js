import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import employeeRepository from '../repositories/employeeRepository.js'
import employeeModel from '../models/employeeModel.js'
import { sendPasswordResetEmail } from '../utils/emailService.js'

const EmployeeRepository = new employeeRepository()
const secret = process.env.JWT_SECRET
const saltRound = 10 // Mientras mas grande el numero mas compleja la encriptacion, pero no puede ser cualquier numero

class EmployeeService {
    async createEmployee(data, file) {
        const existEmployee = await EmployeeRepository.getEmployeeByUsername(data.username)
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

        const employeeId = await EmployeeRepository.createEmployee(newEmployee)

        if (file) {
            const image = `${employeeId}_image.png`
            const imagePath = path.join('src', 'userImages', image)
            fs.writeFileSync(imagePath, file.buffer)
            await EmployeeRepository.updateEmployee(employeeId, {image: image})

        }
    }

    async updateEmployee(id, data, file) {
        const existEmployee = await EmployeeRepository.getEmployeeById(id)
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

        await  EmployeeRepository.updateEmployee(id, data)
    }

    async  deleteEmployee(id) {
        const existEmployee = await EmployeeRepository.getEmployeeById(id)
        if (!existEmployee) {
            throw new Error('Employee not found')
        }

        await  EmployeeRepository.deleteEmployee(id)
    }

    async getAllEmployee(){
        return await EmployeeRepository.getAllEmployee()
    }

    async  getEmployeeById(id){
        return await EmployeeRepository.getEmployeeById(id)
    }

    async getEmployeeByUsername(username){
        return await EmployeeRepository.getEmployeeByUsername(username)
    }

    async  getEmployeeByRol(rol){
        return await EmployeeRepository.getEmployeeByRol(rol)
    }

    async generatePasswordResetToken(username){
        const existEmployee = await  EmployeeRepository.getEmployeeByUsername(username)
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
            await  EmployeeRepository.updateEmployee(decoded.id, {password: hashedPassword})
            
        } catch (error) {
            throw new Error('Error resetting password, token expired')
            
        }
    }


}

export  default EmployeeService