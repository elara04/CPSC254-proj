<template>
    <div class="dashboard">
      <h2>Welcome to the Department Dashboard</h2>
      
      <!-- Grid container for navigation cards -->
      <div class="dashboard-grid">
        <!-- Employee Management Card -->
        <router-link to="/employees" class="dashboard-card">
          <div class="card-icon">👥</div> <!-- Placeholder icon -->
          <h3>Employees</h3>
          <p>Manage department staff and faculty</p>
        </router-link>
  
        <!-- Course Management Card -->
        <router-link to="/courses" class="dashboard-card">
          <div class="card-icon">📚</div> <!-- Placeholder icon -->
          <h3>Courses</h3>
          <p>View and manage course schedules</p>
        </router-link>
  
        <!-- Asset Management Card -->
        <router-link to="/assets" class="dashboard-card">
          <div class="card-icon">💻</div> <!-- Placeholder icon -->
          <h3>Assets</h3>
          <p>Track department equipment and resources</p>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardView'
  }
  </script>
  
  <style scoped>
  .dashboard {
    text-align: center;
  }
  
  h2 {
    margin-bottom: 2rem;
    color: var(--primary-blue);
    font-size: 2rem;
  }
  
  /* Grid layout for cards */
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 1rem;
  }
  
  /* Card styling */
  .dashboard-card {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  
  /* Hover effect */
  .dashboard-card:hover {
    transform: translateY(-5px);
    border-color: var(--primary-orange);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
  
  /* Icon styling */
  .card-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--primary-orange);
  }
  
  /* Card title */
  .dashboard-card h3 {
    color: var(--primary-blue);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  /* Card description */
  .dashboard-card p {
    color: #666;
    line-height: 1.4;
  }
  </style>
  