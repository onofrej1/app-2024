"use client"

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import Form, { FormRenderFunc } from "./form/form";
import { resources } from "@/resources";
import { FormSchema } from "@/validation";

export default function TableFilter() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const resourceName = params.name;
  const resource = resources.find(r => r.resource === resourceName);
  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const filters = resource.filter;
  const defaultData: Record<string, string | undefined> = {};
  filters.forEach(f => {
    defaultData[f.name] = searchParams.get(f.name)?.toString();
    /*f['onChange'] = (submit: any) => {
      console.log('change field');
      filter(defaultData);
    };*/
    f['onChange'] = (values: any, setFocus: any, fieldName: any) => {
      console.log('change field', fieldName);
      filter(values, () => setFocus(fieldName));
      
    };
  })

  const render: FormRenderFunc = ({ fields, formState }) => {
    return (
      <div className="flex flex-row">
        {filters.map(f => <span key={f.name}>{fields[f.name]}</span>)}
        
      </div>
    )
  };

  const filter = (data: any, callback?: any) => {
    console.log('filter');
    const params = new URLSearchParams(searchParams);
    params.set('page', '0');
    Object.keys(data).forEach(name => {
      params.set(name, data[name]);
    });
    const path = `${pathname}?${params.toString()}`;
    replace(path);
    if (callback) {
      console.log('callback');
      callback();
    }
  }

  return (
    <>
      <Form fields={filters}
        formSchema={FormSchema.FilterResource}
        data={defaultData}
        render={render}
        useClient={true}
        action={filter}
      />

      {/*<input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />*/}
    </>
  )
}