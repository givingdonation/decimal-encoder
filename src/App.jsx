import { useState, useMemo, useEffect } from "react";

const COLS = ["0","1","2","3","4","5","6","7","8","9"];

export default function App() {
  // Inject Bootstrap
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap');
      body { background: #0f0f13 !important; }
      .enc-root { font-family: 'Syne', sans-serif; color: #e8e8f0; min-height: 100vh; background: #0f0f13; }
      .enc-title { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; color: #fff; }
      .enc-sub { font-size: 12px; color: #666; line-height: 1.7; font-family: 'JetBrains Mono', monospace; }
      .enc-card { background: #18181f; border: 1px solid #2a2a38; border-radius: 12px; overflow: hidden; }
      .enc-card-header { background: #1e1e2a; border-bottom: 1px solid #2a2a38; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
      .enc-card-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #555; }
      .enc-table { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; }
      .enc-table th { background: #1e1e2a; color: #555; font-size: 11px; font-weight: 600; text-align: center; padding: 8px 4px; border: 1px solid #2a2a38; }
      .enc-table td { border: 1px solid #222230; padding: 3px 2px; text-align: center; }
      .enc-table tr:hover td { background: rgba(255,255,255,0.02); }
      .cell-input { background: transparent; border: none; outline: none; width: 100%; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 600; color: #a5f3fc; caret-color: #a5f3fc; text-transform: uppercase; }
      .cell-input:focus { background: rgba(165,243,252,0.07); border-radius: 4px; }
      .cell-prefix { background: #111118; }
      .cell-prefix-label { font-size: 9px; color: #333; font-family: 'JetBrains Mono', monospace; }
      .row-label-td { background: #1a1a28; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 14px; }
      .row-base-label { color: #444; font-size: 13px; }
      .row-digit-label { color: #f59e0b; }
      .btn-add-row { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; border: 1px solid #333; background: transparent; color: #888; border-radius: 6px; padding: 2px 8px; cursor: pointer; transition: all 0.15s; }
      .btn-add-row:hover { border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.08); }
      .btn-remove-row { background: none; border: none; color: #444; font-size: 16px; cursor: pointer; line-height: 1; padding: 0 0 0 4px; transition: color 0.15s; }
      .btn-remove-row:hover { color: #ef4444; }
      .io-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #555; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace; }
      .io-textarea { background: #13131a; border: 1px solid #2a2a38; border-radius: 10px; color: #e8e8f0; font-family: 'JetBrains Mono', monospace; font-size: 14px; padding: 14px; resize: vertical; width: 100%; outline: none; transition: border-color 0.2s; }
      .io-textarea:focus { border-color: #a5f3fc55; }
      .io-textarea.output { color: #86efac; background: #101016; cursor: default; }
      .switch-btn { width: 52px; height: 52px; border-radius: 50%; border: 1px solid #333; background: #1e1e2a; color: #a5f3fc; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
      .switch-btn:hover { border-color: #a5f3fc; background: rgba(165,243,252,0.1); transform: scale(1.05); }
      .mode-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #444; font-family: 'JetBrains Mono', monospace; margin-top: 8px; text-align: center; }
      .badge-1d { background: #1e3a5f; color: #7dd3fc; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 4px 9px; border-radius: 6px; border: 1px solid #1e4a7a; }
      .badge-2d { background: #14532d; color: #86efac; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 4px 9px; border-radius: 6px; border: 1px solid #1a6335; }
      .legend-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
      .legend-hint { font-size: 10px; color: #444; font-family: 'JetBrains Mono', monospace; margin-top: 8px; }
      .warn-box { background: #2d1f00; border: 1px solid #78350f; border-radius: 8px; padding: 8px 14px; font-size: 12px; color: #fbbf24; font-family: 'JetBrains Mono', monospace; }
      .row-extra-cells { background: #16161e; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  const [cells, setCells] = useState({ base: Object.fromEntries(COLS.map(c => [c, ""])) });
  const [rowOrder, setRowOrder] = useState([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode");

  // letter -> code string
  const encMap = useMemo(() => {
    const m = {};
    COLS.forEach(col => {
      const l = (cells.base?.[col] || "").toUpperCase();
      if (l) m[l] = col;
    });
    rowOrder.forEach(row => {
      COLS.forEach(col => {
        const l = (cells[row]?.[col] || "").toUpperCase();
        if (l) m[l] = row + col;
      });
    });
    return m;
  }, [cells, rowOrder]);

  // code string -> letter
  const decMap = useMemo(() => {
    const m = {};
    Object.entries(encMap).forEach(([l, c]) => { m[c] = l; });
    return m;
  }, [encMap]);

  // Duplicate letter detection
  const dupLetters = useMemo(() => {
    const counts = {};
    COLS.forEach(col => {
      const l = (cells.base?.[col] || "").toUpperCase();
      if (l) counts[l] = (counts[l] || 0) + 1;
    });
    rowOrder.forEach(row => {
      COLS.forEach(col => {
        const l = (cells[row]?.[col] || "").toUpperCase();
        if (l) counts[l] = (counts[l] || 0) + 1;
      });
    });
    return Object.keys(counts).filter(k => counts[k] > 1);
  }, [cells, rowOrder]);

  // Compute output value reactively
  const output = useMemo(() => {
    if (mode === "encode") {
      return [...input.toUpperCase()].map(ch => {
        if (ch === " ") return " ";
        if (!/[A-Z]/.test(ch)) return ch;
        return encMap[ch] !== undefined ? encMap[ch] : `[${ch}]`;
      }).join("");
    } else {
      let res = "", i = 0;
      while (i < input.length) {
        const ch = input[i];
        if (ch === " ") { res += " "; i++; continue; }
        if (!/\d/.test(ch)) { i++; continue; }
        if (rowOrder.includes(ch) && i + 1 < input.length && /\d/.test(input[i + 1])) {
          const key = ch + input[i + 1];
          res += decMap[key] !== undefined ? decMap[key] : "?";
          i += 2;
        } else {
          res += decMap[ch] !== undefined ? decMap[ch] : "?";
          i++;
        }
      }
      return res;
    }
  }, [input, mode, encMap, decMap, rowOrder]);

  const setCell = (row, col, val) => {
    const letter = val.replace(/[^a-zA-Z]/g, "").slice(-1).toUpperCase();
    setCells(prev => ({ ...prev, [row]: { ...prev[row], [col]: letter } }));
  };

  const addRow = (digit) => {
    if (rowOrder.includes(digit)) return;
    setRowOrder(prev => [...prev, digit]);
    setCells(prev => ({
      ...prev,
      base: { ...prev.base, [digit]: "" },
      [digit]: Object.fromEntries(COLS.map(c => [c, ""]))
    }));
  };

  const removeRow = (digit) => {
    setRowOrder(prev => prev.filter(r => r !== digit));
    setCells(prev => { const n = { ...prev }; delete n[digit]; return n; });
  };

  const switchMode = () => {
    setMode(m => m === "encode" ? "decode" : "encode");
    setInput(output);
  };

  const available = COLS.filter(d => !rowOrder.includes(d));

  return (
    <div className="enc-root p-3 p-md-4">
      {/* Header */}
      <div className="mb-4">
        <div className="enc-title mb-1">Decimal Encoder</div>
        <p className="enc-sub mb-0">
          Fill letters into the table → they get the column digit as their code (base row = 1 digit).<br />
          Add labeled rows → letters get a 2-digit code (row prefix + column). Prefix digits are blocked in the base row.
        </p>
      </div>

      {/* Encoding Table */}
      <div className="enc-card mb-4">
        <div className="enc-card-header">
          <span className="enc-card-title">Encoding Table</span>
          {available.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: "#555", fontFamily: "'JetBrains Mono',monospace" }}>+ prefix row:</span>
              {available.map(d => (
                <button key={d} className="btn-add-row" onClick={() => addRow(d)}>{d}</button>
              ))}
            </div>
          )}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="enc-table">
            <thead>
              <tr>
                <th style={{ width: 52 }}></th>
                {COLS.map(c => <th key={c} style={{ minWidth: 52 }}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {/* Base row */}
              <tr>
                <td className="row-label-td">
                  <span className="row-base-label">—</span>
                </td>
                {COLS.map(col => {
                  const isPrefix = rowOrder.includes(col);
                  const val = cells.base?.[col] || "";
                  return (
                    <td key={col} className={isPrefix ? "cell-prefix" : ""} style={{ height: 38 }}>
                      {isPrefix
                        ? <span className="cell-prefix-label">prefix</span>
                        : <input
                            type="text"
                            maxLength={1}
                            className="cell-input"
                            value={val}
                            onFocus={e => e.target.select()}
                            onChange={e => setCell("base", col, e.target.value)}
                            style={{ height: 32 }}
                          />
                      }
                    </td>
                  );
                })}
              </tr>
              {/* Prefix rows */}
              {rowOrder.map(row => (
                <tr key={row}>
                  <td className="row-label-td">
                    <span className="row-digit-label">{row}</span>
                    <button className="btn-remove-row" onClick={() => removeRow(row)} title={`Remove row ${row}`}>×</button>
                  </td>
                  {COLS.map(col => {
                    const val = cells[row]?.[col] || "";
                    return (
                      <td key={col} className="row-extra-cells" style={{ height: 38 }}>
                        <input
                          type="text"
                          maxLength={1}
                          className="cell-input"
                          style={{ color: "#86efac", height: 32 }}
                          value={val}
                          onFocus={e => e.target.select()}
                          onChange={e => setCell(row, col, e.target.value)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Duplicate warning */}
      {dupLetters.length > 0 && (
        <div className="warn-box mb-3">
          ⚠ <strong>{dupLetters.join(", ")}</strong> {dupLetters.length === 1 ? "is" : "are"} assigned to multiple cells — only the last assignment is used for encoding.
        </div>
      )}

      {/* I/O */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", minWidth: 180 }}>
          <div className="io-label">{mode === "encode" ? "✦ Letters Input" : "✦ Code Input"}</div>
          <textarea
            className="io-textarea"
            rows={5}
            placeholder={mode === "encode" ? "Type letters here…" : "Type digit codes here…"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22, flexShrink: 0 }}>
          <button className="switch-btn" onClick={switchMode} title="Flip encode/decode">⇄</button>
          <div className="mode-label">{mode === "encode" ? "Encoding" : "Decoding"}</div>
        </div>

        <div style={{ flex: "1 1 200px", minWidth: 180 }}>
          <div className="io-label">{mode === "encode" ? "✦ Code Output" : "✦ Letters Output"}</div>
          <textarea
            className="io-textarea output"
            rows={5}
            value={output}
            readOnly
            placeholder="Output appears here…"
          />
        </div>
      </div>

      {/* Encoding legend */}
      {Object.keys(encMap).length > 0 && (
        <div className="mt-4">
          <div className="io-label">Encoding Map</div>
          <div className="legend-row">
            {Object.entries(encMap)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, code]) => (
                <span key={letter} className={code.length === 1 ? "badge-1d" : "badge-2d"}>
                  {letter} → {code}
                </span>
              ))}
          </div>
          <div className="legend-hint">
            <span className="badge-1d" style={{ padding: "1px 6px", fontSize: 10 }}>■</span> 1-digit (base row) &nbsp;&nbsp;
            <span className="badge-2d" style={{ padding: "1px 6px", fontSize: 10 }}>■</span> 2-digit (prefix row)
          </div>
        </div>
      )}
    </div>
  );
}
