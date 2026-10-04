import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResultsActionBarProps {
  children: ReactNode;
  /** Horizontal alignment of the buttons from the `sm` breakpoint up. */
  align?: 'stretch' | 'start' | 'center' | 'end';
  className?: string;
}

/**
 * Responsive row for results actions (Retake / Export PDF / Copy / Download / Back).
 * - Mobile: buttons stack full-width so labels never collide.
 * - `sm` and up: buttons sit in a row and wrap to a new line instead of
 *   squeezing their labels; `stretch` lets them share the row evenly.
 */
export function ResultsActionBar({ children, align = 'stretch', className }: ResultsActionBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:flex-wrap [&>*]:flex-none [&>*]:w-full sm:[&>*]:w-auto',
        align === 'stretch' && 'sm:[&>*]:flex-1',
        align === 'start' && 'sm:justify-start',
        align === 'center' && 'sm:justify-center',
        align === 'end' && 'sm:justify-end',
        className,
      )}
    >
      {children}
    </div>
  );
}
