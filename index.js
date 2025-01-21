
const fs = require("fs");

const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const cors = require("cors");

const pg = require('pg');


const Pool = require("pg").Pool;


const DB_MODE='GLOBAL'
// const DB_MODE='LOCAL'
var pool;
if( DB_MODE==='GLOBAL' )
{
    const config_global = {
        user: "avnadmin",
        password: "AVNS_y2RajkrJvNiw73ANfPR",
        host: "pg-todos-1c74105d-foto888999.k.aivencloud.com",
        port: "24435",
        //database: "defaultdb",
        database: "perntodo",
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync("./ca.pem").toString(),
        },
    };
    const client = new pg.Client(config_global);

    client.connect(function (err0) {
        if (err0) {
            console.log('=== err0 ')
            throw err0;
        }
        pool = client;
        client.query("SELECT VERSION()", [], function (err1, result) {
            if (err1) {
                console.log('=== err1 ')
                throw err1;
            }
            console.log("=== version:",result.rows[0].version);

        //     CREATE TABLE todo(
        //         todo_id SERIAL PRIMARY KEY,
        //         description VARCHAR(255)
        // );
        //
        //
        //     SELECT * FROM todo


            // client.end(function (err2) {
            //     if (err2) {
            //         console.log('=== err2 ')
            //         throw err2;
            //     }
            // });
        });
    });
}
else{
    const user = process.env.USER || 'postgres';
    const password = process.env.USER || 'Taras777999';
    pool = new Pool({
        user: user,
        password: password,
        host: 'localhost',
        port: 5432,
        database: 'perntodo',
    })
}

app.use(cors());
app.use(express.json());


//create a todo

app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );
        console.log("=== insert ",newTodo);
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//get all todos

app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a todo

app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
            id
        ]);

        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a todo

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
        );

        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//delete a todo

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
            id
        ]);
        res.json("Todo was deleted!");
    } catch (err) {
        console.log(err.message);
    }
});


app.listen(port, ()=>{
    console.log(  "=== server started OK" , port)
})
