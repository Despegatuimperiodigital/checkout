import { useState } from 'react';

export default function PaymentMethod({ prevStep, updateOrderData, orderData }) {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderData('payment', { method: paymentMethod });
    // Aquí normalmente enviarías los datos a tu API o procesador de pagos
    console.log('Orden completa:', orderData);
    alert('¡Gracias por tu compra!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Método de Pago</h2>
      <div>
        <label className="block mb-2">Selecciona un método de pago</label>
        <select
          className="w-full p-2 border border-border rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="credit_card">Tarjeta de Crédito</option>
          <option value="debit_card">Tarjeta de Débito</option>
          <option value="bank_transfer">Transferencia Bancaria</option>
        </select>
      </div>
      {paymentMethod === 'credit_card' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="card_number" className="block mb-2">Número de tarjeta</label>
            <input
              type="text"
              id="card_number"
              className="w-full p-2 border border-border rounded"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="expiry" className="block mb-2">Fecha de expiración</label>
              <input
                type="text"
                id="expiry"
                className="w-full p-2 border border-border rounded"
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="cvv" className="block mb-2">CVV</label>
              <input
                type="text"
                id="cvv"
                className="w-full p-2 border border-border rounded"
                required
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <button type="button" onClick={prevStep} className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90">
          Atrás
        </button>
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
          Finalizar Compra
        </button>
      </div>
    </form>
  );
}

