const express = require('express');
const {port} = require('./config');
const bodyParser = require('body-parser');
const appRoutes = require('./index.route');
const app = express();

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());


// Routes Middleware
app.use(appRoutes)

//Base Path
app.get('/', (req, res) => {
    res.send("Welcome").status(200);
})

app.listen(port, ()=> console.log("Connected to port:", port));