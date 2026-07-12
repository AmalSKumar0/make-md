import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="markdown-body px-8 py-6 h-full w-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || '*Start typing to see preview...*'}
      </ReactMarkdown>
    </div>
  );
}
