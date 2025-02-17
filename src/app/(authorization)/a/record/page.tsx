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
      return dayjs.duration(+expireIn, "seconds").format("m分s秒")
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
  const [data, setData] = useState<RecordType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    const response = await getRecords({
      page: page,
      size: 20,
    });
    setData(response.data.data.records || []);
    setTotal(response.data.data.total || 0);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div>
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
