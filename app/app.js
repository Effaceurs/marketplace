const passport = require('passport')
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const deployApp = require('./routes/deploy');
const cors = require('cors')
const morgan = require('morgan')
const keys = require('./config/keys')

mongoose.connect(keys.mongiURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/application', orderRoutes);
app.use('/api/deploy', deployApp);

module.exports = app;
