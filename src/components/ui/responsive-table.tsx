import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  mobileLabel?: string;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

export function ResponsiveTable<T>({ columns, data, keyExtractor, emptyMessage = "No data found." }: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    if (data.length === 0) {
      return <p className="text-center text-muted-foreground py-8 text-sm">{emptyMessage}</p>;
    }
    return (
      <div className="divide-y">
        {data.map((row) => (
          <div key={keyExtractor(row)} className="p-4 space-y-2">
            {columns.map((col, i) => (
              <div key={i} className="flex items-start justify-between gap-2 text-sm">
                <span className="text-muted-foreground shrink-0">{col.mobileLabel || col.header}</span>
                <span className="text-right font-medium">{col.accessor(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {columns.filter(c => !c.hideOnMobile).map((col, i) => (
              <th key={i} className={col.className}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted-foreground py-8">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={keyExtractor(row)}>
              {columns.filter(c => !c.hideOnMobile).map((col, i) => (
                <td key={i} className={col.className}>{col.accessor(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
