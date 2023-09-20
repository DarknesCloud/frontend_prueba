import jsPDF from 'jspdf';
import { useState, useEffect } from 'react';

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

  // Estado para controlar la cantidad y el mensaje de error
  const [errorCantidad, setErrorCantidad] = useState<string | null>(null);

  // Estados para la lista de clientes y ventas
  const [clientList, setClientList] = useState<Client[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Estado para mantener un contador de facturas
  const [invoiceCounter, setInvoiceCounter] = useState<number>(1);

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

    // Calcular el subtotal, ISV y total de la factura
    const facturaSubtotal = sales[0].subtotal * cantidad;
    const isv = facturaSubtotal * 0.15;
    const facturaTotal = facturaSubtotal + isv;

    // Crear una factura independiente para cada venta
    sales.forEach((venta, index) => {
      const productName = productList.find(
        (product) => product.code === venta.codigoProducto
      )?.name;

      const factura = `
      --- Factura ${invoiceCounter + index} ---
      Cliente: ${venta.name}
      Tipo de Factura: ${venta.tipoFactura}
      
      --- Detalles ---
      Producto: ${venta.codigoProducto} - ${productName}
      Cantidad: ${cantidad}
      Precio: ${venta.precio.toFixed(2)}
      Subtotal: ${facturaSubtotal}
      
      Subtotal: ${facturaSubtotal}
      ISV (15%): ${isv.toFixed(2)}
      Total: ${facturaTotal.toFixed(2)}
    `;

      const doc = new jsPDF();

      // Agregar el contenido de la factura al PDF
      doc.text(factura, 10, 10);

      // Guardar el PDF en una variable de tipo Blob
      const pdfBlob = doc.output('blob');

      // Crear una URL para el Blob (el PDF)
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Abrir el PDF en una nueva ventana o pestaña
      window.open(pdfUrl);

      // Actualizar el contador de facturas
      setInvoiceCounter((prevCounter) => prevCounter + 1);
    });

    // Limpiar la lista de ventas
    setSales([]);

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
    <div>
      <h2>Generar Factura</h2>
      <form>
        {/* Campo de selección de cliente */}
        <div className="mb-3">
          <label htmlFor="client">Cliente:</label>
          <select
            id="client"
            className="form-select"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Seleccionar cliente</option>
            {clientList.map((client) => (
              <option key={client.name} value={client.name}>
                {client.name}
              </option>
            ))}
            <option>Consumidor final</option>
          </select>
        </div>
        {/* Campo para el tipo de factura (Crédito / Contado) */}
        <div className="mb-3">
          <label htmlFor="invoice-type">Tipo de Factura:</label>
          <select
            id="invoice-type"
            className="form-select"
            value={tipoFactura}
            onChange={(e) => setTipoFactura(e.target.value)}
          >
            <option value="">Seleccionar tipo</option>
            <option value="Credito">Crédito</option>
            <option value="Contado">Contado</option>
          </select>
        </div>
        {/* Campo para el producto */}
        <div className="mb-3">
          <label htmlFor="product">Producto:</label>
          <input
            type="text"
            id="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            onBlur={(e) => handleProductSelect(e.target.value)}
          />
        </div>
        {/* Campo para el código de producto */}
        <div className="mb-3">
          <label htmlFor="product-code">Código de Producto:</label>
          <input
            type="text"
            id="product-code"
            value={codigoProducto}
            onChange={(e) => setCodigoProducto(e.target.value)}
          />
        </div>
        {/* Campo para el precio */}
        <div className="mb-3">
          <label htmlFor="price">Precio:</label>
          <input
            type="number"
            id="price"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
          />
        </div>
        {/* Campo para la cantidad */}
        {errorCantidad && <p className="text-danger">{errorCantidad}</p>}
        <div className="mb-3">
          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            value={cantidad}
            onChange={(e) => handleCantidadChange(Number(e.target.value))}
          />
        </div>
        {/* Campo para el subtotal */}
        <div className="mb-3">
          <label htmlFor="subtotal">Subtotal:</label>
          <input
            type="text"
            id="subtotal"
            value={subtotal.toFixed(2)}
            readOnly
          />
        </div>
        {/* Campo para el total */}
        <div className="mb-3">
          <label htmlFor="total">Total:</label>
          <input type="text" id="total" value={total.toFixed(2)} readOnly />
        </div>
        {/* Botón para registrar un nuevo cliente */}
        <button type="button" onClick={handleRegisterClientClick}>
          Registrar Cliente
        </button>
        {/* Botón para limpiar el formulario */}
        <button type="button" onClick={handlePagarFacturaClick}>
          Generar Factura
        </button>
      </form>
    </div>
  );
};

export default Factura;
