  export const isFormValid = (shippingDetails, isLoadingShipitPrice, showWeightPopup) => {
    if (!shippingDetails) {
      return false;
    }

    if (shippingDetails.type === 'delivery') {
      // Validar que se haya seleccionado región y comuna
      if (!shippingDetails.region || !shippingDetails.comuna) {
        return false;
      }
      
      // Validar que la dirección no esté vacía
      if (!shippingDetails.address.trim()) {
        return false;
      }
  
      // Validar que el costo de envío se haya calculado
      if (isLoadingShipitPrice || shippingDetails.shipping_cost === undefined) {
        return false;
      }
  
      // Validar que no haya un popup de peso activo
      if (showWeightPopup) {
        return false;
      }
  
      return true;
    }
  
    // Para retiro en tienda
    return true;
  };