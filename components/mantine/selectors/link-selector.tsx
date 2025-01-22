import { Button, Popover, TextInput } from "@mantine/core";
import { TbCheck, TbTrash } from "react-icons/tb";
import { useEditor } from "novel";
import { useEffect, useRef } from "react";

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (_e) {
    return null;
  }
}

interface LinkSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LinkSelector = ({ open, onOpenChange }: LinkSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { editor } = useEditor();

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current?.focus();
  });

  if (!editor) return null;

  return (
    <Popover opened={open} onChange={onOpenChange} width={240} position="bottom-start" offset={10} withArrow>
      <Popover.Target>
        <Button
          variant="subtle"
          size="sm"
          styles={{
            root: {
              gap: '8px',
              borderRadius: 0,
              border: 'none',
              padding: '6px 8px'
            },
            label: {
              display: 'flex',
              alignItems: 'center'
            }
          }}
        >
          <span style={{ fontSize: '16px' }}>↗</span>
          <span style={{ 
            textDecoration: 'underline',
            textDecorationColor: 'var(--mantine-color-gray-5)',
            textUnderlineOffset: '4px',
            color: editor.isActive("link") ? 'var(--mantine-color-blue-5)' : 'inherit'
          }}>
            Link
          </span>
        </Button>
      </Popover.Target>
      <Popover.Dropdown p={4}>
        <form
          onSubmit={(e) => {
            const target = e.currentTarget as HTMLFormElement;
            e.preventDefault();
            const input = target[0] as HTMLInputElement;
            const url = getUrlFromString(input.value);
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
              onOpenChange(false);
            }
          }}
          style={{ display: 'flex', gap: '4px' }}
        >
          <TextInput
            ref={inputRef}
            placeholder="Paste a link"
            defaultValue={editor.getAttributes("link").href || ""}
            styles={{
              input: {
                fontSize: '14px'
              }
            }}
          />
          {editor.getAttributes("link").href ? (
            <Button
              variant="outline"
              color="red"
              size="sm"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
                onOpenChange(false);
              }}
              px={8}
            >
              <TbTrash size={16} />
            </Button>
          ) : (
            <Button size="sm" px={8}>
              <TbCheck size={16} />
            </Button>
          )}
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};
