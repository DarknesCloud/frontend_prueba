import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  ClientCrud,
  Dashboard,
  Factura,
  Login,
  ProductCrud,
  Register,
  Sidebar,
  TopBar,
} from './pages';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Puedes agregar un encabezado común aquí */}
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard/*"
              element={
                <div style={{ display: 'flex' }}>
                  <Sidebar />
                  <TopBar />
                  <DashboardRoutes />
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<ProductCrud />} />
      <Route path="/clients" element={<ClientCrud />} />
      <Route path="/invoice" element={<Factura />} />
      {/* Agrega tus otras rutas aquí */}
    </Routes>
  );
}

export default App;
