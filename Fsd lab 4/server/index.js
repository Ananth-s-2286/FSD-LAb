const express = require('express'); 
const cors = require('cors'); 
const app = express(); 
app.use(cors()); 

let tasks = [ 
    { id: 1, title: 'Learn Express', done: false },
     { id: 2, title: 'Build React app', done: false }, 
    ];
    app.get('/api/hello', (req, res) => { 
        res.json({ message: 'Hello from Express API 👋' }); 
    });
    app.get('/api/tasks', (req, res) => { 
        res.json(tasks); 
    });
    app.post('/api/tasks', (req, res) => {
         const { title } = req.body; if (!title || !title.trim()) 
        { return res.status(400).json({ error: 'Title is required' }); } 

         const newTask = { id: Date.now(), title: title.trim(), done: false }; 
         tasks.push(newTask);

res.status(201).json(newTask); });
app.patch('/api/tasks/:id/toggle', (req, res) => {
     const id = Number(req.params.id);
      const task = tasks.find(t => t.id === id); 
      if (!task) return res.status(404).json({ error: 'Task not found' }); 
task.done = !task.done; res.json(task); });
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => { 
    console.log(`✅ API running at http://localhost:${PORT}`); });