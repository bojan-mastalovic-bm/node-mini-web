const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const employeeService = require('../services/employeeService');

router.get('/', employeeService.getAll);
router.post('/', employeeService.addEmployee);
router.get('/:id', employeeService.getEmployeeById);
router.put('/:id', employeeService.updateEmployee);

module.exports = router;