'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./config.js');
const { addCallback } = require(__dirname+'/../redis/redis.js');

// Initialize empty arrays
module.exports.themes = [];
module.exports.codeThemes = [];

function updateThemes() {
	// Initialize empty arrays in case config.get is null
	let themes = [];
	let codeThemes = [];

	// Only try to get themes from config if it exists
	if (config.get) {
		themes = config.get.themes || [];
		codeThemes = config.get.codeThemes || [];
	}

	// If no themes found in config, read from filesystem
	if (themes.length === 0) {
		const themesDir = path.join(__dirname, '../../public/css/themes');
		const codeThemesDir = path.join(__dirname, '../../public/css/codethemes');

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

	// Update module exports
	module.exports.themes = themes;
	module.exports.codeThemes = codeThemes;
}

// Call updateThemes immediately and set up callback for config updates
updateThemes();
addCallback('config', updateThemes);

module.exports.updateThemes = updateThemes;
