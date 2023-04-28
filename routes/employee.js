const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlize = require('../sequelize');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', async (req, res) => {
    sqlize.Employee.findAll({
        include: [{
            model: sqlize.Technology,
            attributes: ['name'],
            through: { attributes: [] }
        }]
    }).then(employees => {
        const employeeList = employees.map(emp => {
            console.log(emp.technologies);
            return {
                id: emp.id,
                firstName: emp.firstName,
                lastName: emp.lastName,
                technologies: emp.technologies.map(tech => tech.toJSON())
            };
        });
        res.send(employeeList);
    })
        .catch(err => {
            console.error(err);
        });
});

router.post('/', async (req, res) => {
    const { firstName, lastName, technologyId } = req.body;
    if (!firstName || !lastName) {
        return res
            .status(400)
            .json({ success: false, msg: 'Please provide first and last name' })
    }
    const Employee = await sqlize.Employee.create({
        firstName: firstName,
        lastName: lastName
    });

    console.log("TechId: " + technologyId);

    if (technologyId) {
        console.log(`Employee: \n ${Employee}`);
        sqlize.Technology.findByPk(technologyId).then(tech => {
            console.log(`Tech: \n ${tech}`);
            Employee.addTechnology(tech);
        });
    }

    res.status(201).json({ success: true, person: firstName });
})

router.get('/:id', (req, res) => {
    const {id} = req.params;
    sqlize.Employee.findByPk(id, {
        include: [{
            model: sqlize.Technology,
            attributes: ['name'],
            through: { attributes: [] }
        }]
    }).then(employee => {
            const result = {
                id: employee.id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                technologies: employee.technologies.map(tech => tech.toJSON())
            };
            res.send(result);
        })
        .catch(err => {
            console.error(err);
        });
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await sqlize.Employee.findByPk(id, {
            include: sqlize.Technology
        });

        if (employee) {
            await employee.update(req.body);

            const { technologyId } = req.body;

            console.log(`TechID: ${technologyId}`);

            if (technologyId) {
                const technologies = await sqlize.Employee.findAll({where: {id: technologyId}});

                console.log("EDIT TECH");
                console.log(employee);

                const existingTechnologyIds = employee.technologies.map((technology) => technology.id);

                const removeTechnologyIds = existingTechnologyIds.filter((techId) => !technologyId.includes(techId));

                const addTechIds = technologyId.filter((techId) => !existingTechnologyIds.includes(techId));

                await sqlize.EmployeeTechnology.destroy({where: {employeeId: id, technologyId: removeTechnologyIds}});

                const newEmployeeTechnologies = addTechIds.map((techId) => ({employeeId: id, technologyId: techId}));
                await sqlize.EmployeeTechnology.bulkCreate(newEmployeeTechnologies);
            }

            console.log('Changed fields:', employee.changed());

            res.status(200).send({ message: 'Employee updated successfully', employee });
        } else {
            res.status(404).send({ message: `Employee with id ${id} not found` });
        }
    } catch (error) {
        console.error('Error occurred while updating employee:', error);
        res.status(500).send({ message: 'Error occurred while updating employee', error });
    }
});

module.exports = router;