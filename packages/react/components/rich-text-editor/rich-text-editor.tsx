"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  ListChecks,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Code,
  RemoveFormatting,
  ChevronDown,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Ported from RichTextEditor.vue's <style> block. Injected once so the
// component ships self-contained (placeholder, prose overrides, task-list,
// blockquote/code/hr/link styling). Selectors match the Vue source 1:1.
const richTextEditorCss = `
/* Editor placeholder */
.rich-text-editor .tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--muted-foreground);
  opacity: 0.5;
  pointer-events: none;
  height: 0;
}

/* Prose overrides for compact styling */
.rich-text-content .tiptap {
  min-height: inherit;
}

.rich-text-content .tiptap > *:first-child {
  margin-top: 0;
}

.rich-text-content .tiptap > *:last-child {
  margin-bottom: 0;
}

.rich-text-content .tiptap h1 {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.rich-text-content .tiptap h2 {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  margin-top: 0.75rem;
  margin-bottom: 0.375rem;
}

.rich-text-content .tiptap p {
  font-size: 0.875rem;
  line-height: 1.6;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.rich-text-content .tiptap ul,
.rich-text-content .tiptap ol {
  padding-left: 1.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.rich-text-content .tiptap li {
  font-size: 0.875rem;
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
}

.rich-text-content .tiptap blockquote {
  border-left: 3px solid var(--border);
  padding-left: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--muted-foreground);
  font-style: italic;
}

.rich-text-content .tiptap code {
  background: var(--muted);
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-size: 0.8rem;
  font-family: ui-monospace, monospace;
}

.rich-text-content .tiptap pre {
  background: var(--muted);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.rich-text-content .tiptap pre code {
  background: none;
  padding: 0;
  font-size: 0.8rem;
}

.rich-text-content .tiptap hr {
  border-color: var(--border);
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

/* Task list styling */
.rich-text-content .tiptap ul[data-type='taskList'] {
  list-style: none;
  padding-left: 0;
}

.rich-text-content .tiptap ul[data-type='taskList'] li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.rich-text-content .tiptap ul[data-type='taskList'] li > label {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.rich-text-content .tiptap ul[data-type='taskList'] li > label input[type='checkbox'] {
  accent-color: var(--primary);
  width: 0.875rem;
  height: 0.875rem;
  cursor: pointer;
}

.rich-text-content .tiptap ul[data-type='taskList'] li > div {
  flex: 1;
}

/* Link styling */
.rich-text-content .tiptap a {
  color: var(--primary);
  text-decoration: underline;
  cursor: pointer;
}
`;

export interface RichTextEditorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  minHeight?: string;
}

