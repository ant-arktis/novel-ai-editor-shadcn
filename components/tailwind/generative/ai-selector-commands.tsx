import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
} from "lucide-react";
import { useEditor } from "novel";
import { getPrevText } from "novel/utils";
import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";
import React from "react";
import { EditorCommandItem } from "novel";

const options = [
  {
    value: "improve",
    label: "Improve writing",
    icon: RefreshCcwDot,
  },

  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckCheck,
  },
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
];

export interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      {options.map((option) => (
        <EditorCommandItem
          key={option.value}
          value={option.value}
          onCommand={() => {
            if (!editor) return;
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(
              slice.content
            );
            onSelect(text, option.value);
          }}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
        >
          <option.icon className="h-4 w-4 text-purple-500" />
          {option.label}
        </EditorCommandItem>
      ))}
      <EditorCommandItem
        value="continue"
        onCommand={() => {
          if (!editor) return;
          const pos = editor.state.selection.from;
          const text = getPrevText(editor, pos);
          onSelect(text, "continue");
        }}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
      >
        <StepForward className="h-4 w-4 text-purple-500" />
        Continue writing
      </EditorCommandItem>
    </>
  );
};

export const AISelectorCommandsNovel = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      <div className="mb-2">
        <p className="mb-1 text-xs font-medium text-muted-foreground">Edit or review selection</p>
        {options.map((option) => (
          <EditorCommandItem
            key={option.value}
            value={option.value}
            onCommand={() => {
              if (!editor) return;
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(
                slice.content
              );
              onSelect(text, option.value);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent aria-selected:bg-accent"
          >
            <option.icon className="h-4 w-4 text-purple-500" />
            {option.label}
          </EditorCommandItem>
        ))}
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-muted-foreground">Use AI to do more</p>
        <EditorCommandItem
          value="continue"
          onCommand={() => {
            if (!editor) return;
            const pos = editor.state.selection.from;
            const text = getPrevText(editor, pos);
            onSelect(text, "continue");
          }}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent aria-selected:bg-accent"
        >
          <StepForward className="h-4 w-4 text-purple-500" />
          Continue writing
        </EditorCommandItem>
      </div>
    </>
  );
};

export default AISelectorCommands;
