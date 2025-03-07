"use client";

import { useEffect, useState } from "react";
import { deleteRecord, getRecords } from "@/requests/requests";
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

export default function Page() {
  const [data, setData] = useState<RecordType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [uniqueId, setUniqueId] = useState("");
  const [createdAtLt, setCreatedAtLt] = useState("");

  const fetchData = async () => {
    const response = await getRecords({
      page: page,
      size: 20,
      uniqueId,
      createdAtLt
    });
    setData(response.data.data.records || []);
    setTotal(response.data.data.total || 0);
  };

  const form = useForm<{
    uniqueId: string;
    daysBefore: string;
  }>({
    defaultValues: {
      uniqueId: "",
      daysBefore: ""
    },
    onSubmit: async ({ value }) => {
      setUniqueId(value.uniqueId);
      if (value.daysBefore) {
        setCreatedAtLt(dayjs().subtract(+value.daysBefore, "day").toISOString());
      }
    },
  });

  useEffect(() => {
    fetchData();
  }, [fetchData, page, uniqueId, createdAtLt]);

  const columns: ColumnDef<RecordType>[] = [
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
    {
      accessorKey: "isDeleted",
      header: "IsDeleted",
    },
    {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await deleteRecord({ id: row.getValue("id") }, { soft: true });
                await fetchData();
              }}
            >
              Soft Delete
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await deleteRecord({ id: row.getValue("id") }, { soft: false });
                await fetchData();
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

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
        <form.Field
          name="daysBefore"
          children={(field) => (
            <Input
              placeholder="daysBefore"
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
