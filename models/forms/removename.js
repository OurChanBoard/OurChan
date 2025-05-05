'use strict';

const { Names } = require(__dirname+'/../../db/')
	, dynamicResponse = require(__dirname+'/../../lib/misc/dynamic.js');

module.exports = async (req, res) => {

	const { __ } = res.locals;
	const name = req.body.name;

	if (!name || name.length === 0) {
		return dynamicResponse(req, res, 400, 'message', {
			'title': __('Bad request'),
			'message': __('No name provided'),
			'redirect': `/${req.params.board}/manage/filters.html`
		});
	}

	try {
		// Delete all occurrences of the name for this board
		await Names.db.deleteMany({
			'board': req.params.board,
			'name': name
		});

		return dynamicResponse(req, res, 200, 'message', {
			'title': __('Success'),
			'message': __('Cleared name filter usage data for %s', name),
			'redirect': `/${req.params.board}/manage/filters.html`
		});
	} catch (err) {
		return dynamicResponse(req, res, 500, 'message', {
			'title': __('Error'),
			'message': __('Error removing name from filter: %s', err.message),
			'redirect': `/${req.params.board}/manage/filters.html`
		});
	}

}; 