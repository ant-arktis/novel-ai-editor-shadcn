import { Button } from "@mantine/core";
import { TbMathFunction } from "react-icons/tb";
import { useEditor } from "novel";

export const MathSelector = () => {
  const { editor } = useEditor();

  if (!editor) return null;

  return (
    <Button
      variant="subtle"
      size="sm"
      styles={{
        root: {
          borderRadius: 0,
          width: '48px',
          padding: '6px 8px'
        }
      }}
      onClick={(evt) => {
        if (editor.isActive("math")) {
          editor.chain().focus().unsetLatex().run();
        } else {
          const { from, to } = editor.state.selection;
          const latex = editor.state.doc.textBetween(from, to);

          if (!latex) return;

          editor.chain().focus().setLatex({ latex }).run();
        }
      }}
    >
      <TbMathFunction
        style={{
          width: '16px',
          height: '16px',
          color: editor.isActive("math") ? 'var(--mantine-color-blue-5)' : 'inherit',
          strokeWidth: 2.3
        }}
      />
    </Button>
  );
};
