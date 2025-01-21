import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";
import { useEditor } from "novel";
import { Check, TextQuote, TrashIcon } from "lucide-react";
import { EditorCommandItem } from "novel";

const AICompletionCommands = ({
  completion,
  onDiscard,
}: {
  completion: string;
  onDiscard: () => void;
}) => {
  const { editor } = useEditor();
  return (
    <>
      <CommandGroup>
        <CommandItem
          className="flex w-full items-center gap-2 rounded-sm px-4 py-2 text-sm hover:bg-accent cursor-pointer"
          value="replace"
          onSelect={() => {
            if (!editor) return;
            const selection = editor.view.state.selection;
            editor
              .chain()
              .focus()
              .insertContentAt(
                {
                  from: selection.from,
                  to: selection.to,
                },
                completion
              )
              .run();
          }}
        >
          <Check className="h-4 w-4 text-muted-foreground" />
          Replace selection
        </CommandItem>
        <CommandItem
          className="flex w-full items-center gap-2 rounded-sm px-4 py-2 text-sm hover:bg-accent cursor-pointer"
          value="insert"
          onSelect={() => {
            if (!editor) return;
            const selection = editor.view.state.selection;
            editor
              .chain()
              .focus()
              .insertContentAt(selection.to + 1, completion)
              .run();
          }}
        >
          <TextQuote className="h-4 w-4 text-muted-foreground" />
          Insert below
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem
          onSelect={onDiscard}
          value="discard"
          className="flex w-full items-center gap-2 rounded-sm px-4 py-2 text-sm hover:bg-accent cursor-pointer"
        >
          <TrashIcon className="h-4 w-4 text-muted-foreground" />
          Discard
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export const AICompletionCommandsNovel = ({
  completion,
  onDiscard,
}: {
  completion: string;
  onDiscard: () => void;
}) => {
  const { editor } = useEditor();
  return (
    <>
      <EditorCommandItem
        value="replace"
        onCommand={() => {
          if (!editor) return;
          const selection = editor.view.state.selection;
          editor
            .chain()
            .focus()
            .insertContentAt(
              {
                from: selection.from,
                to: selection.to,
              },
              completion
            )
            .run();
        }}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
      >
        <Check className="h-4 w-4 text-muted-foreground" />
        Replace selection
      </EditorCommandItem>
      <EditorCommandItem
        value="insert"
        onCommand={() => {
          if (!editor) return;
          const selection = editor.view.state.selection;
          editor
            .chain()
            .focus()
            .insertContentAt(selection.to + 1, completion)
            .run();
        }}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
      >
        <TextQuote className="h-4 w-4 text-muted-foreground" />
        Insert below
      </EditorCommandItem>
    </>
  );
};

export default AICompletionCommands;
