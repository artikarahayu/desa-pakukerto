import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="h-64 w-full border rounded-md bg-muted/20 animate-pulse" />,
});

interface DusunEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function DusunEditor({
  value,
  onChange,
  disabled = false,
}: DusunEditorProps) {
  // Use state to handle hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [editorValue, setEditorValue] = useState(value);

  // Update local state when prop value changes
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  // Mark component as mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle editor change
  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  // Quill modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="dusun-editor">Konten Dusun</Label>
      
      {mounted ? (
        <ReactQuill
          id="dusun-editor"
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          readOnly={disabled}
          className="h-64"
        />
      ) : (
        <div className="h-64 w-full border rounded-md bg-muted/20" />
      )}
    </div>
  );
}
