<template>
  <!-- Main container for the entire view -->
  <div class="view-container">
    <!-- Navigation breadcrumb showing current location in app -->
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">Dashboard</router-link>
      <span class="breadcrumb-separator">›</span>
      <!-- Dynamic title based on route name -->
      <span class="breadcrumb-current">{{ viewTitle }}</span>
    </div>

    <!-- Header section containing title and action buttons -->
    <div class="page-header">
      <h2>{{ viewTitle }}</h2>
      <!-- Group of action buttons for different operations -->
      <div class="button-group">
        <!-- Button to clear the content area -->
        <button class="cancel-button" @click="clearData">
          Clear Content Area
        </button>
        <!-- Button to display all employees -->
        <button class="action-button" @click="fetchAllEmployees">
          View All Employees
        </button>
        <!-- Button to show search form -->
        <button class="action-button" @click="showSearchForm = true">
          Search Employee
        </button>
        <!-- Button to show add employee form -->
        <button class="action-button" @click="showAddForm = true">
          Add New {{ viewTitle.slice(0, -1) }}
        </button>
        <!-- Button to show delete form -->
        <button class="action-button" @click="showDeleteForm = true">
          Delete Employee
        </button>        
      </div>
    </div>
<!-- Main content area containing forms and table -->
<div class="content-area">
  <p>{{ viewTitle }} content will be displayed here</p>
      <!-- Search form - shown when Search Employee button is clicked -->
      <div v-if="showSearchForm" class="form-container">
        <h3>Search Employee</h3>
        <form @submit.prevent="searchEmployee" class="add-form">
          <!-- Dropdown to select search method -->
          <div class="form-group">
            <label>Search By:</label>
            <select v-model="searchType" required>
              <option value="cwid">CWID</option>
              <option value="name">Name</option>
            </select>
          </div>
          <!-- Dynamic input field that changes based on search type -->
          <div class="form-group">
            <label>{{ searchType === 'cwid' ? 'Enter CWID:' : 'Enter Name:' }}</label>
            <input 
              type="text" 
              v-model="searchValue"
              :maxlength="searchType === 'cwid' ? 4 : undefined"
              :placeholder="searchType === 'cwid' ? 'Enter 4-digit CWID' : 'Enter name to search'"
              required
            >
          </div>
          <!-- Form action buttons -->
          <div class="form-actions">
            <button type="submit" class="action-button">Search</button>
            <button type="button" @click="showSearchForm = false" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>

      
      <!-- Delete form -->
      <div v-if="showDeleteForm" class="form-container">
        <h3>Delete Employee</h3>
        <form @submit.prevent="deleteEmployee" class="add-form">
          <div class="form-group">
            <label>Delete By:</label>
            <select v-model="deleteType" required>
              <option value="cwid">CWID</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ deleteType === 'cwid' ? 'Enter CWID:' : 'Enter Name:' }}</label>
            <input 
              type="text" 
              v-model="deleteValue"
              :maxlength="deleteType === 'cwid' ? 4 : undefined"
              :placeholder="deleteType === 'cwid' ? 'Enter 4-digit CWID' : 'Enter exact name'"
              required
            >
          </div>
          <div class="form-actions">
            <button type="submit" class="action-button">Delete</button>
            <button type="button" @click="showDeleteForm = false" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Add new employee form - shown when Add New Employee button is clicked -->
      <div v-if="showAddForm" class="form-container">
        <h3>Add New Employee</h3>
        <form @submit.prevent="submitNewEmployee" class="add-form">
          <!-- CWID input field -->
          <div class="form-group">
            <label>CWID:</label>
            <input type="text" v-model="newEmployee.cwid" maxlength="4" required>
          </div>
          <!-- Name input field -->
          <div class="form-group">
            <label>Name:</label>
            <input type="text" v-model="newEmployee.name" required>
          </div>
          <!-- Title selection dropdown -->
          <div class="form-group">
            <label>Title:</label>
            <select v-model="newEmployee.title" required>
              <option value="">Select Title</option>
              <option value="TA">TA</option>
              <option value="Part-Time Faculty">Part-Time Faculty</option>
              <option value="IST3">IST3</option>
              <option value="DITC">DITC</option>
              <option value="ASC1">ASC1</option>
              <option value="ASC2">ASC2</option>
            </select>
          </div>
          <!-- Office input field -->
          <div class="form-group">
            <label>Office:</label>
            <input type="text" v-model="newEmployee.office" required>
          </div>
          <!-- Form action buttons -->
          <div class="form-actions">
            <button type="submit" class="action-button">Save</button>
            <button type="button" @click="showAddForm = false" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
      <!-- Employee table - shown when data is available -->
      <div v-if="showTable" class="table-container">
        <table>
          <!-- Table headers -->
          <thead>
            <tr>
              <th>CWID</th>
              <th>Name</th>
              <th>Title</th>
              <th>Office</th>
            </tr>
          </thead>
          <!-- Table body with employee data -->
          <tbody>
            <!-- Loop through employees array to create table rows -->
            <tr v-for="employee in employees" :key="employee">
              <td>{{ employee.cwid }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.title }}</td>
              <td>{{ employee.office }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Success message display -->
      <div v-if="message" class="success-message">{{ message }}</div>
      
      <!-- Loading indicator and error messages -->
      <div v-if="loading" class="message">Loading...</div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>
<script>
// Import axios for making HTTP requests to backend
import axios from 'axios';

export default {
  name: 'EmployeesView',
  
  // Component's local state
  data() {
    return {
      employees: [],          // Stores list of employees
      loading: false,         // Loading state flag
      error: null,           // Stores error messages
      message: null,         // Stores success messages
      showAddForm: false,    // Controls add form visibility
      showSearchForm: false, // Controls search form visibility
      showDeleteForm: false, // Controls delete form visibility
      showTable: false,      // Controls table visibility
      searchType: 'cwid',    // Type of search (cwid or name)
      searchValue: '',       // Search input value
      deleteType: 'cwid',    // Type of delete (cwid or name)
      deleteValue: '',       // Delete input value
      // New employee data structure
      newEmployee: {
        cwid: '',
        name: '',
        title: '',
        office: ''
      }
    }
  },

  // Computed properties
  computed: {
    // Converts route name to title case for display
    viewTitle() {
      return this.$route.name.charAt(0).toUpperCase() + 
             this.$route.name.slice(1);
    }
  },

  // Component methods
  methods: {
    // Fetches all employees from database
    async fetchAllEmployees() {
      this.loading = true;
      this.error = null;
      this.message = null;
      // Hide all forms
      this.showAddForm = false;
      this.showSearchForm = false;
      this.showDeleteForm = false;
      this.showTable = false;
      
      try {
        // Make GET request to backend
        const response = await axios.get('http://localhost:3000/api/employees');
        this.employees = response.data;
        this.showTable = true;
      } catch (err) {
        this.error = 'Error fetching employees: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    // Searches for employees by CWID or name
    async searchEmployee() {
      this.loading = true;
      this.error = null;
      this.message = null;
      try {
        // Make GET request with search parameters
        const response = await axios.get(
          `http://localhost:3000/api/employees/${this.searchType}/${this.searchValue}`
        );
        this.employees = response.data;
        if (this.employees.length === 0) {
          this.error = 'No matching employees found';
        }
        this.showTable = true;
        this.showSearchForm = false;
      } catch (err) {
        this.error = 'Error searching employees: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    // Deletes an employee
    async deleteEmployee() {
      // Show confirmation dialog
      if (!confirm('Are you sure you want to delete this employee?')) {
        return;
      }

      this.loading = true;
      this.error = null;
      this.message = null;
      try {
        // Make DELETE request to backend
        await axios.delete(
          `http://localhost:3000/api/employees/${this.deleteType}/${this.deleteValue}`
        );
        this.message = 'Employee deleted successfully';
        this.showDeleteForm = false;
        await this.fetchAllEmployees();
      } catch (err) {
        this.error = 'Error deleting employee: ' + err.message;
      } finally {
        this.loading = false;
        this.deleteValue = '';
      }
    },

    // Adds a new employee
    async submitNewEmployee() {
      try {
        // Make POST request to backend with new employee data
        await axios.post('http://localhost:3000/api/employees', this.newEmployee);
        this.message = 'Employee added successfully';
        // Reset form data
        this.newEmployee = {
          cwid: '',
          name: '',
          title: '',
          office: ''
        };
        this.showAddForm = false;
        await this.fetchAllEmployees();
      } catch (err) {
        this.error = 'Error adding employee: ' + err.message;
      }
    },

    // Clears all data and resets view
    clearData() {
      this.employees = [];
      this.showTable = false;
      this.error = null;
      this.message = null;
      this.loading = false;
      this.showAddForm = false;
      this.showSearchForm = false;
      this.showDeleteForm = false;
      this.searchValue = '';
      this.deleteValue = '';
    }
  }
}
</script>
<style scoped>
/* Base container styling */
.view-container {
  padding: 1rem;
}

/* Breadcrumb navigation styling */
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

/* Page header styling */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--primary-blue);
}

/* Button group styling */
.button-group {
  display: flex;
  gap: 1rem;
}

/* Header text styling */
h2 {
  color: var(--primary-blue);
  font-size: 1.8rem;
}

/* Primary action button styling */
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

/* Main content area styling */
.content-area {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Form styling */
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

/* Form input and select styling */
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Form actions container */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Cancel button styling */
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

/* Status message styling */
.message {
  text-align: center;
  color: #666;
  padding: 1rem;
}

/* Error message styling */
.error-message {
  color: red;
  padding: 1rem;
  background-color: #fff3f3;
  border: 1px solid #ffd7d7;
  border-radius: 4px;
  margin-top: 1rem;
}

/* NEW: Search specific styles */
.search-container {
  margin-bottom: 1rem;
}

/* Style for search input focus */
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 2px rgba(0, 51, 102, 0.1);
}

/* Style for required fields */
.form-group input:required,
.form-group select:required {
  border-left: 3px solid var(--primary-orange);
}

/* Add success message styling */
.success-message {
  color: green;
  padding: 1rem;
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
}
</style>