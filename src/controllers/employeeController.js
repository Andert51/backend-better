import employeeService from '../services/employeeService.js'
import { validationResult } from 'express-validator'

const EmployeeService = new employeeService()

const handleValidationErrors = ( req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    next()
    
}

const createEmployee = async (req, res) => {
   // handleValidationErrors(req) // Porque en rutas si se usa el check para validar los campos
   console.log('@ body =>', req)
    try {
        const employeeId = await EmployeeService.createEmployee(req.body, req.file)
        res.status(201).json({
            success: true,
            employeeId
        })

    } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const updateEmployee = async (req, res) => {
    // handleValidationErrors(req)
     try {
        const id = req.params.id
        await EmployeeService.updateEmployee(id, req.body, req.file)
        res.status(201).json({
            success: true
        })

    } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

const deleteEmployee = async (req, res) => {
    // handleValidationErrors(req)
     try {
        const id = req.params.id
        await EmployeeService.deleteEmployee(id)
        res.status(201).json({
            success: true
        })
    } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getAllEmployee = async (req, res) => {
     try {
       const employees = await EmployeeService.getAllEmployee()
       res.status(201).json({
        success: true,
        employees
       })
    } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getEmployeeById = async (req, res) => {
    // handleValidationErrors(req)
     try {
        const id = req.params.id
        const employee = EmployeeService.getEmployeeById(id)
        if (!employee){
            res.status(404).json({
                success: false,
                message: 'Employee Not Found'
            })
        }

        res.status(201).json({
            success: true,
            employee
        })
    } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getEmployeeByUsername = async (req, res) => {
    // handleValidationErrors(req)
    console.log('@Nint req =>', req.body, req.params)
     try {
        const username = req.params.username
        const employee = EmployeeService.getEmployeeByUsername(username)
        if (!employee){
            res.status(404).json({
                success: false,
                message: 'Employee Not Found'
            })
        }

        res.status(201).json({
            success: true,
            employee
        })
    } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getEmployeeByRol = async (req, res) => {
    // handleValidationErrors(req)
     try {
        const rol = req.params.rol
        const employee = EmployeeService.getEmployeeByRol(rol)
        if (!employee){
            res.status(404).json({
                success: false,
                message: 'Employee Not Found'
            })
        }

        res.status(201).json({
            success: true,
            employee
        })
    } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getAllEmployee,
    getEmployeeById,
    getEmployeeByUsername,
    getEmployeeByRol
}

// AZURE, AWS para hosting node
// Otros hosting

