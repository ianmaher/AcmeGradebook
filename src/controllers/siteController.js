

module.exports = function (payLoad) {
    // AWS

    var AWS = require('aws-sdk');
    var Map = require('collections/map');
    var http = require('http');

    AWS.config.update({
        accessKeyId:'AKIAIZSS34RJOPNJTRUQ',
        secretAccessKey : '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',
        region: 'eu-west-1',
        endpoint: 'https://dynamodb.eu-west-1.amazonaws.com'
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    var index = function (req, res) {

        var table = 'LRSAwards';
        var params = {
            TableName: table,
            FilterExpression: 'verb = :earned',
            ExpressionAttributeValues: {
                ':earned':'earned'
            }
        };

        var chartData = new Map();
        docClient.scan(params, function(err, data) {
            if (err) {
                console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
            } else {
                payLoad.title = 'ACME Gradebook PoC';
                payLoad.learners = [];

                for (var i = 0; i < data.Items.length; i++) {
                    var actor = data.Items[i].actor;

                    if (!chartData.has(actor)) {
                        chartData.set(actor, 0);
                    }
                    chartData.set(actor, chartData.get(actor) + 1) ;
                }
                //payLoad.learners = Array.from(chartData.keys);
                payLoad.values = Array.from(chartData);
                chartData.forEach(function(val,key,map) {
                    payLoad.learners.add(key);
                });
            }
            res.render('index', payLoad);

        });

    };

    var timeline = function (req, res) {

        var learner = req.query.learner;
        var locale = 'en-uk';
        var table = 'LRSAwards';
        var params = {
            TableName: table,
            FilterExpression: 'verb = :earned and actor = :learner',
            ExpressionAttributeValues: {
                ':earned':'earned',
                ':learner':learner
            }
        };
        var chartData = new Map();

        docClient.scan(params, function(err, data) {
            if (err) {
                console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
            } else {
                payLoad.title = 'ACME Gradebook PoC';
                payLoad.learners = [];

                for (var i = 0; i < data.Items.length; i++) {
                    var month = new Date(data.Items[i].timestamp).toLocaleString(locale, {month:'long',year:'numeric'});
                    //month = objDate.toLocaleString(locale, { month: 'long' });

                    if (!chartData.has(month)) {
                        chartData.set(month, 0);
                    }
                    chartData.set(month, chartData.get(month) + 1) ;
                }
                //payLoad.learners = Array.from(chartData.keys);
                payLoad.values = Array.from(chartData);
                chartData.forEach(function(val,key,map) {
                    payLoad.learners.add(key);
                });
            }
            res.render('timeline', payLoad);
        });
    };

    var readbook = function (req, res) {
        res.render('readbook', payLoad);
    };

    var submitbook = function (req, res) {

        for (var x = 0; x < 1; x++) {
            var headers = {
                'Authorization':         'MGYwMWFiZTEzNjMzYjc2ZjAwNWU2YTJiYmVkYTBjYjM3NmM3MzcyZDo2MTFjOGUzYTI0ZmI5OGYzMWFiN2JmNTMzZWQ3NmNmYTg1OWRlMDQ5',
                'X-Experience-API-Version':'1.3.0'
            };
            var options = {
                host:'54.75.242.34',
                method: 'put',
                path:'data/xAPI/statements?statementId=dfb7218c-0fc9-4dfc-9524-d497097de026',
                headers: headers
            };

            var xapi = JSON.stringify(
              {
                actor:{
                    objectType: 'Agent',
                    name:'oliver maher',
                    mbox:'mailto:olivermaher@example.com'
                },
                verb:{
                    id:'http://example.com/xapi/verbs/earned',
                    display: {
                        en: 'earned'
                    }
                },
                object: {
                    objectType: 'Activity',
                    definition: {
                        name: {
                            en:'star'
                        }
                    },
                    id: 'http://example.com/star'
                },
                result : {
                    completion:true,
                    score:{
                        scaled:1
                    }
                }
            });

            var callback = function(response) {
                var str = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function(chunk) {
                    str += chunk;
                });

                //the whole response has been recieved, so we just print it out here
                response.on('end', function() {
                    res.render('readbook', payLoad);
                });
            };
            console.log(xapi);
            http.request(options, callback).write(xapi);

        }
    };

    // return an object that includes all the actions
    return {
        index: index,
        timeline: timeline,
        readbook: readbook,
        submitbook: submitbook
    };
};