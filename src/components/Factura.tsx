import jsPDF from 'jspdf';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Autocomplete,
} from '@mui/material';
import Guard from './Guard';
// Define una interfaz para el cliente
interface Client {
  name: string;
  // Agrega otros campos necesarios para un cliente
}

// Define una interfaz para el producto
interface Product {
  name: string;
  code: string; // Código del producto
  stock: number;
  price: number;
}

// Define una interfaz para la venta
interface Sale {
  name: string; // Nombre del cliente
  tipoFactura: string; // Tipo de factura (Crédito / Contado)
  codigoProducto: string; // Código del producto
  precio: number; // Precio del producto
  cantidad: number; // Cantidad de productos
  subtotal: number; // Subtotal
  total: number; // Total
  productName: string;
}

// Obtener la lista de clientes desde el LocalStorage
function getClientListFromLocalStorage() {
  const clientsJSON = localStorage.getItem('clients');
  if (clientsJSON) {
    const clients = JSON.parse(clientsJSON);
    return clients as Client[];
  }
  return [];
}

// Componente Factura
const Factura = () => {
  // Estados para los valores del formulario
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [tipoFactura, setTipoFactura] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>(''); // Campo de selección del producto
  const [codigoProducto, setCodigoProducto] = useState<string>(''); // Código del producto
  const [precio, setPrecio] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [errorMensaje, setErrorMensaje] = useState<any>(null);
  const [facturaGenerada, setFacturaGenerada] = useState(false);

  // Estado para controlar la cantidad y el mensaje de error
  const [errorCantidad, setErrorCantidad] = useState<string | null>(null);

  // Estados para la lista de clientes y ventas
  const [clientList, setClientList] = useState<Client[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Estado para mantener un contador de facturas
  const [invoiceCounter, setInvoiceCounter] = useState<number>(1);

  // Estados para mantener las ventas generadas
  const [generatedSales, setGeneratedSales] = useState<Sale[]>([]);

  // Cargar la lista de clientes, productos y ventas desde el LocalStorage al cargar el componente
  useEffect(() => {
    const clients = getClientListFromLocalStorage();
    setClientList(clients);

    const productsJSON = localStorage.getItem('products');
    if (productsJSON) {
      const products = JSON.parse(productsJSON);
      setProductList(products);
    }

    const savedSalesJSON = localStorage.getItem('sales');
    if (savedSalesJSON) {
      const savedSales = JSON.parse(savedSalesJSON);
      setSales(savedSales);
    }
  }, []);

  // Evento para el botón de registrar cliente
  const handleRegisterClientClick = () => {
    // Validar que se haya seleccionado un cliente
    if (!selectedClient) {
      setErrorMensaje('Por favor, seleccione un cliente.');
      return;
    }

    // Validar que se haya seleccionado un producto
    if (!selectedProduct) {
      setErrorMensaje('Por favor, seleccione un producto.');
      return;
    }

    // Encontrar el producto seleccionado
    const product = productList.find((p) => p.name === selectedProduct);

    // Validar que la cantidad y el precio sean mayores que cero
    if (cantidad <= 0 || precio <= 0) {
      setErrorMensaje(
        'Asegúrese de que la cantidad y el precio sean mayores que cero.'
      );
      return;
    }

    // Validar que la cantidad no sea mayor que el stock disponible
    if (product) {
      const updatedStock = product.stock - cantidad;
      const updatedProducts = productList.map((p) =>
        p.code === product.code ? { ...p, stock: updatedStock } : p
      );
      setProductList(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } else {
      setErrorMensaje('Producto no encontrado en el catálogo.');
      return;
    }

    // Crear un objeto Sale con los datos del formulario
    const subtotalVenta = precio * cantidad;
    const isv = subtotalVenta * 0.15;
    const totalVenta = subtotalVenta + isv;

    const venta: Sale = {
      name: selectedClient,
      tipoFactura,
      codigoProducto: product.code,
      precio,
      cantidad,
      subtotal: subtotalVenta,
      total: totalVenta,
      productName: product.name,
    };

    // Agregar la nueva venta a la lista de ventas
    setSales([...sales, venta]);

    // Limpiar el formulario
    setSelectedClient('');
    setTipoFactura('');
    setSelectedProduct('');
    setCodigoProducto('');
    setPrecio(0);
    setCantidad(0);
    setSubtotal(0);
    setTotal(0);
    setErrorMensaje(null);
  };

  // Evento para calcular el subtotal, ISV y total
  useEffect(() => {
    const newSubtotal = precio * cantidad;
    const isv = newSubtotal * 0.15;
    const newTotal = newSubtotal + isv;
    setSubtotal(newSubtotal);
    setTotal(newTotal);
  }, [precio, cantidad]);

  const handleProductSelect = (selectedProduct: string) => {
    const product = productList.find((p) => p.name === selectedProduct);
    if (product) {
      setSelectedProduct(product.name);
      setCodigoProducto(product.code);
      setPrecio(product.price);

      // Calcular el subtotal y el total
      const newSubtotal = cantidad * product.price;
      const isv = newSubtotal * 0.15;
      const newTotal = newSubtotal + isv;
      setSubtotal(newSubtotal);
      setTotal(newTotal);
    }
  };

  // Evento para controlar el cambio de cantidad
  const handleCantidadChange = (newCantidad: number) => {
    if (newCantidad >= 0) {
      // Validar que la cantidad no sea menor que 0
      // Validar que la cantidad no sea mayor que el stock disponible
      const product = productList.find((p) => p.name === selectedProduct);
      if (product && newCantidad > product.stock) {
        setErrorCantidad(
          'La cantidad no puede ser mayor que el stock disponible'
        );
      } else {
        setErrorCantidad(null);

        // Actualizar el estado de cantidad con el nuevo valor ingresado
        setCantidad(newCantidad);

        // Calcular el subtotal y el total con la nueva cantidad
        const newSubtotal = newCantidad * precio;
        const isv = newSubtotal * 0.15;
        const newTotal = newSubtotal + isv;
        setSubtotal(newSubtotal);
        setTotal(newTotal);
      }
    } else {
      setErrorCantidad('La cantidad no puede ser menor que 0');
    }
  };

  // ...

  // Evento para el botón de "Pagar Factura" con los nuevos requerimientos
  const handlePagarFacturaClick = () => {
    // Validar que se haya seleccionado un cliente y se haya registrado al menos un producto
    if (!selectedClient || sales.length === 0) {
      setErrorMensaje(
        'Por favor, seleccione un cliente y registre al menos un producto.'
      );
      return;
    }

    // Validar que haya suficientes existencias para los productos vendidos
    let existenciasSuficientes = true;
    const updatedProducts = productList.map((product) => {
      const venta = sales.find((item) => item.codigoProducto === product.code);

      if (venta) {
        if (venta.cantidad > product.stock) {
          // Mostrar un mensaje de error si no hay suficientes existencias
          setErrorMensaje(
            `No hay suficientes existencias para el producto ${product.code}. Existencia actual: ${product.stock}`
          );
          existenciasSuficientes = false;
          return product;
        }

        // Restar la cantidad vendida al stock del producto
        const updatedStock = product.stock - cantidad;
        return { ...product, stock: updatedStock };
      }
      return product;
    });

    if (!existenciasSuficientes) {
      return;
    }

    // Actualizar la lista de productos en el LocalStorage con los nuevos valores de stock
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Agregar la venta actual a la lista de ventas generadas
    setGeneratedSales([...generatedSales, ...sales]);

    // Limpiar el estado de ventas actuales
    setSales([]);

    // Crear un objeto Sale con los datos del formulario
    const subtotalVenta = precio * cantidad;
    const isv = subtotalVenta * 0.15;
    const totalVenta = subtotalVenta + isv;

    const nuevaVenta: Sale = {
      name: selectedClient,
      tipoFactura,
      codigoProducto: codigoProducto, // Usar el código del producto seleccionado
      precio,
      cantidad,
      subtotal: subtotalVenta,
      total: totalVenta,
      productName: selectedProduct, // Usar el nombre del producto seleccionado
    };

    // Agregar la nueva venta a la lista de ventas
    const nuevasVentas = [...sales, nuevaVenta];
    setSales(nuevasVentas);

    // Actualizar 'sales' en el LocalStorage
    localStorage.setItem('sales', JSON.stringify(nuevasVentas));

    // Calcular el subtotal, ISV y total de la factura
    const facturaSubtotal = nuevaVenta.subtotal;
    const facturaISV = isv;
    const facturaTotal = nuevaVenta.total;

    // Crear el contenido de la factura
    const facturaContent = `
      --- Factura ${invoiceCounter} ---
      Cliente: ${selectedClient}
      Tipo de Factura: ${tipoFactura}
  
      --- Detalles ---
      Producto: ${codigoProducto} - ${selectedProduct}
      Cantidad: ${cantidad}
      Precio: ${precio.toFixed(2)}
      Subtotal: ${facturaSubtotal.toFixed(2)}
  
      Subtotal: ${facturaSubtotal.toFixed(2)}
      ISV (15%): ${facturaISV.toFixed(2)}
      Total: ${facturaTotal.toFixed(2)}
    `;

    // Crear el PDF de la factura
    const doc = new jsPDF();
    doc.text(facturaContent, 10, 10);

    // Guardar el PDF en una variable de tipo Blob
    const pdfBlob = doc.output('blob');

    // Crear una URL para el Blob (el PDF)
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Abrir el PDF en una nueva ventana o pestaña
    window.open(pdfUrl);

    // Actualizar el contador de facturas
    setInvoiceCounter((prevCounter) => prevCounter + 1);

    setFacturaGenerada(true);

    // Limpiar el formulario y errores
    setSelectedClient('');
    setTipoFactura('');
    setSelectedProduct('');
    setCodigoProducto('');
    setPrecio(0);
    setCantidad(0);
    setSubtotal(0);
    setTotal(0);
    setErrorMensaje(null);
  };

  // ...

  return (
    <Guard>
      <Container maxWidth="md" style={{ marginTop: '100px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Generar Factura
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="client">Cliente</InputLabel>
                  <Select
                    id="client"
                    label="Cliente"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Seleccionar cliente</em>
                    </MenuItem>
                    {clientList.map((client) => (
                      <MenuItem key={client.name} value={client.name}>
                        {client.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="Consumidor final">
                      Consumidor final
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="invoice-type">
                    Tipo de Factura
                  </InputLabel>
                  <Select
                    id="invoice-type"
                    label="Tipo de Factura"
                    value={tipoFactura}
                    onChange={(e) => setTipoFactura(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Seleccionar tipo</em>
                    </MenuItem>
                    <MenuItem value="Credito">Crédito</MenuItem>
                    <MenuItem value="Contado">Contado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Autocomplete
              id="product"
              options={productList.map((product) => product.name)}
              value={selectedProduct}
              onChange={(_, newValue: any) => setSelectedProduct(newValue)}
              onInputChange={(e, newInputValue) => {
                setSelectedProduct(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Producto"
                  fullWidth
                  variant="outlined"
                  style={{ marginTop: '20px' }}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  onBlur={(e) => handleProductSelect(e.target.value)}
                />
              )}
            />

            <TextField
              id="product-code"
              label="Código de Producto"
              fullWidth
              variant="outlined"
              value={codigoProducto}
              onChange={(e) => setCodigoProducto(e.target.value)}
              style={{ marginTop: '20px' }}
            />
            <TextField
              id="price"
              label="Precio"
              fullWidth
              variant="outlined"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              style={{ marginTop: '20px' }}
            />
            {errorCantidad && (
              <Typography variant="body2" color="error">
                {errorCantidad}
              </Typography>
            )}
            <TextField
              id="quantity"
              label="Cantidad"
              fullWidth
              variant="outlined"
              type="number"
              value={cantidad}
              onChange={(e) => handleCantidadChange(Number(e.target.value))}
              style={{ marginTop: '20px' }}
            />
            <TextField
              id="subtotal"
              label="Subtotal"
              fullWidth
              variant="outlined"
              value={subtotal.toFixed(2)}
              InputProps={{
                readOnly: true,
              }}
              style={{ marginTop: '20px' }}
            />
            <TextField
              id="total"
              label="Total"
              fullWidth
              variant="outlined"
              value={total.toFixed(2)}
              InputProps={{
                readOnly: true,
              }}
              style={{ marginTop: '20px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegisterClientClick}
              style={{ marginTop: '20px' }}
            >
              Registrar Cliente
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handlePagarFacturaClick}
              disabled={facturaGenerada}
              style={{ marginTop: '20px', marginLeft: '10px' }}
            >
              Generar Factura
            </Button>
          </form>
        </Paper>
      </Container>
    </Guard>
  );
};

export default Factura;
