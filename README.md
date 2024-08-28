# Employee Tracker
  ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
## Description 

This project is a terminal-based application to provide a user-friendly interface to manage employees, departments, and roles for your company. This application Uses PostgreSQL to keep a database of the data you want to store. This project also uses NodeJS, the Inquirer package, and the pg package to prompt the user for information about their employees, departments and roles, as well as providing visible tables for their companies data.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Tests](#tests)
- [Contact](#contact)

## Installation

To install this project, you will first need to make sure you have PostgreSQL and NodeJS installed on your device. Once they are installed, clone down the repository for this application using the "git clone" command in your terminal. Next you will need to run an "npm i" to download the required packages. After you have installed the packages, enter into the PostreSQL Shell by using the "psql -U" command followed by your username. You will then need to enter your password to log into the shell. Once you are in the PostgreSQL Shell within your terminal, you will need to run the provided schema.sql and seeds.sql files in order to create the database and provide the created tables with some information. You can then back out of the shell using "\q" and then using the "npm run start" command in your terminal. After you have completed these steps, the application will be launched and you will be provided with prompts.

## Usage

To use this Employee Tracker Application, you will be given prompts such and Add or View Employees, Departments, or Roles. You can choose any of these prompts and it will complete its action. Depending on which action you complete, you will be provided with tables that include specified data or you will be asked more prompts to add new data to the database.

## Credits

This project was created by Alec Taber.

## License
  
  This project uses the MIT License. For more information, visit [license link](https://opensource.org/licenses/MIT).

## Features

- Add employees, departments, and roles to the database
- View tables of employees, departments, and roles data
- Update employees roles


## Tests

N/A

## Contact

- GitHub: [AlecTaber](https://github.com/AlecTaber)
- Email: [alectaber12@gmail.com](mailto:alectaber12@gmail.com)