'use client'
import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        {/* Círculo exterior */}
        <div className="absolute inset-0 animate-spin rounded-full border-b-4 border-primary"></div>
        
        {/* Círculo medio */}
        <div className="absolute inset-2 animate-spin rounded-full border-b-4 border-secondary animate-[spin_1.5s_linear_infinite]"></div>
        
        {/* Círculo interior */}
        <div className="absolute inset-4 animate-spin rounded-full border-b-4 border-accent animate-[spin_2s_linear_infinite]"></div>
        
        {/* Contenedor central */}
        <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-primary animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
