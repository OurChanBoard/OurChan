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

		console.log('Setting theme:', theme);
		console.log('Setting codetheme:', codetheme);
		console.log('Current cookies:', req.cookies);

		// Prepare cookie headers
		const cookieHeaders = [];

		// Set theme cookie if valid
		if (theme && (theme === 'default' || availableThemes.includes(theme))) {
			cookieHeaders.push(`theme=${theme}; Path=/; Max-Age=31536000; HttpOnly=false; SameSite=Lax${req.secure ? '; Secure' : ''}`);
		}

		// Set code theme cookie if valid
		if (codetheme && (codetheme === 'default' || availableCodeThemes.includes(codetheme))) {
			cookieHeaders.push(`codetheme=${codetheme}; Path=/; Max-Age=31536000; HttpOnly=false; SameSite=Lax${req.secure ? '; Secure' : ''}`);
		}

		// Set all cookies at once
		if (cookieHeaders.length > 0) {
			res.setHeader('Set-Cookie', cookieHeaders);
		}

		// Redirect back to the original page or home
		const redirectUrl = redirectTo || req.headers.referer || '/';
		console.log('Redirecting to:', redirectUrl);
		res.redirect(redirectUrl);
	}
}; 