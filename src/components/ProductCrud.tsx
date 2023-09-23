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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [productToDeleteIndex, setProductToDeleteIndex] = useState<
    number | null
  >(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(savedProducts);
  }, []);

  const saveProductsToLocalStorage = (updatedProducts: Product[]) => {
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

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

    if (editingProduct !== null) {
      // Si estamos editando, actualizamos el producto existente
      const updatedProducts = products.map((product) =>
        product === editingProduct ? newProduct : product
      );
      setProducts(updatedProducts);
      saveProductsToLocalStorage(updatedProducts);
      setEditingProduct(null);
    } else {
      // Si no estamos editiendo, agregamos un nuevo producto
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      saveProductsToLocalStorage(updatedProducts);
    }

    // Limpiamos los campos del formulario
    setProductName('');
    setProductCode('');
    setProductStock(0);
    setProductPrice(0);
    setProductQuantity(0);
  };
  const confirmDelete = (index: number) => {
    setProductToDeleteIndex(index);
    setDeleteConfirmationOpen(true);
  };

  const deleteProduct = () => {
    if (productToDeleteIndex !== null) {
      const updatedProducts: Product[] = products.filter(
        (_, i) => i !== productToDeleteIndex
      );
      setProducts(updatedProducts);
      saveProductsToLocalStorage(updatedProducts);
      setDeleteConfirmationOpen(false);
      setProductToDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setProductToDeleteIndex(null);
  };

  const editProduct = (index: number) => {
    const productToEdit = products[index];
    setProductName(productToEdit.name);
    setProductCode(productToEdit.code);
    setProductStock(productToEdit.stock);
    setProductPrice(productToEdit.price);
    setProductQuantity(productToEdit.quantity);
    setEditingProduct(productToEdit);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
            </Button>
          </form>
        </div>
        <Typography variant="h5" gutterBottom>
          Lista de Productos
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
            label="Buscar Producto"
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
              {filteredProducts.map((product, index) => (
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
                      onClick={() => confirmDelete(index)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => editProduct(index)}
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
          <Button onClick={deleteProduct} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Guard>
  );
};

export default ProductCrud;
