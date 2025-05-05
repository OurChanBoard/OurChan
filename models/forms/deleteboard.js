'use strict';

const { remove } = require('fs-extra')
	, uploadDirectory = require(__dirname+'/../../lib/file/uploaddirectory.js')
	, { Boards, Posts, Stats, Bans, Modlogs, Filters, CustomPages, Names } = require(__dirname+'/../../db/')
	, deletePosts = require(__dirname+'/deletepost.js')
	, i18n = require(__dirname+'/../../lib/locale/locale.js');

module.exports = async (uri, board) => {

	//i18n mumbo jumbo
	const deleteLocals = {};
	i18n.init(deleteLocals);
	const boardLanguage = board.settings.language;
	deleteLocals.setLocale(deleteLocals, boardLanguage);
	
	//delete board
	await Boards.deleteOne(uri);
	//get all posts (should probably project to get files for deletin and anything else necessary)
	const allPosts = await Posts.allBoardPosts(uri);
	if (allPosts.length > 0) {
		//delete posts and decrement images
		await deletePosts(allPosts, uri, deleteLocals, true);
	}
	await Promise.all([
		Accounts.removeOwnedBoard(board.owner, uri), //remove board from owner account
		Object.keys(board.staff).length > 0 ? Accounts.removeStaffBoard(Object.keys(board.staff), uri) : void 0, //remove staffboard from staff accounts
		Modlogs.deleteBoard(uri), //modlogs for the board
		Bans.deleteBoard(uri), //bans for the board
		Filters.deleteBoard(uri), //filters for the board
		Stats.deleteBoard(uri), //stats for the board
		CustomPages.deleteBoard(uri), //custom pages for the board
		Names.deleteBoardNames(uri),
		remove(`${uploadDirectory}/html/${uri}/`),
		remove(`${uploadDirectory}/json/${uri}/`),
		remove(`${uploadDirectory}/banner/${uri}/`),
		remove(`${uploadDirectory}/flag/${uri}/`),
		remove(`${uploadDirectory}/asset/${uri}/`),
		Boards.deleteIncrement(board),
	]);

};
