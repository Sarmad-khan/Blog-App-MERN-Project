const express = require('express');
const router = express.Router();
const Post = require('./models/post');

// Middleware
router.use(express.json());

router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, {
        title: req.body.title,
        content: req.body.content,
        updatedAt: Date.now()
      }, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;
