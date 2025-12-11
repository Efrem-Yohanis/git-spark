import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TargetedCustomersFormProps {
  fields: {
    table_name: string;
    data_from: Date | undefined;
    targeted_for_last: string;
  };
  onChange: (fields: TargetedCustomersFormProps["fields"]) => void;
  disabled?: boolean;
}

export function TargetedCustomersForm({ fields, onChange, disabled }: TargetedCustomersFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Table Name</Label>
        <Input
          type="text"
          value={fields.table_name}
          onChange={(e) => onChange({ ...fields, table_name: e.target.value })}
          placeholder="e.g., targeted_customers_jan"
          disabled={disabled}
        />
      </div>
      <div>
        <Label>Data From</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-1",
                !fields.data_from && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fields.data_from ? format(fields.data_from, "yyyy-MM-dd") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
            <Calendar
              mode="single"
              selected={fields.data_from}
              onSelect={(date) => onChange({ ...fields, data_from: date })}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label>Targeted For Last (Days)</Label>
        <Input
          type="number"
          value={fields.targeted_for_last}
          onChange={(e) => onChange({ ...fields, targeted_for_last: e.target.value })}
          placeholder="e.g., 30"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
