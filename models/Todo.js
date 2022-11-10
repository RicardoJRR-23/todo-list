const connectDB = require('../config/db');

class Todo {
    static async getAll() {
        try {
            const todo_list = await connectDB.query("SELECT * FROM todos");
            return todo_list.rows;
        } catch (error) {
            console.log(error.message);
        }
    }

    static async getOne(id) {
        try {
            const todo = await connectDB.query("SELECT * FROM todos WHERE id = $1", [id]);
            return todo.rows[0];
        } catch (err) {
            console.log(err.message);
        }
    }

    static async create(title, description) {
        try {
            const todo = await connectDB.query("INSERT INTO todos (title, description) VALUES($1, $2) RETURNING *", [title, description]);
            return todo.rows[0];
        } catch (err) {
            console.log(err.message);
        }
    }

    static async update(id, title, description) {
        try {
            let todo;
            if (title && description){
                todo = await connectDB.query("UPDATE todos SET title = $1, description = $2 WHERE id = $3 RETURNING *", [title, description, id]);
            } else {
                if (title) {
                    todo = await connectDB.query("UPDATE todos SET title = $1 WHERE id = $2 RETURNING *", [title, id]);
                }
                if (description) {
                    todo = await connectDB.query("UPDATE todos SET description = $1 WHERE id = $2 RETURNING *", [description, id]);
                }
            }
            return todo.rows[0];
        } catch (err) {
            console.log(err.message);
        }
    }

    static async delete(id) {
        try {
            await connectDB.query("DELETE FROM todos WHERE id = $1", [id]);
        } catch (err) {
            console.log(err.message);
        }
    }
}

module.exports = Todo;