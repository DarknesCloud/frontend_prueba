import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Verificamos que los campos no estén vacíos
    if (!name || !email || !password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // Verificamos si el usuario ya existe en el LocalStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      alert('El usuario ya está registrado.');
      return;
    }

    // Generamos un token aleatorio para el usuario
    const token = generateRandomToken();

    // Creamos un nuevo usuario con el token y lo almacenamos en el LocalStorage
    const newUser = { name, email, password, token };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso');
  };

  // Genera un token aleatorio
  const generateRandomToken = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  return (
    <div className="container">
      <h2>Registro</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRegister}
        >
          Registrarse
        </button>
      </form>
      <Link to="/">Volver</Link>{' '}
      {/* Agrega un enlace a la página de registro */}
    </div>
  );
};

export default Register;
