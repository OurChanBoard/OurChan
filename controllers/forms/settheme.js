'use strict';

const themes = require(__dirname+'/../../lib/misc/themes.js');

module.exports = {
	paramConverter: function(req, res, next) {
		// No validation needed, we'll handle defaults in the controller
		next();
	},
	controller: async function(req, res) {
		const { theme, codetheme, redirectTo } = req.query;
		const availableThemes = themes.themes;
		const availableCodeThemes = themes.codeThemes;

		// Set theme cookie if valid
		if (theme && (theme === 'default' || availableThemes.includes(theme))) {
			res.cookie('theme', theme, {
				maxAge: 31536000000, // 1 year
				httpOnly: false,
				secure: req.secure,
				sameSite: 'lax',
				path: '/'
			});
		}

		// Set code theme cookie if valid
		if (codetheme && (codetheme === 'default' || availableCodeThemes.includes(codetheme))) {
			res.cookie('codetheme', codetheme, {
				maxAge: 31536000000, // 1 year
				httpOnly: false,
				secure: req.secure,
				sameSite: 'lax',
				path: '/'
			});
		}

		// Set a flag in the response to indicate theme change
		res.locals.themeChanged = true;

		// Redirect back to the original page or home with a cache-busting parameter
		const redirectUrl = redirectTo || req.headers.referer || '/';
		const separator = redirectUrl.includes('?') ? '&' : '?';
		res.redirect(`${redirectUrl}${separator}t=${Date.now()}`);
	}
}; 