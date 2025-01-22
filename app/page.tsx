import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import MantineAdvancedEditor from "@/components/mantine/advanced-editor-mantine";


export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">
      <h1>Share your story here</h1>
      {/* <TailwindAdvancedEditor /> */}
      <MantineAdvancedEditor />
    </div>
  );
}
