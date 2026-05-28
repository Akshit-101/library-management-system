const express = require('express');
const router = express.Router();
const { getNeverBorrowed, getOutstanding, getTopBorrowed } = require('../controllers/task.js');

router.get('/never-borrowed', getNeverBorrowed);
router.get('/outstanding', getOutstanding);
router.get('/top-borrowed', getTopBorrowed);

module.exports = router;
