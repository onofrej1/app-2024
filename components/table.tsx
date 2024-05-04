"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
  action: (data: TableData) => void;

  //color: ButtonProps['color'];
  //type?: 'edit' | 'delete' | 'info';
}

interface TableProps {
  headers: TableHeader[];
  data: TableData[];
  totalRows: number;
  actions?: TableAction[];
}

export default function TableComponent({ headers, data, totalRows, actions }: TableProps) {
    
  return (
    <>
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
                {actions?.map((action) => (
                  <Button onClick={() => action.action(row)} key={action.label} className="ml-2">{action.label}</Button>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}