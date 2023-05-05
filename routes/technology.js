const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlize = require('../sequelize');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const technologyService = require('../services/technologyService');

router.get('/', technologyService.getAll);
router.post('/', technologyService.addTechnology)

module.exports = router;