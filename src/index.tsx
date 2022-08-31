import * as esbuild from "esbuild-wasm";
import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
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

    iframe.current.srcdoc = html;
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

    // setCode(result.outputFiles[0].text);
    /*
    postMessage 사용법
    - 문법 : targetWindow.postMessage(message, targetOrigin, [transfer]);
    targetWindow : 메세지를 전달 받을 window의 참조
    message : 다른 widnow에 보내질 데이터
    targetOrigin : targetWindow의 origin을 지정. '*'은 별도로 지정하지 않음을 나타냄. 문자열 혹은 URI를 지정해야함
                  이벤트를 전송하려 할 때 targetWindow의 스키마, 호스트이름, 포트가 targetOrigin과 맞지 않다면 이벤트는 전송되지 않음

    */
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try{
              eval(event.data);
            }catch(err){
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color:red;"><h4>Rutime Error</h4>' + err + '</div>';
              console.error(err);
            }
          },false);
        </script>
      </body>
    </html>
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
      <iframe ref={iframe} srcDoc={html} sandbox="allow-scripts" />
    </div>
  );
};

const root = createRoot(document.querySelector("#root")!);
root.render(<App />);
