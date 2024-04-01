import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

export interface TableData {
    [key: string]: any;
}

export interface TableHeader {
    name: string;
    header: string;
}

export interface TableAction {
    label: string;
    icon?: React.ElementType;
    //color: ButtonProps['color'];
    action: (data: TableData) => void;
    type?: 'edit' | 'delete' | 'info';
}

interface TableProps {
    headers: TableHeader[];
    data: TableData[];
}

const actions = [
    {
        label: 'Edit',
        action: (data: TableData) => console.log(data),
        type: 'edit'
    },
    {
        label: 'Delete',
        action: (data: TableData) => console.log(data),
        type: 'delete'
    }
]

export default function TableUI({ headers, data }: TableProps) {

    return (
        <Table>
            {/*<TableCaption>A list of entities.</TableCaption>*/}
            <TableHeader>
                <TableRow>
                    {headers.map((header) => (
                        <TableHead className="w-[100px]" key={header.name}>
                            {header.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, index) => (
                    <TableRow key={index}>
                        {headers.map((header) => (
                            <TableCell className="w-[100px]" key={header.name}>
                                {row[header.name]}
                            </TableCell>
                        ))}
                        <TableCell className="w-[100px]">
                            {actions.map((action) => (
                                <Button key={action.label} className="ml-2">{action.label}</Button>
                            ))}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}