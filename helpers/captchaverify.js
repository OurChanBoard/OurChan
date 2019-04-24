'use strict';

const Captchas = require(__dirname+'/../db/captchas.js')
	, Mongo = require(__dirname+'/../db/db.js');

module.exports = async (req, res, next) => {

	//check if captcha field in form is valid
	const input = req.body.captcha;
	if (!input || input.length !== 6) {
		return res.status(403).render('message', {
            'title': 'Forbidden',
            'message': 'Incorrect captcha'
        });
	}

	//make sure they have captcha cookie and its 24 chars
	const captchaId = req.cookies.captchaid;
	if (!captchaId || captchaId.length !== 24) {
		return res.status(403).render('message', {
            'title': 'Forbidden',
            'message': 'Captcha expired'
        });
	}

	// try to get the captcha from the DB
	let captcha;
	try {
		const captchaMongoId = Mongo.ObjectId(captchaId);
		captcha = await Captchas.findOne(captchaMongoId);
	} catch (err) {
		return next(err);
	}

	//check that it exists and matches captcha in DB
	if (!captcha || captcha.text !== input) {
		return res.status(403).render('message', {
            'title': 'Forbidden',
            'message': 'Incorrect captcha'
        });
	}

	//it was correct, so continue
	res.clearCookie('captchaid');
	return next();

}
