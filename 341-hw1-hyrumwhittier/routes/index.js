const express = require('express');
const router = express.Router();

const { showSomeone, showAnother } = require('../controllers');

router.get('/', showSomeone);
router.get('/awesome', showAnother);

module.exports = router;
