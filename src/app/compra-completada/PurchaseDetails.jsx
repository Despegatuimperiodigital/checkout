import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function PurchaseDetails({ orderData, payment }) {

  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#ffffff] to-[#f0f0f0] backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden text-[#222222] max-w-2xl w-full mx-4"
      >
        <motion.div 
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "radial-gradient(circle, rgba(93,168,114,0.1) 0%, rgba(255,255,255,0) 70%)",
              "radial-gradient(circle, rgba(93,168,114,0.2) 0%, rgba(255,255,255,0) 70%)",
              "radial-gradient(circle, rgba(93,168,114,0.1) 0%, rgba(255,255,255,0) 70%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="p-8 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <Image
              src="https://www.cruzeirogomas.cl/wp-content/uploads/sites/2/2024/11/cropped-logo_cruzeirogomas_mediano_1.png"
              alt="Cruzeiro Gomas Logo"
              width={150}
              height={75}
              objectFit="contain"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#397e4c]">Número de Orden:</h2>
              <span className="text-2xl text-[#397e4c]">{orderData.id}</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-[#5da872] text-white p-4 rounded-lg shadow-md flex items-center"
            >
              <CheckCircle className="mr-3" size={24} />
              <span className="text-lg font-semibold">¡Compra exitosa! Gracias por tu preferencia.</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#397e4c]">Detalles de envío:</h3>
                <div className="space-y-1 text-[#222222]">
                  <p>{orderData.billing.first_name} { orderData.billing.last_name}</p>
                   {
                    orderData.billing.address_1 ? <> <p>{orderData.billing.address_1}</p>
                    <p>{orderData.shipping.address_2}</p> </> : <p>Retiro en tienda</p>
                   }
                 
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#397e4c]">Método de pago:</h3>
                <div className="space-y-1 text-[#222222]">
                  <p>{orderData.payment_method_title}</p>
                  <p>******{payment.card_detail.card_number}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-[#397e4c]">Resumen de tu pedido:</h3>
              <div className="space-y-3">
                {orderData.line_items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#5da872] mt-4 pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${orderData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Envío:</span>
                  <span>${orderData.shipping_total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-2 text-[#397e4c]">
                  <span>Total:</span>
                  <span>${(orderData.total.toLocaleString())}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-center mt-8"
            >
              <p className="text-lg mb-2">¿Tienes alguna pregunta sobre tu pedido?</p>
              <p className="font-semibold text-[#397e4c]">Contáctanos al +56 9 1234 5678</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

