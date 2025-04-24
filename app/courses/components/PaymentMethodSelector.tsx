"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onSelectMethod: (method: string) => void
}

export default function PaymentMethodSelector({ selectedMethod, onSelectMethod }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Select Payment Method</Label>
      <RadioGroup
        defaultValue={selectedMethod}
        value={selectedMethod}
        onValueChange={onSelectMethod}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem value="esewa" id="esewa" className="peer sr-only" />
          <Label
            htmlFor="esewa"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="mb-3 h-6 w-6 flex items-center justify-center bg-green-500 rounded-full text-white font-bold text-xs">
              e
            </div>
            eSewa
          </Label>
        </div>
        <div>
          <RadioGroupItem value="khalti" id="khalti" className="peer sr-only" />
          <Label
            htmlFor="khalti"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="mb-3 h-6 w-6 flex items-center justify-center bg-purple-600 rounded-full text-white font-bold text-xs">
              K
            </div>
            Khalti
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
