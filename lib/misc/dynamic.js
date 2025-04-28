'use strict';

const { themes, codeThemes } = require(__dirname+'/../misc/themes.js');
const config = require(__dirname+'/../misc/config.js');

module.exports = (req, res, code, page, data) => {

	res.status(code);

	if (req.body.minimal) {
		data.minimal = true;
	}

	// Ensure themes and codeThemes are always available
	data.themes = themes;
	data.codeThemes = codeThemes;
	
	// Set current theme and code theme from cookies or defaults
	const { boardDefaults } = config.get;
	data.currentTheme = req.cookies.theme || boardDefaults.theme;
	data.currentCodeTheme = req.cookies.codeTheme || boardDefaults.codeTheme;

	if (req.headers && req.headers['x-using-xhr'] != null) {
		//if sending header with js, and not a bypass_minimal page, show modal
		return res.json(data);
	} else {
		return res.render(page, data);
	}

};
