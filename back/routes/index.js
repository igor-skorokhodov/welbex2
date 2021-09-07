const router = require('express').Router();
const tableRoutes = require('./elements');

router.use(tableRoutes);

module.exports = router;
