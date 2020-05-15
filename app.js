const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./public'));

let todoList = [
  {
    id: 1,
    todo: 'Implement a REST API',
  },
  {
    id: 2,
    todo: 'Build a frontend',
  },
  {
    id: 3,
    todo: '???',
  },
  {
    id: 4,
    todo: 'Profit!',
  },
];

// GET /api/todos
app.get('/api/todos', (req, res) => {
  res.json(todoList);
});
// GET /api/todos/:id
app.get('/api/todos/:id', (req, res) => {
  const todo =
    todoList.find((todo) => {
      return todo.id === Number.parseInt(req.params.id);
  }) || {};
  const status = Object.keys(todo).length ? 200 : 404;
  res.status(status).json(todo);
});

// POST /api/todos
app.post('/api/todos', (req, res, next) => {
  if (!req.body.todo) {
    res.status(400).json({
      error: 'Please provide todo text'
    });
  } else {
    const maxId = todoList.reduce((max, currentTodo) => {
      if (currentTodo.id > max) {
        max = currentTodo.id;
      }
      return max;
    }, 0);
  
    const newTodo = {
      id: maxId + 1,
      todo: req.body.todo,
    }
    todoList.push(newTodo);
    res.json(newTodo);
  }
});

// PUT /api/todos/:id
app.put('/api/todos/:id', (req, res, next) => {
  if (!req.body.todo) {
    res.status(400).json({
      error: 'PLease provide todo text',
    });
    return;
  }
  let updateTodo = {};
  todoList.forEach((todo) => {
    if (todo.id === Number.parseInt(req.params.id)) {
      todo.todo = req.body.todo;
      updateTodo = todo;
    }
  });
  const status = Object.keys(updateTodo).length ? 200 : 404;
  res.status(status).json(updateTodo);
});
  

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  let found = false;
  todoList = todoList.filter((todo) => {
    if (todo.id === Number.parseInt(req.params.id)) {
      found = true;
      return false;
    }
    return true;
  });
  const status = found ? 200 : 404;
  res.status(status).json(todoList);
});

app.listen(3000, function () {
  console.log('Todo List API is now listening on port 3000...');
});
