export interface LexicalEditorProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    required?: boolean;
}

export interface RichTextViewerProps {
    content: string;
}