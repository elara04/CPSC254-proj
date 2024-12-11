<!-- Template for EmployeesView.vue, CoursesView.vue, and AssetsView.vue -->
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
      <!-- Add any action buttons here -->
      <!-- Button to clear assets view -->
      <button class="cancel-button" @click="clearAssets">
        Clear Content Area
      </button>
        <!-- Button to display assets view -->
      <button class="action-button" @click="fetchAssets">
        View Assets
      </button>
      <!-- Button to search assets table -->
      <button class="action-button" @click="showSearch=true">
        Search Assets
      </button>
      <!-- Add new asset -->
      <button class="action-button" @click="showAddAssets=true">
        Add New {{ viewTitle.slice(0, -1) }}
      </button>
      <button class="action-button" @click="showDelete=true">
        Delete Asset
      </button>
    </div>

    <!-- Main content area - will be customized for each view -->
    <div class="content-area">
      <!-- <p>{{ viewTitle }} content will be displayed here</p> -->
    <!-- </div> -->
      <div v-if="showSearch" class="form-container">
        <h3>Search Assets</h3>
        <form @submit.prevent="searchAssets" class="add-form">
          <div class="form-group">
            <label>Search By:</label>
            <select v-model="searchType" required>
              <option value="asset_id">Asset ID</option>
              <option value="service_tag">Service Tag</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ getSearchLabel }}</label>
            <input
              :type="searchType === 'asset_id' ? 'number': 'text'"
              v-model="searchValue"
              :maxlength="getInputMaxLength"
              :placeholder="getInputPlaceholder"
              required
            >
          </div>
          <div class="form-actions">
            <button type="submit" class="action-button">Search</button>
            <button type="button" @click="showSearch=false" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>

      <div v-if="showAddAssets" class="form-container">
        <h3>Add New Asset</h3>
        <form @submit.prevent="submitNewAsset" class="add-asset">
          <div class="form-group">
            <label>Asset ID:</label>
            <input type="text" v-model="newAsset.asset_id" maxlength="6" required>
          </div>
          <div class="form-group">
            <label>Category:</label>
            <select v-model="newAsset.category" required>
              <option value="">Select Category</option>
              <option value="PC">PC</option>
              <option value="Laptop">Laptop</option>
            </select>
          </div>
          <div class="form-group">
            <label>Purchase Year:</label>
            <select v-model="newAsset.purchase_year" required>
              <option value="">Select Year</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div class="form-group">
            <label>Manufacture:</label>
            <select v-model="newAsset.manufacture" required>
              <option value="">Select Manufacture</option>
              <option value="Dell">Dell</option>
              <option value="Apple">Apple</option>
            </select>
          </div>
          <div class="form-group">
            <label>Name:</label>
            <input type="text" v-model="newAsset.name" maxlength="12" required>
          </div>
          <div class="form-group">
            <label>Model:</label>
            <input type="text" v-model="newAsset.model" maxlength="4" required>
          </div>
          <div class="form-group">
            <label>Location:</label>
            <input type="text" v-model="newAsset.location" maxlength="15" required>
          </div>
          <div class="form-group">
            <label>Service Tag:</label>
            <input type="text" v-model="newAsset.service_tag" maxlength="7" required>
          </div>
          <div class="form-actions">
            <button type="submit" class="action-button">Save</button>
            <button type="button" @click="showAddAssets=false" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>

