import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { MonthYearInput } from "@/components/shared/month-year-input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Label } from "@/components/ui/label.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx"
import { cn } from "@/lib/utils.ts"

type MonthYearRange = {
  readonly mesAnoInicio?: string
  readonly mesAnoFim?: string
}

type MonthYearRangePickerProps = {
  readonly value: MonthYearRange
  readonly onChange: (range: MonthYearRange) => void
  readonly placeholder?: string
  readonly className?: string
}

const formatLabel = (internal: string): string => {
  try {
    const date = parse(internal, "yyyy-MM", new Date())
    return format(date, "MMM/yyyy", { locale: ptBR })
  } catch {
    return internal
  }
}

export const MonthYearRangePicker = ({
  value,
  onChange,
  placeholder = "Selecione o período",
  className,
}: MonthYearRangePickerProps) => {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<MonthYearRange>(value)

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraft(value)
    }
    setOpen(nextOpen)
  }

  const handleApply = () => {
    onChange(draft)
    setOpen(false)
  }

  const handleClear = () => {
    onChange({ mesAnoInicio: undefined, mesAnoFim: undefined })
    setOpen(false)
  }

  const handleCancel = () => {
    setDraft(value)
    setOpen(false)
  }

  const label =
    value.mesAnoInicio && value.mesAnoFim
      ? `${formatLabel(value.mesAnoInicio)} — ${formatLabel(value.mesAnoFim)}`
      : value.mesAnoInicio
        ? `${formatLabel(value.mesAnoInicio)} — ...`
        : value.mesAnoFim
          ? `... — ${formatLabel(value.mesAnoFim)}`
          : placeholder

  const hasValue = !!value.mesAnoInicio || !!value.mesAnoFim

  const isRangeInvalid =
    !!draft.mesAnoInicio &&
    !!draft.mesAnoFim &&
    draft.mesAnoInicio > draft.mesAnoFim

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !hasValue && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-end gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Início</Label>
            <MonthYearInput
              value={draft.mesAnoInicio ?? ""}
              onChange={(val) =>
                setDraft({ ...draft, mesAnoInicio: val || undefined })
              }
              placeholder="MM/AAAA"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Fim</Label>
            <MonthYearInput
              value={draft.mesAnoFim ?? ""}
              onChange={(val) =>
                setDraft({ ...draft, mesAnoFim: val || undefined })
              }
              placeholder="MM/AAAA"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 border-t pt-3">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Limpar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleApply} disabled={isRangeInvalid}>
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
