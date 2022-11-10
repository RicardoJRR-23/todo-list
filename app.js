const express = require('express');
<<<<<<< HEAD
const info = require('./models/InfoHttp');
const TodoController = require('./controllers/TodoController');
const app = express();

app.use([info, express.json()]);

app.get('/todos', TodoController.getAll);

app.get('/todos/:todoID', TodoController.getOne);

app.post('/todos', TodoController.create);

app.put('/todos/:todoID', TodoController.update);

app.delete('/todos/:todoID', TodoController.deleteTD);
=======


let todo_list = [];
let id = 1;


const app = express();


app.use(express.json());


app.post("/create", (req, res) => {
    console.log("Creating a todo element");
    const {title, description} = req.body;
    const found = todo_list.find((todo) => title === todo.title);
    if (!title && !description){
        return res.send("TITLE and DESCRIPTION not provided");
    }
    if (!title){
        return res.send("TITLE not provided");
    }
    if (!description){
        return res.send("DESCRIPTION not provided.");
    }

    if (found){
        return res.status(208).send("Todo element already exist");
    }
    todo_list.push({ "id": Number(id), "title": title, "description": description});
    id++;
    console.log(todo_list);
    res.status(201).send("register sucess");
});


app.get("/", (req, res) => {
    console.log("geting all elements");
    if (!todo_list.length){
        return res.status(204).send("there is no todo task");
    }
    return res.json(todo_list);
});


app.get("/todo", (req, res) => {
    const {todoID} = req.query;
    console.log(`geting the element ${todoID}`);
    const singleTodo = todo_list.find((todo) => todo.id === Number(todoID));
    if (!singleTodo){
        return res.status(404).send("Todo element not found");
    }
    return res.status(200).json(singleTodo);
});


app.put("/update", (req, res) => {
    
    const {todoID, title, description} = req.query;
    let found;
    console.log(`Updating element with id: ${todoID}`);
    const singleTodo = todo_list.find((todo) => Number(todoID) === todo.id);
    if (!singleTodo){
        return res.send("Element not found");
    }
    if (title){
        singleTodo.title = title;
    }
    if (description){
        singleTodo.description = description;
    }
    return res.send("Updated whit sucess");
});


app.delete('/delete', (req, res) => {
    const {todoID} = req.query;
    let found;
    console.log(`Deleting element with id: ${todoID}`);

    for (let index=0; index < todo_list.length; index++){
        if (Number(todoID) === todo_list[index].id){
            found = index;
            break;
        }
    }
    if (found === undefined){
        return res.status(404).send("Element not found");
    }
    todo_list.splice(found, 1);
    return res.send("Delete sucess");
});


app.listen(5000, () => {
    console.log("Listen on port 5000...");
});
>>>>>>> 5127a77486323dcbbc652a512b8fa554062de761

app.listen(3001, () => {
    console.log("Server listening on port 3001....");
});     