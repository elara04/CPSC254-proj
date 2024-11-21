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
        <button class="action-button">
          Add New {{ viewTitle.slice(0, -1) }}
        </button>
      </div>
  
      <!-- Main content area - will be customized for each view -->
      <div class="content-area">
        <p>{{ viewTitle }} content will be displayed here</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AssetsView', // Change for each view
    computed: {
      viewTitle() {
        // Return appropriate title based on view
        return this.$route.name.charAt(0).toUpperCase() + 
               this.$route.name.slice(1);
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
  </style>