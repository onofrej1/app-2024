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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';

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
  //type?: 'edit' | 'delete' | 'info';
}

interface TableProps {
  headers: TableHeader[];
  data: TableData[];
  actions?: TableAction[];
}

export default function TableUI({ headers, data, actions }: TableProps) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()

  const pageParam = searchParams.get('page');
  const page = Number(pageParam) || 0;

  const itemsPerPage = 10;

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <button onClick={() => changePage(page + 1)}> Next Page </button>
      <button onClick={() => changePage(page - 1)}> Prev Page </button>

      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />

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