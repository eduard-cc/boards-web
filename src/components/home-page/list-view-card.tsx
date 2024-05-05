import { cn } from "@/lib/utils";

export default function ListViewCard({ displayed }: { displayed: boolean }) {
  const rows = 3;
  const columns = 4;

  return (
    <div className="group flex flex-col items-center gap-3 p-4 hover:cursor-pointer">
      <table className="h-full w-36 table-fixed">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <th
                key={colIndex}
                className={`p-1 ${
                  colIndex === 0 ? "w-1/6" : colIndex === 1 ? "w-1/3" : "w-1/4"
                }`}
              >
                <div
                  className={cn(
                    "h-3 rounded bg-muted",
                    displayed
                      ? "bg-primary"
                      : "group-hover:bg-muted-foreground dark:group-hover:bg-muted-foreground",
                  )}
                ></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td
                  key={colIndex}
                  className={`p-1 ${
                    colIndex === 0
                      ? "w-1/6"
                      : colIndex === 1
                      ? "w-1/3"
                      : "w-1/4"
                  }`}
                >
                  <div
                    className={cn(
                      "h-3 rounded bg-muted",
                      displayed
                        ? "bg-primary"
                        : "group-hover:bg-muted-foreground dark:group-hover:bg-muted-foreground",
                    )}
                  ></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-foreground">List View</p>
    </div>
  );
}
