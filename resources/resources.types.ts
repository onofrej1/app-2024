import { TableHeader } from "@/components/table";

interface SelectOption {
    text: string;
    value: string | number | null | undefined;
  }

interface FormField {
    // mandatory props
    name: string;
    label: string;
    type: string;

    // optional props
    /*value?: string;
    helperText?: string;
    rows?: number;    
    options?: SelectOption[];
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

type Resource = {
    name: string;
    name_plural: string;
    model: PrismaModel;
    resource: string;
    relations?: string[];
    //search?: string[];
    //rules?: ObjectSchema<any>;
    menuIcon: string;
    form: FormField[];
    list: TableHeader[];
    //filter: DataFilter[];
    canAddItem?: boolean;
    canEditItem?: boolean;
}

enum PrismaModel {
    "user" = "user",
    "post" = "post"
}

export { PrismaModel };
export type { Resource, FormField };