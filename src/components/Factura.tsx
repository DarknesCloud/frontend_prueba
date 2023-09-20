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

  // Estado para controlar la cantidad y el mensaje de error
  const [errorCantidad, setErrorCantidad] = useState<string | null>(null);

  // Estados para la lista de clientes y ventas
  const [clientList, setClientList] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);

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
    // Crear un objeto Sale con los datos del formulario
    const clientData: Sale = {
      name: selectedClient,
      tipoFactura,
      codigoProducto,
      precio,
      cantidad,
      subtotal,
      total,
    };

    // Agregar la nueva venta a la lista de ventas
    setSales([...sales, clientData]);

    // Guardar las ventas actualizadas en el LocalStorage
    localStorage.setItem('sales', JSON.stringify([...sales, clientData]));

    // Limpiar el formulario
    setSelectedClient('');
    setTipoFactura('');
    setSelectedProduct('');
    setCodigoProducto('');
    setPrecio(0);
    setCantidad(0);
    setSubtotal(0);
    setTotal(0);
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
        setCantidad(newCantidad); // Actualizar la cantidad si la validación es exitosa
      }
    } else {
      setErrorCantidad('La cantidad no puede ser menor que 0');
    }
  };

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
        <button type="button">Limpiar</button>
      </form>
    </div>
  );
};

export default Factura;
