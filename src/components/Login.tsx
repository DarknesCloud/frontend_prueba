import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
} from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si existe una sesión en el SessionStorage al cargar el componente
    const userSession = JSON.parse(
      sessionStorage.getItem('userSession') || '{}'
    );
    if (userSession.token) {
      // Si hay una sesión válida, redirigir al dashboard u otra página deseada
      navigate('/dashboard');
    }
  }, []); // El array vacío [] asegura que este efecto se ejecute solo una vez al cargar el componente

  const handleLogin = () => {
    // Verificamos que los campos no estén vacíos
    if (!email || !password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // Obtenemos los usuarios almacenados en el LocalStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Buscamos el usuario por el email
    const user = users.find((u: any) => u.email === email);

    // Verificamos si el usuario existe y la contraseña coincide
    if (user && user.password === password) {
      // Verificamos si el usuario tiene un token válido
      if (user.token) {
        // Inicio de sesión exitoso
        alert('Inicio de sesión exitoso');

        // Guardar la sesión en SessionStorage
        sessionStorage.setItem('userSession', JSON.stringify(user));

        // Redirigir al dashboard u otra página después del inicio de sesión
        navigate('/dashboard');
      } else {
        alert('Usuario no autorizado');
      }
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email "
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Recuerdame"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Iniciar Sesion
          </Button>
          <Grid container>
            <Grid item xs>
              <MuiLink href="#" variant="body2">
                ¿Olvido su contraseña?
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink component={Link} to="/register" variant="body2">
                {'¿No tiene una cuenta? Registrarse'}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
