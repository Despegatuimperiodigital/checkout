import Image from 'next/image'

const ProductCard = ({product}) => {
  return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="relative">
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt || ''}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-[#397e4c] text-white px-3 py-1 rounded-full text-sm font-medium">
                          40% DCTO
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <Image
                            src="/placeholder.svg?text=CG"
                            alt="CruzeiroGomas Logo"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <span className="ml-2 text-sm font-semibold text-gray-600">CRUZEIROGOMAS</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2"> {product.name
                                          .replace(/Gol\s*\/\s*(Saverio|Saveiro)\s*\/\s*Amazon\s*\/\s*Parat[i]?\s*/gi, '')
                                          .trim()
                                          .slice(0, 56) + (product.name.replace(/Gol\s*\/\s*(Saverio|Saveiro)\s*\/\s*Amazon\s*\/\s*Parat[i]?\s*/gi, '').trim().length > 63 ? '...' : '')}</h3>
                        <div className="flex items-baseline mb-2">
                          <span className="text-2xl font-bold text-[#397e4c]">{product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                          <span className="ml-2 text-lg text-gray-500 line-through">{(product.regular_price).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="bg-gray-100 px-3 py-1 rounded-full inline-block text-sm text-gray-600">
                            6 cuotas sin interés
                          </div>
                          <button className="w-full bg-[#397e4c] hover:bg-[#5da872] text-white">
                            Ver más
                          </button>
                        </div>
                      </div>
                    </div>
  )
}

export default ProductCard
