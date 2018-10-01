const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const dbURL = require('./config/keys').mongoURI;
const bodyParser = require('body-parser');

mongoose.connect(dbURL).then(
    () => console.log(`DB Connection Established on ${dbURL}`)
).catch(err => console.log(`Error in DB Connection: ${dbURL}, Error message: ${err}`));

const app = express();


//Initialize body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) =>
    res.send('Hello World'));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('api/posts', posts);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
