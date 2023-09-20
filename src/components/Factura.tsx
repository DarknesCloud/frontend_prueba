import React, { useState, useEffect } from 'react';

// Define una interfaz para el cliente
interface Client {
  name: string;
  // Agrega otros campos necesarios para un cliente
}
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
  const [codigoProducto, setCodigoProducto] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('');
  const [subtotal, setSubtotal] = useState<string>('');
  const [total, setTotal] = useState<string>('');

  // Estados para la lista de clientes y ventas
  const [clientList, setClientList] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Cargar la lista de clientes del LocalStorage al cargar el componente
  useEffect(() => {
    const clients = getClientListFromLocalStorage();
    setClientList(clients);
  }, []);

  // Evento para el botón de registrar cliente
  const handleRegisterClientClick = () => {
    // Crear un objeto Sale con los datos del formulario
    const clientData: Sale = {
      name: selectedClient,
      tipoFactura,
      codigoProducto,
      precio: parseFloat(precio),
      cantidad: parseFloat(cantidad),
      subtotal: parseFloat(subtotal),
      total: parseFloat(total),
    };

    // Agregar la nueva venta a la lista de ventas
    setSales([...sales, clientData]);

    // Guardar las ventas actualizadas en el LocalStorage
    localStorage.setItem('sales', JSON.stringify([...sales, clientData]));

    // Limpiar el formulario
    setSelectedClient('');
    setTipoFactura('');
    setCodigoProducto('');
    setPrecio('');
    setCantidad('');
    setSubtotal('');
    setTotal('');
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
            type="text"
            id="price"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>
        {/* Campo para la cantidad */}
        <div className="mb-3">
          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="text"
            id="quantity"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        {/* Campo para el subtotal */}
        <div className="mb-3">
          <label htmlFor="subtotal">Subtotal:</label>
          <input
            type="text"
            id="subtotal"
            value={subtotal}
            onChange={(e) => setSubtotal(e.target.value)}
          />
        </div>
        {/* Campo para el total */}
        <div className="mb-3">
          <label htmlFor="total">Total:</label>
          <input
            type="text"
            id="total"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />
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
