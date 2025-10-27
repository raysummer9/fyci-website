'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Palette,
  Plus,
  Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useCallback, useEffect, useRef } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const MenuButton = ({ 
  onClick, 
  isActive, 
  disabled, 
  children, 
  title 
}: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title?: string
}) => (
  <Button
    type="button"
    variant={isActive ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className="h-8 w-8 p-0"
  >
    {children}
  </Button>
)

export default function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [uploading, setUploading] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false)
      }
    }

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColorPicker])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = linkUrl || window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setShowLinkInput(false)
      setLinkUrl('')
      return
    }

    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()

    setShowLinkInput(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  const setImage = useCallback(() => {
    if (!editor || !imageUrl) return

    editor.chain().focus().setImage({ src: imageUrl }).run()
    setShowImageInput(false)
    setImageUrl('')
  }, [editor, imageUrl])

  const handleFileUpload = useCallback(async (file: File) => {
    if (!editor) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/admin/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        editor.chain().focus().setImage({ src: result.url }).run()
      } else {
        alert(result.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </MenuButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </MenuButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </MenuButton>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-1 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <span className="text-xs font-bold">L</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <span className="text-xs font-bold">C</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <span className="text-xs font-bold">R</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <span className="text-xs font-bold">J</span>
          </MenuButton>
        </div>

        {/* Color Picker */}
        <div className="flex gap-1 mr-2">
          <div className="relative" ref={colorPickerRef}>
            <MenuButton
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Text Color"
            >
              <Palette className="h-4 w-4" />
            </MenuButton>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <div className="grid grid-cols-6 gap-1">
                  {[
                    '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#ffffff',
                    '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a',
                    '#059669', '#0891b2', '#0284c7', '#2563eb', '#4f46e5', '#7c3aed',
                    '#9333ea', '#c026d3', '#db2777', '#e11d48', '#f43f5e', '#fb7185'
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run()
                        setShowColorPicker(false)
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    className="text-xs text-gray-600 hover:text-gray-800"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run()
                      setShowColorPicker(false)
                    }}
                  >
                    Remove Color
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex gap-1 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            disabled={!editor.isActive('table')}
            title="Add Column Before"
          >
            <Plus className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.isActive('table')}
            title="Add Column After"
          >
            <Plus className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.isActive('table')}
            title="Delete Column"
          >
            <Minus className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().addRowBefore().run()}
            disabled={!editor.isActive('table')}
            title="Add Row Before"
          >
            <Plus className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.isActive('table')}
            title="Add Row After"
          >
            <Plus className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.isActive('table')}
            title="Delete Row"
          >
            <Minus className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.isActive('table')}
            title="Delete Table"
          >
            <TableIcon className="h-4 w-4" />
          </MenuButton>
        </div>

        {/* Links */}
        <div className="flex gap-1 mr-2">
          <MenuButton
            onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run()
              } else {
                setShowLinkInput(true)
              }
            }}
            isActive={editor.isActive('link')}
            title="Link"
          >
            {editor.isActive('link') ? <Unlink className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
          </MenuButton>
          <div className="relative">
            <MenuButton
              onClick={() => setShowImageInput(true)}
              title="Image - Click for URL input, drag file over for upload"
            >
              <ImageIcon className="h-4 w-4" />
            </MenuButton>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileUpload(file)
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Upload image from file"
            />
          </div>
        </div>

        {/* History */}
        <div className="flex gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </MenuButton>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  setLink()
                }
                if (e.key === 'Escape') {
                  setShowLinkInput(false)
                  setLinkUrl('')
                }
              }}
              className="flex-1"
            />
            <Button type="button" onClick={setLink} size="sm">
              Set Link
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowLinkInput(false)
                setLinkUrl('')
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="mb-2 text-sm text-gray-600">
            You can either upload an image file by clicking the image button above, or enter an image URL below:
          </div>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  setImage()
                }
                if (e.key === 'Escape') {
                  setShowImageInput(false)
                  setImageUrl('')
                }
              }}
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={setImage} 
              size="sm" 
              disabled={!imageUrl || uploading}
            >
              {uploading ? 'Uploading...' : 'Insert Image'}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowImageInput(false)
                setImageUrl('')
              }}
              variant="outline"
              size="sm"
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="p-4 min-h-[400px]">
        <EditorContent 
          editor={editor}
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none"
        />
      </div>

      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 300px;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }

        .ProseMirror a:hover {
          color: #1d4ed8;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          font-weight: bold;
          margin: 1.5rem 0 1rem 0;
        }

        .ProseMirror h1 {
          font-size: 2rem;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
        }

        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
        }

        .ProseMirror pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
        }

        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
        }

        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #d1d5db;
          padding: 0.5rem;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: #f9fafb;
        }

        .ProseMirror table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }

        .ProseMirror table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #3b82f6;
          pointer-events: none;
        }

        .ProseMirror table p {
          margin: 0;
        }

        .ProseMirror .tableWrapper {
          padding: 1rem 0;
          overflow-x: auto;
        }

        .ProseMirror .resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }
      `}</style>
    </div>
  )
}
