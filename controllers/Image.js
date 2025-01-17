const Clarifai = require('clarifai');

// Clarifai personal API key
const app = new Clarifai.App({
  apiKey: '65fe44751fd24f1c9fcb27bf5080b0ce'
});

// Clarifa's detection model, responds with data
const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with API'));
}

// Increase user entries by 1 when submitting image
const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}