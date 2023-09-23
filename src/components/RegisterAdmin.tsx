import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const RegisterAdmin: React.FC = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [viewMode, setViewMode] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const storedAdminPassword = localStorage.getItem('adminPassword');
    if (!storedAdminPassword) {
      // Si no existe una contraseña de administrador, establece el modo en 0 para la creación de contraseña.
      setViewMode(0);
    } else {
      // Si existe una contraseña de administrador, establece el modo en 1 para la validación.
      setViewMode(1);
    }
  }, []);

  const handleAdminAuthentication = () => {
    const storedAdminPassword = localStorage.getItem('adminPassword');
    if (adminPassword !== storedAdminPassword) {
      alert('La contraseña de administrador ingresada es incorrecta.');
      return;
    }
    setViewMode(2);
    setIsAdminAuthenticated(true);
  };

  const handleCreateAdminPassword = () => {
    if (!adminPassword) {
      alert('Por favor, ingrese una contraseña de administrador.');
      return;
    }

    // Guarda la contraseña de administrador en el localStorage.
    localStorage.setItem('adminPassword', adminPassword);
    // Cambia al modo de validación.
    setViewMode(1);
  };

  const handleRegister = () => {
    if (viewMode !== 2 || !isAdminAuthenticated) {
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
    // Navegar a la página de destino después del registro
    // Ejemplo: navigate('/dashboard');
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
            {viewMode === 0
              ? 'Crear Contraseña de Administrador'
              : viewMode === 1
              ? 'Validar Contraseña de Administrador'
              : 'Registro'}
          </Typography>
          {viewMode === 0 && (
            <>
              <TextField
                label="Contraseña de Administrador"
                variant="outlined"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateAdminPassword}
                fullWidth
                style={{ marginTop: '20px' }}
              >
                Crear Contraseña de Administrador
              </Button>
            </>
          )}
          {viewMode === 1 && (
            <>
              <TextField
                label="Contraseña de Administrador"
                variant="outlined"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdminAuthentication}
                fullWidth
                style={{ marginTop: '20px' }}
              >
                Validar Contraseña de Administrador
              </Button>
            </>
          )}
          {viewMode === 2 && (
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
        </Container>
      </Paper>
    </div>
  );
};

export default RegisterAdmin;
