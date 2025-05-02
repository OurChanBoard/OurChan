'use strict';

const { Boards, Files, News, Posts } = require(__dirname+'/../../db/');
const { buildHomepage } = require(__dirname+'/../../lib/build/tasks.js');

module.exports = async (req, res, next) => {
	try {
		// Get theme from cookie or default
		const themeCookie = req.cookies.theme;
		const codeThemeCookie = req.cookies.codetheme;
		
		// Ensure theme is set in res.locals (with multiple fallback mechanisms)
		const defaultTheme = res.locals.defaultTheme || 'default';
		const defaultCodeTheme = res.locals.defaultCodeTheme || 'default';
		
		// Set theme in locals with multiple fallbacks
		res.locals.currentTheme = themeCookie || defaultTheme;
		res.locals.currentCodeTheme = codeThemeCookie || defaultCodeTheme;
		
		// Set app.locals themes as well to ensure persistence
		if (req.app && req.app.locals) {
			req.app.locals.currentTheme = res.locals.currentTheme;
			req.app.locals.currentCodeTheme = res.locals.currentCodeTheme;
		}
		
		// Debug log themes for development
		if (process.env.NODE_ENV !== 'production') {
			console.log('Home page theme:', res.locals.currentTheme);
		}
		
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
