"use client";

import { createSuggestionItems, Command, renderItems } from "novel/extensions";
import { useCompletion } from "ai/react";
import { ArrowUp, StepForward } from "lucide-react";
import { useEditor } from "novel";
import { addAIHighlight } from "novel/extensions";
import { getPrevText } from "novel/utils";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "../ui/button";
import CrazySpinner from "../ui/icons/crazy-spinner";
import Magic from "../ui/icons/magic";
import { ScrollArea } from "../ui/scroll-area";
import { Check, TextQuote, TrashIcon, RefreshCcwDot, CheckCheck, ArrowDownWideNarrow, WrapText, Flame, Snowflake, Swords, Heart, Wind, Sparkles, ChevronLeft, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
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

export function AISelector({ open, onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState("");

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
          icon: <Flame size={18} />,
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
          icon: <Snowflake size={18} />,
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
          icon: <Swords size={18} />,
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
          icon: <Heart size={18} />,
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
          icon: <Wind size={18} />,
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
          icon: <Sparkles size={18} />,
          option: "foreshadowing",
          command: ({ editor }) => {
            const slice = editor.state.selection.content();
            const text = editor.storage.markdown.serializer.serialize(slice.content);
            complete(text, { body: { option: "foreshadowing" } });
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
      icon: <Check size={18} />,
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
      icon: <TextQuote size={18} />,
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
      icon: <TrashIcon size={18} />,
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
            icon: <RefreshCcwDot size={18} />,
            command: ({ editor }) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              complete(text, { body: { option: "improve" } });
            },
          },
          {
            title: "Fix grammar",
            description: "Fix grammar and spelling",
            icon: <CheckCheck size={18} />,
            command: ({ editor }) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              complete(text, { body: { option: "fix" } });
            },
          },
          {
            title: "Make shorter",
            description: "Make the text more concise",
            icon: <ArrowDownWideNarrow size={18} />,
            command: ({ editor }) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              complete(text, { body: { option: "shorter" } });
            },
          },
          {
            title: "Make longer",
            description: "Expand the text",
            icon: <WrapText size={18} />,
            command: ({ editor }) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              complete(text, { body: { option: "longer" } });
            },
          },
          {
            title: "Continue writing",
            description: "Let AI continue the text",
            icon: <StepForward size={18} />,
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

  return (
    <div className="w-[350px]">
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose p-2 px-4 prose-sm">
              <Markdown>{completion}</Markdown>
            </div>
          </ScrollArea>
        </div>
      )}

      {isLoading && (
        <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
          <Magic className="mr-2 h-4 w-4 shrink-0" />
          AI is thinking
          <div className="ml-2 mt-1">
            <CrazySpinner />
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="relative border-b px-4">
            <div className="flex items-center">
              <Magic className="mr-2 h-4 w-4 shrink-0 text-purple-500" />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  hasCompletion
                    ? "Tell AI what to do next"
                    : "Ask AI to edit or generate..."
                }
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                onFocus={() => {
                  if (editor) {
                    addAIHighlight(editor);
                  }
                }}
              />
              <Button
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-full",
                  // Disable button styling when no input and completion exists
                  (!inputValue.trim() && hasCompletion) 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-purple-500 hover:bg-purple-900"
                )}
                disabled={!inputValue.trim() && hasCompletion} // Disable button when no input and completion exists
                onClick={() => {
                  // Prevent action if there's no input text and we have a completion
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
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="h-auto max-h-[330px] overflow-y-auto px-1 py-2">
              {editor && (
                <div className="novel-command-menu">
                  {hasCompletion ? (
                    completionCommands.map((item) => (
                      <button
                        key={item.title}
                        className={cn(
                          "flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm",
                          // Disable hover and add opacity for non-discard buttons when no valid completion
                          item.title !== "Discard" && !hasValidCompletion
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-accent cursor-pointer"
                        )}
                        onClick={() => {
                          // Only allow discard when no valid completion
                          if (!hasValidCompletion && item.title !== "Discard") return;
                          item.command({ editor });
                        }}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : activeSubmenu ? (
                    // Show submenu items when no completion
                    <>
                      <button
                        className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent mb-2"
                        onClick={() => setActiveSubmenu(null)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back</span>
                      </button>
                      {writingSubmenus
                        .find((menu) => menu.title === activeSubmenu)
                        ?.items.map((item) => (
                          <button
                            key={item.title}
                            className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
                            onClick={() => item.command({ editor })}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                              {item.icon}
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        ))}
                    </>
                  ) : (
                    // Show main menu when no completion and no active submenu
                    <>
                      {writingSubmenus.map((menu) => (
                        <button
                          key={menu.title}
                          className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
                          onClick={() => setActiveSubmenu(menu.title)}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                            <FolderOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{menu.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {menu.description}
                            </p>
                          </div>
                        </button>
                      ))}
                      {/* Add original options after submenus */}
                      {suggestionItems.map((item) => (
                        <button
                          key={item.title}
                          className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
                          onClick={() => item.command({ editor })}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
