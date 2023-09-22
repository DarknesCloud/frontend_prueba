import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const RegisterAdmin: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedAdminPassword = localStorage.getItem('adminPassword');
    if (storedAdminPassword) {
      setIsFirstTime(false);
    }
  }, []);

  const handleCreateAdminPassword = () => {
    if (!adminPassword) {
      alert('Por favor, ingrese una contraseña de administrador.');
      return;
    }

    localStorage.setItem('adminPassword', adminPassword);
    setIsAdminAuthenticated(true);
    setIsFirstTime(false);
    alert('Contraseña de administrador creada con éxito.');
  };

  const handleAuthenticate = () => {
    const storedAdminPassword = localStorage.getItem('adminPassword');
    if (enteredPassword !== storedAdminPassword) {
      alert('La contraseña de administrador ingresada es incorrecta.');
      return;
    }
    setIsAdminAuthenticated(true);
  };

  const handleRegister = () => {
    if (!isFirstTime && !isAdminAuthenticated) {
      alert('Por favor, autentíquese para acceder al registro.');
      return;
    }

    if (!name || !email || !password || !role) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      alert('El usuario ya está registrado.');
      return;
    }

    const token = generateRandomToken();
    const newUser = { name, email, password, token, role };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso');
    navigate('/dashboard');
  };

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
            {isFirstTime
              ? 'Crear Contraseña de Administrador'
              : isAdminAuthenticated
              ? 'Registro'
              : 'Autenticación'}
          </Typography>
          {!isFirstTime && !isAdminAuthenticated && (
            <>
              <TextField
                label="Contraseña de Administrador"
                variant="outlined"
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAuthenticate}
                fullWidth
                style={{ marginTop: '20px' }}
              >
                Autenticar
              </Button>
            </>
          )}
          {(isFirstTime || isAdminAuthenticated) && (
            <>
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
              <TextField
                label="Rol (1 o 2)"
                variant="outlined"
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
            </>
          )}
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

export default RegisterAdmin;
