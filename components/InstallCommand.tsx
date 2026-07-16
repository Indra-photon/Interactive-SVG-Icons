import { CopyButton } from "@/components/loader-gallery/CopyButton";

export function InstallCommand({
  command,
  className = "mt-10",
}: {
  command: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
        Installation
      </h2>
      <CopyButton text={command} />
    </div>
  );
}
