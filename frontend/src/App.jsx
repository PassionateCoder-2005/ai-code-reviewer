import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios"
import "./app.css"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown-dark.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
const App = () => {
  const [code, setCode] = useState(`function greet(name) {
  console.log("Hello " + name);
}

greet("John");
`);
const [loading, setLoading] = useState(false);
  const [review, setReview] = useState("");

 const reviewCode = async () => {
  try {
    setLoading(true);
    setReview("");

    const { data } = await axios.post(
      "http://localhost:3000/api/ai/ai-reviewer",
      { code }
    );

    setReview(data.response);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-screen bg-[#0d1117] text-white">
      {/* Left Panel */}
      <div className="flex w-1/2 flex-col border-r border-zinc-800 p-6">
        <h1 className="mb-5 text-2xl font-bold">
          💻 AI Code Reviewer
        </h1>

        <div className="flex-1 overflow-hidden rounded-xl border border-zinc-700">
          <Editor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 15,
              fontFamily: "Fira Code",
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              tabSize: 2,
              padding: {
                top: 20,
              },
            }}
          />
        </div>

       <button
  onClick={reviewCode}
  disabled={loading}
  className={`mt-5 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all ${
    loading
      ? "cursor-not-allowed bg-blue-400"
      : "bg-blue-600 hover:bg-blue-700 active:scale-95"
  }`}
>
  {loading ? (
    <>
      <svg
        className="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-100"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      Reviewing...
    </>
  ) : (
    "🚀 Review Code"
  )}
</button>
      </div>

      {/* Right Panel */}
      <div className="flex w-1/2 flex-col p-6">
        <h1 className="mb-5 text-2xl font-bold">
          🤖 AI Review
        </h1>

        <div className="flex-1 overflow-auto rounded-xl border border-zinc-700 bg-[#161b22] p-5">
          {loading ? (
  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
    <svg
      className="mb-5 h-10 w-10 animate-spin text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-100"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>

    <h2 className="text-xl font-semibold">
      🔍 Reviewing your code...
    </h2>

    <p className="mt-2 text-sm text-zinc-500">
      Finding bugs, improving performance and suggesting best practices.
    </p>
  </div>
) : review ? (
 <article className="markdown-body !bg-transparent max-w-none text-white">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");

        if (!inline && match) {
          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              customStyle={{
                background: "#0d1117",
                borderRadius: "12px",
                padding: "18px",
                marginTop: "16px",
                marginBottom: "16px",
                border: "1px solid #30363d",
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        }

        return (
          <code
            className="rounded-md bg-zinc-800 px-2 py-1 text-pink-400"
            {...props}
          >
            {children}
          </code>
        );
      },
      h1: ({ children }) => (
        <h1 className="text-3xl font-bold text-white">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="mt-8 border-b border-zinc-700 pb-2 text-2xl font-bold text-cyan-400">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-6 text-xl font-semibold text-yellow-400">
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p className="my-4 leading-8 text-zinc-300">{children}</p>
      ),
      strong: ({ children }) => (
        <strong className="font-bold text-white">{children}</strong>
      ),
      ul: ({ children }) => (
        <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>
      ),
      li: ({ children }) => (
        <li className="text-zinc-300">{children}</li>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-4 border-l-4 border-blue-500 pl-4 italic text-zinc-400">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="my-6 border-zinc-700" />,
      table: ({ children }) => (
        <table className="my-4 w-full border-collapse border border-zinc-700">
          {children}
        </table>
      ),
      th: ({ children }) => (
        <th className="border border-zinc-700 bg-zinc-800 p-3 text-left">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border border-zinc-700 p-3">{children}</td>
      ),
    }}
  >
    {review}
  </ReactMarkdown>
</article>
) : (
  <div className="flex h-full flex-col items-center justify-center text-zinc-500">
    <div className="mb-4 text-6xl">🤖</div>

    <h2 className="text-xl font-semibold">
      AI Code Reviewer
    </h2>

    <p className="mt-2 text-center text-sm">
      Paste your code on the left and click
      <br />
      <span className="text-blue-400">"Review Code"</span>
      <br />
      to get AI suggestions.
    </p>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default App;