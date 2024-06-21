import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, TextField, Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import axios from 'axios';
import './App.css'; 

const apiUrl = 'http://localhost:5000';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPost, setEditedPost] = useState({ title: '', content: '' });

  useEffect(() => {
    axios.get(`${apiUrl}/posts`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddPost = () => {
    axios.post(`${apiUrl}/posts`, newPost)
      .then(response => {
        setPosts(prevState => [...prevState, response.data]);
        setNewPost({ title: '', content: '' });
      })
      .catch(error => {
        console.error('Error adding post:', error);
      });
  };

  const handleDeletePost = (id) => {

    axios.delete(`${apiUrl}/posts/${id}`)
      .then(() => {
        setPosts(prevState => prevState.filter(post => post._id !== id));
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
  };

  const handleEditClick = (id, title, content) => {
    setEditingPostId(id);
    setEditedPost({ title, content });
  };

  const handleUpdatePost = (id) => {
    axios.put(`${apiUrl}/posts/${id}`, editedPost)
      .then(response => {
        const updatedPosts = posts.map(post => {
          if (post._id === id) {
            return response.data;
          }
          return post;
        });
        setPosts(updatedPosts);
        setEditingPostId(null);
        setEditedPost({ title: '', content: '' });
      })
      .catch(error => {
        console.error('Error updating post:', error);
      });
  };

  return (
    <div className="app">
      <AppBar position="static" className="app-bar">
        <Toolbar>
          <Typography variant="h6">
            My Blog
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="container">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card className="card">
              <CardContent className="card-content">
                <TextField
                  label="Title"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Content"
                  name="content"
                  value={newPost.content}
                  onChange={handleInputChange}
                  multiline
                  fullWidth
                  margin="normal"
                />
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                className="add-post-button"
                onClick={handleAddPost}
              >
                Add Post
              </Button>
            </Card>
          </Grid>
          {posts.map(post => (
            <Grid key={post._id} item xs={12} sm={6} md={4}>
              <Card className="card">
                <CardContent className="card-content">
                  {editingPostId === post._id ? (
                    <>
                      <TextField
                        label="Title"
                        value={editedPost.title}
                        onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Content"
                        value={editedPost.content}
                        onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                        multiline
                        fullWidth
                        margin="normal"
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant="h5" className="post-title">
                        {post.title}
                      </Typography>
                      <Typography variant="body2" className="post-content">
                        {post.content}
                      </Typography>
                    </>
                  )}
                </CardContent>
                <div className="card-actions">
                  {editingPostId === post._id ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdatePost(post._id)}
                    >
                      Update
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(post._id, post.title, post.content)}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
