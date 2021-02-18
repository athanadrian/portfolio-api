const express = require('express');

const {
  getBlogs,
  getBlogsByUser,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogs');
const { checkJwt, checkRole } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getBlogs).post(checkJwt, createBlog);
router.get('/me', checkJwt, checkRole('admin'), getBlogsByUser);
router.get('/s/:slug', getBlogBySlug);
router
  .route('/:id')
  .get(getBlogById)
  .put(checkJwt, checkRole('admin'), updateBlog)
  .delete(checkJwt, checkRole('admin'), deleteBlog);

module.exports = router;
