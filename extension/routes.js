var loki = require('lokijs');
var express = require('express');
//var collections = require('./collections');
var router = express.Router();
//var db = collections();


router.get('/', function(req, res) {
  return res.json({foo: "bar"});
});

module.exports = router;
