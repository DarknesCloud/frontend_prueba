import React, { useEffect, useRef, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Box, Grid } from '@mui/material';
import { ExitToApp, People, ShoppingCart, Store } from '@mui/icons-material';
import Guard from './Guard';
import StatCard from './StatCard';

interface DashboardProps {
  // Define las propiedades del componente si es necesario
}

const Dashboard: React.FC<DashboardProps> = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  let myChart: any;

  const [clientCount, setClientCount] = useState<number>(0);
  const [saleCount, setSaleCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const clientsDataString = localStorage.getItem('clients');
    const productsDataString = localStorage.getItem('products');
    const usersDataString = localStorage.getItem('users');

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Extraer datos del LocalStorage
      const salesDataString = localStorage.getItem('sales');
      let contadoCount = 0;
      let creditoCount = 0;

      if (salesDataString) {
        const salesData = JSON.parse(salesDataString);

        // Contar registros con "contado" y "credito"
        for (const sale of salesData) {
          if (sale.tipoFactura === 'Contado') {
            contadoCount++;
          } else if (sale.tipoFactura === 'Credito') {
            creditoCount++;
          }
        }
      }

      // Datos para el gráfico
      const data = {
        labels: ['Contado', 'Crédito'],
        datasets: [
          {
            data: [contadoCount, creditoCount],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 205, 86, 0.6)',
            ],
          },
        ],
      };

      // Destruye el gráfico anterior si existe
      if (myChart) {
        myChart.destroy();
      }

      // Configuración del gráfico
      const chartConfig: ChartConfiguration<'doughnut', number[], string> = {
        type: 'doughnut',
        data: data,
      };

      // Crea el nuevo gráfico de dona y almacena la referencia en myChart
      myChart = new Chart(ctx as CanvasRenderingContext2D, chartConfig);

      if (clientsDataString) {
        const clientsData = JSON.parse(clientsDataString);
        setClientCount(clientsData.length);
      }

      if (salesDataString) {
        const salesData = JSON.parse(salesDataString);
        setSaleCount(salesData.length);
      }

      if (productsDataString) {
        const productsData = JSON.parse(productsDataString);
        setProductCount(productsData.length);
      }

      if (usersDataString) {
        const usersData = JSON.parse(usersDataString);
        setUserCount(usersData.length);
      }
    }
  }, []);

  return (
    <div className="containerDashboard">
      <Guard>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box flexGrow={1} width="100%">
            <Grid
              container
              spacing={6}
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Clientes"
                  icon={<People />}
                  value={clientCount}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Ventas"
                  icon={<ShoppingCart />}
                  value={saleCount}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Productos"
                  icon={<Store />}
                  value={productCount}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Usuarios"
                  icon={<ExitToApp />}
                  value={userCount}
                />
              </Grid>
            </Grid>
          </Box>
          <div className="chartjsContainer">
            <Box m={2}>
              <canvas ref={chartRef}></canvas>
            </Box>
          </div>
        </Box>
      </Guard>
    </div>
  );
};

export default Dashboard;
