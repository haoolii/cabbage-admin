"use client";

import { DataTable } from "@/components/dataTable";
import { getUrls } from "@/requests/requests";
import { UrlType } from "@/requests/types";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const columns: ColumnDef<UrlType>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "recordId",
    header: "RecordId",
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
];

export default function Page() {
  const [data, setData] = useState<UrlType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [recordId, setRecordId] = useState("");
  const [content, setContent] = useState("");

  const form = useForm<{
    recordId: string;
    content: string;
  }>({
    defaultValues: {
      recordId: "",
      content: ""
    },
    onSubmit: async ({ value }) => {
        setRecordId(value.recordId);
        setContent(value.content);
    },
  });

  const fetchData = async () => {
    const response = await getUrls({
      page: page,
      size: 20,
      recordId,
      content
    });
    setData(response.data.data.urls || []);
    setTotal(response.data.data.total || 0);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, page, recordId, content]);

  return (
    <div>
      <h2 className="font-semibold text-lg py-2">Url</h2>
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
          name="content"
          children={(field) => (
            <Input
              placeholder="Content"
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
