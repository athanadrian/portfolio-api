const Portfolio = require('../db/models/Portfolio');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@desc         Get all portfolios
//@route        GET /api/v1/portfolios
//@access       Public
exports.getPortfolios = asyncHandler(async (req, res, next) => {
  const portfolios = await Portfolio.find({});
  return res.json(portfolios);
});

//@desc         Get single portfolio
//@route        GET /api/v1/portfolios/:id
//@access       Public
exports.getPortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(
      new ErrorResponse(`Property not found with id ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ success: true, data: portfolio });
});

//@desc         Create Portfolio
//@route        POST /api/v1/portfolios
//@access       Private admin
exports.createPortfolio = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.sub;
  const portfolio = await Portfolio.create(req.body);

  if (!portfolio) {
    return next(new ErrorResponse(`Something went wrong`), 500);
  }

  res.status(200).json({
    success: true,
    data: portfolio,
  });
});

//@desc         Update Portfolio
//@route        PUT /api/v1/portfolios/:id
//@access       Private admin
exports.updatePortfolio = asyncHandler(async (req, res, next) => {
  let portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(new ErrorResponse(`Something went wrong`), 500);
  }

  portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: portfolio });
});

//@desc         Delete Portfolio
//@route        DELETE /api/v1/portfolios/:id
//@access       Private admin
exports.deletePortfolio = asyncHandler(async (req, res, next) => {
  let portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(new ErrorResponse(`Something went wrong`), 500);
  }
  portfolio = await Portfolio.findOneAndRemove({ _id: req.params.id });
  return res.json({ _id: portfolio.id });
});
