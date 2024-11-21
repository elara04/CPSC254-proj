// Import axios
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Your backend API URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Employee-related API calls
export const employeeAPI = {
    // Get all employees
    getAllEmployees: () => api.get('/employees'),
    
    // Search employee by name
    searchByName: (name) => api.get(`/employees?name=${name}`),
    
    // Add new employee
    addEmployee: (employeeData) => api.post('/employees', employeeData),
    
    // Get employee by CWID
    getEmployeeByCWID: (cwid) => api.get(`/employees/${cwid}`),
    
    // Update employee
    updateEmployee: (cwid, employeeData) => api.put(`/employees/${cwid}`, employeeData),
    
    // Delete employee
    deleteEmployee: (cwid) => api.delete(`/employees/${cwid}`)
};

export default api;