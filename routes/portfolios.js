const express = require('express');

const {
  getPortfolios,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolios');
const { checkJwt, checkRole } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getPortfolios).post(checkJwt, createPortfolio);

router
  .route('/:id')
  .get(getPortfolio)
  .put(checkJwt, checkRole('admin'), updatePortfolio)
  .delete(checkJwt, checkRole('admin'), deletePortfolio);

module.exports = router;
