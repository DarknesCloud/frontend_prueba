import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  AccountCircle,
  Settings,
  Person,
  ExitToApp,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

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

  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* Agregar un enlace al inicio */}
        <Link
          to="/dashboard"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Button color="inherit">Inicio</Button>
        </Link>
        {/* Espacio flexible para empujar elementos al extremo derecho */}
        <Box sx={{ flexGrow: 1 }} />
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