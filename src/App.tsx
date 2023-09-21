import './App.css';
import {
  ClientCrud,
  Dashboard,
  Factura,
  Login,
  ProductCrud,
  Register,
} from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; // Importa el componente PrivateRoute

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
            <PrivateRoute path="/products" element={<ProductCrud />} />
            <PrivateRoute path="/clients" element={<ClientCrud />} />
            <PrivateRoute path="/invoice" element={<Factura />} />
            <PrivateRoute path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
