import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button.tsx"
import { Calendar } from "@/components/ui/calendar.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx"
import { cn } from "@/lib/utils.ts"

type DateRangePickerProps = {
  readonly value: DateRange | undefined
  readonly onChange: (range: DateRange | undefined) => void
  readonly placeholder?: string
  readonly className?: string
}

export const DateRangePicker = ({
  value,
  onChange,
  placeholder = "Selecione o período",
  className,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false)
  const formatDate = (date: Date) => format(date, "dd/MM/yyyy")

  const label =
    value?.from && value?.to
      ? `${formatDate(value.from)} — ${formatDate(value.to)}`
      : value?.from
        ? `${formatDate(value.from)} — ...`
        : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value?.from && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          locale={ptBR}
        />
        <div className="flex items-center justify-end gap-2 border-t px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(undefined)
              setOpen(false)
            }}
          >
            Limpar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
