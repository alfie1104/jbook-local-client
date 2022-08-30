import * as esbuild from "esbuild-wasm";
import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    // const result = await ref.current.transform(input, {
    //   loader: "jsx",
    //   target: "es2015",
    // });

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    setCode(result.outputFiles[0].text);
  };

  const html = `
    <script>
      ${code}
    </script>
  `;

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)}>
        {input}
      </textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      {
        //Set sandbox property of iframe to "" or other things except "allow-same-origin"", to prevent direct access from and to parent HTML document.
      }
      <iframe srcDoc={html} sandbox="allow-scripts" />
    </div>
  );
};

const root = createRoot(document.querySelector("#root")!);
root.render(<App />);
