import {
  AIHighlight,
  CharacterCount,
  CodeBlockLowlight,
  Color,
  CustomKeymap,
  GlobalDragHandle,
  HighlightExtension,
  HorizontalRule,
  MarkdownExtension,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  Twitter,
  UpdatedImage,
  Youtube,
  Mathematics,
} from "novel/extensions";
import { UploadImagesPlugin } from "novel/plugins";

import { common, createLowlight } from "lowlight";

const aiHighlight = AIHighlight;
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    style: {
      color: 'var(--mantine-color-dimmed)',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      cursor: 'pointer',
      transition: 'color 0.2s',
      ':hover': {
        color: 'var(--mantine-color-primary)'
      }
    }
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: '',
        imageStyle: {
          opacity: 0.4,
          borderRadius: 'var(--mantine-radius-lg)',
          border: '1px solid var(--mantine-color-gray-2)'
        }
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    style: {
      borderRadius: 'var(--mantine-radius-lg)',
      border: '1px solid var(--mantine-color-gray-2)'
    }
  },
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    style: {
      borderRadius: 'var(--mantine-radius-lg)',
      border: '1px solid var(--mantine-color-gray-2)'
    }
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    style: {
      paddingLeft: '0.5rem'
    }
  },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    style: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'flex-start',
      margin: '1rem 0'
    }
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    style: {
      marginTop: '1rem',
      marginBottom: '1.5rem',
      borderTop: '1px solid var(--mantine-color-dimmed)'
    }
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      style: {
        listStyleType: 'disc',
        listStylePosition: 'outside',
        lineHeight: '0.75',
        marginTop: '-0.5rem'
      }
    },
  },
  orderedList: {
    HTMLAttributes: {
      style: {
        listStyleType: 'decimal',
        listStylePosition: 'outside',
        lineHeight: '0.75',
        marginTop: '-0.5rem'
      }
    },
  },
  listItem: {
    HTMLAttributes: {
      style: {
        lineHeight: 'normal',
        marginBottom: '-0.5rem'
      }
    },
  },
  blockquote: {
    HTMLAttributes: {
      style: {
        borderLeft: '4px solid var(--mantine-color-primary)',
        paddingLeft: '1rem'
      }
    },
  },
  codeBlock: {
    HTMLAttributes: {
      style: {
        borderRadius: 'var(--mantine-radius-md)',
        backgroundColor: 'var(--mantine-color-gray-1)',
        color: 'var(--mantine-color-dimmed)',
        border: '1px solid var(--mantine-color-gray-2)',
        padding: '1.25rem',
        fontFamily: 'monospace',
        fontWeight: 500
      }
    },
  },
  code: {
    HTMLAttributes: {
      style: {
        borderRadius: 'var(--mantine-radius-md)',
        backgroundColor: 'var(--mantine-color-gray-1)',
        padding: '0.375rem 0.375rem',
        fontFamily: 'monospace',
        fontWeight: 500
      },
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "var(--mantine-color-blue-1)",
    width: 4,
  },
  gapcursor: false,
});

const codeBlockLowlight = CodeBlockLowlight.configure({
  lowlight: createLowlight(common),
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    style: {
      borderRadius: 'var(--mantine-radius-lg)',
      border: '1px solid var(--mantine-color-gray-2)'
    }
  },
  inline: false,
});

const twitter = Twitter.configure({
  HTMLAttributes: {
    style: {
      all: 'revert'
    }
  },
  inline: false,
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    style: {
      color: 'var(--mantine-color-text)',
      borderRadius: 'var(--mantine-radius-sm)',
      padding: '0.25rem',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: 'var(--mantine-color-gray-1)'
      }
    }
  },
  katexOptions: {
    throwOnError: false,
  },
});

const characterCount = CharacterCount.configure();

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  codeBlockLowlight,
  youtube,
  twitter,
  mathematics,
  characterCount,
  TiptapUnderline,
  MarkdownExtension,
  HighlightExtension,
  TextStyle,
  Color,
  CustomKeymap,
  GlobalDragHandle,
];
