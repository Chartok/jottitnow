const express = require('express');
const htmlRoutes = require('./routes/index.js');
const jottRoutes = require('./routes/jottRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/jott', jottRoutes);
app.use('/', index.js);


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

console.log(err);