import { Button } from "@mantine/core";
import {
  TbBold,
  TbCode,
  TbItalic,
  TbStrikethrough,
  TbUnderline,
} from "react-icons/tb";
import { EditorBubbleItem, useEditor } from "novel";
import type { SelectorItem } from "./node-selector";

export const TextButtons = () => {
  const { editor } = useEditor();
  if (!editor) return null;
  const items: SelectorItem[] = [
    {
      name: "bold",
      isActive: (editor) => editor.isActive("bold"),
      command: (editor) => editor.chain().focus().toggleBold().run(),
      icon: TbBold,
    },
    {
      name: "italic",
      isActive: (editor) => editor.isActive("italic"),
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      icon: TbItalic,
    },
    {
      name: "underline",
      isActive: (editor) => editor.isActive("underline"),
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      icon: TbUnderline,
    },
    {
      name: "strike",
      isActive: (editor) => editor.isActive("strike"),
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      icon: TbStrikethrough,
    },
    {
      name: "code",
      isActive: (editor) => editor.isActive("code"),
      command: (editor) => editor.chain().focus().toggleCode().run(),
      icon: TbCode,
    },
  ];
  return (
    <div style={{ display: 'flex' }}>
      {items.map((item) => (
        <EditorBubbleItem
          key={item.name}
          onSelect={(editor) => {
            item.command(editor);
          }}
        >
          <Button
            variant="subtle"
            size="sm"
            styles={{
              root: {
                borderRadius: 0,
                padding: '6px 8px'
              }
            }}
          >
            <item.icon
              style={{
                width: '16px',
                height: '16px',
                color: item.isActive(editor) ? 'var(--mantine-color-blue-5)' : 'inherit',
                strokeWidth: 2.3
              }}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};
