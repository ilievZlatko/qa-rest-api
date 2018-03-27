const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const jsonParser = require('body-parser').json;

const routes = require('./routes');
const app = express();
const db = mongoose.connection;
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/qa');

app.use(logger('dev'));
app.use(jsonParser());

db.on('error', err => {
	console.error('connection error: ', err);
});

db.once('open', () => {
	console.log('db connection successful');
});

app.use('/questions', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

app.listen(PORT, () => {
	console.log(`Server started on port: ${PORT}`);
});
