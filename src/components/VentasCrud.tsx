import React, { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import Guard from './Guard';

interface Sale {
  productName: string;
  cantidad: number;
  name: string;
  precio: number;
  tipoFactura: string;
  subtotal: number;
  total: number;
}

const VentasCrud: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const savedSales = JSON.parse(localStorage.getItem('sales') || '[]');
    setSales(savedSales);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSales = sales.filter((sale) =>
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Guard>
      <Container style={{ marginTop: '100px' }}>
        <Fade>
          <Typography variant="h5" gutterBottom>
            Lista de Ventas
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
              label="Buscar Registro de Ventas"
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
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Tipo Factura</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSales.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{sale.productName}</TableCell>
                    <TableCell>{sale.cantidad}</TableCell>
                    <TableCell>{sale.name}</TableCell>
                    <TableCell>{sale.precio}</TableCell>
                    <TableCell>{sale.tipoFactura}</TableCell>
                    <TableCell>{sale.subtotal}</TableCell>
                    <TableCell>{sale.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      </Container>
    </Guard>
  );
};

export default VentasCrud;
