import { ptBR } from "date-fns/locale";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export const CalendarComponent = ({
  showOutsideDays = true,
  ...props
}: CalendarProps) => {
  const locale = ptBR;

  return (
    <DayPicker showOutsideDays={showOutsideDays} locale={locale} {...props} />
  );
};
