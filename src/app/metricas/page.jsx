'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, ShoppingBag, AlertCircle, Clock, RefreshCcw } from 'lucide-react';

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      // Reemplazar con tu URL real
      const response = await fetch('https://sellercenter-api.falabella.com?Action=GetMetrics&Format=XML&Timestamp=2024-12-04T22%3A23%3A56-03%3A00&UserID=ventasdigital2@cruzeirogomas.cl&Version=1.0&Signature=f4b1da31fe6c661377e9941a5daeb3892df8c512', {
        headers: {
          'Accept': 'application/xml',
          // otros headers necesarios
        }
      });
      console.log(response)
      const xmlText = await response.text(); // Obtenemos el texto XML
      
      // Parseamos el XML a un objeto DOM
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Función auxiliar para convertir XML a JSON
      const xmlToJson = (xml) => {
        const metrics = [];
        const metricsNodes = xml.getElementsByTagName('MetricsType');
        
        for (let i = 0; i < metricsNodes.length; i++) {
          const metric = {
            StatisticsType: metricsNodes[i].getElementsByTagName('StatisticsType')[0]?.textContent || '',
            SkuNumber: metricsNodes[i].getElementsByTagName('SkuNumber')[0]?.textContent || '0',
            SkuActive: metricsNodes[i].getElementsByTagName('SkuActive')[0]?.textContent || '0',
            SalesTotal: metricsNodes[i].getElementsByTagName('SalesTotal')[0]?.textContent || '0',
            Orders: metricsNodes[i].getElementsByTagName('Orders')[0]?.textContent || '0',
            Commissions: metricsNodes[i].getElementsByTagName('Commissions')[0]?.textContent || '0',
            TwoDayShipmentPercentage: metricsNodes[i].getElementsByTagName('TwoDayShipmentPercentage')[0]?.textContent || '0',
            ReturnsPercentage: metricsNodes[i].getElementsByTagName('ReturnsPercentage')[0]?.textContent || '0',
            CancellationsPercentage: metricsNodes[i].getElementsByTagName('CancellationsPercentage')[0]?.textContent || '0'
          };
          metrics.push(metric);
        }
        
        return metrics;
      };
  
      const metricsData = xmlToJson(xmlDoc);
      setMetrics(metricsData);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los datos');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <RefreshCcw className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen text-destructive">
      <AlertCircle className="mr-2" /> {error}
    </div>
  );

  const timeFrameData = metrics?.map(metric => ({
    periodo: metric.StatisticsType,
    ventas: parseFloat(metric.SalesTotal),
    ordenes: parseInt(metric.Orders),
    envios2dias: parseFloat(metric.TwoDayShipmentPercentage),
    devoluciones: parseFloat(metric.ReturnsPercentage)
  }));

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Dashboard de Métricas</h1>

        {/* Métricas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Ventas Totales</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">
              ${(parseFloat(metrics[0].SalesTotal)).toLocaleString('es-CL')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Histórico total</p>
          </div>

          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium">SKUs Activos</h3>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{metrics[0].SkuNumber}</div>
            <p className="text-xs text-muted-foreground mt-1">Productos totales</p>
          </div>

          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Órdenes</h3>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{metrics[0].Orders}</div>
            <p className="text-xs text-muted-foreground mt-1">Pedidos totales</p>
          </div>

          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Envíos 2 días</h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{metrics[0].TwoDayShipmentPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">Tasa de envío rápido</p>
          </div>
        </div>

        {/* Gráficos de Rendimiento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Ventas por Periodo</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeFrameData}>
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventas" fill="#F04132" name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Métricas de Rendimiento</h3>
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold capitalize mb-2">{metric.StatisticsType}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Devoluciones</p>
                      <p className="font-medium">{metric.ReturnsPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cancelaciones</p>
                      <p className="font-medium">{metric.CancellationsPercentage}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;

