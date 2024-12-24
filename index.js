const express = require('express')
const app = express()
port = 3000

const { QuickDB } = require("quick.db");
const db = new QuickDB();

const bcrypt = require('bcrypt')

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended:false }));
app.get('/',(req,res) => {
    res.render(`index.ejs`)
})

app.get('/login',(req,res) => {
    res.render(`login.ejs`)
})

app.get('/register',(req,res) => {
    res.render(`register.ejs`)
})

app.post('/register', async(req,res) =>{
    console.log(req.body.username)
    data = {
        username: req.body.username,
        password: req.body.password
    }
    console.log(data)
    res.render('register.ejs')
})

app.listen(port,() => {
    console.log(`app is running on http://localhost:${port}`)
})