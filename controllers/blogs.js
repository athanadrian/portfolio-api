const Blog = require('../db/models/Blog');
const slugify = require('slugify');
const uniqueSlug = require('unique-slug');
const asyncHandler = require('../middleware/async');
const { getAccessToken, getAuth0User } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

//@desc         Get all blogs
//@route        GET /api/v1/blogs
//@access       Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find({ status: 'published' }).sort({
    createdAt: -1,
  });
  const { access_token } = await getAccessToken();
  const blogsWithUsers = [];
  const authors = {};

  for (let blog of blogs) {
    const author =
      authors[blog.userId] || (await getAuth0User(access_token)(blog.userId));
    authors[author.user_id] = author;
    blogsWithUsers.push({ blog, author });
  }

  return res.json(blogsWithUsers);
});

//@desc         Get user blogs
//@route        GET /api/v1/blogs/me
//@access       Private Admin
exports.getBlogsByUser = async (req, res) => {
  const userId = req.user.sub;
  const blogs = await Blog.find({
    userId,
    status: { $in: ['draft', 'published'] },
  });
  return res.json(blogs);
};

//@desc         Get single blog by Id
//@route        GET /api/v1/blogs/:id
//@access       Public
exports.getBlogById = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id ${req.params.id}!`, 404)
    );
  }
  res.status(200).json(blog);
});

//@desc         Get single blog by slug
//@route        GET /api/v1/blogs/s/:slug
//@access       Public
exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  const { access_token } = await getAccessToken();
  const author = await getAuth0User(access_token)(blog.userId);

  return res.json({ blog, author });
};

// //@desc         Create blog
// //@route        POST /api/v1/blogs
// //@access       Private admin
exports.createBlog = async (req, res) => {
  const blogData = req.body;
  blogData.userId = req.user.sub;
  const blog = new Blog(blogData);

  try {
    const createdBlog = await blog.save();
    return res.json(createdBlog);
  } catch (e) {
    return res.status(422).send(e.message);
  }
};

const _saveBlog = async (blog) => {
  try {
    const createdBlog = await blog.save();
    return createdBlog;
  } catch (e) {
    if (e.code === 11000 && e.keyPattern && e.keyPattern.slug) {
      blog.slug += `-${uniqueSlug()}`;
      return _saveBlog(blog);
    }

    throw e;
  }
};

//@desc         Update blog
//@route        PUT /api/v1/blogs/:id
//@access       Private admin
exports.updateBlog = async (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  Blog.findById(id, async (err, blog) => {
    if (err) {
      return res.status(422).send(err.message);
    }

    if (body.status && body.status === 'published' && !blog.slug) {
      blog.slug = slugify(blog.title, {
        replacement: '-',
        lower: true,
      });
    }

    blog.set(body);
    blog.updateAt = new Date();

    try {
      const updatedBlog = await _saveBlog(blog);
      return res.json(updatedBlog);
    } catch (err) {
      return res.status(422).send(err.message);
    }
  });
};

//@desc         Delete blog
//@route        DELETE /api/v1/blogs/:id
//@access       Private admin
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse(`Something went wrong`), 500);
  }
  blog = await Blog.findOneAndRemove({ _id: req.params.id });
  return res.json({ _id: blog.id });
});
