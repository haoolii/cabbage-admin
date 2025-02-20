"use client";

import { useEffect, useState } from "react";
import { getAssets, getRecords } from "@/requests/requests";
import { AssetType, RecordType } from "@/requests/types";
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

export const columns: ColumnDef<AssetType>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "recordId",
    header: "RecordId",
  },
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => {
      return dayjs
        .utc(row.getValue("createdAt"))
        .tz(userTimeZone)
        .format("YYYY-MM-DD HH:mm:ss");
    },
  },
];

export default function Page() {
  const [data, setData] = useState<AssetType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [recordId, setRecordId] = useState("");
  const [key, setKey] = useState("");

  const fetchData = async () => {
    const response = await getAssets({
      page: page,
      size: 20,
      recordId,
      key,
    });
    setData(response.data.data.assets || []);
    setTotal(response.data.data.total || 0);
  };

  useEffect(() => {
    fetchData();
  }, [page, recordId, key]);

  const form = useForm<{
    recordId: string;
    key: string;
  }>({
    defaultValues: {
      recordId: "",
      key: "",
    },
    onSubmit: async ({ value }) => {
      setRecordId(value.recordId);
      setKey(value.key);
    },
  });

  return (
    <div>
      <h2 className="font-semibold text-lg py-2">Asset</h2>
      <form
        className="pt-2 pb-4 flex gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="recordId"
          children={(field) => (
            <Input
              placeholder="Record Id"
              value={field.state.value}
              className="w-60"
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
          )}
        />
        <form.Field
          name="key"
          children={(field) => (
            <Input
              placeholder="Key"
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
            <Button type="submit" disabled={!canSubmit}>
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
