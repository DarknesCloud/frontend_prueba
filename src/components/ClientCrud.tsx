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

  useEffect(() => {
    const savedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    setClients(savedClients);
  }, []);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

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

    setClients([...clients, newClient]);

    setClientName('');
    setClientRtn('');
    setClientAddress('');
  };

  const deleteClient = (index: number) => {
    const updatedClients: Client[] = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
  };

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
              Agregar Cliente
            </Button>
          </form>
        </div>

        <Typography variant="h5" gutterBottom>
          Lista de Clientes
        </Typography>
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
              {clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.rtn}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteClient(index)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Guard>
  );
};

export default ClientCrud;
