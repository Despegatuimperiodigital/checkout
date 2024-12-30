  export const calculateShippingCost = (comunaName, cartTotal) => {
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