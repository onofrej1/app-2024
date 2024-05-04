"use client"

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import Form, { FormRenderFunc } from "./form/form";
import { resources } from "@/resources";
import { FormSchema } from "@/validation";

export default function TableFilter() {
  const { replace, push } = useRouter();
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
  filters.forEach(field => {
    defaultData[field.name] = searchParams.get(field.name)?.toString();
    field['onChange'] = (values: any) => filter(values);
  })

  const render: FormRenderFunc = ({ fields, formState }) => {
    return (
      <div className="flex flex-row gap-2">
        {filters.map(f => <span key={f.name}>{fields[f.name]}</span>)}
      </div>
    )
  };

  const filter = (data: any) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '0');
    Object.keys(data).forEach(name => {
      params.set(name, data[name]);
    });
    const path = `${pathname}?${params.toString()}`;
    replace(path, { scroll: false });
  }

  return (
    <>
      <Form fields={filters}
        formSchema={FormSchema.FilterResource}
        data={defaultData}
        render={render}
        useClient={true}
        action={() => {}}
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