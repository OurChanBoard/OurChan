'use strict';

const config = require(__dirname+'/../lib/misc/config.js')
	, { themes, codeThemes } = require(__dirname+'/../lib/misc/themes.js');

module.exports = async (req, res) => {
	// Get theme parameters from query
	const { theme, codetheme, redirectTo } = req.query;
	
	// Validate themes against available themes
	const validTheme = theme && themes.includes(theme) ? theme : null;
	const validCodeTheme = codetheme && codeThemes.includes(codetheme) ? codetheme : null;
	
	// Set cookies for theme preferences
	if (validTheme) {
		res.cookie('theme', validTheme, { 
			maxAge: 31536000000, // 1 year
			httpOnly: false,
			path: '/'
		});
	}
	
	if (validCodeTheme) {
		res.cookie('codetheme', validCodeTheme, { 
			maxAge: 31536000000, // 1 year
			httpOnly: false,
			path: '/'
		});
	}
	
	// Redirect back to the original page or home
	const redirectUrl = redirectTo || '/';
	res.redirect(redirectUrl);
}; 