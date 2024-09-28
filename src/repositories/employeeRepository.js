import {db} from  '../config/firebase.js'
import employeeModel from '../models/employeeModel.js'

class EmployeeRepository {
    async createEmployee(data){
        const employee = await db.collection('employees').add({
            name: data.name,
            patsur: data.patsur,
            matsur: data.matsur,
            adress: data.adress,
            phone: data.phone,
            city: data.city,
            state: data.state,
            username: data.username,
            password: data.password,
            rol: data.rol,
            image: data.image
        })

        return employee.id
    }

    async deleteEmployee(id){
        await db.collection('employees').doc(id).delete()
    }

    async getAllEmployee(){
        const docs = await db.collection('employees').get()
        const employees = []
        docs.forEach(doc => {
            const data = doc.data()
            employees.push(new employeeModel(
                doc.id,
                data.name,
                data.patsur,
                data.matsur,
                data.adress,
                data.phone,
                data.city,
                data.state,
                data.username,
                data.password,
                data.rol,
                data.image
            ))
        })

        return  employees
    }

    async getEmployeeById(id){
        const doc = await db.collection('employees').doc(id).get()
        if(!doc.exists){
            return null
        }
        const data = doc.data()
        return new employeeModel(
            doc.id,
            data.name,
            data.patsur,
            data.matsur,
            data.adress,
            data.phone,
            data.city,
            data.state,
            data.username,
            data.password,
            data.rol,
            data.image
        )
    }

    async getEmployeeByUsername(username){
        const employee = db.collection('employees').where('username', '==', username).get
        if(employee.empty){
            return null
        }
        const doc = employee.docs[0]
        const data = doc.data()
        return new employeeModel(
            doc.id,
            data.name,
            data.patsur,
            data.matsur,
            data.adress,
            data.phone,
            data.city,
            data.state,
            data.username,
            data.password,
            data.rol,
            data.image
        )
    }

    async  getEmployeesByRol(rol){
        const docs = await db.collection('employees').where('rol', '==',  rol).get()
        const employees = []
        docs.forEach(doc => {
            const data = doc.data()
            employees.push(new employeeModel(
                doc.id,
                data.name,
                data.patsur,
                data.matsur,
                data.adress,
                data.phone,
                data.city,
                data.state,
                data.username,
                data.password,
                data.rol,
                data.image
            ))
        })

        return  employees
    }
}

export default EmployeeRepository