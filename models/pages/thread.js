'use strict';

const { buildThread } = require(__dirname+'/../../lib/build/tasks.js');

module.exports = async (req, res, next) => {

	let html, json;
	try {
		// Fix for non JS theming:
		// Get theme preferences from cookies if present
		const userTheme = req.cookies.theme;
		const userCodeTheme = req.cookies.codetheme;
		
		const buildThreadData = await buildThread({
			threadId: res.locals.thread.postId,
			board: res.locals.board,
			// Pass user theme preferences
			currentTheme: userTheme,
			currentCodeTheme: userCodeTheme
		});
		/* unlikely, but postsExists middleware can be true, but this can be null if deleted. so just next() to 404
		wont matter in the build-workers that call this because they dont destructure and never cause the bug */
		if (!buildThreadData) {
			return next();
		}
		({ html, json } = buildThreadData);
	} catch (err) {
		return next(err);
	}

	if (req.path.endsWith('.json')) {
		return res.set('Cache-Control', 'max-age=0').json(json);
	} else {
		return res.set('Cache-Control', 'max-age=0').send(html);
	}

};
