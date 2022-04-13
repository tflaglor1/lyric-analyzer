const { Router, response } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', controller.test);

router.get('/songs', controller.getAllSongs);

module.exports = router;
