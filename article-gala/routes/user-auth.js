var userService = require('./services/user-service');
var express = require('express'), router = express.Router();

router.post('/authenticate', function (req, res) {
    userService.authenticate(req.body.username, req.body.password)
            .then(function (token) {
                if (token) {
                    // authentication successful
                    res.send(token);
                } else {
                    // authentication failed
                    res.status(401).send('Username or password is incorrect');
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
});
router.post('/register', function (req, res) {
    userService.create(req.body)
            .then(function () {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
});
/*
exports.currentuser = function (req, res) {
    userService.getById(req.user.sub)
            .then(function (user) {
                if (user) {
                    res.send(user);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
};
exports.putUser = function (req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
            .then(function () {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
};
exports.deleteUser = function (req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
            .then(function () {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
};
*/
module.exports = router;
