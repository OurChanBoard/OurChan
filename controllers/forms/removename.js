'use strict';

const removeName = require(__dirname+'/../../models/forms/removename.js')
	, { processBody } = require(__dirname+'/../../lib/input/htmlparse.js');

module.exports = {

	paramConverter: (req, res, next) => {
		if (req.body.name) {
			req.body.name = processBody(req.body.name, true);
		}
		next();
	},

	controller: async (req, res, next) => {
		try {
			await removeName(req, res, next);
		} catch (err) {
			return next(err);
		}
	}

}; 