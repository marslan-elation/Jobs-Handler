import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, TextFormatType, $createParagraphNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Quote, Eraser, Pilcrow } from 'lucide-react';
import React from 'react';
import { LexicalEditorProps } from '@/app/types/RichTextInterfaces';

const theme = {
    ltr: 'ltr',
    rtl: 'rtl',
    placeholder: 'editor-placeholder',
    paragraph: 'editor-paragraph',
    quote: 'editor-quote',
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
        h4: 'editor-heading-h4',
        h5: 'editor-heading-h5',
        h6: 'editor-heading-h6',
    },
    list: {
        nested: {
            listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listitem',
    },
    image: 'editor-image',
    link: 'editor-link',
    text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
        underlineStrikethrough: 'editor-text-underlineStrikethrough',
    },
};

const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError: (error: Error) => {
        console.error(error);
    },
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
    ],
};

function OnChangePlugin({ onChange }: { onChange: (value: string) => void }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState.read(() => editor.getRootElement()?.innerHTML || ''));
        });
    }, [editor, onChange]);

    return null;
}

function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [activeFormats, setActiveFormats] = React.useState<{ [key: string]: boolean }>({});
    const [blockType, setBlockType] = React.useState<string>('paragraph');

    React.useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    setActiveFormats({
                        bold: selection.hasFormat('bold'),
                        italic: selection.hasFormat('italic'),
                        underline: selection.hasFormat('underline'),
                    });
                    const anchorNode = selection.anchor.getNode();
                    const parent = anchorNode.getParent();
                    let type = anchorNode.getType();
                    if (parent) type = parent.getType();
                    setBlockType(type);
                }
            });
        });
    }, [editor]);

    const formatText = (format: TextFormatType) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    // Node transforms for block types
    const setParagraph = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const nodes = selection.getNodes();
                nodes.forEach(node => {
                    node.replace($createParagraphNode());
                });
            }
        });
    };
    const setHeading = (tag: 'h1' | 'h2') => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const nodes = selection.getNodes();
                nodes.forEach(node => {
                    node.replace(new HeadingNode(tag));
                });
            }
        });
    };
    const setQuote = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const nodes = selection.getNodes();
                nodes.forEach(node => {
                    node.replace(new QuoteNode());
                });
            }
        });
    };
    const clearFormatting = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                selection.formatText('bold', 0);
                selection.formatText('italic', 0);
                selection.formatText('underline', 0);
                selection.formatText('strikethrough', 0);
                selection.formatText('code', 0);
                selection.formatText('subscript', 0);
                selection.formatText('superscript', 0);
                selection.formatText('highlight', 0);
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    };
    const insertUnorderedList = () => {
        if (blockType === 'bullet') {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
    };
    const insertOrderedList = () => {
        if (blockType === 'number') {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
    };

    return (
        <div className="toolbar border-b p-2 flex gap-2">
            <button
                type="button"
                onClick={() => formatText('bold')}
                className={`p-1 hover:bg-gray-700 rounded${activeFormats.bold ? ' bg-gray-700' : ''}`}
                title="Bold"
            >
                <Bold size={16} />
            </button>
            <button
                type="button"
                onClick={() => formatText('italic')}
                className={`p-1 hover:bg-gray-700 rounded${activeFormats.italic ? ' bg-gray-700' : ''}`}
                title="Italic"
            >
                <Italic size={16} />
            </button>
            <button
                type="button"
                onClick={() => formatText('underline')}
                className={`p-1 hover:bg-gray-700 rounded${activeFormats.underline ? ' bg-gray-700' : ''}`}
                title="Underline"
            >
                <Underline size={16} />
            </button>
            <button
                type="button"
                onClick={clearFormatting}
                className="p-1 hover:bg-gray-700 rounded"
                title="Clear Formatting"
            >
                <Eraser size={16} />
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1" />
            <button
                type="button"
                onClick={setParagraph}
                className={`p-1 hover:bg-gray-700 rounded${blockType === 'paragraph' ? ' bg-gray-700' : ''}`}
                title="Normal"
            >
                <Pilcrow size={16} />
            </button>
            <button
                type="button"
                onClick={() => setHeading('h1')}
                className={`p-1 hover:bg-gray-700 rounded${blockType === 'heading' ? ' bg-gray-700' : ''}`}
                title="Heading 1"
            >
                <Heading1 size={16} />
            </button>
            <button
                type="button"
                onClick={() => setHeading('h2')}
                className={`p-1 hover:bg-gray-700 rounded${blockType === 'heading' ? ' bg-gray-700' : ''}`}
                title="Heading 2"
            >
                <Heading2 size={16} />
            </button>
            <button
                type="button"
                onClick={setQuote}
                className={`p-1 hover:bg-gray-700 rounded${blockType === 'quote' ? ' bg-gray-700' : ''}`}
                title="Quote"
            >
                <Quote size={16} />
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1" />
            <button
                type="button"
                onClick={insertUnorderedList}
                className={`p-1 hover:bg-gray-700 rounded${blockType === 'bullet' ? ' bg-gray-700' : ''}`}
                title="Bullet List"
            >
                <List size={16} />
            </button>
            <button
                type="button"
                onClick={insertOrderedList}
                className={`p-1 hover:bg-gray-700 rounded${blockType === 'number' ? ' bg-gray-700' : ''}`}
                title="Numbered List"
            >
                <ListOrdered size={16} />
            </button>
        </div>
    );
}

export default function LexicalEditor({ onChange, label, required = false }: LexicalEditorProps) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="border rounded-md shadow-sm bg-black">
                <LexicalComposer initialConfig={initialConfig}>
                    <div className="editor-container">
                        <ToolbarPlugin />
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="editor-input min-h-[150px] p-3 list-disc list-decimal" />}
                            placeholder={<div className="editor-placeholder p-3 mt-6 text-gray-500">Enter some text...</div>}
                            ErrorBoundary={({ children }) => <div>{children}</div>}
                        />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <LinkPlugin />
                        <ListPlugin />
                        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                        <OnChangePlugin onChange={onChange} />
                    </div>
                </LexicalComposer>
            </div>
        </div>
    );
} 