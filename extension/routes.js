var loki = require('lokijs');
var express = require('express');
//var collections = require('./collections');
var router = express.Router();
//var db = collections();

router.get('/user', function(req, res) {});
router.get('/user/:id', function(req, res) {});
router.get('/user/:id/channel', function(req, res) {});
router.get('/user/:id/channel/twitch', function(req, res) {});

module.exports = router;
