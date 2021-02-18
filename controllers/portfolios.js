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
  res.status(200).json(portfolio);
});

//@desc         Create Portfolio
//@route        POST /api/v1/portfolios
//@access       Private admin
// exports.createPortfolio = asyncHandler(async (req, res, next) => {
//   req.body.userId = req.user.sub;
//   const portfolio = await Portfolio.create(req.body);

//   if (!portfolio) {
//     return next(new ErrorResponse(`Something went wrong`), 500);
//   }

//   res.status(200).json({
//     success: true,
//     data: portfolio,
//   });
// });
exports.createPortfolio = async (req, res) => {
  const portfolioData = req.body;
  portfolioData.userId = req.user.sub;
  const portfolio = new Portfolio(portfolioData);

  try {
    const createdPortfolio = await portfolio.save();
    return res.status(200).json(createdPortfolio);
  } catch (e) {
    return res.status(422).send(e.message);
  }
};

//@desc         Update Portfolio
//@route        PUT /api/v1/portfolios/:id
//@access       Private admin
exports.updatePortfolio = asyncHandler(async (req, res, next) => {
  let portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(new ErrorResponse(`Something went wrong`), 500);
  }

  //res.status(200).json({ success: true, data: portfolio });
  try {
    updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json(updatedPortfolio);
  } catch (e) {
    return res.status(422).send(e.message);
  }
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
