'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { addCallback } = require(__dirname+'/../redis/redis.js');

//initialize arrays
let themes = [];
let codeThemes = [];

function updateThemes() {
	// Attemptto get themes from config if possible
	if (config.get) {
		themes = config.get.themes || [];
		codeThemes = config.get.codeThemes || [];
	}

	// If no themes found in config, read from filesystem
	if (themes.length === 0) {
		const themesDir = path.join(__dirname, '../../gulp/res/css/themes');
		const codeThemesDir = path.join(__dirname, '../../gulp/res/css/codethemes');

		if (fs.existsSync(themesDir)) {
			themes = fs.readdirSync(themesDir)
				.filter(file => file.endsWith('.css'))
				.map(file => file.replace('.css', ''));
		}

		if (fs.existsSync(codeThemesDir)) {
			codeThemes = fs.readdirSync(codeThemesDir)
				.filter(file => file.endsWith('.css'))
				.map(file => file.replace('.css', ''));
		}
	}

	// Ensure we have the default theme at a minimum
	if (themes.length === 0) {
		themes = ['default'];
	}
	if (codeThemes.length === 0) {
		codeThemes = ['default'];
	}

	/* Debug logging
	if (process.env.NODE_ENV !== 'production') {
		console.log('Themes loaded:', themes);
		console.log('Code themes loaded:', codeThemes);
	}
	*/
}

// Call updateThemes immediately
updateThemes();

// Set up Redis callback for config updates
addCallback('config', updateThemes);

// Export the module
module.exports = {
	themes,
	codeThemes,
	updateThemes
};
