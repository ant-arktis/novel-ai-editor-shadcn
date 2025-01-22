"use client";
import { defaultEditorContent } from "@/lib/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Box, Group, Text, Paper } from "@mantine/core";
import { handleImageDrop, handleImagePaste } from "novel/plugins";

// Mantine-specific components
import { defaultExtensions } from "./extensions-mantine";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { MathSelector } from "./selectors/math-selector";
import { TextButtons } from "./selectors/text-buttons";
import { Separator } from "./ui/separator";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload-mantine";
import { slashCommand, suggestionItems } from "./slash-command-mantine";

// Shared icons (from tailwind)
import CrazySpinner from "@/components/tailwind/ui/icons/crazy-spinner";
import Magic from "@/components/tailwind/ui/icons/magic";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

const MantineAdvancedEditor = () => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setCharsCount(editor.storage.characterCount.words());
      window.localStorage.setItem(
        "html-content",
        highlightCodeblocks(editor.getHTML())
      );
      window.localStorage.setItem("novel-content", JSON.stringify(json));
      window.localStorage.setItem(
        "markdown",
        editor.storage.markdown.getMarkdown()
      );
      setSaveStatus("Saved");
    },
    500
  );

  useEffect(() => {
    const content = window.localStorage.getItem("novel-content");
    if (content) setInitialContent(JSON.parse(content));
    else setInitialContent(defaultEditorContent);
  }, []);

  if (!initialContent) return null;

  return (
    <Box pos="relative" w="100%" maw="100%" style={{ maxWidth: '1024px' }}>
      <Group pos="absolute" right={20} top={20} style={{ zIndex: 10, marginBottom: '1.25rem' }} spacing="sm">
        <Paper p="xs" radius="lg" bg="gray.1">
          <Text size="sm" c="dimmed">{saveStatus}</Text>
        </Paper>
        {charsCount && (
          <Paper p="xs" radius="lg" bg="gray.1">
            <Text size="sm" c="dimmed">{charsCount} Words</Text>
          </Paper>
        )}
      </Group>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          style={{
            position: 'relative',
            minHeight: '500px',
            width: '100%',
            maxWidth: '1024px',
            background: 'white',
            marginBottom: 'calc(20vh)',
            borderRadius: '0.5rem',
            border: '1px solid #e5e5e5',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              style: {
                fontSize: '1.125rem',
                lineHeight: '1.75rem',
                outline: 'none',
                maxWidth: '100%'
              }
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand style={{
            zIndex: 50,
            height: 'auto',
            maxHeight: '330px',
            overflowY: 'auto',
            borderRadius: '0.375rem',
            border: '1px solid #e5e5e5',
            background: 'white',
            padding: '0.25rem 0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s'
          }}>
            <EditorCommandEmpty style={{ padding: '0 0.5rem', color: '#666' }}>
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderRadius: '0.375rem',
                    padding: '0.25rem 0.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#f1f3f5'
                    },
                    '&[aria-selected="true"]': {
                      background: '#f1f3f5'
                    }
                  }}
                  key={item.title}
                >
                  <Box style={{
                    display: 'flex',
                    height: '2.5rem',
                    width: '2.5rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e5e5',
                    background: 'white'
                  }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Text fw={500}>{item.title}</Text>
                    <Text size="xs" c="dimmed">
                      {item.description}
                    </Text>
                  </Box>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </Box>
  );
};

export default MantineAdvancedEditor;
