const express = require('express')
const app = express()
const port = 3000
const saltRounds = 10
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const session = require("express-session");
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended:false }));

app.use(session({
    secret:'config'
    ,name:'uniqueSessionID'
    ,saveUninitialized:false
}))

app.get('/',(req,res) => {
    res.render(`index.ejs`)
})
var msg = ""
app.get('/login',(req,res) => {
    res.render(`login.ejs`, {code:msg})
})

app.get('/login',(req,res) => {
    res.render(`login.ejs`, {code:msg})
})

app.get('/dashboard',(req,res) => {
    if(req.session.loggedIn == true){
        res.render('dashboard.ejs',{user:req.session.username})
    }else{
        res.redirect('/')
    }
})

app.post('/login',async(req,res) =>{
    data = {
        username: req.body.username,
        password: req.body.password
    }

    console.log(data)

    if(data.username == '' || data.password == ''){
        msg = "username or password not inputted"
        console.log('err')
        res.render('login.ejs',{code:msg})
    }else{
    await db.get(data.username).then(resp => {
        compare = bcrypt.compareSync(data.password, resp);
        console.log(compare)
        if(compare == true){
            msg = "login successfull"
            console.log("successful log")
            req.session.loggedIn = true
            req.session.username = data.username
            res.render('login.ejs',{code:msg})
        }else{
            msg = "incorrect password"
            console.log('incorrect password')
            res.render('login.ejs',{code:msg})
        }
    })
}
})
var message = ""
app.get('/register',(req,res) => {
    res.render('register.ejs', {code:message})
})

app.post('/register', async(req,res) =>{

    data = {
        username: req.body.username,
        password: req.body.password
    }

    const encrypted = bcrypt.hashSync(data.password, saltRounds);

    
    await db.get(data.username).then(res => {
        if(res == null){
            db.set(data.username,encrypted)
            console.log('password successfull')
            message = "registered successfully"
        }else{
            message = "Username already exists"
            console.log('username error')
        }
    })

    res.render('register.ejs',{code:message})
    
})

app.listen(port,() => {
    console.log(`app is running on http://localhost:${port}`)
})