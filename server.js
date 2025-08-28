const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB ulanish
mongoose.connect('mongodb+srv://refbot:refbot00@gamepaymentbot.ffcsj5v.mongodb.net/portf3?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Modellar
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  mediaType: String,
  mediaUrl: String,
  likes: { type: Number, default: 0 },
  comments: [{
    author: String,
    content: String,
    likes: { type: Number, default: 0 },
    replies: [{
      author: String,
      content: String,
      likes: { type: Number, default: 0 }
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const GallerySchema = new mongoose.Schema({
  title: String,
  type: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);
const Message = mongoose.model('Message', MessageSchema);
const Gallery = mongoose.model('Gallery', GallerySchema);

// Fayl yuklash sozlamalari
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'public/uploads/';
    if (file.mimetype.startsWith('image')) {
      uploadPath += 'images/';
    } else if (file.mimetype.startsWith('video')) {
      uploadPath += 'videos/';
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// API Routelari

// Postlar uchun
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', upload.single('media'), async (req, res) => {
  try {
    const { title, content, mediaType } = req.body;
    const mediaUrl = req.file ? `/uploads/${req.file.mimetype.startsWith('image') ? 'images/' : 'videos/'}${req.file.filename}` : '';
    
    const newPost = new Post({
      title,
      content,
      mediaType,
      mediaUrl
    });
    
    await newPost.save();
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/posts/:id', upload.single('media'), async (req, res) => {
  try {
    const { title, content, mediaType } = req.body;
    const updateData = { title, content, mediaType };
    
    if (req.file) {
      updateData.mediaUrl = `/uploads/${req.file.mimetype.startsWith('image') ? 'images/' : 'videos/'}${req.file.filename}`;
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:id/comment', async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = await Post.findById(req.params.id);
    
    post.comments.push({
      author,
      content
    });
    
    await post.save();
    res.json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:postId/comment/:commentId/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.id(req.params.commentId);
    comment.likes += 1;
    
    await post.save();
    res.json({ likes: comment.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:postId/comment/:commentId/reply', async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.id(req.params.commentId);
    
    comment.replies.push({
      author,
      content
    });
    
    await post.save();
    res.json(comment.replies[comment.replies.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xabarlar uchun
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Galereya uchun
app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gallery', upload.single('media'), async (req, res) => {
  try {
    const { title, type } = req.body;
    const url = req.file ? `/uploads/${req.file.mimetype.startsWith('image') ? 'images/' : 'videos/'}${req.file.filename}` : '';
    
    const newItem = new Gallery({
      title,
      type,
      url
    });
    
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// HTML routelari
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda`);
});