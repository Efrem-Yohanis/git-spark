import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RewardedFromAccountFormProps {
  fields: {
    table_name: string;
    account_number: string;
  };
  onChange: (fields: RewardedFromAccountFormProps["fields"]) => void;
  disabled?: boolean;
}

export function RewardedFromAccountForm({ fields, onChange, disabled }: RewardedFromAccountFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Table Name</Label>
        <Input
          type="text"
          value={fields.table_name}
          onChange={(e) => onChange({ ...fields, table_name: e.target.value })}
          placeholder="e.g., rewarded_from_account_list"
          disabled={disabled}
        />
      </div>
      <div>
        <Label>Account Number</Label>
        <Input
          type="text"
          value={fields.account_number}
          onChange={(e) => onChange({ ...fields, account_number: e.target.value })}
          placeholder="e.g., 9000069"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
