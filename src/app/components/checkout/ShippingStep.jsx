'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shippingCosts, isWithinAmericoVespucioRing } from '../../data/shipping-costs';
import { Package, Truck, Clock, Headphones, AlertCircle } from 'lucide-react';

export default function ShippingStep({ nextStep, prevStep, updateOrderData, orderData }) {
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    region: '',
    comuna: '',
    additionalInfo: '',
    type: 'delivery',
    ws_region_name: '',
    ws_region_id: '',
    ws_comuna_name: '',
    ws_comuna_id: '',
    shipping_cost: 0,
    shipping_method: ''
  });

  const [shippingCost, setShippingCost] = useState(0);
  const [regions, setRegions] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loadingComunas, setLoadingComunas] = useState(false);
  const [comunasData, setComunasData] = useState([]);
  const [showWeightPopup, setShowWeightPopup] = useState(false);
  const [isLoadingShipitPrice, setIsLoadingShipitPrice] = useState(false);

  const cartWeight = orderData.cartWeight || 0;

  const apiUrl = 'https://api.shipit.cl/v/communes';
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/vnd.shipit.v4",
    "X-Shipit-Email": "gabriel.jofre@cruzeiroempresas.cl",
    "X-Shipit-Access-Token": "VuXw5Yo98WczGy3uxiyz"
  };

  const cargarRegiones = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    cargarRegiones();
  }, [cargarRegiones]);

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

