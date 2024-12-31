import './globals.css'

export const metadata = {
  title: 'CruzeiroGomas',
  description: 'Soluciones en pisos industriales y comerciales',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen w-full flex items-center justify-center bg-background">
        <main className="w-full h-full flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
