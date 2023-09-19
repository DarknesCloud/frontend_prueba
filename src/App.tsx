import './App.css';
import { Login, ProductCrud, Register } from './pages';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'; // Importa los componentes de React Router

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
            {/* Ruta para el componente de inicio de sesión */}
            <Route path="/register" element={<Register />} />{' '}
            {/* Ruta para el componente de registro */}
            <Route path="/products" element={<ProductCrud />} />
            {/* Ruta para el componente ProductCrud */}
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
