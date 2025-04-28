'use strict';

const themesModule = require(__dirname+'/../misc/themes.js');
const config = require(__dirname+'/../misc/config.js');

module.exports = (req, res, code, page, data) => {

	res.status(code);

	if (req.body.minimal) {
		data.minimal = true;
	}

	// Ensure themes and codeThemes are always available
	data.themes = themesModule.themes || [];
	data.codeThemes = themesModule.codeThemes || [];
	
	// Set current theme and code theme from cookies or defaults
	const { boardDefaults } = config.get || { boardDefaults: { theme: 'default', codeTheme: 'default' } };
	
	// Get theme from cookie or default
	if (req.cookies.theme && (req.cookies.theme === 'default' || data.themes.includes(req.cookies.theme))) {
		data.currentTheme = req.cookies.theme;
	} else {
		data.currentTheme = boardDefaults.theme || 'default';
	}
	
	// Get code theme from cookie or default
	if (req.cookies.codetheme && (req.cookies.codetheme === 'default' || data.codeThemes.includes(req.cookies.codetheme))) {
		data.currentCodeTheme = req.cookies.codetheme;
	} else {
		data.currentCodeTheme = boardDefaults.codeTheme || 'default';
	}

	// Log theme information for debugging
	if (process.env.NODE_ENV !== 'production') {
		console.log('Dynamic.js - Theme cookies:', req.cookies.theme, req.cookies.codetheme);
		console.log('Dynamic.js - Current themes:', data.currentTheme, data.currentCodeTheme);
	}

	if (req.headers && req.headers['x-using-xhr'] != null) {
		//if sending header with js, and not a bypass_minimal page, show modal
		return res.json(data);
	} else {
		return res.render(page, data);
	}

};
