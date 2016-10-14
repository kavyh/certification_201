var articleService = require('./services/articles-service');
var express = require('express'), router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(' ',''));
    }
});
var upload = multer({storage: storage}).single('file');

router.get('/articles', function (req, res) {
    //get all articles
    articleService.getAllTheArticles(req.body)
            .then(function (response) {
                if (response) {
                    // authentication successful
                    res.send(response);
                } else {
                    // authentication failed
                    res.status(500).send('Not able to fetch Please try after some time, or contact admin');
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });

});
router.get('/article/:_id', function (req, res) {
    //get all articles
    articleService.getArticle(req.params._id)
            .then(function (response) {
                if (response) {
                    // authentication successful
                    res.send(response);
                } else {
                    // authentication failed
                    res.status(500).send('Not able to fetch Please try after some time, or contact admin');
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });

});
router.post('/article/new', function (req, res) {
    //add new article
    var user = req['headers']['cookie'] || "";
    user = user.split('; ');
    var usr;
    user.forEach(function (item) {
        if (item.startsWith('article.user')) {
            usr = JSON.parse(decodeURIComponent(item.substring(13)));
        }
    });
    if (!usr) {
        res.status(401).send("Permission Denied");
    }
    req.body['author'] = usr;
    articleService.create(req.body)
            .then(function (articleId) {
                if (articleId) {
                    // authentication successful
                    res.send(articleId);
                } else {
                    // authentication failed
                    res.status(500).send('Not able to save Please try after some time, or contact admin');
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });

});
router.put('/article/:_id', function (req, res) {
    //update an article
    var user = req['headers']['cookie'] || "";
    user = user.split('; ');
    var usr;
    user.forEach(function (item) {
        if (item.startsWith('article.user')) {
            usr = JSON.parse(decodeURIComponent(item.substring(13)));
        }
    });
    if (!usr) {
        res.status(401).send("Permission Denied");
    }
    req.body['author'] = usr;
    var params = {};
    params[req.params._id] = req.body;
    articleService.update({id: req.params._id, data: req.body})
            .then(function (articleId) {
                if (articleId) {
                    // authentication successful
                    res.send(articleId);
                } else {
                    // authentication failed
                    res.status(500).send('Not able to save Please try after some time, or contact admin');
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
});
router.delete('/article/:_id', function (req, res) {
    //delete an article
    articleService.getArticle(req.params._id)
            .then(function (response) {
                if (response) {
                    // authentication successful
                    res.send(response);
                } else {
                    // authentication failed
                    res.status(500).send('Not able to perform the operation Please try after some time, or contact admin');
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
});
router.post('/comments/:_id', function (req, res) {
    //add comments to an article
    var user = req['headers']['cookie'] || "";
    user = user.split('; ');
    var usr;
    user.forEach(function (item) {
        if (item.startsWith('article.user')) {
            usr = JSON.parse(decodeURIComponent(item.substring(13)));
        }
    });
    if (!usr) {
        res.status(401).send("Permission Denied");
    }
    req.body['author'] = usr.name;
    var params = {};
    params[req.params._id] = req.body;
    articleService.createComment({id: req.params._id, data: req.body})
            .then(function (articleId) {
                if (articleId) {
                    // authentication successful
                    res.send(true);
                } else {
                    // authentication failed
                    res.status(500).send('Not able to save Please try after some time, or contact admin');
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
});
router.post('/upload', function (req, res) {
    try {
        upload(req, res, function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.send({filename: req.file.filename});
        });
    } catch (error) {
        res.send(error);
    }

});
module.exports = router;