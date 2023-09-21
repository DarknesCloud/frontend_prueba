import React, { useState, useEffect } from 'react';
import Guard from './Guard';

interface Client {
  name: string;
  rtn: string;
  address: string;
}

const ClientCrud: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientName, setClientName] = useState<string>('');
  const [clientRtn, setClientRtn] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');

  useEffect(() => {
    // Cargar la lista de clientes desde el LocalStorage al iniciar el componente
    const savedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    setClients(savedClients);
  }, []);

  useEffect(() => {
    // Guardar la lista de clientes en el LocalStorage cuando cambie
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const addClient = () => {
    if (!clientName || !clientRtn || !clientAddress) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const newClient: Client = {
      name: clientName,
      rtn: clientRtn,
      address: clientAddress,
    };

    setClients([...clients, newClient]);

    setClientName('');
    setClientRtn('');
    setClientAddress('');
  };

  const deleteClient = (index: number) => {
    const updatedClients: Client[] = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
  };

  return (
    <Guard>
      <div className="container">
        <h2>CRUD de Clientes</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="clientName" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="clientRtn" className="form-label">
              RTN
            </label>
            <input
              type="text"
              className="form-control"
              id="clientRtn"
              value={clientRtn}
              onChange={(e) => setClientRtn(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="clientAddress" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              className="form-control"
              id="clientAddress"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={addClient}>
            Agregar Cliente
          </button>
        </form>
        <h3>Lista de Clientes</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RTN</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={index}>
                <td>{client.name}</td>
                <td>{client.rtn}</td>
                <td>{client.address}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteClient(index)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Guard>
  );
};

export default ClientCrud;
