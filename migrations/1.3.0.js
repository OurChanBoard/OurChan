'use strict';

module.exports = async(db, redis) => {

	console.log('Updating globalsettings to add web3 settings');
	await db.collection('globalsettings').updateOne({ _id: 'globalsettings' }, {
		'$set': {
			'enableWeb3': false,
			'ethereumLinksURL': 'https://etherscan.io/address/%s',
		},
	});

	console.log('Updating boards to add web3 settings');
	await db.collection('boards').updateMany({}, {
		'$set': {
			'enableWeb3': false,
		},
	});
	
	console.log('Clearing globalsettings cache');
	await redis.deletePattern('globalsettings');
	console.log('Clearing boards cache');
	await redis.deletePattern('board:*');

	console.log('Creating names collection for name filtering');
	await db.createCollection('names');
	console.log('Creating names collection indexes');
	await db.collection('names').createIndex({ 'board': 1, 'name': 1, 'date': 1 });
	await db.collection('names').createIndex({ 'date': 1 });
	await db.collection('names').createIndex({ 'board': 1 });

	console.log('Updating board settings to add name filtering');
	const boards = await db.collection('boards').find({}).toArray();
	for (const board of boards) {
		await db.collection('boards').updateOne({ _id: board._id }, {
			'$set': {
				'settings.nameFiltering': {
					'enabled': false,
					'maxNameUses': 0,
					'durationHours': 24
				}
			}
		});
	}

	console.log('Clearing board cache');
	await redis.deletePattern('board:*');

};
