import assert from "node:assert/strict";
import test from "node:test";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mdxComponents, getCodeBlockTheme } from "@/components/blog/mdx-components";

test("getCodeBlockTheme normalizes common fenced code aliases", () => {
  assert.deepEqual(getCodeBlockTheme("language-tsx"), {
    label: "TSX",
    language: "tsx",
  });
  assert.deepEqual(getCodeBlockTheme("language-ts"), {
    label: "TypeScript",
    language: "typescript",
  });
  assert.deepEqual(getCodeBlockTheme("language-js"), {
    label: "JavaScript",
    language: "javascript",
  });
  assert.deepEqual(getCodeBlockTheme(undefined), {
    label: "Code",
    language: "text",
  });
});

test("mdx pre blocks render a Notion-like language label shell", () => {
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

  assert.match(markup, /class="code-block"/);
  assert.match(markup, /data-language="tsx"/);
  assert.match(markup, /class="code-block__label"/);
  assert.match(markup, />TSX</);
  assert.match(markup, /class="language-tsx"/);
  assert.match(markup, /const answer = 42;/);
});
