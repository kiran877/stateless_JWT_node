const express = require('express');
const jwt= require('jsonwebtoken');
const mongoose =require('mongoose');
const dotenv = require('dotenv');
const ejs=require('ejs')
const app = express();

const PORT = 3000;
dotenv.config();

app.use(express.json());
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))


const secretkey=process.env.mySecretkey

const users=[{
    id:"1",
    username:"charukesh",
    password:"charukesh",
    city:"Hyderabad",
    isAdmin:true
},
{
    id:"2",
    username:"sree",
    password:"sree",
    city:"Hyderabad",
    isAdmin:false
}];


const verifyUser = (req, res, next) => {
    const userToken = req.headers.authorization
    if (userToken) {
        const token = userToken.split(" ")[1]
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ err: "token is not valid" })
            }
            req.user = user
            next()
        })

    } else {
        res.status(401).json("you are not authenticated")
    }
}


app.post('/login',(req,res)=>{
    const {username,password}=req.body;

    const user=users.find((person)=>{
        return person.username === username && person.password === password;

        
    })
    if(user){
        const accesstoken=jwt.sign({
            id:user.id,
            username:user.username,
            city:user.city,
            isAdmin:user.isAdmin
        },secretkey)
        res.json({
            username:user.username,
            isAdmin:user.isAdmin,
            accesstoken
        });
    }
    else{
        res.status(401).json("username and password incorrect");
    }
})


app.delete('/api/users/:userId', verifyUser, (req, res) => {

    if (req.user.id === req.params.userId || req.user.isAdmin) {
        res.status(200).json("user is deleted successfull")
    } else {
        res.status(401).json("you are not allowed to delete")
    }

})

app.get("/kiran", (req, res) => {
    res.render("kiran")
})
app.get("/sree", (req, res) => {
    res.render("sree")
})

app.get('/login/:userId', (req, res) => {
    const userId = req.params.userId
    if (userId) {
        if (userId === "1") {
            res.redirect('/kiran')
        } else if (userId === "2") {
            res.redirect("/sree")
        }
    } else {
        res.status(403).json("user not found")
    }
})

app.post("/logout", (req, res) => {
    const userTokens = req.headers.authorization
    if (userTokens) {
        const token = userTokens.split(" ")[1]
        if (token) {
            let allTokens = []
            const tokenIndex = allTokens.indexOf(token)
            if (tokenIndex !== -1) {
                allTokens.splice(tokenIndex, 1)
                res.status(200).json("Logout Succesfully!")
                res.redirect("/")
            } else {
                res.status(400).json("you are not valied use")
            }

        } else {
            res.status(400).json("token not found")
        }

    } else {
        res.status(400).json("You are not authenitcated")
    }

})

app.get('/logout', (req, res) => {
    res.redirect('/')
})

app.get('/', (req, res) => {
    res.render('final')
})





app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
})