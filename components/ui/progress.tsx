"use client"

import * as React from "react"
import { clsx } from "clsx"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = (value / max) * 100
    
    return (
      <div
        ref={ref}
        className={clsx(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-in-out"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