interface ToolbarItem {
  type: "button" | "separator";
  icon?: React.ComponentType<{ className?: string }>;
  action?: () => void;
  isActive?: () => boolean;
  title?: string;
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value = "",
      onValueChange,
      placeholder = "Start writing...",
      className,
      editorClassName,
      minHeight = "120px",
    },
    ref,
  ) => {
    const [showExtended, setShowExtended] = React.useState(false);

    const editor = useEditor({
      content: value,
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          // StarterKit ships its own link + underline since v3 — disable them so
          // we can register the standalone packages with our own configuration
          // without TipTap warning about duplicate extension names.
          link: false,
          underline: false,
        }),
        Placeholder.configure({ placeholder }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: "text-primary underline cursor-pointer" },
        }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TaskList,
        TaskItem.configure({ nested: true }),
      ],
      editorProps: {
        attributes: {
          class:
            "prose prose-sm dark:prose-invert max-w-none focus:outline-none",
        },
      },
      onUpdate: ({ editor: e }) => {
        onValueChange?.(e.getHTML());
      },
    });

    React.useEffect(() => {
      if (editor && editor.getHTML() !== value) {
        editor.commands.setContent(value || "", { emitUpdate: false });
      }
    }, [editor, value]);

    const toggleLink = React.useCallback(() => {
      if (!editor) return;
      if (editor.isActive("link")) {
        editor.chain().focus().unsetLink().run();
      } else {
        const url = window.prompt("Enter URL");
        if (url) {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }
      }
    }, [editor]);

    const essentialItems = React.useMemo<ToolbarItem[]>(() => {
      if (!editor) return [];
      const e = editor;
      return [
        {
          type: "button",
          icon: Bold,
          action: () => e.chain().focus().toggleBold().run(),
          isActive: () => e.isActive("bold"),
          title: "Bold",
        },
        {
          type: "button",
          icon: Italic,
          action: () => e.chain().focus().toggleItalic().run(),
          isActive: () => e.isActive("italic"),
          title: "Italic",
        },
        {
          type: "button",
          icon: UnderlineIcon,
          action: () => e.chain().focus().toggleUnderline().run(),
          isActive: () => e.isActive("underline"),
          title: "Underline",
        },
        {
          type: "button",
          icon: Strikethrough,
          action: () => e.chain().focus().toggleStrike().run(),
          isActive: () => e.isActive("strike"),
          title: "Strikethrough",
        },
        { type: "separator" },
        {
          type: "button",
          icon: List,
          action: () => e.chain().focus().toggleBulletList().run(),
          isActive: () => e.isActive("bulletList"),
          title: "Bullet list",
        },
        {
          type: "button",
          icon: ListOrdered,
          action: () => e.chain().focus().toggleOrderedList().run(),
          isActive: () => e.isActive("orderedList"),
          title: "Numbered list",
        },
        { type: "separator" },
        {
          type: "button",
          icon: LinkIcon,
          action: toggleLink,
          isActive: () => e.isActive("link"),
          title: "Link",
        },
        { type: "separator" },
        {
          type: "button",
          icon: Undo2,
          action: () => e.chain().focus().undo().run(),
          isActive: () => false,
          title: "Undo",
        },
        {
          type: "button",
          icon: Redo2,
          action: () => e.chain().focus().redo().run(),
          isActive: () => false,
          title: "Redo",
        },
      ];
    }, [editor, toggleLink]);

    const extendedItems = React.useMemo<ToolbarItem[]>(() => {
      if (!editor) return [];
      const e = editor;
      return [
        {
          type: "button",
          icon: Heading1,
          action: () => e.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => e.isActive("heading", { level: 1 }),
          title: "Heading 1",
        },
        {
          type: "button",
          icon: Heading2,
          action: () => e.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => e.isActive("heading", { level: 2 }),
          title: "Heading 2",
        },
        { type: "separator" },
        {
          type: "button",
          icon: Code,
          action: () => e.chain().focus().toggleCode().run(),
          isActive: () => e.isActive("code"),
          title: "Inline code",
        },
        {
          type: "button",
          icon: Quote,
          action: () => e.chain().focus().toggleBlockquote().run(),
          isActive: () => e.isActive("blockquote"),
          title: "Blockquote",
        },
        {
          type: "button",
          icon: Minus,
          action: () => e.chain().focus().setHorizontalRule().run(),
          isActive: () => false,
          title: "Divider",
        },
        {
          type: "button",
          icon: ListChecks,
          action: () => e.chain().focus().toggleTaskList().run(),
          isActive: () => e.isActive("taskList"),
          title: "Task list",
        },
        { type: "separator" },
        {
          type: "button",
          icon: AlignLeft,
          action: () => e.chain().focus().setTextAlign("left").run(),
          isActive: () => e.isActive({ textAlign: "left" }),
          title: "Align left",
        },
        {
          type: "button",
          icon: AlignCenter,
          action: () => e.chain().focus().setTextAlign("center").run(),
          isActive: () => e.isActive({ textAlign: "center" }),
          title: "Align center",
        },
        {
          type: "button",
          icon: AlignRight,
          action: () => e.chain().focus().setTextAlign("right").run(),
          isActive: () => e.isActive({ textAlign: "right" }),
          title: "Align right",
        },
        { type: "separator" },
        {
          type: "button",
          icon: RemoveFormatting,
          action: () => e.chain().focus().clearNodes().unsetAllMarks().run(),
          isActive: () => false,
          title: "Clear formatting",
        },
      ];
    }, [editor]);

    React.useEffect(() => {
      return () => {
        editor?.destroy();
      };
    }, [editor]);

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="rich-text-editor"
        className={cn("rich-text-editor rounded-lg border", className)}
      >
        <style dangerouslySetInnerHTML={{ __html: richTextEditorCss }} />
        {/* Toolbar */}
        {editor && (
          <div className="border-b" role="toolbar" aria-label="Text formatting">
            {/* Essential row */}
            <div className="flex items-center gap-0.5 px-2 py-1.5">
              {essentialItems.map((item, i) =>
                item.type === "separator" ? (
                  <Separator
                    key={"e" + i}
                    orientation="vertical"
                    className="mx-1 h-5"
                  />
                ) : (
                  <Toggle
                    key={"e" + i}
                    size="sm"
                    pressed={item.isActive?.()}
                    title={item.title}
                    aria-label={item.title}
                    className="focus-visible:ring-ring size-7 p-0 focus-visible:ring-2 focus-visible:outline-none"
                    onClick={() => item.action?.()}
                  >
                    {item.icon && (
                      <item.icon className="size-3.5" aria-hidden="true" />
                    )}
                  </Toggle>
                ),
              )}

              <Separator orientation="vertical" className="mx-1 h-5" />

              {/* Expand toggle */}
              <button
                type="button"
                title={showExtended ? "Hide more options" : "Show more options"}
                aria-label={
                  showExtended ? "Hide more options" : "Show more options"
                }
                aria-expanded={showExtended}
                className={cn(
                  "text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  showExtended && "bg-muted text-foreground",
                )}
                onClick={() => setShowExtended((v) => !v)}
              >
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    showExtended && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Extended row (collapsible) */}
            <div
              className={cn(
                "grid transition-colors duration-200 ease-in-out",
                showExtended
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex items-center gap-0.5 border-t px-2 py-1.5">
                  {extendedItems.map((item, i) =>
                    item.type === "separator" ? (
                      <Separator
                        key={"x" + i}
                        orientation="vertical"
                        className="mx-1 h-5"
                      />
                    ) : (
                      <Toggle
                        key={"x" + i}
                        size="sm"
                        pressed={item.isActive?.()}
                        title={item.title}
                        aria-label={item.title}
                        className="focus-visible:ring-ring size-7 p-0 focus-visible:ring-2 focus-visible:outline-none"
                        onClick={() => item.action?.()}
                      >
                        {item.icon && (
                          <item.icon className="size-3.5" aria-hidden="true" />
                        )}
                      </Toggle>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editor */}
        <EditorContent
          editor={editor}
          className={cn(
            "rich-text-content cursor-text overflow-y-auto px-3 py-2",
            editorClassName,
          )}
          style={{ minHeight }}
          onClick={() => editor?.commands.focus()}
        />
      </div>
    );
  },
);
RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor };
