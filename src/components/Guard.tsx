// Guard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function Guard({ children }: { children: React.ReactNode }) {
  // Verificar si existe una sesión en el SessionStorage
  const userSession = JSON.parse(sessionStorage.getItem('userSession') || '{}');
  if (!userSession.token) {
    // Si no hay una sesión válida, redirigir al inicio de sesión o registro
    return <Navigate to="/" />;
  }

  // Si hay una sesión válida, mostrar el contenido de la ruta protegida
  return <>{children}</>;
}

export default Guard;
