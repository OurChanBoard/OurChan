'use strict';

const { readdirSync } = require('fs-extra')
	, config = require(__dirname+'/config.js')
	, { addCallback } = require(__dirname+'/../redis/redis.js')
	, updateThemes = () => {
		// Initialize with empty arrays
		let themes = [];
		let codeThemes = [];
		
		// Try to get themes from config if available
		if (config.get) {
			themes = config.get.themes || [];
			codeThemes = config.get.codeThemes || [];
		}
		
		// If no themes in config, read from filesystem
		module.exports.themes = themes.length > 0 ? themes : readdirSync(__dirname+'/../../gulp/res/css/themes/').filter(x => x.endsWith('.css')).map(x => x.substring(0,x.length-4));
		module.exports.codeThemes = codeThemes.length > 0 ? codeThemes : readdirSync(__dirname+'/../../node_modules/highlight.js/styles/').filter(x => x.endsWith('.css')).map(x => x.substring(0,x.length-4));
	};

// Initialize with empty arrays
module.exports.themes = [];
module.exports.codeThemes = [];

// Update themes when config is loaded
updateThemes();
addCallback('config', updateThemes);
