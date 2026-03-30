"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { number: 1, label: "RFP & Firm Info" },
  { number: 2, label: "Project Scoping" },
  { number: 3, label: "AI Draft & Edit" },
  { number: 4, label: "Export & Submit" },
]

interface WizardProgressProps {
  currentStep: number
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                  currentStep > step.number
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center whitespace-nowrap",
                  currentStep >= step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-4 mt-[-1.25rem] transition-all",
                  currentStep > step.number
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
