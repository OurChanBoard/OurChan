'use strict';

const Mongo = require(__dirname+'/db.js')
	, db = Mongo.db.collection('names');

// Initialize indexes
(async () => {
	try {
		await db.createIndex({ 'board': 1, 'name': 1, 'date': 1 });
		await db.createIndex({ 'date': 1 });
		await db.createIndex({ 'board': 1 });
	} catch (e) {
		console.error('Error creating indexes for names collection', e);
	}
})();

module.exports = {

	db,

	findNames: async (board, name, hoursAgo) => {
		// Find all name usages within the specified time period
		const timeAgo = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
		return db.find({
			'board': board,
			'name': name,
			'date': {
				'$gte': timeAgo
			}
		}).toArray();
	},

	// Record the usage of a name
	recordNameUsage: async (board, name, postId, userId, ip) => {
		const nameUsage = {
			'board': board,
			'name': name,
			'postId': postId,
			'userId': userId,
			'ip': ip,
			'date': new Date()
		};
		return db.insertOne(nameUsage);
	},

	// Delete name data older than specified hours
	deleteOldNameData: async (hoursAgo) => {
		const timeAgo = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
		return db.deleteMany({
			'date': {
				'$lt': timeAgo
			}
		});
	},

	// Delete name data for a specific board
	deleteBoardNames: async (board) => {
		return db.deleteMany({
			'board': board
		});
	},

	// Count name usages for a specific name and board within the time period
	countNameUsage: async (board, name, hoursAgo) => {
		const timeAgo = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
		return db.countDocuments({
			'board': board,
			'name': name,
			'date': {
				'$gte': timeAgo
			}
		});
	},

	// Create indexes for performance
	createIndexes: async () => {
		return Promise.all([
			db.createIndex({ 'board': 1, 'name': 1, 'date': 1 }),
			db.createIndex({ 'date': 1 }),
			db.createIndex({ 'board': 1 }),
		]);
	},

	deleteAll: () => {
		return db.deleteMany({});
	},
}; 