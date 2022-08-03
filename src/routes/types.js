const express = require('express');
const router = express.Router()

const { getAllTypes } = require('../controllers/types');

router.get("/", getAllTypes)

module.exports = router;