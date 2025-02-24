const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


const loadTasks = () => {
  const data = fs.readFileSync('tasks.json', 'utf-8');
  return JSON.parse(data);
};


app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.render('index', { tasks });
});


app.get('/task', (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id == req.query.id);
  if (task) {
    res.render('add-task', { task });
  } else {
    res.status(404).send('Task not found');
  }
});

app.get('/add-task', (req, res) => {
  res.render('add-task', { task: null });
});


app.post('/add-task', (req, res) => {
  const tasks = loadTasks();
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description
  };
  tasks.push(newTask);
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
  res.redirect('/tasks');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
