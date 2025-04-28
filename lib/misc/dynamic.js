'use strict';

const themesModule = require(__dirname+'/../misc/themes.js');
const config = require(__dirname+'/../misc/config.js');

module.exports = (req, res, code, page, data) => {

	res.status(code);

	if (req.body.minimal) {
		data.minimal = true;
	}

	// Debug cookies
	console.log('Reading cookies in dynamic.js:', req.cookies);
	console.log('Theme cookie:', req.cookies.theme);
	console.log('Code theme cookie:', req.cookies.codetheme);

	// Ensure themes and codeThemes are always available
	data.themes = themesModule.themes || [];
	data.codeThemes = themesModule.codeThemes || [];
	
	// Set current theme and code theme from cookies or defaults
	const { boardDefaults } = config.get || { boardDefaults: { theme: 'default', codeTheme: 'default' } };
	
	// Use app.locals if available, otherwise use cookies or defaults
	if (req.app && req.app.locals) {
		data.currentTheme = req.app.locals.currentTheme || req.cookies.theme || boardDefaults.theme;
		data.currentCodeTheme = req.app.locals.currentCodeTheme || req.cookies.codetheme || boardDefaults.codeTheme;
	} else {
		data.currentTheme = req.cookies.theme || boardDefaults.theme;
		data.currentCodeTheme = req.cookies.codetheme || boardDefaults.codeTheme;
	}

	console.log('Setting currentTheme to:', data.currentTheme);
	console.log('Setting currentCodeTheme to:', data.currentCodeTheme);

	if (req.headers && req.headers['x-using-xhr'] != null) {
		//if sending header with js, and not a bypass_minimal page, show modal
		return res.json(data);
	} else {
		return res.render(page, data);
	}

};
