var express = require('express')
var app = express()
app.set("view engine", "ejs")
var nodemailer = require('nodemailer');
let c =0;
var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1160000 } }))



const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/newdb', { useNewUrlParser: true });
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
app.use('/assets',express.static('assets'));
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hssharma2212000@gmail.com',
      pass: 'priyanshi4141'
    }
  });

var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1160000 } }))

const _ = require("lodash")
const userSc = new Schema({
    name:String,
    mobile:String,
    address:String,
    pincode:Number,
    quantity:Number,
    email:String,
    password:String

});

const usersm = mongoose.model("Userm", userSc)
const userScehma = new Schema({
    email: String,
    password: String,
    address:String,
    mobile :String,
    pincode:Number,

});

const checkLogIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/')
    }
}


const userModel = mongoose.model("User", userScehma)

var bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.get('/', (req, res) => {
    res.render('app',{d:c})
})
app.get('/form', (req, res) => {
    res.render('form')
})

app.get('/user/login', (req, res) => {
    res.render('login')
})
app.post('/form', urlencodedParser, (req, res) => {
    switch (req.body.action) {
        case 'signup':
            userModel.findOne({ email: req.body.email }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/')
                    return
                }
                if (_.isEmpty(doc)) {
                    let newUser = new userModel();
                    newUser.email = req.body.email;
                    newUser.password = req.body.password;
                    newUser.address=req.body.address;
                    newUser.mobile=req.body.mobile;
                    newUser.pincode=req.body.pin;
                
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err, 'error')
                            return
                        }
                        res.render('login', { message: "Sign Up Successful. Please log in." })
                    });

                } else {
                    res.render('login', { message: "User already exists" })
                }
            })
            break;
        case 'login':
            userModel.findOne({ email: req.body.email, password: req.body.password }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/')
                    return
                }
                if (_.isEmpty(doc)) {
                    res.render('login', { message: "Please check email/password" })
                } else {
                    req.session.user = doc
                 
                
                    res.redirect('/das')
                }
            })
            break;
    }


})

app.get('/das',(req,res)=>{
    res.render('dass');
})
app.post('/das',urlencodedParser,(req,res)=>{
    var mailOptions = {
        from: 'himanshsharma5557@gmail.com',
        to: 'priyanshichauhanx06@gmail.com',
        subject: 'pickup order for waste',
        text: req.body.quantity + "             " + "from" + "                  " +req.session.user.address,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
      
res.redirect('/qr')
    
})
app.get('/qr',(req,res)=>{
    userModel.findOne({ email: req.session.user.email }, function (err, doc) {
        if (err) {
            console.log(err, 'error')
            res.redirect('/')
            return
        }
         else {
        
         
        
            res.render('him',{user:doc})
        }
    })
 
})
app.get('/about',(req,res)=>{
    res.render('index')
})
app.post('/user/login', urlencodedParser, (req, res) => {
    switch (req.body.action) {
        case 'signup':
            userm.findOne({ email: req.body.email }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/')
                    return
                }
                if (_.isEmpty(doc)) {
                    let newUser = new userm();
                    newUser.email = req.body.email;
                    newUser.password = req.body.password;
                    newUser.address=req.body.address;
                    newUser.mobile=req.body.mobile;
                    newUser.pincode=req.body.pin;
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err, 'error')
                            return
                        }
                        res.render('login', { message: "Sign Up Successful. Please log in." })
                    });

                } else {
                    res.render('login', { message: "User already exists" })
                }
            })
            break;
        case 'login':
            userm.findOne({ email: req.body.email, password: req.body.password }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/')
                    return
                }
                if (_.isEmpty(doc)) {
                    res.render('login', { message: "Please check email/password" })
                } else {
                    req.session.user = doc
                    res.redirect('/user/him')
                }
            })
            break;
    }


})
app.get('/user/him',(req,res)=>{
    res.render('hima')
})
app.get('/user/dashboard', checkLogIn, (req, res) => {
    res.render("user");
})
app.post('/user/him',urlencodedParser,(req,res)=>{
    usersm.findOne({_id:req.body.key}, function (err, doc) {
        if (err) {
            console.log(err, 'error')
            res.redirect('/')
            return
        }
        if (_.isEmpty(doc)) {
            res.redirect('/user/him')
        } else {
        
            res.redirect('/user/dashboard')
        }
    })

})
app.post("/user/dashboard",urlencodedParser,(req,res)=>{
    c=c+Number(req.body.receive);
    if(c>100){
        var mailOptions = {
            from: 'himanshsharma5557@gmail.com',
            to: 'shivdwi043@gmail.com',
            subject: 'pickup order for waste',
            text: 'can collect the total e waste as the total e waste is exceeding 100kgs '
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          })
    
        c=0;
    }
    res.redirect('/')
})

app.get('/user/logout', checkLogIn, (req, res) => {
    req.session.destroy()
    res.redirect('/')
})
app.listen(9000);