const getShipitPrice = async (comuna, weight) => {
  try {
    const adjustedWeight = Math.max(1, weight);
    
    const requestBody = {
      parcel: {
        length: 10,
        width: 10,
        height: 10,
        weight: adjustedWeight,
        origin_id: 308,
        destiny_id: parseInt(comuna.id),
        type_of_destiny: "domicilio",
        algorithm: "1",
        algorithm_days: "2",
        courier_for_client:'starken'
        
      }
    };

    console.log('Requesting Shipit price:', requestBody);

    const response = await fetch('https://api.shipit.cl/v/rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.shipit.v4',
        'X-Shipit-Email': 'gabriel.jofre@cruzeiroempresas.cl',
        'X-Shipit-Access-Token': 'VuXw5Yo98WczGy3uxiyz'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Shipit response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener tarifa de envío');
    }

    // Manejar la estructura real de la respuesta de Shipit
    if (data.prices && data.prices.length > 0) {
      // Tomamos el precio más bajo disponible
      const lowestPrice = data.prices.reduce((min, current) => {
        if (current.available_to_shipping && current.price < min.price) {
          return current;
        }
        return min;
      }, data.prices[0]);

      if (lowestPrice && lowestPrice.available_to_shipping) {
        return parseInt(lowestPrice.price);
      }
    } else if (data.lower_price && data.lower_price.price) {
      return parseInt(data.lower_price.price);
    }

    throw new Error('No hay tarifas disponibles para esta ubicación');

  } catch (error) {
    console.error('Error en Shipit:', error);
    throw error;
  }
};

  const handleComunaChange = async (e) => {
    const selectedComuna = comunas.find(c => c.id === parseInt(e.target.value));
    if (!selectedComuna) return;

    try {
      const isDirectShipping = isShippingAvailable(selectedComuna.name);

      if (cartWeight > 100 && !isDirectShipping) {
        setShowWeightPopup(true);
        return;
      }

      if (!isDirectShipping) {
        setIsLoadingShipitPrice(true);
        try {
          const shipitCost = await getShipitPrice(selectedComuna, cartWeight);
          
          setShippingCost(shipitCost);
          setShippingDetails(prev => ({
            ...prev,
            shipping_cost: shipitCost,
            shipping_method: 'shipit'
          }));
        } catch (error) {
          console.error('Error Shipit:', error);
          setShowWeightPopup(true);
        }
      } else {
        const cost = calculateShippingCost(selectedComuna.name, orderData.cartTotal);
        
        setShippingCost(cost);
        setShippingDetails(prev => ({
          ...prev,
          shipping_cost: cost,
          shipping_method: 'direct'
        }));
      }
    } catch (error) {
      console.error('Error al procesar comuna:', error);
      setShowWeightPopup(true);
    } finally {
      setIsLoadingShipitPrice(false);
    }
  };

  const calculateShippingCost = (comunaName, cartTotal) => {
    let cost = 0;
    for (const [, zone] of Object.entries(shippingCosts.zones)) {
      if (zone.communes.includes(comunaName.toUpperCase())) {
        cost = zone.cost;
        break;
      }
    }

    if (cartTotal >= shippingCosts.freeShippingThreshold && 
        isWithinAmericoVespucioRing(comunaName)) {
      cost = 0;
    }

    return cost;
  };

  const isShippingAvailable = (comunaName) => {
    const availableCommunes = Object.values(shippingCosts.zones).flatMap(zone => zone.communes);
    return availableCommunes.includes(comunaName.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderData('shipping', shippingDetails);
    nextStep();
  };

  const WeightPopup = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center relative">
        <button
          onClick={() => setShowWeightPopup(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
        <h3 className="text-xl font-bold mb-4">Estamos trabajando en tu cotización</h3>
        <p className="mb-4">
          {cartWeight > 100 
            ? "Debido al peso de tu pedido, estamos trabajando para otorgarte precios de envío rápidos y económicos de manera personalizada."
            : "En este momento no tenemos métodos de envío estándar disponibles para tu ubicación."}
        </p>
        <p className="mb-4">
          Una ejecutiva de Cruzeiro Gomas te contactará en breve. Ya hemos recolectado tus datos y en unos minutos te escribirán.
        </p>
        <button
          onClick={() => {
            setShowWeightPopup(false);
            console.log("Contacting executive...");
          }}
          className="bg-[#397e4c] text-white px-4 py-2 rounded hover:bg-[#5da872] transition-colors mb-2 w-full"
        >
          Contactar con una ejecutiva ahora
        </button>
        <button
          onClick={() => {
            setShowWeightPopup(false);
            console.log("Proceeding to purchase verification...");
          }}
          className="bg-[#5da872] text-white px-4 py-2 rounded hover:bg-[#397e4c] transition-colors w-full"
        >
          Proceder a verificación de compra
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {showWeightPopup && <WeightPopup />}
      </AnimatePresence>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#222222]">Detalles de Envío</h2>
        <p className="text-[#222222] mt-2">
          Queremos asegurarnos de que tu pedido llegue de la mejor manera posible. Tu satisfacción es nuestra prioridad.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#353535] to-[#2a2a2a] p-6 rounded-lg mt-6 border-2 border-[#5da872] shadow-lg relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-[#5da872] opacity-5"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <h3 className="font-bold text-xl mb-6 text-[#5da872] relative z-10">
            Nuestro compromiso con tu envío:
          </h3>
          <motion.ul className="space-y-4 relative z-10">
            {[
              { icon: Package, text: "Empaquetamos cuidadosamente cada producto para garantizar su seguridad." },
              { icon: Truck, text: "Te mantendremos informado en cada etapa del proceso de envío." },
              { icon: Headphones, text: "Nuestro equipo está disponible para resolver cualquier duda que tengas." },
              { icon: Clock, text: "Si eliges envío a domicilio, nos aseguraremos de que llegue en el horario más conveniente para ti." },
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-center text-[#ffffff]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <item.icon className="mr-3 text-[#5da872]" size={24} />
                <span>{item.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="shippingType"
                value="delivery"
                checked={shippingDetails.type === 'delivery'}
                onChange={(e) => setShippingDetails({
                  ...shippingDetails,
                  type: e.target.value
                })}
                className="mr-2"
              />
              Envío a domicilio
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="shippingType"
                value="pickup"
                checked={shippingDetails.type === 'pickup'}
                onChange={(e) => setShippingDetails({
                  ...shippingDetails,
                  type: e.target.value
                })}
                className="mr-2"
              />
              Retiro en tienda
            </label>
          </div>

          {shippingDetails.type === 'delivery' && (
            <>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2 text-[#397e4c]">
                  Dirección de entrega
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full p-3 border border-[#676767] rounded-lg bg-[#353535] text-[#ffffff] placeholder-[#676767] focus:ring-2 focus:ring-[#5da872]"
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({
                    ...shippingDetails,
                    address: e.target.value
                  })}
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
                  }}
                  required
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
                        handleComunaChange(e);
                      }
                    }}
                    required
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
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium mb-2 text-[#397e4c]">
                  Información adicional para la entrega (opcional)
                </label>
                <textarea
                  id="additionalInfo"
                  className="w-full p-3 border border-[#676767] rounded-lg bg-[#353535] text-[#ffffff] placeholder-[#676767] focus:ring-2 focus:ring-[#5da872]"
                  value={shippingDetails.additionalInfo}
                  onChange={(e) => setShippingDetails({
                    ...shippingDetails,
                    additionalInfo: e.target.value
                  })}
                  rows={3}
                  placeholder="Ej: Timbre, referencias, horario preferido de entrega, etc."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Esta información nos ayuda a asegurar una entrega exitosa y cómoda para ti.
                </p>
              </div>
            </>
          )}
        </div>

        {shippingDetails.type === 'delivery' && shippingDetails.comuna && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="bg-gradient-to-br from-[#353535] to-[#2a2a2a] p-8 rounded-lg border-2 border-[#5da872] shadow-lg text-[#ffffff] relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-[#5da872] opacity-5"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div className="relative z-10">
              <motion.h4 
                className="font-bold text-2xl mb-4 text-[#5da872]"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Resumen de envío 📦
              </motion.h4>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isLoadingShipitPrice ? (
                  <div className="flex items-center space-x-2 text-white">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Calculando costo de envío con Starken...</span>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-xl text-[#ffffff]">
                      Costo de envío: ${shippingCost.toLocaleString()}
                      {shippingCost === 0 && orderData.cartTotal >= shippingCosts.freeShippingThreshold && (
                        <motion.span 
                          className="block text-[#5da872] mt-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                        >
                          ¡Felicidades! 🎉 Tu envío es gratis
                        </motion.span>
                      )}
                    </p>
                    <p className="text-base text-[#ffffff] leading-relaxed">
                      Nos esforzamos por ofrecerte la mejor experiencia de envío 🚚💨
                      {shippingCost > 0 && orderData.cartTotal < shippingCosts.freeShippingThreshold && (
                        <motion.span 
                          className="block mt-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          ¡Atención! 🎯 Por compras sobre ${shippingCosts.freeShippingThreshold.toLocaleString()}, 
                          el envío es gratis dentro del anillo Américo Vespucio. ¡Estás cerca de lograrlo! 💪
                        </motion.span>
                      )}
                    </p>
                    {shippingCost > 0 && orderData.cartTotal < shippingCosts.freeShippingThreshold && (
                      <motion.div 
                        className="mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                      >
                        <div className="w-full bg-[#676767] rounded-full h-3 mb-2 overflow-hidden">
                          <motion.div 
                            className="bg-[#5da872] h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(orderData.cartTotal / shippingCosts.freeShippingThreshold) * 100}%` }}
                            transition={{ duration: 1, delay: 1.2 }}
                          />
                        </div>
                        <p className="text-sm text-[#5da872] font-medium">
                          Te faltan ${(shippingCosts.freeShippingThreshold - orderData.cartTotal).toLocaleString()} para envío gratis
                        </p>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        <div className="flex justify-between pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={prevStep}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
          >
            Volver a datos personales
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            onClick={() => {
              updateOrderData('shipping', shippingDetails);
              nextStep();
            }}
            className="px-6 py-3 bg-[#397e4c] text-[#ffffff] rounded-lg hover:bg-[#5da872]"
          >
            Ir a la pasarela de pago
          </motion.button>
        </div>

        <input type="hidden" name="shipping_ws_region_name" value={shippingDetails.ws_region_name} />
        <input type="hidden" name="shipping_ws_region_id" value={shippingDetails.ws_region_id} />
        <input type="hidden" name="shipping_ws_comuna_name" value={shippingDetails.ws_comuna_name} />
        <input type="hidden" name="shipping_ws_comuna_id" value={shippingDetails.ws_comuna_id} />
        <input type="hidden" name="shipping_cost" value={shippingDetails.shipping_cost} />
        <input type="hidden" name="shipping_method" value={shippingDetails.shipping_method} />
      </form>
    </motion.div>
  );
}

