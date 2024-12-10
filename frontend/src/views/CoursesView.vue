<template>
    <div class="view-container">
      <!-- Navigation breadcrumb -->
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-link">Dashboard</router-link>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">{{ viewTitle }}</span>
      </div>
  
      <!-- Header section with action buttons -->
      <div class="page-header">
        <h2>{{ viewTitle }}</h2>
        <div class="button-group">
          <button class="cancel-button" @click="clearData">
          Clear Table
          </button>
          <button class="action-button" @click="fetchAllCourses">
             View All Courses
          </button>
        <button class="action-button" @click="showSearchForm = true">
          Search Course
        </button>
          <button class="action-button" @click="showAddForm = true">
           Add New {{ viewTitle.slice(0, -1) }}
          </button>
        <button class="action-button" @click="showDeleteForm = true">
          Delete Course
        </button>
         </div>
      </div>
  
      <!-- Main content area -->
      <div class="content-area">
         <p v-if="!showAddForm && !showSearchForm && !showDeleteForm">{{ viewTitle }} content will be displayed here</p>

<!-- Search form -->
<div v-if="showSearchForm" class="form-container">
  <h3>Search Course</h3>
  <form @submit.prevent="searchCourse" class="add-form">
    <div class="form-group">
      <label>Search By:</label>
      <select v-model="searchType" required>
        <option value="section">Section Number</option>
        <option value="department">Department Code</option>
        <option value="instructor">Instructor Name</option>
      </select>
    </div>
    <div class="form-group">
      <label>{{ getSearchLabel }}</label>
      <input 
        :type="searchType === 'section' ? 'number' : 'text'"
        v-model="searchValue"
        :maxlength="getInputMaxLength"
        :placeholder="getInputPlaceholder"
        required
      >
    </div>
    <div class="form-actions">
      <button type="submit" class="action-button">Search</button>
      <button type="button" @click="showSearchForm = false" class="cancel-button">Cancel</button>
    </div>
  </form>
</div>

	<!-- Form for adding new course - shown when showAddForm is true -->
	<div v-if="showAddForm" class="form-container">
          <h3>Add New Course</h3>
          <form @submit.prevent="submitNewCourse" class="add-form">
           <div class="form-group">
              <label>Section Number:</label>
              <input type="text" v-model="newCourse.section_number" require>
           </div>
           <div class="form-group">
              <label>Instructor ID:</label>
              <input type="text" v-model="newCourse.inst_id" required maxlength="4">
           </div>
           <div class="form-group">
              <label>Department Code:</label>
              <input type="text" v-model="newCourse.deptcode" required maxlength="10">
           </div>
           <div class="form-group">
              <label>Capacity:</label>
              <input type="text" v-model="newCourse.capacity"  required>
           </div>
           <div class="form-group">
              <label>Enrolled:</label>
              <input type="text" v-model="newCourse.enrolled">
           </div>
           <div class="form-group">
              <label>Room:</label>
              <input type="text" v-model="newCourse.room">
           </div>
           <div class="form-group">
              <label>Time:</label>
              <input type="text" v-model="newCourse.time"  require>
           </div>
           <div class="form-actions">
            <button type="submit" class="action-button">Save</button>
            <button type="button" @click="showAddForm = false" class="cancel-button">Cancel</button>
          </div>
          </form>
       </div>

