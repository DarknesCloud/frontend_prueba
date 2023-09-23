import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface User {
  email: string;
  name: string;
  role: string;
  password: string;
}

const UserCrud: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userToDeleteIndex, setUserToDeleteIndex] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  }, []);

  const saveUsersToLocalStorage = (updatedUsers: User[]) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const addUser = () => {
    if (!userEmail || !userName || !userPassword) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const newUser: User = {
      email: userEmail,
      name: userName,
      role: userRole,
      password: userPassword,
    };

    if (editingUser !== null) {
      // Si estamos editando, actualizamos el usuario existente
      const updatedUsers = users.map((user, index) =>
        index === users.indexOf(editingUser) ? newUser : user
      );
      setUsers(updatedUsers);
      saveUsersToLocalStorage(updatedUsers);
      setEditingUser(null);
    } else {
      // Si no estamos editiendo, agregamos un nuevo usuario
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveUsersToLocalStorage(updatedUsers);
    }

    // Limpiamos los campos del formulario
    setUserEmail('');
    setUserName('');
    setUserRole('');
    setUserPassword('');
  };

  const confirmDelete = (index: number) => {
    setUserToDeleteIndex(index);
    setDeleteConfirmationOpen(true);
  };

  const deleteUser = () => {
    if (userToDeleteIndex !== null) {
      const updatedUsers: User[] = users.filter(
        (_, i) => i !== userToDeleteIndex
      );
      setUsers(updatedUsers);
      saveUsersToLocalStorage(updatedUsers);
      setDeleteConfirmationOpen(false);
      setUserToDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setUserToDeleteIndex(null);
  };

  const editUser = (index: number) => {
    const userToEdit = users[index];
    setUserEmail(userToEdit.email);
    setUserName(userToEdit.name);
    setUserRole(userToEdit.role);
    setUserPassword(userToEdit.password);
    setEditingUser(userToEdit);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <div className="containerCRUDS">
        <Typography variant="h4" gutterBottom>
          CRUD de Usuarios
        </Typography>
        <form>
          <TextField
            label="Email"
            fullWidth
            value={userEmail}
            onChange={(e: any) => setUserEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Nombre"
            fullWidth
            value={userName}
            onChange={(e: any) => setUserName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Role"
            fullWidth
            value={userRole}
            onChange={(e: any) => setUserRole(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Contraseña"
            fullWidth
            type="password"
            value={userPassword}
            onChange={(e: any) => setUserPassword(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={addUser}>
            {editingUser ? 'Guardar Cambios' : 'Agregar Usuario'}
          </Button>
        </form>
      </div>
      <Typography variant="h5" gutterBottom>
        Lista de Usuarios
      </Typography>
      <Container
        component={Paper}
        style={{
          marginTop: '20px',
          marginBottom: '50px',
          padding: '15px',
        }}
      >
        <TextField
          label="Buscar Usuario"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          margin="normal"
        />
      </Container>
      <TableContainer component={Paper} style={{ marginBottom: '50px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Contraseña</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => confirmDelete(index)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => editUser(index)}
                    style={{ marginLeft: '8px' }}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={deleteConfirmationOpen}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este usuario?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteUser} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserCrud;
