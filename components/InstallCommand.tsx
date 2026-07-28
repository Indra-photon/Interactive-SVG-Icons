import { CopyButton } from "@/components/loader-gallery/CopyButton";
import { Paragraph } from "./Paragraph";

export function InstallCommand({
  command,
  className = "mt-10",
}: {
  command: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Paragraph variant="Instruction-Heading" className="mb-3">
        Installation
      </Paragraph>
      <CopyButton text={command} />
    </div>
  );
}
