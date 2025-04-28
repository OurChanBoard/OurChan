'use strict';

const themes = require(__dirname+'/../../lib/misc/themes.js');

module.exports = {
	paramConverter: function(parameters, req, res, next) {
		// No validation needed, we'll handle defaults in the controller
		next();
	},
	controller: async function(req, res, next) {
		const { theme, codetheme, redirectTo } = req.query;
		const redirectUrl = redirectTo || req.headers.referer || '/';

		const availableThemes = themes.themes;
		const availableCodeThemes = themes.codeThemes;

		// Set theme cookie if valid
		if (theme && (theme === 'default' || availableThemes.includes(theme))) {
			res.cookie('theme', theme, {
				maxAge: 31536000000, // 1 year
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				path: '/'
			});
		}

		// Set code theme cookie if valid
		if (codetheme && (codetheme === 'default' || availableCodeThemes.includes(codetheme))) {
			res.cookie('codetheme', codetheme, {
				maxAge: 31536000000, // 1 year
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				path: '/'
			});
		}

		// Set cache control headers to prevent caching
		res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
		res.set('Expires', '0');
		res.set('Pragma', 'no-cache');

		// Redirect back to the original page
		res.redirect(redirectUrl);
	}
}; 