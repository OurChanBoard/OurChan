'use strict';

const { Names, Boards } = require(__dirname+'/../../db/')
	, { debugLogs } = require(__dirname+'/../../configs/secrets.js')
	, timeUtils = require(__dirname+'/../../lib/converter/timeutils.js');

module.exports = {

	func: async () => {
		// Get all boards with name filtering enabled
		const boards = await Boards.db.find({
			'settings.nameFiltering.enabled': true
		}, {
			'projection': {
				'_id': 1,
				'settings.nameFiltering.durationHours': 1
			}
		}).toArray();

		// Clean up old data for each board with its specific duration
		for (const board of boards) {
			const durationHours = board.settings.nameFiltering.durationHours || 24;
			const deleted = await Names.deleteOldNameData(durationHours);
			if (deleted && deleted.deletedCount > 0 && debugLogs) {
				console.log(`Deleted ${deleted.deletedCount} old name records from ${board._id}`);
			}
		}
	},

	interval: timeUtils.HOUR,
	immediate: true,
	condition: null

}; 