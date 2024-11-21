<template>
  <div class="view-container">
    <!-- Navigation breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">Dashboard</router-link>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-current">{{ viewTitle }}</span>
    </div>

    <!-- Page header -->
    <div class="page-header">
      <h2>{{ viewTitle }}</h2>
      <div class="button-group">
         <!-- Clear button -->
        <button class="cancel-button" @click="clearData">
          Clear Table
        </button>
        <!-- View All Employees button -->
        <button class="action-button" @click="fetchAllEmployees">
          View All Employees
        </button>
        <!-- Add New Employee button -->
        <button class="action-button" @click="showAddForm = true">
          Add New {{ viewTitle.slice(0, -1) }}
        </button>
      </div>
    </div>

    <!-- Main content area -->
    <div class="content-area">
      <!-- Form for adding new employee - shown when showAddForm is true -->
      <div v-if="showAddForm" class="form-container">
        <h3>Add New Employee</h3>
        <form @submit.prevent="submitNewEmployee" class="add-form">
          <div class="form-group">
            <label>CWID:</label>
            <input type="text" v-model="newEmployee.cwid" maxlength="4" required>
          </div>
          <div class="form-group">
            <label>Name:</label>
            <input type="text" v-model="newEmployee.name" required>
          </div>
          <div class="form-group">
            <label>Title:</label>
            <select v-model="newEmployee.title" required>
              <option value="">Select Title</option>
              <option value="TA">TA</option>
              <option value="Part-Time Faculty">Part-Time Faculty</option>
              <option value="IST3">IST3</option>
              <option value="DITC">DITC</option>
            </select>
          </div>
          <div class="form-group">
            <label>Office:</label>
            <input type="text" v-model="newEmployee.office" required>
          </div>
          <div class="form-actions">
            <button type="submit" class="action-button">Save</button>
            <button type="button" @click="showAddForm = false" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Employee table - shown when showTable is true -->
      <div v-if="showTable" class="table-container">
        <table>
          <thead>
            <tr>
              <th>CWID</th>
              <th>Name</th>
              <th>Title</th>
              <th>Office</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee">
              <td>{{ employee.cwid }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.title }}</td>
              <td>{{ employee.office }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading and error states -->
      <div v-if="loading" class="message">Loading...</div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EmployeesView',
  data() {
    return {
      employees: [],
      loading: false,
      error: null,
      showAddForm: false,
      showTable: false,
      newEmployee: {
        cwid: '',
        name: '',
        title: '',
        office: ''
      }
    }
  },
  computed: {
    viewTitle() {
      return this.$route.name.charAt(0).toUpperCase() + 
             this.$route.name.slice(1);
    }
  },
  methods: {
    async fetchAllEmployees() {
      this.loading = true;
      this.error = null;
      this.showAddForm = false;
      this.showTable = false;
      
      try {
        const response = await axios.get('http://localhost:3000/api/employees');
        this.employees = response.data;
        this.showTable = true;
      } catch (err) {
        this.error = 'Error fetching employees: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    async submitNewEmployee() {
      try {
        await axios.post('http://localhost:3000/api/employees', this.newEmployee);
        // Reset form
        this.newEmployee = {
          cwid: '',
          name: '',
          title: '',
          office: ''
        };
        this.showAddForm = false;
        // Refresh employee list
        await this.fetchAllEmployees();
      } catch (err) {
        this.error = 'Error adding employee: ' + err.message;
      }
    },
    clearData() {
      this.employees = [];
      this.showTable = false;
      this.error = null;
      this.loading = false;      
    }
  }
}
</script>

<style scoped>
/* Keep all your existing styles */
.view-container {
  padding: 1rem;
}

.breadcrumb {
  margin-bottom: 2rem;
  color: #666;
}

.breadcrumb-link {
  color: var(--primary-blue);
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: var(--primary-orange);
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #999;
}

.breadcrumb-current {
  color: var(--primary-orange);
  font-weight: 500;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--primary-blue);
}

/* Add styles for button group */
.button-group {
  display: flex;
  gap: 1rem;
}

h2 {
  color: var(--primary-blue);
  font-size: 1.8rem;
}

.action-button {
  background-color: var(--primary-orange);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: var(--secondary-orange);
}

.content-area {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Add new styles for form and table */
.form-container {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--primary-blue);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button {
  background-color: #666;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #888;
}

/* Table styles */
.table-container {
  margin-top: 1rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: var(--primary-blue);
  color: white;
}

tr:nth-child(even) {
  background-color: #f5f5f5;
}

.message {
  text-align: center;
  color: #666;
  padding: 1rem;
}

.error-message {
  color: red;
  padding: 1rem;
  background-color: #fff3f3;
  border: 1px solid #ffd7d7;
  border-radius: 4px;
  margin-top: 1rem;
}
</style>