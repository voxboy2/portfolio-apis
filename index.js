const express = require('express');
const app = express();
const router = express.Router();
const dotenv = require('dotenv');
const path = require("path");



const db = require('./db');
dotenv.config();


const authRoute = require('./routes/auth');
const projectsRoute = require('./routes/Projects');

app.use(express.json());

app.use('/api/user', authRoute)
app.use('/api/projects', projectsRoute)

const port = 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.listen(port, function () {
    console.log('app listening on port 8080!')
  })