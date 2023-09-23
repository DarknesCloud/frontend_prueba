import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [userRole, setUserRole] = useState<number | null | string>(null); // Cambiado a number para representar el rol

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  useEffect(() => {
    // Obtener el valor del rol del usuario desde el sessionStorage
    const userSession = sessionStorage.getItem('userSession');
    if (userSession) {
      const userData = JSON.parse(userSession);
      const role = userData.role;
      setUserRole(role);
      console.log('Rol del usuario:', role); // Imprimir el rol en la consola
    }
  }, []);

  // Función para renderizar elementos de menú en función del rol
  const renderMenuItems = () => {
    if (userRole === '1' || userRole === 1) {
      // Si el usuario tiene un rol de 1, muestra todos los elementos del menú
      return (
        <>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="dashboard/clients">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Clientes" />
          </ListItem>
          <ListItem button component={Link} to="dashboard/products">
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Productos" />
          </ListItem>
          <ListItem button component={Link} to="dashboard/users">
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItem>
          <ListItem button component={Link} to="dashboard/ventas">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Ventas" />
          </ListItem>
        </>
      );
    } else if (userRole === '2' || userRole === 2) {
      // Si el usuario tiene un rol de 2, oculta el elemento "Clientes"
      return (
        <>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          {/* Los elementos "Clientes", "Productos" y "Usuarios" se ocultan */}
        </>
      );
    } else {
      // Manejar otros roles si es necesario
      return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleToggleSidebar}
        edge="start"
        sx={{
          display: open ? 'none' : 'block',
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="close drawer"
          onClick={handleToggleSidebar}
          edge="start"
          sx={{
            display: open ? 'block' : 'none',
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <List>{renderMenuItems()}</List>
        <Divider />
        <List>
          <ListItem button component={Link} to="dashboard/invoice">
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Facturar" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
