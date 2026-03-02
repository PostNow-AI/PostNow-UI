/**
 * Date Time Picker Component
 *
 * Allows selecting both date and time for scheduling.
 */

import { Button } from "@/components/ui/button";
import { CalendarComponent } from "@/components/ui/DatePicker/Calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, parseDate } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
  hasError?: boolean;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  minDate = new Date(),
  hasError,
  disabled,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }

    // Preserve time if value exists
    if (value) {
      date.setHours(value.getHours());
      date.setMinutes(value.getMinutes());
    } else {
      // Default to next hour
      const now = new Date();
      date.setHours(now.getHours() + 1);
      date.setMinutes(0);
    }

    onChange(date);
  };

  const handleTimeChange = (type: "hour" | "minute", val: string) => {
    if (!value) return;

    const newDate = new Date(value);
    if (type === "hour") {
      newDate.setHours(parseInt(val));
    } else {
      newDate.setMinutes(parseInt(val));
    }

    onChange(newDate);
  };

  const formatDateTime = (date: Date) => {
    return parseDate(date).format("DD/MM/YYYY [às] HH:mm");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            hasError && "border-destructive"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDateTime(value) : "Selecione data e hora"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <CalendarComponent
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            disabled={(date) => {
              // Create a copy to avoid mutating minDate
              const minDateStart = new Date(minDate);
              minDateStart.setHours(0, 0, 0, 0);
              return date < minDateStart;
            }}
            initialFocus
          />

          <div className="border-t pt-3 mt-3">
            <Label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              Horário
            </Label>
            <div className="flex gap-2 items-center">
              <Select
                value={value?.getHours().toString().padStart(2, "0") ?? ""}
                onValueChange={(val) => handleTimeChange("hour", val)}
                disabled={!value}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-lg font-medium">:</span>
              <Select
                value={value?.getMinutes().toString().padStart(2, "0") ?? ""}
                onValueChange={(val) => handleTimeChange("minute", val)}
                disabled={!value}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 15, 30, 45].map((min) => (
                    <SelectItem key={min} value={min.toString()}>
                      {min.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={!value}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
