import pg from 'pg';
import inquirer from 'inquirer';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

pool.connect();

function mainMenu() {
    console.log('Main menu loaded');
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit'
            ]
        }
    ]).then(answer => {
        console.log('Selected action:', answer.action);
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                console.log('Exiting...');
                pool.end();
                break;
        }
    });
}

function viewAllDepartments() {
    pool.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}

function viewAllRoles() {
    pool.query(`
        SELECT roles.id, roles.title, roles.salary, departments.name AS department
        FROM roles
        JOIN departments ON roles.department_id = departments.id
    `, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}

function viewAllEmployees() {
    pool.query(`
        SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
        COALESCE(CONCAT(manager.first_name, ' ', manager.last_name), 'No Manager') AS manager
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees manager ON employees.manager_id = manager.id
    `, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]).then(answer => {
        pool.query('INSERT INTO departments (name) VALUES ($1)', [answer.name], (err) => {
            if (err) throw err;
            console.log('Department added successfully!');
            mainMenu();
        });
    });
}

function addRole() {
    pool.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        const departments = res.rows.map(row => ({ name: row.name, value: row.id }));
        
        inquirer.prompt([
            { name: 'title', message: 'Enter the name of the role:' },
            { name: 'salary', message: 'Enter the salary for the role:' },
            { 
                type: 'list',
                name: 'department_id',
                message: 'Select the department for the role:',
                choices: departments
            }
        ]).then(answers => {
            pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', 
                [answers.title, answers.salary, answers.department_id], (err) => {
                    if (err) throw err;
                    console.log('Role added successfully!');
                    mainMenu();
                });
        });
    });
}

function addEmployee() {
    pool.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        const roles = res.rows.map(row => ({ name: row.title, value: row.id }));

        pool.query('SELECT * FROM employees', (err, res) => {
            if (err) throw err;
            const managers = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
            managers.push({ name: 'None', value: null });

            inquirer.prompt([
                { name: 'first_name', message: 'Enter the first name of the employee:' },
                { name: 'last_name', message: 'Enter the last name of the employee:' },
                { 
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the role for the employee:',
                    choices: roles
                },
                { 
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the manager for the employee:',
                    choices: managers
                }
            ]).then(answers => {
                pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
                    [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err) => {
                        if (err) throw err;
                        console.log('Employee added successfully!');
                        mainMenu();
                    });
            });
        });
    });
}

function updateEmployeeRole() {
    pool.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        const employees = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        
        pool.query('SELECT * FROM roles', (err, res) => {
            if (err) throw err;
            const roles = res.rows.map(row => ({ name: row.title, value: row.id }));

            inquirer.prompt([
                { 
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee whose role you want to update:',
                    choices: employees
                },
                { 
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role:',
                    choices: roles
                }
            ]).then(answers => {
                pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', 
                    [answers.role_id, answers.employee_id], (err) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully!');
                        mainMenu();
                    });
            });
        });
    });
}

 mainMenu();

