require('../routes/employee');
const sqlize = require('../sequelize');

const getAll = async (req, res) => {
    try {
        const employees = await sqlize.Employee.findAll({
            include: [{
                model: sqlize.Technology,
                attributes: ['name'],
                through: {attributes: []}
            }]
        });
        const employeeList = employees.map(emp => {
            return {
                id: emp.id,
                firstName: emp.first_name,
                lastName: emp.last_name,
                technologies: emp.technologies.map(tech => tech.toJSON())
            };
        });
        res.send(employeeList);
    } catch (error) {
        res.status(500);
        console.error(error);
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const {id} = req.params;

        const employee = await sqlize.Employee.findByPk(id, {
            attributes: ["id", "first_name", "last_name"],
            include: [{
                model: sqlize.Technology,
                attributes: ['name'],
                through: {attributes: []}
            }]
        })

        res.send(employee);
    } catch (error) {
        res.status(500);
        console.error(error);
    }
}

const addEmployee = async (req, res) => {
    try {
        const {firstName, lastName, technologyId} = req.body;
        if (!firstName || !lastName) {
            return res.status(400)
                .json({success: false, msg: 'Please provide first and last name'})
        }
        const employee = await sqlize.Employee.create({
            first_name: firstName,
            last_name: lastName
        });

        if (technologyId) {
            technologyId.forEach(techId => addTechToEmployee(employee, techId));
        }
        res.status(201)
            .json({success: true, person: `${firstName} ${lastName}`});

    } catch (error) {
        console.error(error);
        res.status(500);
    }
};

const addTechToEmployee = (employee, techId) => {
    sqlize.Technology.findByPk(techId).then(tech => {
        employee.addTechnology(tech);
    });
}

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await sqlize.Employee.findByPk(id, {
            include: sqlize.Technology
        });

        if (employee) {
            await employee.update(req.body);
            const { technologyId } = req.body;

            if (technologyId) {
                const technologies = await sqlize.Employee.findAll({where: {id: technologyId}});
                const existingTechnologyIds = employee.technologies.map((technology) => technology.id);
                const removeTechnologyIds = existingTechnologyIds.filter((techId) => !technologyId.includes(techId));
                console.log(`Remove Tech: ${removeTechnologyIds}`);
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
}

module.exports = {getAll, addEmployee, getEmployeeById, updateEmployee};