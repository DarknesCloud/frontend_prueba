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
  Store,
  TopBar,
  UserCrud,
  VentasCrud,
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
      <Route path="/dashboard/users" element={<UserCrud />} />
      <Route path="/dashboard/products" element={<ProductCrud />} />
      <Route path="/dashboard/clients" element={<ClientCrud />} />
      <Route path="/dashboard/ventas" element={<VentasCrud />} />
      <Route path="/dashboard/invoice" element={<Factura />} />
      <Route path="/dashboard/tienda" element={<Store />} />
    </Routes>
  );
}

export default App;
