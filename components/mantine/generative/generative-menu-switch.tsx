import { EditorBubble, useEditor } from "novel";
import { removeAIHighlight } from "novel/extensions";
import {} from "novel/plugins";
import { Fragment, type ReactNode, useEffect } from "react";
import { Box, Paper, Group } from "@mantine/core";
import { Button } from "../ui/button";
import Magic from "../../tailwind/ui/icons/magic";
import { AISelector } from "./ai-selector";
import { TbArrowBack, TbArrowForward } from "react-icons/tb";
import { Separator } from "../ui/separator";

interface GenerativeMenuSwitchProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const GenerativeMenuSwitch = ({
  children,
  open,
  onOpenChange,
}: GenerativeMenuSwitchProps) => {
  const { editor } = useEditor();

  useEffect(() => {
    if (!open) removeAIHighlight(editor);
  }, [open]);
  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? "bottom-start" : "top",
        onHidden: () => {
          onOpenChange(false);
          editor.chain().unsetHighlight().run();
        },
      }}
    >
      <Paper
        shadow="xl"
        style={{
          display: "flex",
          width: "fit-content",
          maxWidth: "90vw",
          overflow: "hidden",
          borderRadius: "var(--mantine-radius-md)",
          border: "1px solid var(--mantine-color-gray-3)",
          background: "var(--mantine-color-body)"
        }}
      >
        {open && <AISelector open={open} onOpenChange={onOpenChange} />}
        {!open && (
          <Group spacing={0}>
            <Button
              style={{
                gap: "4px",
                borderRadius: 0,
                color: "var(--mantine-color-violet-5)"
              }}
              variant="ghost"
              onClick={() => onOpenChange(true)}
              size="sm"
            >
              <Magic className="h-5 w-5" />
              Ask AI
            </Button>

            <Separator orientation="vertical" />

            <Button
              style={{
                gap: "4px",
                borderRadius: 0,
                color: "var(--mantine-color-dark-4)"
              }}
              variant="ghost"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor?.can().undo()}
              size="sm"
            >
              <TbArrowBack className="h-4 w-4" />
            </Button>

            <Button
              style={{
                gap: "4px",
                borderRadius: 0,
                color: "var(--mantine-color-dark-4)"
              }}
              variant="ghost"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor?.can().redo()}
              size="sm"
            >
              <TbArrowForward className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" />

            {/* All other menu items */}
            {children}
          </Group>
        )}
      </Paper>
    </EditorBubble>
  );
};

export default GenerativeMenuSwitch;
