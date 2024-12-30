import { useState } from 'react';

export default function ShippingDetails({ nextStep, updateOrderData }) {
  const [shippingMethod, setShippingMethod] = useState('delivery');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderData('shipping', { method: shippingMethod, address });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Detalles de Envío</h2>
      <div>
        <label className="block mb-2">Método de envío</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-primary"
              name="shippingMethod"
              value="delivery"
              checked={shippingMethod === 'delivery'}
              onChange={() => setShippingMethod('delivery')}
            />
            <span className="ml-2">Envío a domicilio</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-primary"
              name="shippingMethod"
              value="pickup"
              checked={shippingMethod === 'pickup'}
              onChange={() => setShippingMethod('pickup')}
            />
            <span className="ml-2">Retiro en tienda</span>
          </label>
        </div>
      </div>
      {shippingMethod === 'delivery' && (
        <div>
          <label htmlFor="address" className="block mb-2">Dirección de envío</label>
          <input
            type="text"
            id="address"
            className="w-full p-2 border border-border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
      )}
      <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
        Continuar
      </button>
    </form>
  );
}

