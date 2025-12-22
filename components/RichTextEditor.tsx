"use client";

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  height = 400, 
  placeholder = "Start typing...",
  disabled = false 
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="rich-text-editor">
      <Editor
        apiKey="dvw9hv8j79gcnrdy80wopmssm3svpdlap6d433rdioj3yila"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={onChange}
        disabled={disabled}
        init={{
          height: height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
              font-size: 14px;
              background-color: #1f2937;
              color: #e5e7eb;
            }
          `,
          skin: 'oxide-dark',
          content_css: 'dark',
          placeholder: placeholder,
          branding: false,
          promotion: false,
          resize: true,
          statusbar: true,
          elementpath: false,
          contextmenu: false,
          mobile: {
            menubar: true
          }
        }}
      />
    </div>
  );
}