<!-- Delete asset -->
       <div v-if="showDelete" class="form-container">
        <h3>Delete Asset</h3>
        <form @submit.prevent="deleteAsset" class="add-form">
          <div class="form-group">
            <label>Asset ID:</label>
            <input
              type="number"
              v-model="deleteValue"
              placeholder="Enter Asset ID"
              required
            >
          </div>
          <div class="form-actions">
            <button type="submit" class="action-button">Delete</button>
            <button type="button" @click="showDelete=false" class="cancel-button">Cancel</button>
          </div>
        </form>
       </div>


      <!-- Asset table - show when showAsset is true -->
      <div v-if="showAssets" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Category</th>
              <th>Purchase Year</th>
              <th>Manufacture</th>
              <th>Name</th>
              <th>Model</th>
              <th>Location</th>
              <th>Service Tag</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="asset in assets" :key="asset">
              <td>{{ asset.asset_id }}</td>
              <td>{{ asset.category }}</td>
              <td>{{ asset.purchase_year }}</td>
              <td>{{ asset.manufacture }}</td>
              <td>{{ asset.name }}</td>
              <td>{{ asset.model }}</td>
              <td>{{ asset.location }}</td>
              <td>{{ asset.service_tag }}</td>
            </tr>
          </tbody>
        </table>
      </div>


      <!-- Loading and erro sttes -->
      <div v-if="loading" class="message">Loading...</div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AssetsView', // Change for each view
  data() {
    return {
      assets: [],
      loading: false,
      error: false,
      message: null,
      showAddAssets: false,
      showAssets: false,
      showSearch: false,
      showDelete: false,
      searchType: 'asset_id',
      searchValue: '',
      deleteValue: '',
      newAsset: {
        asset_id: '',
        category: '',
        purchase_year: '',
        manufacture: '',
        name: '',
        model: '',
        location: '',
        service_tag: ''
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
        case 'asset_id': return 'Enter Asset ID:';
        case 'service_tag': return 'Enter service Tag';
        default: return 'Enter Search Value';
      }
    },

    getInputPlaceholder() {
      switch(this.searchType) {
        case 'asset_id':
          return 'Enter Asset ID';
        case 'service_tag':
          return 'Enter Service Tag';
        default: return undefined;
      }
    },

    getInputMaxLength() {
      switch(this.searchType) {
        case 'asset_id' : return 6;
        case 'service_tag' : return 7;
        default: return undefined;
      }
    }
  },
  methods: {
    async fetchAssets() {
      this.loading = true;
      this.error = null;
      this.message = null;
      this.showAddAssets = false;
      this.showAssets = false;
      this.showSearch = false;
      this.showDelete = false;
      
      try {
        const response = await axios.get('http://localhost:3000/api/assets');
        this.assets = response.data;
        this.showAssets = true;
      } catch (err) {
        this.error = 'Error fetching Assets: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    async searchAssets() {
      this.loading = true;
      this.error = null;
      this.message = null;
      try {
        let endpoint = `http://localhost:3000/api/assets/search/${this.searchType}/${encodeURIComponent(this.searchValue)}`;
        const response = await axios.get(endpoint);
        this.assets = response.data;
        if (this.assets.length === 0) {
          this.error = 'No matching asset found';
        }
        this.showAssets = true;
        this.showSearch = false;
      } catch (err) {
        this.error = 'Error searching assets: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    async deleteAsset() {
      if (!confirm('Are you sure you want to delete this asset?')) {
        return;
      }

      this.loading = true;
      this.error = null;
      this.message = null;
      try {
        await axios.delete(
          `http://localhost:3000/api/assets/${this.deleteValue}`
        );
        this.message = 'Asset deleted successfully';
        this.showDelete = false;
        await this.fetchAssets();
      } catch (err) {
        this.error = 'Error deleting asset: ' + err.message;
      } finally {
        this.loading = false;
        this.deleteValue = '';
      }
    },

    async submitNewAsset() {
      try {
        await axios.post('http://localhost:3000/api/assets', this.newAsset);
        // reset assets form
        this.newAsset = {
          asset_id: "",
          category: "",
          purchase_year: "",
          manufacture: "",
          name: "",
          model: "",
          location: "",
          service_tag: ""
        };
        this.showAddAssets = false;
        // refresh assets list
        await this.fetchAssets();
      } catch (err) {
        this.error = 'Error adding Asset: ' + err.message;
      }
    },
    clearAssets() {
      this.assets = [];
      this.showAssets = false;
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

/* Content area styling */
.content-area {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* add new styles for form and tables */
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
