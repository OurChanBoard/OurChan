'use strict';

const editNameFilter = require(__dirname+'/../../models/forms/editnamefilter.js')
	, dynamicResponse = require(__dirname+'/../../lib/misc/dynamic.js')
	, { checkSchema, lengthBody } = require(__dirname+'/../../lib/input/schema.js')
	, paramConverter = require(__dirname+'/../../lib/middleware/paramconverter.js')
	, { processBody } = require(__dirname+'/../../lib/input/htmlparse.js');

module.exports = {

	paramConverter: paramConverter({
		trimFields: ['max_name_uses', 'duration_hours'],
	}),

	controller: async (req, res, next) => {

		const { __ } = res.locals;
		const errors = await checkSchema([
			{ result: lengthBody(req.body.max_name_uses, 1, 3), expected: false, error: __('Max name uses must be 1-3 characters') },
			{ result: lengthBody(req.body.duration_hours, 1, 3), expected: false, error: __('Duration hours must be 1-3 characters') },
		]);

		if (errors.length > 0) {
			return dynamicResponse(req, res, 400, 'message', {
				'title': __('Bad request'),
				'errors': errors,
				'redirect': `/${req.params.board}/manage/filters.html`
			});
		}

		try {
			await editNameFilter(req, res, next);
		} catch (err) {
			return next(err);
		}

	}

}; 