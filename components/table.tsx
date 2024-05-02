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
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation'
import { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import Form, { FormRenderFunc } from "./form/form";
import { resources } from "@/resources";
import { FormSchema } from "@/validation";
import { filterResource } from "@/actions";

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
  const searchParams = useSearchParams();
  const params = useParams();

  const pageParam = searchParams.get('page');
  const page = Number(pageParam) || 0;

  const resourceName = params.name;
  const resource = resources.find(r => r.resource === resourceName);
  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }

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
  

  const filters = resource.filter;
  //console.log(filters);

  const render: FormRenderFunc = ({ fields, formState }) => {
    return (
      <div className="flex flex-row">
        {filters.map(f => <span key={f.name}>{fields[f.name]}</span>)}
        
      </div>
    )
  };

  const act = filterResource.bind(null, searchParams);

  return (
    <>
      <button onClick={() => changePage(page + 1)}> Next Page </button>
      <button onClick={() => changePage(page - 1)}> Prev Page </button>

      
      <Form fields={filters}
            formSchema={FormSchema.FilterResource}
            data={{}}
            render={render}
            action={act} />

      {/*<input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />*/}

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