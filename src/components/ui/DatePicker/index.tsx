import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn, parseDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../scroll-area";
import { CalendarComponent } from "./Calendar";

export function DatePicker({
  date,
  setDate,
  hasError,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  hasError?: boolean;
}) {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year, 10);
    setSelectedYear(newYear);
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setFullYear(newYear);
      setDate(updatedDate);
    }
  };

  const handleMonthChange = (month: string) => {
    const newMonth = parseInt(month, 10);
    setSelectedMonth(newMonth);
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setMonth(newMonth);
      setDate(updatedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "flex w-full justify-start gap-2 p-3 text-left font-normal",
            hasError ? "border-destructive" : "",
          )}
        >
          <CalendarIcon />
          {date ? (
            parseDate(date).format("DD/MM/YYYY")
          ) : (
            <span className="text-placeholder text-sm leading-5">
              DD/MM/AAAA
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="mb-2 flex gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="flex-1 rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-60">
                {Array.from({ length: 100 }, (_, i) => (
                  <SelectItem
                    key={i}
                    value={(new Date().getFullYear() - i).toString()}
                  >
                    {new Date().getFullYear() - i}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <Select
            value={selectedMonth.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-60">
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {new Date(0, i).toLocaleString("pt-BR", {
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <CalendarComponent
          mode="single"
          selected={date}
          animate
          onSelect={setDate}
          initialFocus
          toYear={new Date().getFullYear()}
          month={new Date(selectedYear, selectedMonth)}
          captionLayout={undefined}
          onMonthChange={(date) => {
            setSelectedMonth(date.getMonth());
            setSelectedYear(date.getFullYear());
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
