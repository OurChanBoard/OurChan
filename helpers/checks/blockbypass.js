'use strict';

const { Bypass } = require(__dirname+'/../../db/')
	, { ObjectId } = require(__dirname+'/../../db/db.js')
	, { secureCookies, blockBypass } = require(__dirname+'/../../configs/main.js')
	, dynamicResponse = require(__dirname+'/../dynamic.js')
	, production = process.env.NODE_ENV === 'production';

module.exports = async (req, res, next) => {

	if (!blockBypass.enabled) {
		return next();
	}

	//check if blockbypass exists and right length
	const bypassId = req.cookies.bypassid;
	if (!res.locals.solvedCaptcha && (!bypassId || bypassId.length !== 24)) {
		return dynamicResponse(req, res, 403, 'message', {
			'title': 'Forbidden',
			'message': 'Missing or invalid block bypass',
			'redirect': '/bypass.html',
			'link': '/bypass.html',
		});
	}

	//try to get bypass from db and make sure uses < maxUses
	let bypass;
	if (bypassId && bypassId.length === 24) {
		try {
			const bypassMongoId = ObjectId(bypassId);
			bypass = await Bypass.checkBypass(bypassMongoId);
			res.locals.blockBypass = bypass;
		} catch (err) {
			return next(err);
		}
	}

	if (bypass && bypass.uses < blockBypass.expireAfterUses) {
		return next();
	}

	if (res.locals.solvedCaptcha) {
		//they dont have a valid bypass, but just solved board captcha, so give them a new one
		const newBypass = await Bypass.getBypass();
		const newBypassId = newBypass.insertedId;
		res.locals.blockBypass = newBypass.ops[0];
		res.cookie('bypassid', newBypassId.toString(), {
			'maxAge': blockBypass.expireAfterTime,
			'secure': production && secureCookies,
			'sameSite': 'strict'
		});
		return next();
	}

	return dynamicResponse(req, res, 403, 'message', {
		'title': 'Forbidden',
		'message': 'Block bypass expired or exceeded max uses',
		'redirect': '/bypass.html',
		'link': '/bypass.html',
	});

}
