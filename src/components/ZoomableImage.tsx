import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ZoomableImage = ({ src, alt, className }: ZoomableImageProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div 
        className={`relative cursor-zoom-in group ${className}`}
        onClick={() => setIsZoomed(true)}
      >
        <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Maximize2 className="text-white h-8 w-8" />
        </div>
      </div>

      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full">
            <Minimize2 className="h-8 w-8" />
          </button>
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300" 
          />
        </div>
      )}
    </>
  );
};
