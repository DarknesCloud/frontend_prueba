import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import {
  AccountCircle,
  Settings,
  Person,
  ExitToApp,
} from '@mui/icons-material';

const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState('');

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Eliminar la sesión del LocalStorage
    sessionStorage.removeItem('userSession');
    // Redirigir a la página de inicio de sesión
    window.location.href = '/';
  };

  useEffect(() => {
    // Obtener el nombre del usuario desde el LocalStorage si está autenticado
    const userSession = sessionStorage.getItem('userSession');
    if (userSession) {
      const userData = JSON.parse(userSession);
      setUserName(userData.name);
    }
  }, []);

  return (
    <AppBar position="fixed" color="default">
      <Toolbar>
        {/* Espacio flexible para empujar elementos al extremo derecho */}
        <Box sx={{ flexGrow: 1 }} />
        {/* Nombre del usuario */}
        {userName && (
          <Typography variant="body1" sx={{ marginRight: '16px' }}>
            Hola, {userName}
          </Typography>
        )}
        {/* Botón de perfil con menú desplegable */}
        <IconButton
          color="inherit"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          edge="end"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
