const themeMiddleware = require('./middleware/theme');
const themeRoutes = require('./routes/theme');

// Add theme middleware before route handlers
app.use(themeMiddleware);

// Add theme routes
app.use('/', themeRoutes); 