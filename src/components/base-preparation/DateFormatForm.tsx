import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateFormatFormProps {
  fields: {
    table_name: string;
    data_format: string;
    date: Date | undefined;
    date_start: Date | undefined;
    date_end: Date | undefined;
  };
  onChange: (fields: DateFormatFormProps["fields"]) => void;
  disabled?: boolean;
  tableLabel?: string;
}

export function DateFormatForm({ fields, onChange, disabled, tableLabel = "Table" }: DateFormatFormProps) {
  const isDateRange = fields.data_format === "date_range";

  return (
    <div className="space-y-4">
      <div>
        <Label>Table Name</Label>
        <Input
          type="text"
          value={fields.table_name}
          onChange={(e) => onChange({ ...fields, table_name: e.target.value })}
          placeholder={`e.g., ${tableLabel.toLowerCase().replace(/ /g, "_")}`}
          disabled={disabled}
        />
      </div>
      <div>
        <Label>Data Format</Label>
        <Select
          value={fields.data_format}
          onValueChange={(value) => onChange({ ...fields, data_format: value })}
          disabled={disabled}
        >
          <SelectTrigger className="mt-1 bg-background">
            <SelectValue placeholder="Select format..." />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="before">Before</SelectItem>
            <SelectItem value="after">After</SelectItem>
            <SelectItem value="date_range">Date Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isDateRange ? (
        <div>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !fields.date && "text-muted-foreground"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fields.date ? format(fields.date, "yyyy-MM-dd") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
              <Calendar
                mode="single"
                selected={fields.date}
                onSelect={(date) => onChange({ ...fields, date })}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !fields.date_start && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fields.date_start ? format(fields.date_start, "yyyy-MM-dd") : "Start"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                <Calendar
                  mode="single"
                  selected={fields.date_start}
                  onSelect={(date) => onChange({ ...fields, date_start: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !fields.date_end && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fields.date_end ? format(fields.date_end, "yyyy-MM-dd") : "End"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                <Calendar
                  mode="single"
                  selected={fields.date_end}
                  onSelect={(date) => onChange({ ...fields, date_end: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}
