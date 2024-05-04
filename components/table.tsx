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
import { LucideIcon, Pencil } from "lucide-react";

type IconNames = 'pencil' | 'delete';

export const Icons: Record<IconNames, LucideIcon> = {
  'pencil': Pencil,
  'delete': Pencil,
}

export interface TableData {
  [key: string]: any;
}

export interface TableHeader {
  name: string;
  header: string;
}

export interface TableAction {
  label: string;
  icon?: IconNames;
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
              <TableHead  key={header.name}>
                {header.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell  key={header.name}>
                  {row[header.name]}
                </TableCell>
              ))}
              <TableCell className="flex flex-row gap-1 justify-end">
                {actions?.map((action) => {
                  const Icon = Icons[action.icon as string];
                  return (
                    <Button onClick={() => action.action(row)} key={action.label} className="flex flex-row gap-2">
                      {action.icon ? <Icon size={14} /> : null} 
                      {action.label}
                    </Button>
                  )
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}