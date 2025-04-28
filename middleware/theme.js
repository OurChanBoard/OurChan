const { themes, codeThemes } = require('../lib/misc/themes');

module.exports = (req, res, next) => {
    // Theme selection priority:
    // 1. URL query parameters (highest)
    // 2. Board-specific theme settings
    // 3. User cookies
    // 4. Default site theme (lowest)
    
    const getUserTheme = (boardTheme) => {
        // first check query parameters
        if (req.query.theme && themes.includes(req.query.theme)) {
            return req.query.theme;
        }
        
        // then check if we're on a board with a specific theme
        if (boardTheme && themes.includes(boardTheme)) {
            return boardTheme;
        }
        
        // ...then, check cookies
        if (req.cookies.theme && themes.includes(req.cookies.theme)) {
            return req.cookies.theme;
        }
        
        // lastly, fall back to the default
        return 'default';
    };
    
    const getUserCodeTheme = (boardCodeTheme) => {
        if (req.query.codetheme && codeThemes.includes(req.query.codetheme)) {
            return req.query.codetheme;
        }
        
        if (boardCodeTheme && codeThemes.includes(boardCodeTheme)) {
            return boardCodeTheme;
        }
        
        if (req.cookies.codetheme && codeThemes.includes(req.cookies.codetheme)) {
            return req.cookies.codetheme;
        }
        
        return 'default';
    };
    
    // adds theme information to res.locals for use in templates
    res.locals.selectedTheme = getUserTheme(res.locals.board?.settings?.theme);
    res.locals.selectedCodeTheme = getUserCodeTheme(res.locals.board?.settings?.codeTheme);
    res.locals.availableThemes = themes;
    res.locals.availableCodeThemes = codeThemes;
    
    next();
}; 