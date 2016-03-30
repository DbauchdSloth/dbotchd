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

module.exports = router;
