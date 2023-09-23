import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, List } from '@mui/material';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Api: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Realizar una petición GET
    fetch(`${API_BASE_URL}/posts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Post[]) => {
        setPosts(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleCreatePost = () => {
    // Realizar una petición POST
    const newPost: Post = {
      userId: 1,
      id: Date.now(),
      title: 'Nuevo Post',
      body: 'Contenido del nuevo post',
    };

    fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al crear el post');
        }
        return response.json();
      })
      .then((createdPost: Post) => {
        setPosts([...posts, createdPost]);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleDeletePost = (postId: number) => {
    // Realizar una petición DELETE
    fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el post');
        }
        return response.json();
      })
      .then(() => {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Mis Posts
      </Typography>
      {error && (
        <Typography variant="body1" color="error">
          Error: {error}
        </Typography>
      )}
      <Button variant="contained" onClick={handleCreatePost}>
        Crear Post
      </Button>
      <List>
        {posts.map((post) => (
          <Card key={post.id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.body}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeletePost(post.id)}
              >
                Eliminar
              </Button>
            </CardContent>
          </Card>
        ))}
      </List>
    </div>
  );
};

export default Api;
