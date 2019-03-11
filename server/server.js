const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');

const mongoose = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');
const authenticate = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 3000;

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    else {    //or return inside if
        Todo.findById(id).then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send(todo);
        }).catch((e) => res.status(404).send());
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndDelete(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send(todo);
    }).catch((e) => res.status(404).send());

});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send(todo);
    }).catch((e) => res.status(404).send());

});

app.post('/users', (req, res) => {
    var { email, password } = _.pick(req.body, ['email', 'password']);
    var user = new User({
        email,
        password
    });

    user.save().then(() => {
        return user.generateAuthToken();

    }).then((token) => {
        res.header('x-auth', token).send(user);

    }).catch((e) => res.status(401).send(e))

});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        console.log(e);
        
        res.status(401).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() =>{
        res.status(200).send();
    }, ()=>{
        res.status(401).send();
    });
});

app.listen(port, () => {
    console.log('Server listening on port 3000');
});