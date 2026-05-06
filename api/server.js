const express = require('express')
const pg = require('pg')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'todo_app',
    user: 'postgres',
    password: 'root',
})

const initDb = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
    await pool.query(queryText)
    console.log("Tabela 'tasks' verificada/criada")
}

initDb();

pool.connect().then(() => {
    console.log('Conectado ao banco de dados PostgreSQL')
}).catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err)
})



app.get('/tarefas', async function (req, res) {
   const { rows: data } = await pool.query('SELECT * FROM tasks')

    res.status(200).json({data}) 
})

app.post('/tarefas', async function (req, res) {

    const { title, description } = req.body
    const { rows: data} = await pool.query("INSERT INTO tasks (title, description) VALUES ($1, $2)", [
        title,
        description || null
    ])
   
    res.status(201).json({data})
    
})
app.patch('/tarefas/:id', async function (req, res) {
     const { id } = req.params
     const {rows: data } = await pool.query ("select * from tasks WHERE id = $1",
        [
            id
        ] )

    if (!data[0])
        return res.status(404).json([])
     
    await pool.query ("UPDATE tasks SET completed=$2 WHERE id=$1",
    [
        id,
        !data[0].completed
    ])

    res.json([])
})

//DELETE ISSO

app.delete('/tarefas/:id', async function (req, res) {
    const { id } = req.params

    await pool.query("DELETE FROM tasks WHERE id = $1", [
        id
    ])
   
    res.status(204).json();
})

app.listen(3000, function () {
    console.log('Server is running on port 3000')
})