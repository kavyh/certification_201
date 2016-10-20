var express = require('express');
var bodyParser = require('body-parser'), path = require('path');
var app = express();

// all environments
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('views', './views');
//app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/auth', require('./routes/user-auth'));
app.use('/data', require('./routes/article-datastore'));

app.get('/*', function (req, res) {
    res.render('index');
});
//comment
app.listen(app.get('port'), function () {
    console.log('App listening on port ' + app.get('port'));
});