import { TableHeader } from "@/components/table";
import { FormSchema } from "@/validation";

interface SelectOption {
    label: string;
    value: string | number;
}

export interface MultiSelectOption {
    label: string;
    value: number;
}

interface FormField {
    // mandatory props
    name: string;
    label: string;
    type: string;
    resource?: PrismaModel;
    fk?: string;
    relation?: string;
    textField?: string;

    // optional props
    options?: SelectOption[] | MultiSelectOption[];

    /*value?: string;
    helperText?: string;
    rows?: number;    
    
    render?: any;
    color?: string;
    inputType?: string;
    fullWidth?: boolean;
    onChange?: any;*/

    // optional resource options (foreign key, many to many)
    //resource?: string;
    //textField?: string;
    //valueField?: string;

    // DatePicker
    //showTimeSelect?: boolean;
    //showTimeSelectOnly?: boolean;
    //dateFormat?: string;
}

interface TableField {
    name: string;
    header?: string | JSX.Element;
    //cell?: (info: CellContext<TableData, unknown>) => JSX.Element,    
}

interface DataFilter {
  name: string;
  type: string;
  label: string;
  options?: SelectOption[];
}

type Resource = {
    name: string;
    name_plural: string;
    model: PrismaModel;
    resource: string;
    relations?: string[];
    //search?: string[];
    //rules?: ObjectSchema<any>;
    rules: FormSchema,
    menuIcon: string;
    form: FormField[];
    list: TableHeader[];
    filter: DataFilter[];
    canAddItem?: boolean;
    canEditItem?: boolean;
}

enum PrismaModel {
    "user" = "user",
    "post" = "post",
    "category" = "category"
}

export { PrismaModel };
export type { Resource, FormField };