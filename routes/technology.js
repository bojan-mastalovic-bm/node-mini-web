const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlize = require('../sequelize');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', async (req, res) => {
    const technologies = await sqlize.Technology.findAll();
    res.send(technologies);
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res
            .status(400)
            .json({ success: false, msg: 'Please provide name of the technology' })
    }
    await sqlize.Technology.create({
        name: name
    });
    res.status(201).json({ success: true, technology: name });
})

module.exports = router;