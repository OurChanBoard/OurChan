'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { addCallback } = require(__dirname+'/../redis/redis.js');

// Initialize empty arrays
let themes = [];
let codeThemes = [];

function updateThemes() {
	// Try to get themes from config first
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

	// Ensure we have at least the default theme
	if (themes.length === 0) {
		themes = ['default'];
	}
	if (codeThemes.length === 0) {
		codeThemes = ['default'];
	}

	// Update module exports
	module.exports.themes = themes;
	module.exports.codeThemes = codeThemes;
}

// Call updateThemes immediately
updateThemes();

// Set up config update handler
config.on('update', updateThemes);

module.exports = {
	themes,
	codeThemes,
	updateThemes
};
