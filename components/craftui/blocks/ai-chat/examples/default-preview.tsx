"use client";

import AIChat, {
  type ChatModeOption,
  type ModelOption,
  type ToolItem,
} from "../default";

// AIChat is a full-scene block — it ships its own bg-muted surface, heading, and
// centering, so the preview just renders it and wires the callbacks. Each handler
// below doubles as usage docs for how selection and submission are reported.
export default function DefaultPreview() {
  return (
    <AIChat
      onSubmit={(value: string) => console.log("submit:", value)}
      onModeChange={(mode: ChatModeOption) => console.log("mode:", mode.id)}
      onModelChange={(model: ModelOption) => console.log("model:", model.id)}
      onToolChange={(tool: ToolItem | null) =>
        console.log("tool:", tool?.label ?? null)
      }
      onRecordingChange={(recording: boolean) =>
        console.log("recording:", recording)
      }
    />
  );
}
