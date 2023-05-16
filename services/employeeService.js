require('../routes/employee');
const {Employee} = require('../models/employee');
const {Technology} = require('../models/technology')

const getAll = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [{
                model: Technology,
                as: 'technologies',
                attributes: ['id','name'],
                through: {attributes: []}
            }]
        });
        const employeeList = employees.map(emp => {
            return {
                id: emp.id,
                firstName: emp.firstName,
                lastName: emp.lastName,
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

        const employee = await Employee.findByPk(id, {
            attributes: ["id", "firstName", "lastName"],
            include: [{
                model: Technology,
                as: 'technologies',
                attributes: ['id','name'],
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
        const {firstName, lastName, technologyIds} = req.body;
        if (!firstName || !lastName) {
            return res.status(400)
                .json({success: false, msg: 'Please provide first and last name'})
        }
        const employee = await Employee.create({
            firstName: firstName,
            lastName: lastName
        });

        if (technologyIds) {
            technologyIds.forEach(techId => addTechToEmployee(employee, techId));
        }
        res.status(201)
            .json({success: true, person: `${firstName} ${lastName}`});

    } catch (error) {
        console.error(error);
        res.status(500);
    }
};

async function addTechToEmployee (employee, techId) {
    try {
        const TechToAdd = await Technology.findByPk(techId);
        employee.addTechnology(TechToAdd);
    } catch (error) {
        console.log(error);
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByPk(id, {
            include: [{
                model: Technology,
                as: 'technologies'
            }]
        });

        if (employee) {
            await employee.update(req.body);
            const { technologyIds } = req.body;

            if (technologyIds) {
                // const existingTechnologyIds = employee.technologies.map((technology) => technology.id);
                // const removeTechnologyIds = existingTechnologyIds.filter((techId) => !technologyIds.includes(techId));
                // console.log(`Remove Tech: ${removeTechnologyIds}`);
                // const addTechIds = technologyIds.filter((techId) => !existingTechnologyIds.includes(techId));
                // await sqlize.EmployeeTechnology.destroy({where: {employeeId: id, technologyId: removeTechnologyIds}});
                // const newEmployeeTechnologies = addTechIds.map((techId) => ({employeeId: id, technologyId: techId}));
                // await sqlize.EmployeeTechnology.bulkCreate(newEmployeeTechnologies);

                const existingTechnologyIds = employee.technologies.map((technology) => technology.id);

                const removeTechnologyIds = existingTechnologyIds
                    .map((id) => String(id))
                    .filter((techId) => !technologyIds.includes(techId));

                const addTechIds = technologyIds
                    .filter((techId) => !existingTechnologyIds
                        .map((id) => String(id))
                        .includes(techId));

                for (const techId of removeTechnologyIds) {
                    const techToRemove = await Technology.findByPk(techId);
                    employee.removeTechnology(techToRemove);
                }

                for (const techId of addTechIds) {
                    await addTechToEmployee(employee, techId);
                }
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