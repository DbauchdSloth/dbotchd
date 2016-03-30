var express = require('express');
var collections = require('./collections');
var router = express.Router();
var db = collections();


router.get('/api/users', function(req, res) {
  return res.json(db.users.find({
    "_id": {"$gt": 1}
  }));
});

router.get('/api/users/:id', function(req, res) {
  return res.json(db.users.find({
    "_id": {"$eq": req.params.id}
  }));
});

router.get('/api/channels', function(req, res) {
  // res.json(twitch.getUser(req.params.name));
});

router.get('/api/channels/:id', function(req, res) {

});

router.get('/api/:name', function(req, res) {

});

router.get('/api/:name/follows', function(req, res) {

});

router.get('/api/:name/followers', function(req, res) {

});

router.get('/api/:name/activity', function(req, res) {

});

router.get('/api/:name/activity', function(req, res) {

});

router.get('/api/:name/channel/activity', function(req, res) {

});

router.get('/api/games/:id', function(req, res) {

});

router.get('/api/games', function(req, res) {

});

router.get('/api/games/activity', function(req, res) {

});

router.get('/api/games/:id/activity', function(req, res) {

});


module.exports = router;
