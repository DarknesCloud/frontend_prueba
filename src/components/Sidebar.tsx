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

import Box from '@mui/material/Box';
import { Group, MonetizationOn, Store } from '@mui/icons-material';

const Sidebar: React.FC = () => {
  const [userRole, setUserRole] = useState<number | null | string>(null); // Cambiado a number para representar el rol

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
          <ListItem
            button
            component={Link}
            to="/dashboard"
            style={{ marginTop: '10px', marginBottom: '10px' }}
          >
            <img
              style={{ width: '100%' }}
              src="https://itgrahn.com/images/logo.png"
              alt="Logo"
            />
          </ListItem>
          <Divider />

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
              <Group />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItem>
          <ListItem button component={Link} to="dashboard/ventas">
            <ListItemIcon>
              <MonetizationOn />
            </ListItemIcon>
            <ListItemText primary="Ventas" />
          </ListItem>
          <ListItem button component={Link} to="dashboard/tienda">
            <ListItemIcon>
              <Store />
            </ListItemIcon>
            <ListItemText primary="Tienda" />
          </ListItem>
        </>
      );
    } else if (userRole === '2' || userRole === 2) {
      return (
        <>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </>
      );
    } else {
      // Manejar otros roles si es necesario
      return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={true}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
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
