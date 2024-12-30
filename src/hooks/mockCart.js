export const mockCart = {
    items: [
      {
        product_id: 123,
        variation_id: 456,
        quantity: 2,
        line_total: "59800",
        variation: {
          "size": "M"
        },
        data: {
          name: "Neumático Ejemplo",
          price: "29900",
          weight: "100.5",
          images: {
            thumbnail: "/ejemplo-thumb.jpg",
            full: "/ejemplo-full.jpg"
          }
        }
      },
      {
        product_id: 124,
        variation_id: 457,
        quantity: 1,
        line_total: "45000",
        variation: {
          "size": "L"
        },
        data: {
          name: "Neumático Ejemplo 2",
          price: "45000",
          weight: "14.2",
          images: {
            thumbnail: "/ejemplo-thumb-2.jpg",
            full: "/ejemplo-full-2.jpg"
          }
        }
      }
    ],
    totals: {
      total_price: "110800",
      total_items: "104800",
      total_shipping: "6000"
    }
  };