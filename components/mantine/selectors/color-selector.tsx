import { TbCheck, TbChevronDown } from "react-icons/tb";
import { EditorBubbleItem, useEditor } from "novel";
import { Button, Popover, Text } from "@mantine/core";

export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--mantine-color-text)",
  },
  {
    name: "Purple",
    color: "#9333EA",
  },
  {
    name: "Red", 
    color: "#E00000",
  },
  {
    name: "Yellow",
    color: "#EAB308", 
  },
  {
    name: "Blue",
    color: "#2563EB",
  },
  {
    name: "Green",
    color: "#008A00",
  },
  {
    name: "Orange", 
    color: "#FFA500",
  },
  {
    name: "Pink",
    color: "#BA4081",
  },
  {
    name: "Gray",
    color: "#A8A29E",
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--mantine-color-yellow-1)",
  },
  {
    name: "Purple",
    color: "var(--mantine-color-violet-1)",
  },
  {
    name: "Red",
    color: "var(--mantine-color-red-1)", 
  },
  {
    name: "Yellow",
    color: "var(--mantine-color-yellow-1)",
  },
  {
    name: "Blue", 
    color: "var(--mantine-color-blue-1)",
  },
  {
    name: "Green",
    color: "var(--mantine-color-green-1)",
  },
  {
    name: "Orange",
    color: "var(--mantine-color-orange-1)",
  },
  {
    name: "Pink",
    color: "var(--mantine-color-pink-1)",
  },
  {
    name: "Gray",
    color: "var(--mantine-color-gray-1)",
  },
];

interface ColorSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
  const { editor } = useEditor();

  if (!editor) return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) =>
    editor.isActive("textStyle", { color })
  );

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
    editor.isActive("highlight", { color })
  );

  return (
    <Popover opened={open} onChange={onOpenChange} position="bottom-start">
      <Popover.Target>
        <Button 
          size="xs" 
          variant="subtle"
          styles={{
            root: {
              gap: '8px',
              padding: '4px 8px',
            }
          }}
        >
          <span
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color,
              padding: '0 4px',
              borderRadius: 'var(--mantine-radius-xs)',
            }}
          >
            A
          </span>
          <TbChevronDown size={16} />
        </Button>
      </Popover.Target>

      <Popover.Dropdown
        style={{
          maxHeight: '320px',
          width: '192px',
          overflow: 'hidden auto',
          padding: '4px',
        }}
      >
        <div>
          <Text size="sm" fw={600} c="dimmed" px={8} my={4}>
            Color
          </Text>
          {TEXT_COLORS.map(({ name, color }) => (
            <EditorBubbleItem
              key={name}
              onSelect={() => {
                editor.commands.unsetColor();
                name !== "Default" &&
                  editor
                    .chain()
                    .focus()
                    .setColor(color || "")
                    .run();
                onOpenChange(false);
              }}
              style={{
                display: 'flex',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                fontSize: 'var(--mantine-font-size-sm)',
                ':hover': {
                  backgroundColor: 'var(--mantine-color-gray-1)'
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{ 
                    color,
                    border: '1px solid var(--mantine-color-gray-3)',
                    borderRadius: 'var(--mantine-radius-xs)',
                    padding: '0 8px'
                  }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
            </EditorBubbleItem>
          ))}
        </div>
        <div>
          <Text size="sm" fw={600} c="dimmed" px={8} my={4}>
            Background
          </Text>
          {HIGHLIGHT_COLORS.map(({ name, color }) => (
            <EditorBubbleItem
              key={name}
              onSelect={() => {
                editor.commands.unsetHighlight();
                name !== "Default" &&
                  editor.chain().focus().setHighlight({ color }).run();
                onOpenChange(false);
              }}
              style={{
                display: 'flex',
                cursor: 'pointer', 
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                fontSize: 'var(--mantine-font-size-sm)',
                ':hover': {
                  backgroundColor: 'var(--mantine-color-gray-1)'
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    backgroundColor: color,
                    border: '1px solid var(--mantine-color-gray-3)',
                    borderRadius: 'var(--mantine-radius-xs)',
                    padding: '0 8px'
                  }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
              {editor.isActive("highlight", { color }) && (
                <TbCheck size={16} />
              )}
            </EditorBubbleItem>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
