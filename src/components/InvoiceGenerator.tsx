import React, { useState, useEffect } from 'react';

// Obtener la lista de productos desde el LocalStorage
function getProductListFromLocalStorage() {
  const productList = localStorage.getItem('productList');
  return productList ? JSON.parse(productList) : [];
}

// Calcular el subtotal de un producto
function calculateProductSubtotal(price, quantity) {
  return price * quantity;
}

const Invoice = () => {
  const [client, setClient] = useState('');
  const [clientList, setClientList] = useState([]);
  const [invoiceType, setInvoiceType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState(0);
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isv, setIsv] = useState(0);
  const [total, setTotal] = useState(0);
  const [stockError, setStockError] = useState('');

  // Obtener la lista de clientes del LocalStorage al cargar el componente
  useEffect(() => {
    const clientsFromLocalStorage = localStorage.getItem('clientList');
    setClientList(
      clientsFromLocalStorage ? JSON.parse(clientsFromLocalStorage) : []
    );
  }, []);

  // Event handler para cuando se selecciona un cliente
  const handleClientChange = (event) => {
    const selectedClient = event.target.value;
    setClient(selectedClient);
  };

  // Event handler para cuando se selecciona un producto
  const handleProductChange = (event) => {
    const selectedProduct = event.target.value;
    setSelectedProduct(selectedProduct);
    const productList = getProductListFromLocalStorage();
    const selectedProductInfo = productList.find(
      (product) => product.name === selectedProduct
    );
    if (selectedProductInfo) {
      setProductQuantity(1); // Restablecer la cantidad a 1 al seleccionar un nuevo producto
      // Actualizar el precio en base al producto seleccionado
      setSubtotal(selectedProductInfo.price);
    }
  };

  // Event handler para cuando se cambia la cantidad de productos
  const handleQuantityChange = (event) => {
    const quantity = parseInt(event.target.value, 10);
    setProductQuantity(quantity);
    const productList = getProductListFromLocalStorage();
    const selectedProductInfo = productList.find(
      (product) => product.name === selectedProduct
    );
    if (selectedProductInfo) {
      // Calcular el subtotal en base a la cantidad ingresada
      setSubtotal(
        calculateProductSubtotal(selectedProductInfo.price, quantity)
      );
    }
  };

  // Event handler para agregar productos al detalle de la factura
  const handleAddProduct = () => {
    const productList = getProductListFromLocalStorage();
    const selectedProductInfo = productList.find(
      (product) => product.name === selectedProduct
    );

    if (!selectedProductInfo) {
      return; // Manejar el caso en que el producto no se encuentre en la lista
    }

    // Verificar si hay suficiente existencia del producto
    if (selectedProductInfo.stock >= productQuantity) {
      // Actualizar la existencia del producto en el LocalStorage restando la cantidad vendida
      selectedProductInfo.stock -= productQuantity;
      localStorage.setItem('productList', JSON.stringify(productList));

      // Crear un objeto para representar el producto en el detalle de la factura
      const newProduct = {
        name: selectedProduct,
        quantity: productQuantity,
        price: selectedProductInfo.price,
        subtotal: calculateProductSubtotal(
          selectedProductInfo.price,
          productQuantity
        ),
      };

      // Agregar el producto al estado de productos en la factura
      setProducts([...products, newProduct]);

      // Calcular los totales
      const newSubtotal = subtotal + newProduct.subtotal;
      const newIsv = newSubtotal * 0.15;
      const newTotal = newSubtotal + newIsv;

      // Actualizar los totales
      setSubtotal(newSubtotal);
      setIsv(newIsv);
      setTotal(newTotal);

      // Limpiar los campos de selección de producto y cantidad
      setSelectedProduct('');
      setProductQuantity(0);

      // Limpiar el mensaje de error de stock
      setStockError('');
    } else {
      // Mostrar un mensaje de error si no hay suficiente existencia
      setStockError(
        `No hay suficiente existencia. Existencia actual: ${selectedProductInfo.stock}`
      );
    }
  };

  // Event handler para pagar la factura
  const handlePayInvoice = () => {
    // Aquí puedes implementar la lógica para pagar la factura y restar las cantidades vendidas
    // a las existencias de los productos en el LocalStorage.
  };

  return (
    <div>
      <h2>Generar Factura</h2>
      <form>
        {/* Campo de selección de cliente */}
        <div className="mb-3">
          <label>Cliente:</label>
          <select
            className="form-select"
            value={client}
            onChange={handleClientChange}
          >
            <option value="">Seleccionar cliente</option>
            {clientList.map((client) => (
              <option key={client.name} value={client.name}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        {/* Campo de tipo de factura */}
        <div className="mb-3">
          <label>Tipo de Factura:</label>
          <select
            className="form-select"
            value={invoiceType}
            onChange={(e) => setInvoiceType(e.target.value)}
          >
            <option value="">Seleccionar tipo</option>
            <option value="Credito">Crédito</option>
            <option value="Contado">Contado</option>
          </select>
        </div>
        {/* Campo de selección de producto */}
        <div className="mb-3">
          <label>Producto:</label>
          <select
            className="form-select"
            value={selectedProduct}
            onChange={handleProductChange}
          >
            <option value="">Seleccionar producto</option>
            {/* Aquí puedes llenar la lista de productos desde el LocalStorage */}
          </select>
        </div>
        {/* Campo de cantidad de productos */}
        <div className="mb-3">
          <label>Cantidad:</label>
          <input
            type="number"
            className="form-control"
            value={productQuantity}
            onChange={handleQuantityChange}
          />
        </div>
        {/* Botón para agregar productos */}
        <button type="button" onClick={handleAddProduct}>
          Agregar Producto
        </button>
        {/* Mostrar mensaje de error de stock */}
        {stockError && <p className="text-danger">{stockError}</p>}
        {/* Detalle de la factura */}
        <div className="mt-4">
          <h3>Detalle de Factura</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>{product.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Totales */}
        <div className="mt-4">
          <p>Subtotal: ${subtotal}</p>
          <p>ISV (15%): ${isv}</p>
          <p>Total a Pagar: ${total}</p>
        </div>
        {/* Botón para pagar factura */}
        <button type="button" onClick={handlePayInvoice}>
          Pagar Factura
        </button>
      </form>
    </div>
  );
};

export default Invoice;
