import Link from "next/link";
import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import type { MDXComponents } from "mdx/types";

const linkClassName =
  "font-medium underline decoration-current underline-offset-4 transition-colors hover:text-primary";

const codeBlockThemes = {
  bash: { label: "Bash", themeClassName: "code-block--bash" },
  javascript: {
    label: "JavaScript",
    themeClassName: "code-block--javascript",
  },
  json: { label: "JSON", themeClassName: "code-block--json" },
  mdx: { label: "MDX", themeClassName: "code-block--mdx" },
  text: { label: "Code", themeClassName: "code-block--text" },
  tsx: { label: "TSX", themeClassName: "code-block--tsx" },
  typescript: {
    label: "TypeScript",
    themeClassName: "code-block--typescript",
  },
} as const;

const languageAliases: Record<string, keyof typeof codeBlockThemes> = {
  js: "javascript",
  jsx: "javascript",
  md: "mdx",
  plaintext: "text",
  shell: "bash",
  sh: "bash",
  text: "text",
  ts: "typescript",
};

type CodeBlockTheme = {
  label: string;
  language: string;
  themeClassName: string;
};

type CodeElementProps = ComponentPropsWithoutRef<"code">;
type PreElementProps = ComponentPropsWithoutRef<"pre">;

function getCodeElement(children: ReactNode) {
  return Children.toArray(children).find(
    (child): child is ReactElement<CodeElementProps> => {
      return isValidElement<CodeElementProps>(child) && child.type === "code";
    },
  );
}

function getLanguageFromClassName(className?: string) {
  const languageMatch = className?.match(/language-([a-z0-9+-]+)/i);

  return languageMatch?.[1]?.toLowerCase() ?? "text";
}

export function getCodeBlockTheme(className?: string): CodeBlockTheme {
  const language = getLanguageFromClassName(className);
  const normalizedLanguage = languageAliases[language] ?? language;
  const theme =
    codeBlockThemes[normalizedLanguage as keyof typeof codeBlockThemes] ??
    codeBlockThemes.text;

  return {
    label: theme.label,
    language: normalizedLanguage,
    themeClassName: theme.themeClassName,
  };
}

function CodeBlock({ children, className, ...props }: PreElementProps) {
  const codeElement = getCodeElement(children);
  const codeClassName =
    typeof codeElement?.props.className === "string"
      ? codeElement.props.className
      : undefined;
  const theme = getCodeBlockTheme(codeClassName ?? className);

  return (
    <div
      aria-label={`${theme.label} code block`}
      className={`code-block ${theme.themeClassName}`}
      data-language={theme.language}
    >
      <div className="code-block__header">
        <div className="code-block__traffic-lights">
          <span className="code-block__traffic-light code-block__traffic-light--red" />
          <span className="code-block__traffic-light code-block__traffic-light--yellow" />
          <span className="code-block__traffic-light code-block__traffic-light--green" />
        </div>
        <span className="code-block__tab">{theme.label}</span>
      </div>
      <pre className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  a: ({ href, ...props }) => {
    if (typeof href === "string" && href.startsWith("/")) {
      return <Link href={href} className={linkClassName} {...props} />;
    }

    return (
      <a
        className={linkClassName}
        href={href}
        rel="noreferrer"
        target="_blank"
        {...props}
      />
    );
  },
  pre: (props) => <CodeBlock {...props} />,
};
