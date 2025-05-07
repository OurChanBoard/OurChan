'use strict';

const { buildCatalog } = require(__dirname+'/../../lib/build/tasks.js');

module.exports = async (req, res, next) => {

	let html, json;
	try {
		// Fix for non JS theming:
		// Get theme preferences from cookies if present
		const userTheme = req.cookies.theme;
		const userCodeTheme = req.cookies.codetheme;
		
		({ html, json } = await buildCatalog({ 
			board: res.locals.board,
			// Pass user theme preferences
			currentTheme: userTheme,
			currentCodeTheme: userCodeTheme
		}));
	} catch (err) {
		return next(err);
	}

	if (req.path.endsWith('.json')) {
		return res.set('Cache-Control', 'max-age=0').json(json);
	} else {
		return res.set('Cache-Control', 'max-age=0').send(html);
	}

};
