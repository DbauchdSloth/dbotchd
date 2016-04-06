//var loki = require('lokijs');
var express = require('express');
var router = express.Router();

router.get('/user/:id', function(req, res) {});
router.get('/user/:id/channel', function(req, res) {});
router.get('/user/:id/channel/twitch', function(req, res) {});


module.exports = router;
