import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  ClientCrud,
  Dashboard,
  Factura,
  Login,
  ProductCrud,
  Register,
  RegisterAdmin,
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
            <Route path="/registerAdmin" element={<RegisterAdmin />} />
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
      <Route path="/dashboard/products" element={<ProductCrud />} />
      <Route path="/dashboard/clients" element={<ClientCrud />} />
      <Route path="/dashboard/invoice" element={<Factura />} />
    </Routes>
  );
}

export default App;
