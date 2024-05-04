"use client"

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import FormSelect from "./form/select";

interface TablePaginationProps {
  totalRows: number,
}

export default function TablePagination({ totalRows }: TablePaginationProps) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageCount = searchParams.get('pageCount');
  const page = Number(searchParams.get('page')) || 0;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  const handlePageCount = useDebouncedCallback((pageCount) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '0');
    if (pageCount) {
      params.set('pageCount', pageCount);
    } else {
      params.delete('pageCount');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const pageCountOptions = [
    {
      label: '10',
      value: 10
    },
    {
      label: '20',
      value: 20
    },
    {
      label: '50',
      value: 50
    }
  ]

  return (
    <>
      <button onClick={() => goToPage(page + 1)}> Next Page </button>
      <button onClick={() => goToPage(page - 1)}> Prev Page </button>

      <FormSelect
        label="Pages"
        name="pageCount"
        value={pageCount?.toString() || 10}
        onChange={handlePageCount}
        options={pageCountOptions}
      />
    </>
  )
}