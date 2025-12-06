const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const activityRoutes = require('./routes/activity.routes');
const nutritionRoutes = require('./routes/nutrition.routes');
const sleepRoutes = require('./routes/sleep.routes');
const goalRoutes = require('./routes/goal.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/dashboard', dashboardRoutes);

// health check
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// error handler (must be last)
app.use(errorHandler);

module.exports = app;
