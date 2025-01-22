import {
  TbCheck,
  TbSquareCheck,
  TbChevronDown,
  TbCode,
  TbH1,
  TbH2,
  TbH3,
  TbList,
  TbQuote,
} from "react-icons/tb";
import { BsTextLeft } from "react-icons/bs";
import { EditorBubbleItem, useEditor } from "novel";
import { Button, Popover, Stack } from "@mantine/core";

export type SelectorItem = {
  name: string;
  icon: React.ComponentType;
  command: (editor: ReturnType<typeof useEditor>["editor"]) => void;
  isActive: (editor: ReturnType<typeof useEditor>["editor"]) => boolean;
};

const items: SelectorItem[] = [
  {
    name: "Text",
    icon: BsTextLeft,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) =>
      editor.isActive("paragraph") &&
      !editor.isActive("bulletList") &&
      !editor.isActive("orderedList"),
  },
  {
    name: "Heading 1",
    icon: TbH1,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    name: "Heading 2",
    icon: TbH2,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    name: "Heading 3",
    icon: TbH3,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
  },
  {
    name: "To-do List",
    icon: TbSquareCheck,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleTaskList().run(),
    isActive: (editor) => editor.isActive("taskItem"),
  },
  {
    name: "Bullet List",
    icon: TbList,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList"),
  },
  {
    name: "Numbered List",
    icon: TbList,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList"),
  },
  {
    name: "Quote",
    icon: TbQuote,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote"),
  },
  {
    name: "Code",
    icon: TbCode,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive("codeBlock"),
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();
  if (!editor) return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple",
  };

  return (
    <Popover opened={open} onChange={onOpenChange} width={200} position="bottom-start" offset={5} withArrow>
      <Popover.Target>
        <Button
          variant="subtle"
          size="sm"
          styles={{
            root: {
              gap: '8px',
              borderRadius: 0,
              padding: '6px 8px'
            },
            label: {
              display: 'flex',
              alignItems: 'center'
            }
          }}
        >
          <span style={{ whiteSpace: 'nowrap', fontSize: '14px' }}>{activeItem.name}</span>
          <TbChevronDown style={{ width: '16px', height: '16px' }} />
        </Button>
      </Popover.Target>
      <Popover.Dropdown p={4}>
        <Stack spacing={4}>
          {items.map((item) => (
            <EditorBubbleItem
              key={item.name}
              onSelect={(editor) => {
                item.command(editor);
                onOpenChange(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '14px',
                borderRadius: '2px',
                ':hover': {
                  backgroundColor: 'var(--mantine-color-gray-1)'
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: '2px', padding: '4px' }}>
                  <item.icon style={{ width: '12px', height: '12px' }} />
                </div>
                <span>{item.name}</span>
              </div>
              {activeItem.name === item.name && <TbCheck style={{ width: '16px', height: '16px' }} />}
            </EditorBubbleItem>
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
