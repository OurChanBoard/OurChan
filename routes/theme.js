const express = require('express');
const router = express.Router();

router.get('/set-theme', (req, res) => {
    const { theme, codetheme, redirectTo } = req.query;
    
    // Sets theme cookies with a 1 year expiration - although 
    // if a Tor user has JS disabled, they're probably not 
    // going to have cookies saved that long
    if (theme) {
        res.cookie('theme', theme, { 
            maxAge: 31536000000, 
            httpOnly: false,
            path: '/'
        });
    }
    
    if (codetheme) {
        res.cookie('codetheme', codetheme, { 
            maxAge: 31536000000, 
            httpOnly: false,
            path: '/'
        });
    }
    
    // Redirect back to the original page
    res.redirect(redirectTo || '/');
});

module.exports = router; 