var express = require('express') 
var app = express()
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId
app.set('view engine', 'pug');
app.use(express.static(__dirname+"/public"))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/listStudents',(req,res)=>{
    MongoClient.connect('mongodb://localhost:27017', function(err,con){
        var db = con.db('kh2')
        db.collection('students').find().toArray()
        .then((students)=>{res.render('studentslist',{stds:students})})
        .catch(err=>console.log(err))
    
    })
})

app.get('/deleteStudent/:id',(req,res)=>{
    MongoClient.connect('mongodb://localhost:27017', function(err,con){
        var db = con.db('kh2')
        db.collection('students').deleteOne({_id:ObjectId(req.params.id)})
        .then((students)=>{res.send("Student Deleted")})
        .catch(err=>console.log(err))
    
    })
})

app.post("/addStudent",(req,res)=>{
    MongoClient.connect('mongodb://localhost:27017', function(err,con){
        var db = con.db('kh2')
        db.collection('students').insertOne(req.body)
        .then((students)=>{res.redirect("/listStudents")})
        .catch(err=>console.log(err))
    
    })
})

app.get('/editStudent/:id',(req,res)=>{
    MongoClient.connect('mongodb://localhost:27017', function(err,con){
        var db = con.db('kh2')
        db.collection('students').findOne({_id:ObjectId(req.params.id)})
        .then((student)=>{
            console.log(student)
            res.render('editStudent',{student:student})
        })
        .catch(err=>console.log(err))
    
    })
})

app.post("/updateStudent/:id",(req,res)=>{
    console.log(req.body)
    MongoClient.connect('mongodb://localhost:27017', function(err,con){
        var db = con.db('kh2')
        db.collection('students').updateOne({_id:ObjectId(req.params.id)},{$set:{...req.body}})
        .then((student)=>{
            res.redirect("/listStudents")
        })
        .catch(err=>console.log(err))
    
    })
})


app.listen(4000,()=>{console.log('server is running on 4000')})