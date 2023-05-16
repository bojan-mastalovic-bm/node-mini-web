const {Sequelize} = require('sequelize');
const Technology = require('./models/technology');
const Employee = require('./models/employee');
async function connect() {
    const sequelizeDB = new Sequelize('project_db', 'root', 'change-me', {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        define: {
            freezeTableName: true, // prevent sequelize from pluralizing table names
        }
    });
    return sequelizeDB;
}

// let db = {};
// async function getDbInstance(syncDB) {
//     console.log("getDbInstance called")
//     if (!db.isConnected) {
//         const sequelize = await connect()
//         db.sequelize = sequelize
//         db.isConnected = true
//     }
//     await initializeModels(db.sequelize)
//     if (syncDB) {
//         await syncDb(db.sequelize);
//     }
// };
async function getDbInstance(syncDB) {
    console.log("getDbInstance called")
    const sequelize = await connect()
    await initializeModels(sequelize)
    if (syncDB) {
        await syncDb(sequelize);
    }
};

async function initializeModels (sequelize) {
    console.log('Inside Initialize Models')
    const employee = Employee.factory(sequelize)
    const technology = Technology.factory(sequelize)
    employee.belongsToMany(technology,
        { through: 'employee_technology',
            as: 'technologies',
            foreignKey: 'employeeId'})

    technology.belongsToMany(employee,
        { through: 'employee_technology',
            as: 'employees',
            foreignKey: 'technologyId'})
}

async function syncDb(sequelize) {
    try {
        sequelize.sync({force: false})
        console.log('User table created or synced!');
    } catch (error) {
        console.error('Unable to sync User table', error);
    }
};

module.exports = {getDbInstance};