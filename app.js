var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
// authentication
var cookieParser = require('cookie-parser');

var payLoad = {
    title:null,
    learners:null,
    books:null,
    actor: 'ianmaher'
};

// routes
var siteRoutes = require('./src/routes/siteRoutes')(payLoad);

var port = process.env.PORT || 8081;

// set up static content
app.use(express.static('public'));
app.set('views','./src/views');
app.set('view engine','ejs');

// set up middleware
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({extended: true}));

// auth middleware
app.use(cookieParser());

// set up routing table
app.use('/',siteRoutes);

app.listen(port, function () {
    console.log('example app listening on port ' + port + '!');

});