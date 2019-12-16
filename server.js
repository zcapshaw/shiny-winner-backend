const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

//GET endpoint that returns all the todos in the db
todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos){
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    })
})

//GET endpoint that returns a specific todo record by ID
todoRoutes.route('/:id').get(function(req, res){
    let id = req.params.id;
    Todo.findById(id, function(err, todo){
        res.json(todo);
    });
});

//POST endpoint to create new todos
todoRoutes.route('/add').post(function(req, res){
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

//POST endpoint to update a record by id
todoRoutes.route('/update/:id').post(function(req, res){
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send('data is not found');
        else
            todo.todoDescription = req.body.todoDescription;
            todo.todoResponsible = req.body.todoResponsible;
            todo.todoPriority = req.body.todoPriority;
            todo.todoCompleted = req.body.todoCompleted;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
            .catch(err => {
                res.status(400).send('Update not possible');
            });
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function(){
    console.log("Server is running on Port: " + PORT);
});

