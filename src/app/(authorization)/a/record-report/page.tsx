"use client";

import { useEffect, useState } from "react";
import {
  getRecordReports,
  putRecordReports,
} from "@/requests/requests";
import { RecordReportType } from "@/requests/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dataTable";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function Page() {
  const [data, setData] = useState<RecordReportType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [uniqueId, setUniqueId] = useState("");
  const [createdAtLt, setCreatedAtLt] = useState("");

  const fetchData = async () => {
    const response = await getRecordReports({
      page: page,
      size: 20,
    });
    setData(response.data.data.recordReports || []);
    setTotal(response.data.data.total || 0);
  };

  const form = useForm<{
    uniqueId: string;
    daysBefore: string;
  }>({
    defaultValues: {
      uniqueId: "",
      daysBefore: "",
    },
    onSubmit: async ({ value }) => {
      setUniqueId(value.uniqueId);
      if (value.daysBefore) {
        setCreatedAtLt(
          dayjs().subtract(+value.daysBefore, "day").toISOString()
        );
      }
    },
  });

  useEffect(() => {
    fetchData();
  }, [page, uniqueId, createdAtLt]);

  const columns: ColumnDef<RecordReportType>[] = [
    {
      accessorKey: "record.uniqueId",
      header: "UniqueId",
      cell: ({ getValue }) => {
        return getValue() || "-";
      },
    },
    {
      accessorKey: "record.type",
      header: "Type",
      cell: ({ getValue }) => {
        return getValue() || "-";
      },
    },
    {
      accessorKey: "content",
      header: "Content",
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
    {
      accessorKey: "isDeleted",
      header: "IsDeleted",
    },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await putRecordReports(
                  { recordReportId: row.getValue("id") },
                  {
                    isDeleted: true,
                  }
                );
                await fetchData();
              }}
            >
              Soft Delete
            </Button>
            {/* <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                //   await deleteRecord({ id: row.getValue("id") }, { soft: false });
                //   await fetchData();
              }}
            >
              Delete
            </Button> */}
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
