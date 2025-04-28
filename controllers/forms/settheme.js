'use strict';

const Config = require(__dirname+'/../../lib/misc/config.js');

module.exports = {
	paramConverter: function(req, res, next) {
		// Validate theme parameters
		const { theme, codeTheme } = req.query;
		if (!theme && !codeTheme) {
			return res.status(400).send('Missing theme parameters');
		}
		next();
	},
	controller: async function(req, res) {
		const { theme, codeTheme } = req.query;
		const availableThemes = await Config.getThemes();
		const availableCodeThemes = await Config.getCodeThemes();

		// Set theme cookie if valid
		if (theme && availableThemes.includes(theme)) {
			res.cookie('theme', theme, {
				maxAge: 31536000000, // 1 year
				httpOnly: true,
				secure: req.secure
			});
		}

		// Set code theme cookie if valid
		if (codeTheme && availableCodeThemes.includes(codeTheme)) {
			res.cookie('codeTheme', codeTheme, {
				maxAge: 31536000000, // 1 year
				httpOnly: true,
				secure: req.secure
			});
		}

		// Redirect back to the original page or home
		const redirectUrl = req.headers.referer || '/';
		res.redirect(redirectUrl);
	}
}; 