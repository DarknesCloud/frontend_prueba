import './App.css';
import { ClientCrud, Login, ProductCrud, Register } from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Importa los componentes de React Router

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Puedes agregar un encabezado común aquí */}
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />{' '}
            <Route path="/register" element={<Register />} />{' '}
            <Route path="/products" element={<ProductCrud />} />
            <Route path="/clients" element={<ClientCrud />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
