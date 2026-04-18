import assert from "node:assert/strict";
import test from "node:test";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mdxComponents, getCodeBlockTheme } from "@/components/blog/mdx-components";

test("getCodeBlockTheme normalizes common fenced code aliases", () => {
  assert.deepEqual(getCodeBlockTheme("language-tsx"), {
    label: "TSX",
    language: "tsx",
    themeClassName: "code-block--tsx",
  });
  assert.deepEqual(getCodeBlockTheme("language-ts"), {
    label: "TypeScript",
    language: "typescript",
    themeClassName: "code-block--typescript",
  });
  assert.deepEqual(getCodeBlockTheme("language-js"), {
    label: "JavaScript",
    language: "javascript",
    themeClassName: "code-block--javascript",
  });
  assert.deepEqual(getCodeBlockTheme(undefined), {
    label: "Code",
    language: "text",
    themeClassName: "code-block--text",
  });
});

test("mdx pre blocks render a VS Code-like language tab shell", () => {
  assert.ok(mdxComponents.pre);

  const markup = renderToStaticMarkup(
    mdxComponents.pre?.({
      children: createElement(
        "code",
        { className: "language-tsx" },
        "const answer = 42;",
      ),
    }) ?? createElement(Fragment),
  );

  assert.match(markup, /class="code-block code-block--tsx"/);
  assert.match(markup, /data-language="tsx"/);
  assert.match(markup, /class="code-block__header"/);
  assert.match(markup, />TSX</);
  assert.match(markup, /class="language-tsx"/);
  assert.match(markup, /const answer = 42;/);
});
