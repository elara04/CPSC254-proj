 <!-- default vue creat app
 <template>
 
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App my guy"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
-->
<template>
  <div class="app">
    <!-- Header section with logo and title -->
    <header class="header">
      <div class="logo-container">
        <!-- Using @ alias for src directory path -->
        <img src="@/assets/DeptLogo.png" alt="Department Logo" class="dept-logo">
        <h1>Department Dashboard</h1>
      </div>
    </header>

    <!-- Main content area where route components will be rendered -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* CSS Variables for consistent color scheme */
:root {
  --primary-blue: #003366;    /* Deep blue for main elements */
  --secondary-blue: #0066cc;  /* Lighter blue for highlights */
  --primary-orange: #ff6600;  /* Vibrant orange for accents */
  --secondary-orange: #ff9933; /* Lighter orange for hover states */
  --background-light: #f5f8fa; /* Light background */
  --text-dark: #333333;       /* Dark text color */
}

/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Main app container */
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-dark);
  min-height: 100vh;
  background-color: var(--background-light);
}

/* Header styling */
.header {
  background-color: var(--primary-blue);
  padding: 1rem 2rem;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Logo container layout */
.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Logo image sizing */
.dept-logo {
  height: 40px;
  width: auto;
}

/* Main content area */
.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
