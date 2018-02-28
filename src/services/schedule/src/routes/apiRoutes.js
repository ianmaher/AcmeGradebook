var express = require('express');
var apiRouter = express.Router();

module.exports = function() {
    console.log('calling schedule api router');

    apiRouter.route('/court')
        .get(function(req,res) {
            console.log(req.params);
            res.status(200).json({'courts':[
                {
                    'id': 10,
                    'name':'court room ten'
                },
                {
                    'id': 12,
                    'name':'court room twelve'
                }
            ]});
        });

    return apiRouter;
};
