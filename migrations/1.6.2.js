'use strict';

module.exports = async(db, redis) => {

	console.log('Updating globalsettings to add reject failed EXIF clean option');
	await db.collection('globalsettings').updateOne({ _id: 'globalsettings' }, {
		'$set': {
			'rejectFailedExifClean': false,
		},
	});

	console.log('Clearing globalsettings cache');
	await redis.deletePattern('globalsettings');

}; 