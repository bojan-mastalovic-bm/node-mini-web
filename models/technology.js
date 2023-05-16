const {DataTypes, Model} = require('sequelize');
// let db = {};
// (async function() {
//     db = await getDbInstance;
// })();
class Technology extends Model {}

function factory(sequelize) {
    console.log('Initializing Technology model')
    Technology.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'technology'
    });
    return Technology;
}

module.exports = {Technology, factory};