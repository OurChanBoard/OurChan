'use strict';

const { Boards, Files, News, Posts } = require(__dirname+'/../../db/');
const { themes, codeThemes } = require(__dirname+'/../../lib/misc/themes.js');
const config = require(__dirname+'/../../lib/misc/config.js');

module.exports = async (req, res, next) => {
	try {
		// Get config and default values
		const configValues = config.get || {};
		const { boardDefaults } = configValues;
		const defaultTheme = (boardDefaults && boardDefaults.theme) || 'default';
		const defaultCodeTheme = (boardDefaults && boardDefaults.codeTheme) || 'default';
		
		// Get theme cookies
		const themeCookie = req.cookies.theme;
		const codeThemeCookie = req.cookies.codetheme;
		
		// Set theme in locals, with proper fallbacks
		if (themeCookie && (themeCookie === 'default' || themes.includes(themeCookie))) {
			res.locals.currentTheme = themeCookie;
		} else {
			res.locals.currentTheme = defaultTheme;
		}
		
		if (codeThemeCookie && (codeThemeCookie === 'default' || codeThemes.includes(codeThemeCookie))) {
			res.locals.currentCodeTheme = codeThemeCookie;
		} else {
			res.locals.currentCodeTheme = defaultCodeTheme;
		}
		
		/*
		// Debug logging
		if (process.env.NODE_ENV !== 'production') {
			console.log('Home page theme:', res.locals.currentTheme);
		}
		*/
		
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
			currentTheme: res.locals.currentTheme,
			currentCodeTheme: res.locals.currentCodeTheme,
			defaultTheme: defaultTheme,
			defaultCodeTheme: defaultCodeTheme,
			themes,
			codeThemes
		});
	} catch (err) {
		return next(err);
	}
};
