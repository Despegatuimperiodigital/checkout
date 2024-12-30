  
 const apiUrl = 'https://api.shipit.cl/v/communes';
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/vnd.shipit.v4",
    "X-Shipit-Email": "gabriel.jofre@cruzeiroempresas.cl",
    "X-Shipit-Access-Token": "VuXw5Yo98WczGy3uxiyz"
  };
  

  export const cargarRegiones =  async (setComunasData, setRegions) => {
    try {
      const response = await fetch(apiUrl, { headers });
      const data = await response.json();
      setComunasData(data);
      const uniqueRegions = [...new Set(data.map(commune => commune.region_name))].map(region => {
        return { 
          id: data.find(commune => commune.region_name === region).region_id, 
          name: region 
        };
      });
      
      setRegions(uniqueRegions);
      console.log('Regiones cargadas correctamente');
    } catch (error) {
      console.error('Error al cargar regiones:', error);
    } 
  };