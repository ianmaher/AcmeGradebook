var express = require('express');
var siteRouter = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var books = [
    'Lion, Witch and the wardrobe',
    'Stig of the Dump',
    'Famous Five fo Wild'
];

module.exports = function(payLoad) {
    payLoad.books = books;
    var siteController = require('../controllers/siteController')(payLoad);

    siteRouter.route('/')
        .get(siteController.index);

    siteRouter.route('/timeline')
        .get(siteController.timeline);

    siteRouter.route('/readbook')
        .get(siteController.readbook)
        .post(urlencodedParser,siteController.submitbook);

    return siteRouter;
};
