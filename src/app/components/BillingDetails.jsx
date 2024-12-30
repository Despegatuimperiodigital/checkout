import { useState } from 'react';

export default function BillingDetails({ nextStep, prevStep, updateOrderData }) {
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [needInvoice, setNeedInvoice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderData('billing', { name, rut, email, needInvoice });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Detalles de Facturación</h2>
      <div>
        <label htmlFor="name" className="block mb-2">Nombre completo</label>
        <input
          type="text"
          id="name"
          className="w-full p-2 border border-border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="rut" className="block mb-2">RUT</label>
        <input
          type="text"
          id="rut"
          className="w-full p-2 border border-border rounded"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-2">Correo electrónico</label>
        <input
          type="email"
          id="email"
          className="w-full p-2 border border-border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox text-primary"
            checked={needInvoice}
            onChange={() => setNeedInvoice(!needInvoice)}
          />
          <span className="ml-2">Necesito factura</span>
        </label>
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={prevStep} className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90">
          Atrás
        </button>
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
          Continuar
        </button>
      </div>
    </form>
  );
}

