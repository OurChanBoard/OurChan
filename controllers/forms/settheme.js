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

		// Redirect back to the original page or home
		const redirectUrl = redirectTo || req.headers.referer || '/';
		res.redirect(redirectUrl);
	}
}; 