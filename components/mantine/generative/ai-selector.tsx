"use client";

import { createSuggestionItems, Command, renderItems } from "novel/extensions";
import { useCompletion } from "ai/react";
import { useEditor } from "novel";
import { addAIHighlight } from "novel/extensions";
import { getPrevText } from "novel/utils";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "../ui/button";
import CrazySpinner from "../../tailwind/ui/icons/crazy-spinner";
import Magic from "../../tailwind/ui/icons/magic";
import { ScrollArea } from "../ui/scroll-area";
import { TbArrowUp, TbPlayerTrackNext, TbCheck, TbQuote, TbTrash, TbRefreshDot, TbArrowNarrowDown, TbTextWrap, TbFlame, TbSnowflake, TbSwords, TbHeart, TbWind, TbSparkles, TbChevronLeft, TbFolder, TbUser, TbMapPin, TbBox, TbStar } from "react-icons/tb";
import { LuCheckCheck } from "react-icons/lu";
import { Box, Input, Stack, Group, Text, UnstyledButton } from "@mantine/core";
import { WorldBuildingDialog } from "./world-building-dialog";
//TODO: I think it makes more sense to create a custom Tiptap extension for this functionality https://tiptap.dev/docs/editor/ai/introduction

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Add submenu type
type AICommandSubmenu = {
  title: string;
  description: string;
  items: {
    title: string;
    description: string;
    icon: JSX.Element;
    command: ({ editor }: { editor: any }) => void;
    option: string;
  }[];
};

const AI_MENU_ITEM_SPACING = 4; // 4px - controls vertical menu spacing
const AI_PARAGRAPH_SPACING = '4px';// '2rem'; // 32px - controls spacing between paragraphs in the response

// Add state for dialog control
interface DialogState {
  type: "character" | "location" | "item" | "experience";
  title: string;
  description: string;
  text: string;
}

