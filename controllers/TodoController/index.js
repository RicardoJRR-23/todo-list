const Todo = require('../../models/Todo');

const getAll = async (req, res) => {  
    const todo_list = await Todo.getAll();

    if (!todo_list.length) {
        return res.status(404).json({sucess: false, msg: "There is no todo elements"});
    }
    res.status(200).json({sucess: true, todo_list: todo_list});
}


const getOne = async (req, res) => {
    const { todoID } = req.params;
    if (!Number(todoID))
    {
        return res.status(400).json({sucess: false, msg: "the id that the user send is not a number or is zero"});
    } else if (!Number.isInteger(Number(todoID)))
    {
        return res.status(400).json({sucess: false, msg: "The id that the user send is not a integer"});
    }
    const todo = await Todo.getOne(Number(todoID));

    if (!todo) {
        return res.status(404).json({sucess: false, msg: "todo element not found"})
    }
    res.status(200).json({sucess: true, todo: todo});
}


const create = async (req, res) => {
    const { title, description } = req.body;
    if (!title && !description){
        return res.status(400).json({sucess: false, msg: "title and description is required"});
    } else if (!title) {
        return res.status(400).json({sucess: false, msg: "title is required"});
    } else if (!description) {
        return res.status(400).json({sucess: false, msg: "description is required"});
    }

    if (title < 5 || title > 50)
    {
        if (title < 5)
        {
            return res.status(400).json({sucess: false, msg: "the amount of character in title is low for the required"});
        }
        return res.status(400).json({sucess: false, msg: "the amount of character in title is high for the required"});
    }
    if (description < 5 || description > 100 )
    {
        if (description < 5)
        {
            return res.status(400).json({sucess: false, msg: "the amount of character in description is low for the required"});
        }
        return res.status(400).json({sucess: false, msg: "the amount of character in descriptiom is high for the required"});
    }

    const todo = await Todo.create(title, description);
    res.status(201).json({sucess: true, todo: todo});
}


const update = async (req, res) => {
    const { todoID } = req.params;
    const { title, description } = req.body;

    if (!Number(todoID))
    {
        return res.status(400).json({sucess: false, msg: "the id that the user send is not a number or is zero"});
    } else if (!Number.isInteger(Number(todoID)))
    {
        return res.status(400).json({sucess: false, msg: "The id that the user send is not a integer"});
    }

    if (!title && !description) {
        return res.status(404).send("TITLE or DESCRIPTION not provided");
    }

    if (title.length && (title < 5 || title > 50))
    {
        if (title < 5)
        {
            return res.status(400).json({sucess: false, msg: "the amount of character in title is low for the required"});
        }
        return res.status(400).json({sucess: false, msg: "the amount of character in title is high for the required"});
    }

    if (description.length && (description < 5 || description > 100))
    {
        if (description < 5)
        {
            return res.status(400).json({sucess: false, msg: "the amount of character in description is low for the required"});
        }
        return res.status(400).json({sucess: false, msg: "the amount of character in descriptiom is high for the required"});
    }

    const todo = await Todo.getOne(Number(todoID));
    if (!todo) {
        return res.status(404).json({sucess: false, msg: "Todo element not found"});
    }

    const todo2 = await Todo.update(Number(todoID), title, description);
    res.status(202).json({sucess: true, todo: todo2});
}

const deleteTD = async (req, res) => {
    const { todoID } = req.params;

    if (!Number(todoID))
    {
        return res.status(400).json({sucess: false, msg: "the id that the user send is not a number or is zero"});
    } else if (!Number.isInteger(Number(todoID)))
    {
        return res.status(400).json({sucess: false, msg: "The id that the user send is not a integer"});
    }

    const todo = await Todo.getOne(Number(todoID));

    if (!todo) {
        return res.status(404).json({sucess: false, msg:"Todo element not found"});
    }
    await Todo.delete(todoID);
    res.status(202).json({sucess: true, msg: "Todo element sucessfull deleted"});
}

module.exports = { getAll, getOne, create, update, deleteTD};