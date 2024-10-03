import React from "react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula, github } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const { theme } = useTheme();
  const syntaxStyle = theme === "dark" ? darcula : github;

  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-6 mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold mt-5 mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold mt-3 mb-2">{children}</h4>
        ),
        p: ({ children }) => <p className="mb-4">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-4">{children}</ol>
        ),
        li: ({ children }) => <li className="mb-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-4 border-gray-300" />,
        strong: ({ children }) => (
          <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({
          inline,
          className,
          children,
        }: {
          inline?: boolean;
          className?: string;
          children?: React.ReactNode;
        }) => {
          const match = /language-(\w+)/.exec(className || "");
          return inline ? (
            <code className="bg-background rounded px-1">{children}</code>
          ) : (
            <SyntaxHighlighter
              style={syntaxStyle}
              language={match ? match[1] : ""}
              PreTag="div"
              className="my-4 rounded"
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
