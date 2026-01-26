"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CounterProps {
  initialValue?: number;
}

export function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="flex items-center gap-4">
      <span data-testid="count" className="text-2xl font-bold">
        {count}
      </span>
      <Button
        onClick={() => setCount(count + 1)}
        data-testid="increment-button"
      >
        +1
      </Button>
      <Button
        onClick={() => setCount(count - 1)}
        data-testid="decrement-button"
        variant="outline"
      >
        -1
      </Button>
    </div>
  );
}
