import { cn } from "@/lib/utils";

export default function BoardViewCard({ displayed }: { displayed: boolean }) {
  const rows = 2;
  const columns = 4;

  return (
    <div className="group flex flex-col items-center gap-3 p-4 hover:cursor-pointer">
      <table className="h-full w-36 table-fixed">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <th key={colIndex} className="flex-grow p-1">
                <div
                  className={cn(
                    "mb-[0.05rem] h-3 rounded bg-muted",
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
                <td key={colIndex} className="flex-grow p-1">
                  {!(rowIndex === rows - 1 && colIndex === 2) && (
                    <div
                      className={cn(
                        "h-[1.35rem] rounded bg-muted",
                        displayed
                          ? "bg-primary"
                          : "group-hover:bg-muted-foreground dark:group-hover:bg-muted-foreground",
                      )}
                    ></div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-foreground">Board View</p>
    </div>
  );
}
