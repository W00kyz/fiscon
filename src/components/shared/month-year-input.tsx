import { forwardRef, useState } from "react"
import { Input } from "@/components/ui/input.tsx"

type MonthYearInputProps = {
  readonly value?: string
  readonly onChange?: (value: string) => void
  readonly id?: string
  readonly className?: string
  readonly placeholder?: string
}

const toDisplay = (internal: string): string => {
  if (!internal) return ""
  const parts = internal.split("-")
  if (parts.length !== 2) return internal
  return `${parts[1]}/${parts[0]}`
}

const isValidMonth = (month: string): boolean => {
  const m = Number(month)
  return m >= 1 && m <= 12
}

const toInternal = (display: string): string => {
  const clean = display.replace(/\D/g, "")
  if (clean.length < 6) return ""
  const month = clean.slice(0, 2)
  if (!isValidMonth(month)) return ""
  const year = clean.slice(2, 6)
  return `${year}-${month}`
}

const formatDisplay = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 6)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export const MonthYearInput = forwardRef<HTMLInputElement, MonthYearInputProps>(
  ({ value = "", onChange, id, className, placeholder = "MM/AAAA" }, ref) => {
    const [display, setDisplay] = useState(() => toDisplay(value))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatDisplay(e.target.value)
      setDisplay(formatted)

      const internal = toInternal(formatted)
      if (internal && onChange) {
        onChange(internal)
      } else if (!formatted && onChange) {
        onChange("")
      }
    }

    return (
      <Input
        ref={ref}
        id={id}
        className={className}
        placeholder={placeholder}
        value={display}
        onChange={handleChange}
        maxLength={7}
      />
    )
  },
)

MonthYearInput.displayName = "MonthYearInput"
