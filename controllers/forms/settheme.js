'use strict';

const themes = require(__dirname+'/../../lib/misc/themes.js');
const buildQueue = require(__dirname+'/../../lib/build/queue.js');

module.exports = {
	paramConverter: function(req, res, next) {
		// Validation not needed; handle defaults in the controller
		next();
	},
	controller: async function(req, res) {
		const { theme, codetheme, redirectTo } = req.query;
		const availableThemes = themes.themes;
		const availableCodeThemes = themes.codeThemes;
		let themeChanged = false;

		// Sets theme cookie if valid
		if (theme && (theme === 'default' || availableThemes.includes(theme))) {
			res.cookie('theme', theme, {
				maxAge: 31536000000, // 1 year
				httpOnly: false,
				secure: req.secure,
				sameSite: 'lax',
				path: '/'
			});
			themeChanged = true;
		}

		// Sets code theme cookie (if valid)
		if (codetheme && (codetheme === 'default' || availableCodeThemes.includes(codetheme))) {
			res.cookie('codetheme', codetheme, {
				maxAge: 31536000000, // 1 year
				httpOnly: false,
				secure: req.secure,
				sameSite: 'lax',
				path: '/'
			});
			themeChanged = true;
		}

		// Set a flag in the response
		res.locals.themeChanged = themeChanged;
		
		// If theme was changed, trigger homepage rebuild with this theme
		if (themeChanged) {
			buildQueue.push({
				'task': 'buildHomepage',
			});
		}

		// Redirect back to the original page
		const redirectUrl = redirectTo || req.headers.referer || '/';
		res.redirect(redirectUrl);
	}
}; 