<!-- Delete form -->
      <div v-if="showDeleteForm" class="form-container">
        <h3>Delete Course</h3>
        <form @submit.prevent="deleteCourse" class="add-form">
          <div class="form-group">
            <label>Section Number:</label>
            <input 
              type="number" 
              v-model="deleteValue"
              placeholder="Enter Section Number"
              required
            >
          </div>
          <div class="form-actions">
            <button type="submit" class="action-button">Delete</button>
            <button type="button" @click="showDeleteForm = false" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
  
    <!-- Course table - shown when showTable is true -->
    <div v-if="showTable" class="table-container">
    <table>
          <thead>
            <tr>
              <th>Section Number</th>
              <th>Department Code</th>
              <th>Instructor</th>
              <th>Capacity</th>
              <th>Enrolled</th>
              <th>Room</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course">
              <td>{{ course.section_number }}</td>
              <td>{{ course.deptcode }}</td>
              <td>{{ course.instructor }}</td>
              <td>{{ course.capacity }}</td>
              <td>{{ course.enrolled }}</td>
              <td>{{ course.room }}</td>
              <td>{{ course.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Messages -->
      <div v-if="message" class="success-message">{{ message }}</div>
      <div v-if="loading" class="message">Loading...</div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
   </div>
</template>


  <script>
  import axios from 'axios';

  export default {
    name: 'CoursesView', // Change for each view
    data() {
    return {
      courses: [],
      loading: false,
      error: null,
      message: null,
      showAddForm: false,
      showSearchForm: false,
      showDeleteForm: false,
      showTable: false,
      searchType: 'section',
      searchValue: '',
      deleteValue: '',
      newCourse: {
        section_number: '',
        inst_id: '',
        deptcode: '',
        capacity: '',
        enrolled: '',
        room: '',
        time: ''
      }
    }
  },


    computed: {
      viewTitle() {
        // Return appropriate title based on view
        return this.$route.name.charAt(0).toUpperCase() + 
               this.$route.name.slice(1);
      },

    getSearchLabel() {
      switch(this.searchType) {
        case 'section': return 'Enter Section Number:';
        case 'department': return 'Enter Department Code:';
        case 'instructor': return 'Enter Instructor Name:';
        default: return 'Enter Search Value:';
      }
    },

getInputPlaceholder() {
      switch(this.searchType) {
        case 'section': 
          return 'Enter 5-digit section number';
        case 'department':
          return 'Enter department code (e.g., CPSC)';
        case 'instructor':
          return 'Enter instructor full name';
        default:
          return 'Enter search value';
      }
    },

    getInputMaxLength() {
      switch(this.searchType) {
        case 'section': return 5;
        case 'department': return 10;
        case 'instructor': return 50;
        default: return undefined;
      }
    }
   },

    methods: {

    async fetchAllCourses() {
      this.loading = true;
      this.error = null;
      this.message = null;
      this.showAddForm = false;
      this.showSearchForm = false;
      this.showDeleteForm = false;
      this.showTable = false;

      try {
        const response = await axios.get('http://localhost:4000/api/courses');
        this.courses = response.data;
        this.showTable = true;
      } catch (err) {
        this.error = 'Error fetching courses: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

async searchCourse() {
  this.loading = true;
  this.error = null;
  this.message = null;
  try {
    let endpoint = `http://localhost:3000/api/courses/search/${this.searchType}/${encodeURIComponent(this.searchValue)}`;
    const response = await axios.get(endpoint);
    this.courses = response.data;
    if (this.courses.length === 0) {
      this.error = 'No matching courses found';
    }
    this.showTable = true;
    this.showSearchForm = false;
  } catch (err) {
    this.error = 'Error searching courses: ' + err.message;
  } finally {
    this.loading = false;
  }
},

    async deleteCourse() {
      if (!confirm('Are you sure you want to delete this course?')) {
        return;
      }

      this.loading = true;
      this.error = null;
      this.message = null;
      try {
        await axios.delete(
          `http://localhost:4000/api/courses/${this.deleteValue}`
        );
        this.message = 'Course deleted successfully';
        this.showDeleteForm = false;
        await this.fetchAllCourses();
      } catch (err) {
        this.error = 'Error deleting course: ' + err.message;
      } finally {
        this.loading = false;
        this.deleteValue = '';
      }
    },

    async submitNewCourse() {
      try {
        await axios.post('http://localhost:4000/api/courses', this.newCourse);
        this.message = 'Course added successfully';
        this.newCourse = {
                section_number: "",
                inst_id: "",
                deptcode: "",
                capacity: "",
                enrolled: "",
                room: "",
                time: ""
        }
        this.showAddForm = false;
        // Refresh course list
        await this.fetchAllCourses();
      } catch (err) {
        this.error = 'Error adding course: ' + err.message;
      }
    },

    clearData() {
      this.courses = [];
      this.showTable = false;
      this.error = null;
      this.loading = false;
    }
  }

  }
  </script>
  
  <style scoped>
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
  
   /* Add styles for button group */
  .button-group {
     display: flex;
     gap: 1rem;
  }


  h2 {
    color: var(--primary-blue);
    font-size: 1.8rem;
  }
  
  /* Action button styling */
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
  
  /* Content area styling */
  .content-area {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

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
