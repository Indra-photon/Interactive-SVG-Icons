import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { PropsTableRow } from "@/types/props-table";

function formatDefault(value: unknown) {
  if (value === undefined) return "—";
  if (Array.isArray(value)) return `[${value.join(", ")}]`;
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

export function PropsTable({
  props,
  showRequired = false,
}: {
  props: PropsTableRow[];
  showRequired?: boolean;
}) {
  if (!props?.length) return null;

  return (
    <div className="overflow-hidden corner-squircle rounded-[10px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[image:var(--gradient-button)] shadow-[var(--gradient-button-shadow)]">
            <th className="text-left text-xs font-mono font-semibold uppercase tracking-wide text-white/90 px-4 py-2.5">
              Prop
            </th>
            <th className="text-left font-mono font-semibold uppercase tracking-wide text-white/90 px-3 py-2.5">
              Type
            </th>
            <th className="text-left font-mono font-semibold uppercase tracking-wide text-white/90 px-3 py-2.5">
              Default
            </th>
            {showRequired ? (
              <th className="text-left font-mono font-semibold uppercase tracking-wide text-white/90 px-3 py-2.5">
                Required
              </th>
            ) : (
              <th className="text-left font-mono font-semibold uppercase tracking-wide text-white/90 px-3 py-2.5">
                Values
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {props.map((prop) => {
            const depth = (prop.name.match(/\[\]\./g) ?? []).length;
            return (
              <tr key={prop.name} className="bg-white dark:bg-stone-900/40">
                <td
                  className="py-3 pr-3 align-top whitespace-nowrap"
                  style={{ paddingLeft: `${16 + depth * 16}px` }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <code className="font-mono font-semibold text-[12px] text-foreground dark:text-stone-200">
                      {prop.name}
                    </code>
                    {prop.description && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            aria-label={`What does ${prop.name} do?`}
                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-semibold text-stone-400 dark:text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-300"
                          >
                            ?
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="right"
                          align="start"
                          className="max-w-72 px-3.5 py-3 text-xs leading-relaxed text-foreground/80"
                        >
                          <code className="mb-1.5 block font-mono text-[11px] font-semibold text-foreground">
                            {prop.name}
                          </code>
                          {prop.description}
                        </PopoverContent>
                      </Popover>
                    )}
                  </span>
                </td>
                <td className="px-3 py-3 align-top whitespace-nowrap">
                  <span className="inline-block rounded-md bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                    {prop.type}
                  </span>
                </td>
                <td className="px-3 py-3 align-top font-mono text-[11px] text-foreground/60 whitespace-nowrap">
                  {formatDefault(prop.default)}
                </td>
                {showRequired ? (
                  <td className="px-3 py-3 align-top whitespace-nowrap">
                    {prop.required ? (
                      <span className="inline-block rounded-md bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 font-mono text-[11px] font-medium text-red-500 dark:text-red-400">
                        required
                      </span>
                    ) : (
                      <span className="inline-block rounded-md bg-stone-50 dark:bg-stone-800 px-1.5 py-0.5 font-mono text-[11px] text-stone-400">
                        optional
                      </span>
                    )}
                  </td>
                ) : (
                  <td className="px-3 py-3 align-top">
                    {prop.options?.length ? (
                      <span className="font-mono text-[11px] text-foreground/70">
                        {prop.options.map((o, i) => (
                          <span key={String(o)}>
                            {i > 0 && (
                              <span className="mx-1 text-foreground/30">
                                |
                              </span>
                            )}
                            <code className="text-foreground/80">
                              &ldquo;{String(o)}&rdquo;
                            </code>
                          </span>
                        ))}
                      </span>
                    ) : prop.min !== undefined && prop.max !== undefined ? (
                      <span className="font-mono text-[11px] text-foreground/60 whitespace-nowrap">
                        {prop.min}&thinsp;&ndash;&thinsp;{prop.max}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-foreground/25">
                        —
                      </span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
