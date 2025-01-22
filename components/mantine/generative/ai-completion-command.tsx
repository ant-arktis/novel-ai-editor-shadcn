import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";
import { useEditor } from "novel";
import { TiTick } from "react-icons/ti";
import { TbQuote } from "react-icons/tb";
import { FiTrash2 } from "react-icons/fi";
import { EditorCommandItem } from "novel";
import { Box, Stack } from "@mantine/core";

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
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "var(--mantine-color-gray-1)"
            }
          }}
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
          <TiTick style={{ width: 16, height: 16, color: "var(--mantine-color-dimmed)" }} />
          Replace selection
        </CommandItem>
        <CommandItem
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center", 
            gap: "8px",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "var(--mantine-color-gray-1)"
            }
          }}
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
          <TbQuote style={{ width: 16, height: 16, color: "var(--mantine-color-dimmed)" }} />
          Insert below
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem
          onSelect={onDiscard}
          value="discard"
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: "8px", 
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "var(--mantine-color-gray-1)"
            }
          }}
        >
          <FiTrash2 style={{ width: 16, height: 16, color: "var(--mantine-color-dimmed)" }} />
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
    <Stack spacing="xs">
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
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: "8px",
          padding: "4px 8px",
          fontSize: "14px",
          textAlign: "left",
          "&:hover": {
            backgroundColor: "var(--mantine-color-gray-1)"
          }
        }}
      >
        <TiTick style={{ width: 16, height: 16, color: "var(--mantine-color-dimmed)" }} />
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
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: "8px",
          padding: "4px 8px", 
          fontSize: "14px",
          textAlign: "left",
          "&:hover": {
            backgroundColor: "var(--mantine-color-gray-1)"
          }
        }}
      >
        <TbQuote style={{ width: 16, height: 16, color: "var(--mantine-color-dimmed)" }} />
        Insert below
      </EditorCommandItem>
    </Stack>
  );
};

export default AICompletionCommands;
