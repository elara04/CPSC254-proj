# Department Dashboard Application

A web application for managing department assets, employees, and courses. Built with Vue.js frontend and Express/PostgreSQL backend.

## Project Structure
```
dept-dashboard-app/
├── frontend/              # Vue.js frontend application
│   ├── src/
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Vue components
│   │   ├── router/       # Vue router configuration
│   │   ├── views/        # Page components
│   │   ├── App.vue      # Root component
│   │   └── main.js      # Application entry point
│   ├── package.json
│   └── vue.config.js
│
├── backend/              # Express.js backend application
│   ├── routes/          # API route handlers
│   │   ├── employees.js
│   │   ├── assets.js
│   │   └── courses.js
│   ├── database.js      # Database configuration
│   ├── index.js         # Server entry point
│   └── package.json
│
└── sql/                 # SQL scripts for database setup
├── drop_commands.sql    # Commands to drop tables and types
├── insert_assets.sql    # Asset data insertion scripts
├── insert_courses.sql   # Course data insertion scripts
└── insert_employee.sql  # Employee data insertion scripts
```

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (Node Package Manager)

## Database Setup

### Installing PostgreSQL on Ubuntu
1. Update package list and install PostgreSQL:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

2. Start PostgreSQL service:
```bash
sudo systemctl start postgresql.service
```

3. Create root admin user and set password:
```bash
# Switch to postgres user
sudo -i -u postgres

# Create root admin user
createuser --interactive --pwprompt rootadmin
# Enter password when prompted
# Answer 'y' to superuser question

# Create database
createdb DeptDB

# Grant ownership to rootadmin
psql -c "ALTER DATABASE DeptDB OWNER TO rootadmin;"

# Exit postgres user shell
exit
```

4. Configure PostgreSQL authentication (optional but recommended):
```bash
sudo nano /etc/postgresql/[version]/main/pg_hba.conf
# Add the following line under IPv4 local connections:
# host    all    rootadmin    127.0.0.1/32    md5
```

5. Restart PostgreSQL to apply changes:
```bash
sudo systemctl restart postgresql
```

### Creating Database Schema and Populating Data
1. Connect to DeptDB as rootadmin:
```bash
psql -U rootadmin -d DeptDB
```

2. Create required ENUM and tables:
```sql
CREATE TYPE category_type AS ENUM ('PC', 'Equipment', 'Monitor');

CREATE TABLE Asset (
    asset_id INTEGER PRIMARY KEY,
    category category_type NOT NULL,
    purchase_year INTEGER,
    manufacture VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    model VARCHAR(50),
    location VARCHAR(100),
    service_tag VARCHAR(30)
);

CREATE TABLE Employee (
    cwid CHAR(4) PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    office VARCHAR(50)
);

CREATE TABLE Course (
    section_number INTEGER PRIMARY KEY,
    inst_id CHAR(4) REFERENCES Employee(cwid),
    deptcode VARCHAR(10) NOT NULL,
    capacity INTEGER NOT NULL,
    enrolled INTEGER,
    room VARCHAR(50),
    time VARCHAR(50)
);
```
3. Populate the databse with inital data
# Navigate to the sql directory
```bash
cd sql

# Execute the SQL scripts in the following order:
psql -U rootadmin -d DeptDB -f insert_employee.sql
psql -U rootadmin -d DeptDB -f insert_assets.sql
psql -U rootadmin -d DeptDB -f insert_courses.sql
```
# Note: If you need to reset the database, you can use the drop_commands.sql script:
```bash
psql -U rootadmin -d DeptDB -f drop_commands.sql
```

## Backend Installation
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=3000
DB_USER=rootadmin
DB_HOST=localhost
DB_NAME=DeptDB
DB_PASSWORD=your_rootadmin_password
DB_PORT=5432
```

4. Start the backend server:
```bash
npm run dev
```

## Frontend Installation
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run serve
```

## Dependencies

### Backend Dependencies
- express: Web framework
- pg: PostgreSQL client
- cors: Cross-Origin Resource Sharing middleware
- dotenv: Environment variable management
- nodemon (dev): Development auto-reload

### Frontend Dependencies
- vue: Frontend framework
- vue-router: Routing
- axios: HTTP client
- @vueuse/core: Vue composition utilities
- pinia: State management

## Usage
After installation:
1. Backend server runs on: http://localhost:3000
2. Frontend development server runs on: http://localhost:8080
3. Access the dashboard through your web browser at http://localhost:8080

## Features
- View and manage department employees
- Track and maintain department assets
- Manage course schedules and enrollments
- Search functionality for all resources
- Add, update, and delete records
- Responsive design for various screen sizes

## Development Notes
- Frontend uses Vue 3 with Composition API
- Backend implements RESTful API design
- PostgreSQL database with referential integrity
- CORS enabled for development

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the ISC License.
