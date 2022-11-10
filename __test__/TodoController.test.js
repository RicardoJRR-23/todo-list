const TodoController = require('../controllers/TodoController');
const httpMocks = require('node-mocks-http');
const connectDB = require('../config/db');

let req, res;
const todos = [
    {title: "estudar", description: "Matematica e Programação"}, 
    {title: "lavar a louça", description: "As 10 horas de manhã"},
    {title: "Limpar o quarto", description: "Antes de sair"},
    {title: "ginasio", description: "Todo o dia as 17 horas"},
    {title: "Ler Livros", description: "Uma hora por dia"}
]

beforeEach(() => {
    connectDB.query("TRUNCATE todos RESTART IDENTITY");
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

describe("TodoController.getAll", () => {
    it("has get method", () => {
        expect(typeof TodoController.getAll).toBe("function");
    });

    it("returns a object with failed sucess and a message of 'no elements found'", async () => {
        await TodoController.getAll(req, res);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "There is no todo elements"});
    });

    it("returns a sucess and an array of five objects, each one filled with two property, title and description", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        await TodoController.getAll(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().todo_list.length).toEqual(5);
        expect(res._getJSONData()).toEqual({
            sucess: true,
            todo_list: [
              { id: 1, title: 'estudar', description: 'Matematica e Programação' },
              { id: 2, title: 'lavar a louça', description: 'As 10 horas de manhã'},
              { id: 3, title: 'Limpar o quarto', description: 'Antes de sair' },
              { id: 4, title: 'ginasio', description: 'Todo o dia as 17 horas'},
              { id: 5, title: 'Ler Livros', description: 'Uma hora por dia' }
            ]
          });
    });
});

describe("TodoController.getOne", () => {
    it("has get method", () => {
        expect(typeof TodoController.getOne).toBe("function");
    });

    it("returns a object with a failed sucess and a message of 'element not found' when there is no todos element at all", async () => {
        req.params.todoID = 1;
        await TodoController.getOne(req, res);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "todo element not found"});
    });
    
    
    it("returns a object that refer to the second element filled with title = 'lavar a louça' and description = 'As 10 horas de manhã'", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        req.params.todoID = 2;
        await TodoController.getOne(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({sucess: true, todo: {id: 2, title: 'lavar a louça', description: 'As 10 horas de manhã'}});
    });

    it("returns a object that refer to the fourth element filled with title = 'ginasio' and description = 'Todo o dia as 17 horas'", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        req.params.todoID = 4;
        await TodoController.getOne(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ 
            sucess: true, 
            todo: { id: 4, title: 'ginasio', description: 'Todo o dia as 17 horas' }
        });
    });

    it("returns a failed sucess and a message of 'the id that the user provided is not a number or is zero'", async () => {
        req._setParameter('todoID', "abc");
        await TodoController.getOne(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "the id that the user send is not a number or is zero"});
    });

    it("returns a failed sucess and a message of 'the id that the user provided is not a integer'", async () => {
        req._setParameter('todoID', 2.3);
        await TodoController.getOne(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "The id that the user send is not a integer"});
    });
});

describe("TodoController.create", () => {
    it("has post method", () => {
        expect(typeof TodoController.getOne).toBe("function");
    });

    it("returns an object with a failed sucess and a message of could not create element because title and description is required", async () => {
        req._setBody({title: "", description: ""});
        await TodoController.create(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "title and description is required"});
    });

    it("returns an object with a failed sucess and a message of could not create element because description is required", async () => {
        req._setBody({title: "New task", description: ""});
        await TodoController.create(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "description is required"});
    });

    it("returns an object with a failed sucess and a message of could not create element because title is required", async () => {
        req._setBody({title: "", description: "New task"});
        await TodoController.create(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "title is required"});
    });


    it("returns an object with a sucess and a object of the element created", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        req._setBody({title: "comprar comida", description: "Sexta feira as 8 horas"});
        await TodoController.create(req, res);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({sucess: true, todo: {id: 6, title: "comprar comida", description: "Sexta feira as 8 horas"}});
    });
});

describe("TodoController.update", () => {
    it("has put method", () => {
        expect(typeof TodoController.update).toBe("function");
    });

    it("return a failed sucess and a message of element not found if the element doesn't exist", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        req.params.todoID = 7;
        req.body.title = "NO task";
        req.body.description = "None";
        await TodoController.update(req, res);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "Todo element not found"});
    });

    it("return a object with sucess and the elemnent with just the title updated", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        req.params.todoID = 3;
        req._setBody({title: "Limpar o quarto e arrumar as roupas", description: ""});
        await TodoController.update(req, res);
        expect(res.statusCode).toBe(202);
        expect(res._getJSONData()).toEqual({
            sucess: true, 
            todo: {id: 3, title: "Limpar o quarto e arrumar as roupas", description: "Antes de sair"}
        });
    });

    
    it("return a object with sucess and the elemnent with just the description updated", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        req.params.todoID = 1;
        req._setBody({description: "Amanhã", title: ""});
        await TodoController.update(req, res);
        expect(res.statusCode).toBe(202);
        expect(res._getJSONData()).toEqual({
            sucess: true, 
            todo: {id: 1, title: "estudar", description: "Amanhã"}
        });
    });

    it("return a object with sucess and the elemnent with the title and description updated", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        req._setParameter('todoID', 5);
        req._setBody({title: "title updated", description: "description updated"});
        await TodoController.update(req, res);
        expect(res.statusCode).toBe(202);
        expect(res._getJSONData()).toEqual({
            sucess: true, 
            todo: {id: 5, title: "title updated", description: "description updated"}
        });
    });

    it("returns a failed sucess and a message of 'the id that the user provided is not a number or is zero'", async () => {
        req._setParameter('todoID', "abc");
        req._setBody({title: "None title", description: "None description"});
        await TodoController.update(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "the id that the user send is not a number or is zero"});
    });

    it("returns a failed sucess and a message of 'the id that the user provided is not a integer'", async () => {
        req._setParameter('todoID', 2.3);
        req._setBody({title: "None title", description: "None description"});
        await TodoController.update(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "The id that the user send is not a integer"});
    });
});

describe("TodoController.deleteTD", () => {
    it("has delete method", () => {
        expect(typeof TodoController.deleteTD).toBe("function");
    });

    it("return a object with a failed sucess and a message of 'element not found'", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        req.params.todoID = 7;
        await TodoController.deleteTD(req, res);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({sucess: false, msg:"Todo element not found"});
    });

    it("return a object with a sucess and a message of 'element sucessfull deleted'", async () => {
        for (let i = 0; i < todos.length; i++){
            await connectDB.query("INSERT INTO todos ( title, description ) VALUES( $1, $2 )", [todos[i].title, todos[i].description]);
        }
        req.params.todoID = 3;
        await TodoController.deleteTD(req, res);
        expect(res.statusCode).toBe(202);
        expect(res._getJSONData()).toEqual({sucess: true, msg: "Todo element sucessfull deleted"});
    });

    it("returns a failed sucess and a message of 'the id that the user provided is not a number or is zero'", async () => {
        req._setParameter('todoID', "abc");
        await TodoController.deleteTD(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "the id that the user send is not a number or is zero"});
    });

    it("returns a failed sucess and a message of 'the id that the user provided is not a integer'", async () => {
        req._setParameter('todoID', 2.3);
        await TodoController.deleteTD(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({sucess: false, msg: "The id that the user send is not a integer"});
    });
});