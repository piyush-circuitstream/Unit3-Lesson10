const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const responseTime = require('response-time');

//SETUP
const app = express();
app.listen('4000', () => {
    console.log('My server is listening to port 4000.');
});

//Middleware
const requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.requestTime);
    next({ code: 400, type: 'time', message: 'Error with requestTime middleware' });
}

const logger = (req, res, next) => {
    console.log('Got a new request');
    next();
}

const requestType = (req, res, next) => {
    console.log('Request Type: ', req.method);
    next();
}

// app.use(requestTime); //EXECUTED ON ALL REQUESTS
// app.get('*', requestTime); //EXECUTED ON GET METHOD OF ALL ENDPOINTS 
// app.use('/books', requestTime); //EXECUTED ON ALL METHODS OF /books ENDPOINT

// app.use([logger, requestType]);
// app.use('/books', requestTime);

// app.use(express.static('public')); //BUILT-IN MIDDLEWARE - used to serve static content from server
// app.use(express.json()); //BUILT-IN MIDDLEWARE - used to parse the request body into json while serving request

app.use([morgan('combined'), cors(), responseTime()]);

//ROUTES / ENDPOINTS
app.get('/',
    requestTime,
    logger,
    (req, res) => {
        // res.sendFile(__dirname + './public/index.html');
        res.status(200).json({ message: 'GET /' });
    });

app.get('/users', (req, res) => {
    res.status(200).json({ message: 'GET /users' })
});

app.get('/books', (req, res) => {
    res.status(200).json({ message: 'GET /books' })
});

app.post('/users', (req, res) => {
    res.status(200).json({ message: 'POST /users' })
});

app.post('/books', (req, res) => {
    res.status(200).json({ message: 'POST /books' })
});

//ERROR HANDLING
app.use((err, req, res, next) => {
    const { code, type, message } = err;
    if (type === 'time') {
        res.status(code).json({ message: message });
    } else {
        res.status(500).json({ message: message });
    }
}); 