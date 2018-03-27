const express = require('express');
const router = express.Router();
const Question = require('./models').Question;

// Handle params
router.param('qID', (req, res, next, id) => {
	Question.findById(id, (err, doc) => {
		if (err) return next(err);
		if (!doc) {
			err = new Error('Not Found');
			err.status = 404;
			return next(err);
		}
		req.question = doc;
		console.log(doc);
		return next();
	});
});

router.param('aID', (req, res, next, id) => {
	req.answer = req.question.answers.id(id);
	if (!req.answer) {
		err = new Error('Not Found');
		err.status = 404;
		return next(err);
	}
	next();
});

// GET /questions
// Route for questions collection
router.get('/', (req, res) => {
	// Arguments: 1. what data we want, 2. Projection, or partial like return 10 items, 3. Sorting options, 4. callback
	Question.find({}, null, { sort: { createdAt: -1 } }, (err, questions) => {
		if (err) return next(err);
		res.json(questions);
	});

	// Alternative method:
	/*
		Question.find({})
			.sort({ createdAt: -1 })  // Arrange respoonse desc
			.exec((err, questions) => {
				if (err) return next(err);
				res.json(questions);
			});
	*/
});

// POST /questions
// Route for creating questions
router.post('/', (req, res, next) => {
	const question = new Question(req.body);
	question.text = question.text.trim();
	question.save((err, question) => {
		if (err) return next(err);
		res.status(201);
		res.json(question);
	});
});

// GET /questions/:qID
// Route for specific questions
router.get('/:qID', (req, res, next) => {
	res.json(req.question);
});

// POST /questions/:qID/answers
// Route for creating an answer
router.post('/:qID/answers', (req, res, next) => {
	req.question.answers.push(req.body);
	req.question.save((err, question) => {
		if (err) return next(err);
		res.status(201);
		res.json(question);
	});
});

// PUT /questions/:qID
// Edit a specific question
router.put('/:qID', (req, res, next) => {
	req.question.update(req.body, (err, result) => {
		if (err) return next(err);
		res.json(result);
	});
});

// PUT /questions/:qID/answers/:aID
// Edit a specific answer
router.put('/:qID/answers/:aID', (req, res) => {
	req.answer.update(req.body, (err, result) => {
		if (err) return next(err);
		res.json(result);
	});
});

// DELETE /questions/:qID
// Delete a specific question
router.delete('/:qID', (req, res, next) => {
	req.question.remove(err => {
		if (err) return next(err);
		req.question.save((err, question) => {
			res.status = 203;
			res.json({
				message: `Question with id: ${
					req.question._id
				} was successfully deleted!`
			});
		});
	});
});

// DELETE /questions/:qID/answers/:aID
// Delete a specific answer
router.delete('/:qID/answers/:aID', (req, res, next) => {
	req.answer.remove(err => {
		req.question.save((err, question) => {
			if (err) return next(err);
			res.json(question);
		});
	});
});

// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
// Vote on a specific answer
router.post(
	'/:qID/answers/:aID/vote-:dir',
	(req, res, next) => {
		if (req.params.dir.search(/^(up|down)$/) === -1) {
			const err = new Error('Not Found');
			err.status = 404;
			next(err);
		} else {
			req.vote = req.params.dir;
			next();
		}
	},
	(req, res, next) => {
		req.answer.vote(req.vote, (err, question) => {
			if (err) return next(err);
			res.json(question);
		});
	}
);

module.exports = router;
