import { RichTextViewerProps } from "@/app/types/RichTextInterfaces";

export default function RichTextViewer({ content }: RichTextViewerProps) {
    return (
        <div
            className="prose prose-invert max-w-none [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
} 