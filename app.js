var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var db = require('./db/db')
const passport = require("passport");
const { graphqlHTTP } = require('express-graphql');

var app = express();

const schema = require('./schema/schema');


app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public/build')));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
app.use('/users', usersRouter);
app.use('/graphql',graphqlHTTP({
  graphiql: true,
  schema: schema
}))
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/build', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


db.init()

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

module.exports = app;
