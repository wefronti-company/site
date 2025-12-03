'use client';

import React from "react";
import { cn } from "@/lib/utils";

export interface BoxesProps {
  className?: string;
}

export const Boxes = ({ className, ...rest }: BoxesProps) => {
  const rows = new Array(80).fill(1);
  const cols = new Array(80).fill(1);
  
  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div
          key={`row` + i}
          className="w-32 h-16 border-l border-slate-700 relative"
        >
          {cols.map((_, j) => (
            <div
              key={`col` + j}
              className="w-32 h-16 border-r border-t border-slate-700 relative"
            />
          ))}
        </div>
      ))}
    </div>
  );
};
