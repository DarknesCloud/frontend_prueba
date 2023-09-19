import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Verificamos que los campos no estén vacíos
    if (!email || !password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // Obtenemos los usuarios almacenados en el LocalStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Buscamos el usuario por el email
    const user = users.find((u: any) => u.email === email);

    // Verificamos si el usuario existe y la contraseña coincide
    if (user && user.password === password) {
      // Verificamos si el usuario tiene un token válido
      if (user.token) {
        // Inicio de sesión exitoso
        alert('Inicio de sesión exitoso');
        // Guardar el token de sesión en el LocalStorage
        localStorage.setItem('token', user.token);
        // Redirigir al usuario a la vista de ProductCrud
        return <Navigate to="/products" />;
      } else {
        alert('Usuario no autorizado');
      }
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleLogin}>
          Iniciar Sesión
        </button>
        <Link to="/register">Registrarse</Link>{' '}
      </form>
    </div>
  );
};

export default Login;
