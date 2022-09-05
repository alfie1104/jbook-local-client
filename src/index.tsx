import "bulmaswatch/superhero/bulmaswatch.min.css";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      {
        //Set sandbox property of iframe to "" or other things except "allow-same-origin"", to prevent direct access from and to parent HTML document.
      }
      <Preview code={code} />
    </div>
  );
};

const root = createRoot(document.querySelector("#root")!);
root.render(<App />);
