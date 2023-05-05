const Sequelize = require('sequelize');

const sequelize = new Sequelize('project_db', 'root', 'change-me', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

const Employee = sequelize.define('employee', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Technology = sequelize.define('technology', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const EmployeeTechnology = sequelize.define('EmployeeTechnology', {});

Employee.belongsToMany(Technology, { through: EmployeeTechnology });
Technology.belongsToMany(Employee, { through: EmployeeTechnology });

sequelize.sync({ force: false }).then(() => {
    console.log('User table created or synced!');
}).catch(err => {
    console.error('Unable to sync User table', err);
});

module.exports = {Employee, Technology, EmployeeTechnology}