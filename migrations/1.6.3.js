'use strict';

module.exports = async(db, redis) => {

	console.log('Updating global settings for improved theme management');
	await db.collection('globalsettings').updateOne({ _id: 'globalsettings' }, {
		'$set': {
			'themeSettings': {
				'allowUserSelection': true,
				'allowBoardCustomization': true,
				'cacheThemes': true
			}
		},
	});

	console.log('Clearing globalsettings cache');
	await redis.deletePattern('globalsettings');
	console.log('Clearing boards cache');
	await redis.deletePattern('board:*');

}; 