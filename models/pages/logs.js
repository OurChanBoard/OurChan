'use strict';

const { Modlogs } = require(__dirname+'/../../db/')
	, pageQueryConverter = require(__dirname+'/../../lib/input/pagequeryconverter.js')
	, limit = 50;

// Moderations actions that are shown to public
const MODERATION_ACTIONS = [
	'Ban', 'Global ban',
	'Dismiss reports', 'Dismiss global reports',
	'Delete', 'Delete by IP', 'Global delete by IP',
	'Unlink files', 'Delete files', 'Spoiler files',
	'Edit', 'Move',
	'Bumplock', 'Lock', 'Sticky', 'Cycle'
];

module.exports = async (req, res, next) => {

	const { page, offset, queryString } = pageQueryConverter(req.query, limit);

	let filter = {};
	
	// Filter by username
	const username = (typeof req.query.username === 'string' ? req.query.username : null);
	if (username && !Array.isArray(username)) {
		filter.user = username;
	}
	
	// Filter by board
	const uri = (typeof req.query.uri === 'string' ? req.query.uri : null);
	if (uri && !Array.isArray(uri)) {
		filter.board = uri;
	}

	// Filter by actions - only show moderation actions, exclude settings
	filter.actions = { $in: MODERATION_ACTIONS };

	let logs, maxPage;
	try {
		[logs, maxPage] = await Promise.all([
			Modlogs.find(filter, offset, limit),
			Modlogs.count(filter),
		]);
		maxPage = Math.ceil(maxPage/limit);
	} catch (err) {
		return next(err);
	}
	
	res
		.set('Cache-Control', 'private, max-age=5')
		.render('logs', {
			queryString,
			username,
			uri,
			logs,
			page,
			maxPage,
		});

}; 