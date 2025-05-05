'use strict';

const { Boards } = require(__dirname+'/../../db/')
	, { redis } = require(__dirname+'/../../lib/redis/redis.js')
	, dynamicResponse = require(__dirname+'/../../lib/misc/dynamic.js');

module.exports = async (req, res) => {

	const { __ } = res.locals;

	// Validate inputs
	const enabled = req.body.name_filtering_enabled === 'true';
	const maxNameUses = Math.min(100, Math.max(0, parseInt(req.body.max_name_uses) || 0));
	const durationHours = Math.min(720, Math.max(1, parseInt(req.body.duration_hours) || 24));

	// Update board settings
	await Boards.updateOne({ _id: req.params.board }, {
		'$set': {
			'settings.nameFiltering.enabled': enabled,
			'settings.nameFiltering.maxNameUses': maxNameUses,
			'settings.nameFiltering.durationHours': durationHours
		}
	});

	// Clear board cache
	await redis.deletePattern(`board:${req.params.board}`);

	return dynamicResponse(req, res, 200, 'message', {
		'title': __('Success'),
		'message': __('Updated name filtering settings'),
		'redirect': `/${req.params.board}/manage/filters.html`
	});

}; 