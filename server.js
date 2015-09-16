var express = require('express'),
    bodyParser = require('body-parser'),
    babelify = require('babelify'),
    browserify = require('browserify-middleware'),
    less = require('less-middleware'),
    nunjucks = require('nunjucks'),
    config = require('./client/config');

// initialise express
var app = express();

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use nunjucks to process view templates in express
nunjucks.configure('server/templates/views', {
    express: app
});

// less will automatically compile matching requests for .css files
app.use(less('public'));
// public assets are served before any dynamic requests
app.use(express.static('public'));

// common packages are precompiled on server start and cached
app.get('/js/' + config.common.bundle, browserify(config.common.packages, {
  cache: true,
  precompile: true
}));

// any file in /client/scripts will automatically be browserified,
// excluding common packages.
app.use('/js', browserify('./client/scripts', {
  external: config.common.packages,
  transform: [babelify.configure({
    plugins: ['object-assign']
  })]
}));

/*
  set up any additional server routes (api endpoints, static pages, etc.)
  here before the catch-all route for index.html below.
*/
app.get('/api/questions', function(req, res) {
    res.json(
      {0: {question: 'Favorite number',
          answers: [
            {text: '1', answer:'1'},
            {text: '2', answer:'2'},
            {text: '3', answer:'3'}
          ]
      },
      1: {question: 'do you like roses',
          answers: [
            {text: 'Yes', answer:'true'},
            {text: 'No', answer:'false'}
          ]
      }
    });
});

app.get('*', function(req, res) {
  // this route will respond to all requests with the contents of your index
  // template. Doing this allows react-router to render the view in the app.
    res.render('index.html');
});

// start the server
var server = app.listen(process.env.PORT || 3000, function() {
  console.log('\nServer ready on port %d\n', server.address().port);
});