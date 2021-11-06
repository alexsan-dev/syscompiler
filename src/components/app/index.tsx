import React, { useState } from "react";
import Editor from "react-simple-code-editor";

import { highlight, languages } from "prismjs";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-java";
import "./style.css";

interface TokenInfo {
  line: number;
  col: number;
}

interface AppError {
  type: "Lexical" | "Syntax" | "Semantic";
  msg: string;
  token: TokenInfo;
}
interface TokenS extends TokenInfo {
  name: string;
}

const App = () => {
  // CODIGO
  const [code, setCode] = useState<string>("");
  const [consoleStr, setConsole] = useState<string>("");
  const [data, setData] = useState<{ errors: AppError[]; symbols: TokenS[] }>({
    errors: [],
    symbols: [],
  });

  // ENVIAR DATOS
  const onSubmit = () => {
    fetch("http://localhost:5000/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setConsole(resData.logs.join("\n"));
          setData({ ...resData });
        }
      })
      .catch((err) => console.log(err));
  };

  // CARGAR ARCHIVO
  const onUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const { result } = reader;
        setCode(result as string);
        ev.target.value = "";
      };
      reader.readAsText(file);
    }
  };

  // GUARDAR CODIGO
  const onChange = (code: string) => setCode(code);

  return (
    <main>
      <section>
        <div>
          <span className="tab">
            <span className="material-icons-two-tone">mode_edit</span>
            Editor 01
          </span>
          <form onSubmit={onSubmit}>
            <Editor
              value={code}
              padding={30}
              className="editor"
              onValueChange={onChange}
              highlight={(code) => highlight(code, languages.java, "java")}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 18,
              }}
            />
          </form>

          <div className="actions">
            <input
              type="file"
              id="scFile"
              name="scFile"
              onChange={onUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="scFile" className="open">
              <span className="material-icons-two-tone">file_open</span>
              Abrir archivo
            </label>
            <button className="send" type="button" onClick={onSubmit}>
              <span className="material-icons-two-tone">send</span>
              Compilar
            </button>
          </div>
        </div>
        <div>
          <span className="tab">
            <span className="material-icons-two-tone">source</span>
            Consola
          </span>
          <textarea readOnly value={consoleStr} className="console"></textarea>
        </div>
      </section>
      <section>
        <div>
          <h3>Tabla de simbolos</h3>

          <ul className="table">
            <li>
              <span>Simbolo</span>
              <span>Linea</span>
              <span>Columna</span>
            </li>
            {data.symbols.map((sym, index) => (
              <li key={index}>
                <span>{sym.name}</span>
                <span>{sym.line}</span>
                <span>{sym.col}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="errs">
          <h3>Tabla de errores</h3>

          <ul className="table">
            <li>
              <span>Tipo</span>
              <span>Mensaje</span>
              <span>Linea</span>
              <span>Columna</span>
            </li>
            {data.errors.map((sym, index) => (
              <li key={index}>
                <span>{sym.type}</span>
                <span>{sym.msg}</span>
                <span>{sym.token.line}</span>
                <span>{sym.token.col}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default App;
