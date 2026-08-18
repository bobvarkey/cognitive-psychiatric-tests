import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ZoomableImage = ({ src, alt, className }: ZoomableImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`relative group cursor-zoom-in overflow-hidden rounded-lg ${className}`}>
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Maximize2 className="h-8 w-8 text-foreground opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-background/95 backdrop-blur-2xl border-primary/20 shadow-2xl shadow-primary/10">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-primary transition-colors border border-white/20"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="w-full h-full flex items-center justify-center p-4">
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-[90vh] object-contain animate-in zoom-in-95 duration-300"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
