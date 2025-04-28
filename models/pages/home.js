'use strict';

const { Boards, Files, News, Posts } = require(__dirname+'/../../db/');
const { buildHomepage } = require(__dirname+'/../../lib/build/tasks.js');

module.exports = async (req, res, next) => {
	try {
		// Get theme from cookie or default
		const themeCookie = req.cookies.theme;
		const codeThemeCookie = req.cookies.codetheme;
		
		// Set theme in locals
		res.locals.currentTheme = themeCookie || res.locals.defaultTheme;
		res.locals.currentCodeTheme = codeThemeCookie || res.locals.defaultCodeTheme;
		
		// Get homepage data
		const { maxRecentNews } = res.locals.config || {};
		let [ totalStats, boards, fileStats, recentNews, hotThreads ] = await Promise.all([
			Boards.totalStats(), //overall total posts ever made
			Boards.boardSort(0, 20), //top 20 boards sorted by users, pph, total posts
			Files.activeContent(), //size and number of files
			News.find(maxRecentNews), //some recent newsposts
			Posts.hotThreads(), //top 5 threads last 7 days
		]);
		const [ localStats, webringStats ] = totalStats;
		
		// Render homepage with theme data
		res.render('home', {
			localStats,
			webringStats,
			boards,
			fileStats,
			recentNews,
			hotThreads,
		});
	} catch (err) {
		return next(err);
	}
};
