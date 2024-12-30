export default function OrderSummary() {
  // Aquí normalmente obtendrías estos datos de tu estado global o API
  const orderItems = [
    { id: 1, name: 'Producto 1', price: 19990, quantity: 2 },
    { id: 2, name: 'Producto 2', price: 24990, quantity: 1 },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 3990;
  const total = subtotal + shipping;

  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-primary">Resumen del Pedido</h2>
      {orderItems.map((item) => (
        <div key={item.id} className="flex justify-between mb-2">
          <span>{item.name} x {item.quantity}</span>
          <span>${(item.price * item.quantity).toLocaleString()}</span>
        </div>
      ))}
      <div className="border-t border-border mt-4 pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Envío</span>
          <span>${shipping.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

