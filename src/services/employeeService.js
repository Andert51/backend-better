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

        const hashedPass = await bcrypt.hash(data.password.saltRound)

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
}