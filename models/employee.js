const {DataTypes, Model} = require('sequelize');
const {Technology} = require('./technology');

class Employee extends Model {}

function factory(sequelize) {
    console.log('Initializing Employee model')
    Employee.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "first_name"
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "last_name"
        }
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'employee' // We need to choose the model name
    });

    return Employee;

}





module.exports = {Employee, factory};