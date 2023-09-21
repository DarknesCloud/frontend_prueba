import React, { useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, ChartTypeRegistry } from 'chart.js/auto';

interface DashboardProps {
  // Define las propiedades del componente si es necesario
}

const Dashboard: React.FC<DashboardProps> = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  let myChart: any;

  useEffect(() => {
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
    }
  }, []);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Dashboard;
