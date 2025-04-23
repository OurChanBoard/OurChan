'use strict';

module.exports = async(db, redis) => {

	console.log('Updating globalsettings to add EXIF cleaning options');
	await db.collection('globalsettings').updateOne({ _id: 'globalsettings' }, {
		'$set': {
			'cleanExif': true,
			'rejectFailedExifClean': false,
		},
	});

	console.log('Clearing globalsettings cache');
	await redis.deletePattern('globalsettings');

}; 