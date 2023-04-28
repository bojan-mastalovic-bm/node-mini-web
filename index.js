const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Home Page');
});

const employeeRoutes = require('./routes/employee.js');
app.use('/employee', employeeRoutes);

const techRoutes = require('./routes/technology.js');
app.use('/technology', techRoutes);

app.get('/project', (req, res) => {
    res.send('Projects');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});