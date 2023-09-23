import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = () => {
    // Verificamos que los campos no estén vacíos
    if (!name || !email || !password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // Verificamos si el usuario ya existe en el LocalStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      alert('El usuario ya está registrado.');
      return;
    }

    // Generamos un token aleatorio para el usuario
    const token = generateRandomToken();

    // Establecemos el valor predeterminado del campo 'role' en 2 si no se proporciona
    const userRole = 2;

    // Creamos un nuevo usuario con el token y el campo 'role'
    const newUser = { name, email, password, token, role: userRole };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso');
    navigate('/dashboard');
  };
  // Genera un token aleatorio
  const generateRandomToken = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" align="center">
            Registro
          </Typography>
          <TextField
            label="Nombre"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Registrarse
          </Button>
          <Link
            to="/"
            style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}
          >
            <Button color="primary" fullWidth style={{ marginTop: '20px' }}>
              Volver
            </Button>
          </Link>
        </Container>
      </Paper>
    </div>
  );
};

export default Register;
