import React, { useState, useEffect } from 'react';
import Guard from './Guard';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface Client {
  name: string;
  rtn: string;
  address: string;
}

const ClientCrud: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientName, setClientName] = useState<string>('');
  const [clientRtn, setClientRtn] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [clientToDeleteIndex, setClientToDeleteIndex] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const savedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    setClients(savedClients);
  }, []);

  const saveClientsToLocalStorage = (updatedClients: Client[]) => {
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const addClient = () => {
    if (!clientName || !clientRtn || !clientAddress) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const newClient: Client = {
      name: clientName,
      rtn: clientRtn,
      address: clientAddress,
    };

    if (editingClient) {
      // Si estamos editando, actualizamos el cliente existente
      const updatedClients = clients.map((client) =>
        client === editingClient ? newClient : client
      );
      setClients(updatedClients);
      saveClientsToLocalStorage(updatedClients);
      setEditingClient(null);
    } else {
      // Si no estamos editando, agregamos un nuevo cliente
      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      saveClientsToLocalStorage(updatedClients);
    }

    // Limpiamos los campos del formulario
    setClientName('');
    setClientRtn('');
    setClientAddress('');
  };

  const confirmDelete = (index: number) => {
    setClientToDeleteIndex(index);
    setDeleteConfirmationOpen(true);
  };

  const deleteClient = () => {
    if (clientToDeleteIndex !== null) {
      const updatedClients: Client[] = clients.filter(
        (_, i) => i !== clientToDeleteIndex
      );
      setClients(updatedClients);
      saveClientsToLocalStorage(updatedClients);
      setDeleteConfirmationOpen(false);
      setClientToDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setClientToDeleteIndex(null);
  };

  const editClient = (index: number) => {
    const clientToEdit = clients[index];
    setClientName(clientToEdit.name);
    setClientRtn(clientToEdit.rtn);
    setClientAddress(clientToEdit.address);
    setEditingClient(clientToEdit);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Guard>
      <Container>
        <div className="containerCRUDS">
          <Typography variant="h4" gutterBottom>
            CRUD de Clientes
          </Typography>
          <form>
            <TextField
              label="Nombre"
              fullWidth
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="RTN"
              fullWidth
              value={clientRtn}
              onChange={(e) => setClientRtn(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Dirección"
              fullWidth
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={addClient}>
              {editingClient ? 'Guardar Cambios' : 'Agregar Cliente'}
            </Button>
          </form>
        </div>

        <Typography variant="h5" gutterBottom>
          Lista de Clientes
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
            label="Buscar Cliente"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            margin="normal"
          />
        </Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>RTN</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.rtn}</TableCell>
                  <TableCell>{client.address}</TableCell>
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
                      onClick={() => editClient(index)}
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
      </Container>

      <Dialog open={deleteConfirmationOpen}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este registro?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteClient} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Guard>
  );
};

export default ClientCrud;
