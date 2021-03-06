/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('game');
});
router.get('/game/:gameId/', function(req, res, next) {
    res.render('game', req.params);
});
router.get('/license', function(req, res, next) {
    res.render('assets/LICENSE');
});

module.exports = router;
