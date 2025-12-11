import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BalanceThresholdFormProps {
  fields: {
    table_name: string;
    balance_threshold: string;
    comparison: string;
  };
  onChange: (fields: BalanceThresholdFormProps["fields"]) => void;
  disabled?: boolean;
}

export function BalanceThresholdForm({ fields, onChange, disabled }: BalanceThresholdFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Table Name</Label>
        <Input
          type="text"
          value={fields.table_name}
          onChange={(e) => onChange({ ...fields, table_name: e.target.value })}
          placeholder="e.g., balance_threshold_10"
          disabled={disabled}
        />
      </div>
      <div>
        <Label>Balance Threshold</Label>
        <Input
          type="number"
          value={fields.balance_threshold}
          onChange={(e) => onChange({ ...fields, balance_threshold: e.target.value })}
          placeholder="e.g., 10"
          disabled={disabled}
        />
      </div>
      <div>
        <Label>Comparison</Label>
        <Select
          value={fields.comparison}
          onValueChange={(value) => onChange({ ...fields, comparison: value })}
          disabled={disabled}
        >
          <SelectTrigger className="mt-1 bg-background">
            <SelectValue placeholder="Select comparison..." />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="equal_to">Equal To</SelectItem>
            <SelectItem value="greater_than_or_equal">Greater Than or Equal To</SelectItem>
            <SelectItem value="less_than_or_equal">Less Than or Equal To</SelectItem>
            <SelectItem value="greater_than">Greater Than</SelectItem>
            <SelectItem value="less_than">Less Than</SelectItem>
            <SelectItem value="not_equal">Not Equal To</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
