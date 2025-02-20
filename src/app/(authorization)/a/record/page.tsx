"use client";

import { useEffect, useState } from "react";
import { getRecords } from "@/requests/requests";
import { RecordType } from "@/requests/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dataTable";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<RecordType>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "uniqueId",
    header: "UniqueId",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "expireIn",
    header: "ExpireIn",
    cell: ({ row }) => {
      const expireIn = row.getValue("expireIn");
      if (!expireIn) return <>-</>;
      return dayjs.duration(+expireIn, "seconds").format("m分s秒");
    },
  },
  {
    accessorKey: "expireAt",
    header: "ExpireAt",
    cell: ({ row }) => {
      const expiredAt = row.getValue("expireAt");
      if (!expiredAt) return <>-</>;
      return dayjs
        .utc(`${expiredAt}`)
        .tz(userTimeZone)
        .format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CreatedAt
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      return dayjs
        .utc(row.getValue("createdAt"))
        .tz(userTimeZone)
        .format("YYYY-MM-DD HH:mm:ss");
    },
  },
];

export default function Page() {
  const [data, setData] = useState<RecordType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [uniqueId, setUniqueId] = useState("");

  const fetchData = async () => {
    const response = await getRecords({
      page: page,
      size: 20,
      uniqueId,
    });
    setData(response.data.data.records || []);
    setTotal(response.data.data.total || 0);
  };

  const form = useForm<{
    uniqueId: string;
  }>({
    defaultValues: {
      uniqueId: "",
    },
    onSubmit: async ({ value }) => {
      setUniqueId(value.uniqueId);
    },
  });

  useEffect(() => {
    fetchData();
  }, [page, uniqueId]);

  return (
    <div>
      <h2 className="font-semibold text-lg py-1">Record</h2>
      <form
        className="pt-2 pb-4 flex gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="uniqueId"
          children={(field) => (
            <Input
              placeholder="Unique Id"
              value={field.state.value}
              className="w-60"
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? "Searching" : "Search"}
            </Button>
          )}
        />
      </form>
      <DataTable
        columns={columns}
        data={data}
        page={page}
        size={20}
        onPaginationChange={(page) => {
          setPage(page);
        }}
        total={total}
      />
    </div>
  );
}