export function AISelector({ open, onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState("");
  const [activeDialog, setActiveDialog] = useState<DialogState | null>(null);

  const { completion, complete, isLoading } = useCompletion({
    // id: "novel",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      } else {
        console.log("response", response);
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const hasCompletion = completion.length > 0;

  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const writingSubmenus: AICommandSubmenu[] = [
    {
      title: "Emotional Tone",
      description: "Adjust the emotional impact",
      items: [
        {
          title: "Increase Emotion",
          description: "Make the text more emotionally charged",
          icon: <TbFlame size={18} />,
          option: "emotion_increase",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            complete(text, { body: { option: "emotion_increase" } });
          },
        },
        {
          title: "Decrease Emotion",
          description: "Make the text more emotionally neutral",
          icon: <TbSnowflake size={18} />,
          option: "emotion_decrease",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            complete(text, { body: { option: "emotion_decrease" } });
          },
        },
      ],
    },
    {
      title: "Narrative Tension",
      description: "Adjust story tension and conflict",
      items: [
        {
          title: "Increase Conflict",
          description: "Add more conflict or tension",
          icon: <TbSwords size={18} />,
          option: "conflict_increase",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            complete(text, { body: { option: "conflict_increase" } });
          },
        },
        {
          title: "Decrease Conflict",
          description: "Reduce conflict or tension",
          icon: <TbHeart size={18} />,
          option: "conflict_decrease",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            complete(text, { body: { option: "conflict_decrease" } });
          },
        },
      ],
    },
    {
      title: "Plot Development",
      description: "Enhance the story structure",
      items: [
        {
          title: "Add Plot Twist",
          description: "Insert an unexpected turn of events",
          icon: <TbWind size={18} />,
          option: "plot_twist",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            complete(text, { body: { option: "plot_twist" } });
          },
        },
        {
          title: "Add Foreshadowing",
          description: "Insert subtle hints about future events",
          icon: <TbSparkles size={18} />,
          option: "foreshadowing",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            complete(text, { body: { option: "foreshadowing" } });
          },
        },
      ],
    },
    {
      title: "World Building",
      description: "Add story elements",
      items: [
        {
          title: "Add Character",
          description: "Add character details",
          icon: <TbUser size={18} />,
          option: "add_character",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            setActiveDialog({
              type: "character",
              title: "Add Character Details",
              description: "Describe the character to add to the story...",
              text
            });
          },
        },
        {
          title: "Add Location",
          description: "Add location details",
          icon: <TbMapPin size={18} />,
          option: "add_location",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            setActiveDialog({
              type: "location",
              title: "Add Location Details",
              description: "Describe the location to add to the story...",
              text
            });
          },
        },
        {
          title: "Add Item",
          description: "Add item details",
          icon: <TbBox size={18} />,
          option: "add_item",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            setActiveDialog({
              type: "item",
              title: "Add Item Details",
              description: "Describe the item to add to the story...",
              text
            });
          },
        },
        {
          title: "Add Experience",
          description: "Add sensory/emotional details",
          icon: <TbStar size={18} />,
          option: "add_experience",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            setActiveDialog({
              type: "experience",
              title: "Add Experience Details",
              description: "Describe the sensory/emotional experience to add...",
              text
            });
          },
        },
      ],
    },
  ];

  // Create the completion commands separately so we can reuse them
  const completionCommands = [
    {
      title: "Replace selection",
      description: "Replace the selected text with AI response",
      icon: <TbCheck size={18} />,
      command: ({ editor }) => {
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
      },
    },
    {
      title: "Insert below",
      description: "Insert AI response below selection",
      icon: <TbQuote size={18} />,
      command: ({ editor }) => {
        const selection = editor.view.state.selection;
        editor
          .chain()
          .focus()
          .insertContentAt(selection.to + 1, completion)
          .run();
      },
    },
    {
      title: "Discard",
      description: "Discard AI response",
      icon: <TbTrash size={18} />,
      command: ({ editor }) => {
        editor.chain().unsetHighlight().focus().run();
        onOpenChange(false);
      },
    },
  ];

  // Modify how we create suggestion items
  const suggestionItems = createSuggestionItems(
    hasCompletion 
      ? completionCommands  // Use completion commands when we have a response
      : [
          {
            title: "Improve writing",
            description: "Make the writing better",
            icon: <TbRefreshDot size={18} />,
            command: ({ editor }) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              complete(text, { body: { option: "improve" } });
            },
          },
          {
            title: "Fix grammar",
            description: "Fix grammar and spelling",
            icon: <LuCheckCheck size={18} />,
            command: ({ editor }) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              complete(text, { body: { option: "fix" } });
            },
          },
          {
            title: "Make shorter",
            description: "Make the text more concise",
            icon: <TbArrowNarrowDown size={18} />,
            command: ({ editor }) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              complete(text, { body: { option: "shorter" } });
            },
          },
          {
            title: "Make longer",
            description: "Expand the text",
            icon: <TbTextWrap size={18} />,
            command: ({ editor }) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              complete(text, { body: { option: "longer" } });
            },
          },
          {
            title: "Continue writing",
            description: "Let AI continue the text",
            icon: <TbPlayerTrackNext size={18} />,
            command: ({ editor }) => {
              const pos = editor.state.selection.from;
              // Get previous context (up to 1000 characters)
              const previousContext = getPrevText(editor, pos, 1000);
              // Get the selected text
              const slice = editor.state.selection.content();
              const selectedText = editor.storage.markdown.serializer.serialize(slice.content);
              
              complete(JSON.stringify({
                context: previousContext,
                selected: selectedText
              }), { body: { option: "continue" } });
            },
          },
        ]
  );

  const aiCommand = Command.configure({
    suggestion: {
      items: () => suggestionItems,
      render: renderItems,
    },
  });

  // Add a check for actual completion content
  const hasValidCompletion = completion && completion.trim().length > 0;

  // Add dialog handler
  const handleDialogSubmit = (details: string) => {
    if (!activeDialog) return;
    
    complete(activeDialog.text, {
      body: { 
        option: `add_${activeDialog.type}`,
        command: details
      }
    });
  };

  return (
    <Box w={350}>
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '80vh' }}>
        {hasCompletion && (
          <Box mah={300} style={{ overflowY: 'auto', flexGrow: 0, flexShrink: 1 }}>
            <ScrollArea>
              <Box p="md">
                <Box 
                  className="prose" 
                  style={{ 
                    '& p': { 
                      marginBottom: AI_PARAGRAPH_SPACING,
                      '&:last-child': {
                        marginBottom: 0
                      }
                    } 
                  }}
                >
                  <Markdown>{completion}</Markdown>
                </Box>
              </Box>
            </ScrollArea>
          </Box>
        )}

        {isLoading && (
          <Group px="md" h={48} align="center" style={{color: '#9333ea'}}>
            {/*<Magic style={{width: 16, height: 16, flexShrink: 0}} />*/}
            <Magic className="w-4 h-4 flex-shrink-0 text-purple-500" />
            <Text size="sm" fw={500}>AI is thinking</Text>
            <Box ml={8} mt={4}>
              <CrazySpinner />
            </Box>
          </Group>
        )}
        {!isLoading && (
          <>
            <Box style={{ borderBottom: '1px solid var(--mantine-color-gray-3)', padding: '0 1rem' }}>
              <Group>
                {/*<Magic style={{width: 16, height: 16, flexShrink: 0, color: '#9333ea'}} />*/}
                <Magic className="w-4 h-4 flex-shrink-0 text-purple-500" />
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    hasCompletion
                      ? "Tell AI what to do next"
                      : "Ask AI to edit or generate..."
                  }
                  styles={{
                    input: {
                      height: 44,
                      background: 'transparent',
                      border: 'none',
                      '&:focus': {
                        outline: 'none'
                      }
                    }
                  }}
                  onFocus={() => {
                    if (editor) {
                      addAIHighlight(editor);
                    }
                  }}
                />
                <Button
                  size="icon"
                  style={{
                    height: 24,
                    width: 24,
                    borderRadius: '50%',
                    background: (!inputValue.trim() && hasCompletion) ? '#d1d5db' : '#9333ea',
                    cursor: (!inputValue.trim() && hasCompletion) ? 'not-allowed' : 'pointer'
                  }}
                  disabled={!inputValue.trim() && hasCompletion}
                  onClick={() => {
                    if (!inputValue.trim() && hasCompletion) return;

                    if (completion)
                      return complete(completion, {
                        body: { option: "zap", command: inputValue },
                      }).then(() => setInputValue(""));

                    const slice = editor?.state.selection.content();
                    if (!editor || !slice) return;
                    const text = editor.storage.markdown.serializer.serialize(
                      slice.content
                    );

                    complete(text, {
                      body: { option: "zap", command: inputValue },
                    }).then(() => setInputValue(""));
                  }}
                >
                  <TbArrowUp style={{width: 16, height: 16}} />
                </Button>
              </Group>
            </Box>
            
            <Box style={{ 
              flexShrink: 0, 
              padding: '0.5rem',
              borderTop: hasCompletion ? '1px solid var(--mantine-color-gray-3)' : 'none'
            }}>
              {editor && (
                <Stack className="novel-command-menu" spacing={AI_MENU_ITEM_SPACING}>
                  {hasCompletion ? (
                    completionCommands.map((item) => (
                      <UnstyledButton
                        key={item.title}
                        style={{
                          opacity: item.title !== "Discard" && !hasValidCompletion ? 0.5 : 1,
                          cursor: item.title !== "Discard" && !hasValidCompletion ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => {
                          if (!hasValidCompletion && item.title !== "Discard") return;
                          item.command({ editor });
                        }}
                      >
                        <Group p={AI_MENU_ITEM_SPACING} style={{borderRadius: 4}}>
                          <Box w={40} h={40} style={{
                            border: '1px solid var(--mantine-color-gray-3)',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {item.icon}
                          </Box>
                          <Box>
                            <Text fw={500}>{item.title}</Text>
                            <Text size="xs" c="dimmed">{item.description}</Text>
                          </Box>
                        </Group>
                      </UnstyledButton>
                    ))
                  ) : activeSubmenu ? (
                    <Stack spacing={AI_MENU_ITEM_SPACING}>
                      <UnstyledButton onClick={() => setActiveSubmenu(null)}>
                        <Group p={AI_MENU_ITEM_SPACING} style={{borderRadius: 4, marginBottom: AI_MENU_ITEM_SPACING}}>
                          <TbChevronLeft style={{width: 16, height: 16}} />
                          <Text>Back</Text>
                        </Group>
                      </UnstyledButton>
                      {writingSubmenus
                        .find((menu) => menu.title === activeSubmenu)
                        ?.items.map((item) => (
                          <UnstyledButton
                            key={item.title}
                            onClick={() => item.command({ editor })}
                          >
                            <Group p={AI_MENU_ITEM_SPACING} style={{borderRadius: 4}}>
                              <Box w={40} h={40} style={{
                                border: '1px solid var(--mantine-color-gray-3)',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {item.icon}
                              </Box>
                              <Box>
                                <Text fw={500}>{item.title}</Text>
                                <Text size="xs" c="dimmed">{item.description}</Text>
                              </Box>
                            </Group>
                          </UnstyledButton>
                        ))}
                    </Stack>
                  ) : (
                    <Stack spacing={AI_MENU_ITEM_SPACING}>
                      {writingSubmenus.map((menu) => (
                        <UnstyledButton
                          key={menu.title}
                          onClick={() => setActiveSubmenu(menu.title)}
                        >
                          <Group p={AI_MENU_ITEM_SPACING} style={{borderRadius: 4}}>
                            <Box w={40} h={40} style={{
                              border: '1px solid var(--mantine-color-gray-3)', 
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <TbFolder style={{width: 16, height: 16}} />
                            </Box>
                            <Box>
                              <Text fw={500}>{menu.title}</Text>
                              <Text size="xs" c="dimmed">{menu.description}</Text>
                            </Box>
                          </Group>
                        </UnstyledButton>
                      ))}
                      {suggestionItems.map((item) => (
                        <UnstyledButton
                          key={item.title}
                          onClick={() => item.command({ editor })}
                        >
                          <Group p={AI_MENU_ITEM_SPACING} style={{borderRadius: 4}}>
                            <Box w={40} h={40} style={{
                              border: '1px solid var(--mantine-color-gray-3)',
                              borderRadius: 4, 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {item.icon}
                            </Box>
                            <Box>
                              <Text fw={500}>{item.title}</Text>
                              <Text size="xs" c="dimmed">{item.description}</Text>
                            </Box>
                          </Group>
                        </UnstyledButton>
                      ))}
                    </Stack>
                  )}
                </Stack>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Add dialog */}
      <WorldBuildingDialog
        opened={!!activeDialog}
        onClose={() => setActiveDialog(null)}
        title={activeDialog?.title || ""}
        description={activeDialog?.description || ""}
        onSubmit={handleDialogSubmit}
      />
    </Box>
  );
}
