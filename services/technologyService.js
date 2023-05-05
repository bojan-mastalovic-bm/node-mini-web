require('../routes/technology');
const sqlize = require('../sequelize');

const getAll = async (req, res) => {
    try {
        const technologies = await sqlize.Technology.findAll();
        res.send(technologies);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

const addTechnology = async (req, res) => {
    try {
        const {name} = req.body;
        if (!name) {
            return res
                .status(400)
                .json({success: false, msg: 'Please provide name of the technology'})
        }
        await sqlize.Technology.create({
            name: name
        });
        res.status(201).json({success: true, technology: name});
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

module.exports = {getAll, addTechnology}