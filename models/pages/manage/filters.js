'use strict';

const { Filters, Names } = require(__dirname+'/../../../db/');

module.exports = async (req, res, next) => {

	let filters;
	let activeNames = [];
	try {
		filters = await Filters.findForBoard(req.params.board);
		
		// Get name filtering info for the board
		if (res.locals.board.settings.nameFiltering && res.locals.board.settings.nameFiltering.enabled) {
			// Get the most recent names up to 20
			const timeAgo = new Date(Date.now() - (res.locals.board.settings.nameFiltering.durationHours * 60 * 60 * 1000));
			activeNames = await Names.db.aggregate([
				{ $match: { 'board': req.params.board, 'date': { $gte: timeAgo } } },
				{ $group: { _id: '$name', count: { $sum: 1 }, lastUsed: { $max: '$date' } } },
				{ $sort: { count: -1, lastUsed: -1 } },
				{ $limit: 20 }
			]).toArray();
		}
	} catch (err) {
		return next(err);
	}

	res
		.set('Cache-Control', 'private, max-age=5')
		.render('managefilters', {
			csrf: req.csrfToken(),
			permissions: res.locals.permissions,
			filters,
			activeNames,
		});

};
