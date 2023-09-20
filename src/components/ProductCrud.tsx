import React, { useState, useEffect } from 'react';

interface Product {
  name: string;
  code: string; // Nuevo campo: Código de Producto
  stock: number;
  price: number;
  quantity: number; // Nuevo campo: Cantidad
  total: number;
}

const ProductCrud: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [productCode, setProductCode] = useState<string>(''); // Nuevo campo: Código de Producto
  const [productStock, setProductStock] = useState<number>(0);
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productQuantity, setProductQuantity] = useState<number>(0); // Nuevo campo: Cantidad

  useEffect(() => {
    // Cargar la lista de productos desde el LocalStorage al iniciar el componente
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(savedProducts);
  }, []);

  useEffect(() => {
    // Guardar la lista de productos en el LocalStorage cuando cambie
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
      code: productCode, // Nuevo campo: Código de Producto
      stock: productStock,
      price: productPrice,
      quantity: productQuantity, // Nuevo campo: Cantidad
      total: productStock * productPrice,
    };

    setProducts([...products, newProduct]);

    setProductName('');
    setProductCode(''); // Nuevo campo: Limpiar Código de Producto
    setProductStock(0);
    setProductPrice(0);
    setProductQuantity(0); // Nuevo campo: Limpiar Cantidad
  };

  const deleteProduct = (index: number) => {
    const updatedProducts: Product[] = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <div className="container">
      <h2>CRUD de Productos</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productCode" className="form-label">
            Código de Producto {/* Nuevo campo */}
          </label>
          <input
            type="text"
            className="form-control"
            id="productCode"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productStock" className="form-label">
            Existencias
          </label>
          <input
            type="number"
            className="form-control"
            id="productStock"
            value={productStock}
            onChange={(e) => setProductStock(Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productPrice" className="form-label">
            Precio
          </label>
          <input
            type="number"
            className="form-control"
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productQuantity" className="form-label">
            Cantidad {/* Nuevo campo */}
          </label>
          <input
            type="number"
            className="form-control"
            id="productQuantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(Number(e.target.value))}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={addProduct}>
          Agregar Producto
        </button>
      </form>
      <h3>Lista de Productos</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código de Producto</th> {/* Nuevo campo */}
            <th>Existencias</th>
            <th>Precio</th>
            <th>Cantidad</th> {/* Nuevo campo */}
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.code}</td> {/* Nuevo campo */}
              <td>{product.stock}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td> {/* Nuevo campo */}
              <td>{product.total}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deleteProduct(index)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductCrud;
