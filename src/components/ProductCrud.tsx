import React, { useState, useEffect } from 'react';
import Guard from './Guard';
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
} from '@mui/material';

interface Product {
  name: string;
  code: string;
  stock: number;
  price: number;
  quantity: number;
  total: number;
}

const ProductCrud: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [productCode, setProductCode] = useState<string>('');
  const [productStock, setProductStock] = useState<number>(0);
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productQuantity, setProductQuantity] = useState<number>(0);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(savedProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = () => {
    if (
      !productName ||
      !productCode ||
      productStock <= 0 ||
      productPrice <= 0 ||
      productQuantity <= 0
    ) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const newProduct: Product = {
      name: productName,
      code: productCode,
      stock: productStock,
      price: productPrice,
      quantity: productQuantity,
      total: productStock * productPrice,
    };

    setProducts([...products, newProduct]);

    setProductName('');
    setProductCode('');
    setProductStock(0);
    setProductPrice(0);
    setProductQuantity(0);
  };

  const deleteProduct = (index: number) => {
    const updatedProducts: Product[] = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <Guard>
      <Container>
        <div className="containerCRUDS">
          <Typography variant="h4" gutterBottom>
            CRUD de Productos
          </Typography>
          <form>
            <TextField
              label="Nombre"
              fullWidth
              value={productName}
              onChange={(e: any) => setProductName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Código de Producto"
              fullWidth
              value={productCode}
              onChange={(e: any) => setProductCode(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Existencias"
              fullWidth
              type="number"
              value={productStock}
              onChange={(e: any) => setProductStock(Number(e.target.value))}
              margin="normal"
            />
            <TextField
              label="Precio"
              fullWidth
              type="number"
              value={productPrice}
              onChange={(e: any) => setProductPrice(Number(e.target.value))}
              margin="normal"
            />
            <TextField
              label="Cantidad"
              fullWidth
              type="number"
              value={productQuantity}
              onChange={(e: any) => setProductQuantity(Number(e.target.value))}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={addProduct}>
              Agregar Producto
            </Button>
          </form>
        </div>
        <Typography variant="h5" gutterBottom>
          Lista de Productos
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Código de Producto</TableCell>
                <TableCell>Existencias</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.total}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteProduct(index)}
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

export default ProductCrud;
