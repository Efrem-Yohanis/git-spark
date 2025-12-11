import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VlrAttachedFormProps {
  fields: {
    table_name: string;
    day_from: string;
    day_to: string;
  };
  onChange: (fields: VlrAttachedFormProps["fields"]) => void;
  disabled?: boolean;
}

export function VlrAttachedForm({ fields, onChange, disabled }: VlrAttachedFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Table Name</Label>
        <Input
          type="text"
          value={fields.table_name}
          onChange={(e) => onChange({ ...fields, table_name: e.target.value })}
          placeholder="e.g., vlr_attached_customers"
          disabled={disabled}
        />
      </div>
      <div>
        <Label>Day From</Label>
        <Input
          type="number"
          value={fields.day_from}
          onChange={(e) => onChange({ ...fields, day_from: e.target.value })}
          placeholder="e.g., 0"
          disabled={disabled}
        />
      </div>
      <div>
        <Label>Day To</Label>
        <Input
          type="number"
          value={fields.day_to}
          onChange={(e) => onChange({ ...fields, day_to: e.target.value })}
          placeholder="e.g., 10"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
