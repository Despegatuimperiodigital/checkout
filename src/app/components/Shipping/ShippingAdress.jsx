import { cargarRegiones } from '../../../utils/cargarRegiones';
import { useState, useCallback, useEffect } from 'react';
import React from 'react'
import LoadingSpinner from '../Ui/LoadingSpinner';

export const ShippingAdress = ({personalInfo ,setPersonalInfo ,type, loading ,setLoading, shippingDetails, setShippingDetails, handleComunaChange, comunas, setComunas}) => {

    const [comunasData, setComunasData] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loadingComunas, setLoadingComunas] = useState(false);

    const cargarRegionesCallBack = useCallback( () => {
      setLoading(true)
      cargarRegiones(setComunasData, setRegions);

      setLoading(false)
    },  [setLoading, setComunasData, setRegions])

  useEffect(() => {
  
    cargarRegionesCallBack();

  }, [])


  useEffect(() => {
    if (shippingDetails.region && comunasData.length > 0) {
      setLoadingComunas(true);
      const communes = comunasData.filter(commune => commune.region_id == shippingDetails.region);
      setComunas(communes);
      
      const selectedRegion = regions.find(r => r.id === parseInt(shippingDetails.region));
      if (selectedRegion) {
        setShippingDetails(prev => ({
          ...prev,
          ws_region_name: selectedRegion.name,
          ws_region_id: shippingDetails.region,
          comuna: '',
          ws_comuna_name: '',
          ws_comuna_id: '',
          shipping_cost: 0
        }));
      }
      setLoadingComunas(false);
    }
  }, [shippingDetails.region, comunasData, regions]);


  if (!shippingDetails) {
    return <LoadingSpinner/>
  }



  return (
      <>
        <div className='my-1'>
          <label htmlFor="address" className="block text-sm font-medium mb-2 text-[#397e4c]">
            Dirección {type === 'business' && ("de Facturación")}
          </label>
          <input
            type="text"
            id="address"
            className="w-full p-3 border border-[#676767] rounded-lg bg-[#353535] text-[#ffffff] placeholder-[#676767] focus:ring-2 focus:ring-[#5da872]"
            value={shippingDetails.address}
            onChange={(e) => {
              setShippingDetails({
                ...shippingDetails,
                address: e.target.value,
              });
              if (personalInfo) {
                setPersonalInfo({ ...personalInfo, businessBilling: e.target.value });
              }
            }}
            required
            placeholder="Calle, número, depto/casa"
          />
        </div>
        <div>
          <label htmlFor="region" className="block text-sm font-medium mb-2 text-[#397e4c]">
            Región
          </label>
          <select
            id="region"
            className="w-full p-3 border border-[#676767] rounded-lg bg-[#353535] text-[#ffffff] focus:ring-2 focus:ring-[#5da872]"
            value={shippingDetails.region}
            onChange={(e) => {
              const selectedRegion = regions.find(r => r.id === parseInt(e.target.value));
              setShippingDetails(prev => ({
                ...prev,
                region: e.target.value,
                ws_region_id: e.target.value,
                ws_region_name: selectedRegion ? selectedRegion.name : '',
                comuna: '',
                ws_comuna_id: '',
                ws_comuna_name: ''
              }));
              setPersonalInfo({...personalInfo, businessRegion: selectedRegion.name})
            }}
            required
            disabled={loading} // Deshabilitar mientras carga

          >
            <option value="">Selecciona una región</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comuna" className="block text-sm font-medium mb-2 text-[#397e4c]">
            Comuna
          </label>
          {loadingComunas ? (
            <div className="w-full p-3 border border-[#676767] rounded-lg bg-[#353535] text-[#ffffff] flex items-center justify-center">
              <div className="w-full bg-[#676767] rounded-full h-2">
                <div
                  className="bg-[#5da872] h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: '50%' }}
                ></div>
              </div>
              <span className="ml-2 text-sm">Cargando comunas...</span>
            </div>
          ) : (
            <select
              id="comuna"
              className="w-full p-3 border border-[#676767] rounded-lg bg-[#353535] text-[#ffffff] focus:ring-2 focus:ring-[#5da872]"
              value={shippingDetails.comuna}
              onChange={(e) => {
                const selectedComuna = comunas.find(c => c.id === parseInt(e.target.value));
                if (selectedComuna) {
                  setShippingDetails(prev => ({
                    ...prev,
                    comuna: e.target.value,
                    ws_comuna_name: selectedComuna.name,
                    ws_comuna_id: selectedComuna.id
                  }));
                  if (handleComunaChange) {
                    handleComunaChange(e)
                  }
                  if (personalInfo) {

                    setPersonalInfo({...personalInfo, businessComune: selectedComuna.name})
                  }
                }
              }}
              required
              disabled={loadingComunas || !shippingDetails.region } // Deshabilitar mientras carga o no hay región seleccionada

            >
              <option value="">Selecciona una comuna</option>
              {comunas.map(comuna => (
                <option key={comuna.id} value={comuna.id}>
                  {comuna.name}
                </option>
              ))}
            </select>
          )}
        </div>
 
      </>
  ) 
  
}

export default ShippingAdress
