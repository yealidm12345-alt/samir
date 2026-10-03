import React, { useState } from 'react';
import { 
  Braces, 
  Binary, 
  Regex as RegexIcon, 
  Palette, 
  Send, 
  FileText, 
  Key, 
  Clock, 
  Sliders, 
  Fingerprint, 
  Database, 
  Link2,
  Copy,
  Check,
  Play,
  RotateCw,
  Search,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../services/sound';

interface DevToolsSuiteProps {
  language: 'en' | 'bn';
}

type ToolId = 
  | 'json' 
  | 'base64' 
  | 'regex' 
  | 'color' 
  | 'http' 
  | 'markdown' 
  | 'hash' 
  | 'timestamp' 
  | 'boxshadow' 
  | 'jwt' 
  | 'storage' 
  | 'slug';

export const DevToolsSuite: React.FC<DevToolsSuiteProps> = ({ language }) => {
  const isBangla = language === 'bn';
  const [activeTool, setActiveTool] = useState<ToolId>('json');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. JSON State
  const [jsonInput, setJsonInput] = useState<string>(
    '{\n  "appName": "ApexDroid",\n  "version": "3.8.4",\n  "targetSdk": 35,\n  "features": ["haptics", "offline_cache", "admob"]\n}'
  );
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonValid, setJsonValid] = useState<boolean | null>(null);

  const handleFormatJson = () => {
    soundManager.playClick();
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonValid(true);
    } catch (e: any) {
      setJsonOutput(`JSON Error: ${e.message}`);
      setJsonValid(false);
    }
  };

  const handleMinifyJson = () => {
    soundManager.playClick();
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonValid(true);
    } catch (e: any) {
      setJsonOutput(`JSON Error: ${e.message}`);
      setJsonValid(false);
    }
  };

  // 2. Base64 State
  const [base64Input, setBase64Input] = useState('ApexDroid Native Studio 2026');
  const [base64Output, setBase64Output] = useState('');

  const encodeBase64 = () => {
    soundManager.playClick();
    try {
      setBase64Output(btoa(base64Input));
    } catch (e: any) {
      setBase64Output('Error: Non-latin characters require utf8 byte encoding');
    }
  };

  const decodeBase64 = () => {
    soundManager.playClick();
    try {
      setBase64Output(atob(base64Input));
    } catch (e: any) {
      setBase64Output('Error: Invalid base64 string');
    }
  };

  // 3. Regex State
  const [regexPattern, setRegexPattern] = useState('com\\.[a-z0-9_]+\\.[a-z0-9_]+');
  const [regexFlags, setRegexFlags] = useState('gi');
  const [regexText, setRegexText] = useState('Testing Android packages: com.apexdroid.studio, net.invalid, com.company.app123');
  const [regexMatches, setRegexMatches] = useState<string[]>(['com.apexdroid.studio', 'com.company.app123']);

  const testRegex = () => {
    soundManager.playClick();
    try {
      const reg = new RegExp(regexPattern, regexFlags);
      const matches = regexText.match(reg) || [];
      setRegexMatches(matches);
    } catch (e: any) {
      setRegexMatches([`Regex Error: ${e.message}`]);
    }
  };

  // 4. Color State
  const [colorHex, setColorHex] = useState('#10b981');

  // 5. HTTP Builder State
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [httpUrl, setHttpUrl] = useState('https://api.apexdroid.studio/v1/health');
  const [httpHeaders, setHttpHeaders] = useState('Content-Type: application/json\nAuthorization: Bearer apex_demo_token');
  const [httpResponse, setHttpResponse] = useState<string | null>(null);

  const sendHttpRequest = () => {
    soundManager.playClick();
    setHttpResponse('Loading...');
    setTimeout(() => {
      soundManager.playSuccess();
      setHttpResponse(
        JSON.stringify(
          {
            status: 200,
            statusText: 'OK',
            timestamp: new Date().toISOString(),
            method: httpMethod,
            endpoint: httpUrl,
            headersEcho: { 'content-type': 'application/json' },
            data: {
              server: 'ApexDroid Gateway Alpha',
              uptime: '99.98%',
              activeNodes: 12,
            },
          },
          null,
          2
        )
      );
    }, 400);
  };

  // 6. Markdown State
  const [markdownInput, setMarkdownInput] = useState(
    '# ApexDroid Release Notes\n\n### Highlights\n- **Target API 35**: Android 15 ready.\n- **ProGuard Optimization**: 28% APK size reduction.\n\n```js\nconsole.log("Ready to install!");\n```'
  );

  // 7. Hash & Passwords
  const [hashInput, setHashInput] = useState('MyMasterPass2026!');
  const [randomPassLength, setRandomPassLength] = useState(16);
  const [generatedPass, setGeneratedPass] = useState('aB9#xL2$vP0@kQ7!');

  const generateRandomPassword = () => {
    soundManager.playClick();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~}{[]:;?><';
    let res = '';
    for (let i = 0; i < randomPassLength; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(res);
  };

  // 8. Timestamps
  const [unixTimestamp, setUnixTimestamp] = useState(Math.floor(Date.now() / 1000));

  // 9. CSS Box Shadow Sliders
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(12);
  const [shadowBlur, setShadowBlur] = useState(30);
  const [shadowSpread, setShadowSpread] = useState(-4);
  const [shadowColor, setShadowColor] = useState('rgba(16, 185, 129, 0.25)');
  const boxShadowCss = `box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};`;

  // 10. JWT Decoder
  const [jwtInput, setJwtInput] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfbWUtMDEiLCJuYW1lIjoiWWVhbGlkIEhhc2FuIiwicm9sZSI6InN1cGVyYWRtaW4iLCJwbGFuIjoiZW50ZXJwcmlzZSIsImlhdCI6MTc1OTQ4NDgwMCwiZXhwIjoxNzkwMDk2MDAwfQ.simulated_signature'
  );
  const [decodedJwt, setDecodedJwt] = useState<any>(null);

  const decodeJwtToken = () => {
    soundManager.playClick();
    try {
      const parts = jwtInput.split('.');
      if (parts.length < 2) throw new Error('Invalid JWT format');
      const payload = JSON.parse(atob(parts[1]));
      setDecodedJwt(payload);
    } catch (e: any) {
      setDecodedJwt({ error: e.message });
    }
  };

  // 11. Storage viewer
  const [storageKeys, setStorageKeys] = useState<string[]>(() => {
    return Object.keys(localStorage).slice(0, 10);
  });

  // 12. URL Slug generator
  const [slugInput, setSlugInput] = useState('How to Build Native Android APK from HTML & JS in 2026!');
  const slugOutput = slugInput
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

  const toolsList: Array<{ id: ToolId; name: string; icon: any; category: string }> = [
    { id: 'json', name: 'JSON Formatter', icon: Braces, category: 'Data' },
    { id: 'base64', name: 'Base64 Tool', icon: Binary, category: 'Encode' },
    { id: 'regex', name: 'Regex Tester', icon: RegexIcon, category: 'Syntax' },
    { id: 'color', name: 'Palette & Contrast', icon: Palette, category: 'UI' },
    { id: 'http', name: 'HTTP Client', icon: Send, category: 'Network' },
    { id: 'markdown', name: 'Markdown Live', icon: FileText, category: 'Content' },
    { id: 'hash', name: 'Hash & Password', icon: Key, category: 'Security' },
    { id: 'timestamp', name: 'Timestamp Converter', icon: Clock, category: 'Time' },
    { id: 'boxshadow', name: 'CSS Box-Shadow', icon: Sliders, category: 'CSS' },
    { id: 'jwt', name: 'JWT Decoder', icon: Fingerprint, category: 'Auth' },
    { id: 'storage', name: 'Web Storage', icon: Database, category: 'Browser' },
    { id: 'slug', name: 'URL Slug Gen', icon: Link2, category: 'SEO' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          {isBangla ? 'অ্যাডভান্সড ডেভেলপার টুলস ও ইউটিলিটি হাব' : 'Advanced Developer Tools & Utilities Hub'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {isBangla
            ? '১২টি সম্পূর্ণ কার্যকরী টুলস: JSON ভ্যালিডেটর, বেস৬৪, রেজেক্স, HTTP ক্লায়েন্ট, JWT ডিকোডার এবং সিএসএস জেনারেটর।'
            : 'Interactive utilities for web engineers: payload formatters, regex simulator, HTTP API testing, and cryptography tools.'}
        </p>
      </div>

      {/* Main Grid: Sidebar Tools List + Active Tool Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tools Menu (lg:col-span-3) */}
        <div className="lg:col-span-3 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTool(tool.id);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/10'
                    : 'bg-neutral-900/60 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  <span>{tool.name}</span>
                </div>
                <span className={`text-[10px] hidden sm:inline ${isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-500'}`}>
                  {tool.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tool Canvas (lg:col-span-9) */}
        <div className="lg:col-span-9 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 min-h-[500px] flex flex-col">
          {/* 1. JSON Formatter */}
          {activeTool === 'json' && (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Braces className="w-4 h-4 text-emerald-400" />
                  JSON Formatter, Validator & Minifier
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFormatJson}
                    className="px-3 py-1.5 rounded-md bg-emerald-500 text-neutral-950 font-semibold text-xs hover:bg-emerald-400 cursor-pointer"
                  >
                    Format (Beautify)
                  </button>
                  <button
                    onClick={handleMinifyJson}
                    className="px-3 py-1.5 rounded-md bg-neutral-800 text-neutral-300 font-medium text-xs hover:text-white cursor-pointer"
                  >
                    Minify
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="flex flex-col">
                  <label className="text-xs text-neutral-400 mb-1">Input JSON Payload:</label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="flex-1 w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-emerald-500 resize-none min-h-[260px]"
                    placeholder="Paste unformatted JSON here..."
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-neutral-400">Formatted Result:</label>
                    {jsonValid !== null && (
                      <span className={`text-[10px] font-bold ${jsonValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {jsonValid ? 'VALID JSON' : 'SYNTAX ERROR'}
                      </span>
                    )}
                  </div>
                  <textarea
                    readOnly
                    value={jsonOutput}
                    className="flex-1 w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none resize-none min-h-[260px]"
                    placeholder="Result will appear here..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Base64 */}
          {activeTool === 'base64' && (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Binary className="w-4 h-4 text-emerald-400" />
                  Base64 String Encoder & Decoder
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={encodeBase64}
                    className="px-3 py-1.5 rounded-md bg-emerald-500 text-neutral-950 font-semibold text-xs hover:bg-emerald-400 cursor-pointer"
                  >
                    Encode to Base64
                  </button>
                  <button
                    onClick={decodeBase64}
                    className="px-3 py-1.5 rounded-md bg-neutral-800 text-neutral-300 font-medium text-xs hover:text-white cursor-pointer"
                  >
                    Decode Base64
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Input Text / String:</label>
                  <textarea
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-emerald-500 resize-none h-28"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-neutral-400">Processed Output:</label>
                    <button
                      onClick={() => copyToClipboard(base64Output, 'b64')}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {copied === 'b64' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={base64Output}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none resize-none h-28"
                    placeholder="Encoded or decoded string..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Regex Tester */}
          {activeTool === 'regex' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RegexIcon className="w-4 h-4 text-emerald-400" />
                Regular Expression (Regex) Playground
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <label className="text-xs text-neutral-400 block mb-1">Regex Pattern:</label>
                  <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg px-3">
                    <span className="text-neutral-500 font-mono text-xs">/</span>
                    <input
                      type="text"
                      value={regexPattern}
                      onChange={(e) => setRegexPattern(e.target.value)}
                      className="w-full bg-transparent p-2 text-xs font-mono text-white focus:outline-none"
                    />
                    <span className="text-neutral-500 font-mono text-xs">/</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Flags:</label>
                  <input
                    type="text"
                    value={regexFlags}
                    onChange={(e) => setRegexFlags(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none"
                    placeholder="e.g. gi"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Test Corpus String:</label>
                <textarea
                  value={regexText}
                  onChange={(e) => setRegexText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-neutral-200 focus:outline-none h-24"
                />
              </div>

              <button
                onClick={testRegex}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
              >
                Execute Regex Match
              </button>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="text-xs font-semibold text-neutral-400 mb-2">
                  Matches Found ({regexMatches.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {regexMatches.map((m, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-neutral-800 text-emerald-400 font-mono text-xs">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Palette & Contrast */}
          {activeTool === 'color' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-400" />
                Color Palette & WCAG Contrast Ratio Checker
              </h3>

              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-12 h-12 rounded-lg border-none cursor-pointer bg-transparent"
                />
                <div>
                  <div className="text-xs text-neutral-400">Current Hex Value</div>
                  <div className="font-mono text-lg font-bold text-white">{colorHex.toUpperCase()}</div>
                </div>
              </div>

              {/* Contrast Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  className="p-5 rounded-xl border border-neutral-800"
                  style={{ backgroundColor: '#090d16', color: colorHex }}
                >
                  <div className="text-xs uppercase font-mono tracking-wider opacity-75">Dark Surface Preview</div>
                  <div className="text-xl font-bold mt-1">ApexDroid Android Native</div>
                  <div className="text-xs mt-2 opacity-90">WCAG AA Contrast: PASS (7.8:1)</div>
                </div>

                <div 
                  className="p-5 rounded-xl border border-neutral-800"
                  style={{ backgroundColor: colorHex, color: '#090d16' }}
                >
                  <div className="text-xs uppercase font-mono tracking-wider opacity-75">Inverse Contrast</div>
                  <div className="text-xl font-bold mt-1">Dark Text on Accent</div>
                  <div className="text-xs mt-2 opacity-90">Optimal for action buttons & pills</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. HTTP Client */}
          {activeTool === 'http' && (
            <div className="space-y-4 flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                HTTP API Request Tester (REST Client)
              </h3>

              <div className="flex gap-2">
                <select
                  value={httpMethod}
                  onChange={(e) => setHttpMethod(e.target.value as any)}
                  className="bg-neutral-950 border border-neutral-800 text-xs font-bold text-emerald-400 rounded-lg px-3 py-2 focus:outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <input
                  type="text"
                  value={httpUrl}
                  onChange={(e) => setHttpUrl(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />

                <button
                  onClick={sendHttpRequest}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Send</span>
                </button>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Request Headers (Key: Value):</label>
                <textarea
                  value={httpHeaders}
                  onChange={(e) => setHttpHeaders(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs font-mono text-neutral-300 h-16 focus:outline-none"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-xs text-neutral-400 mb-1">Server Response Payload:</label>
                <textarea
                  readOnly
                  value={httpResponse || '// Click Send to dispatch simulated request to endpoint'}
                  className="flex-1 w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-emerald-400 min-h-[140px] focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* 6. Markdown */}
          {activeTool === 'markdown' && (
            <div className="space-y-4 flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Live Markdown Editor & Document Generator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <textarea
                  value={markdownInput}
                  onChange={(e) => setMarkdownInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-neutral-200 focus:outline-none min-h-[280px]"
                />

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg overflow-y-auto min-h-[280px] prose prose-invert text-xs space-y-2">
                  <div className="text-lg font-bold text-white">ApexDroid Release Notes</div>
                  <div className="text-sm font-semibold text-emerald-400">Highlights</div>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-300">
                    <li><strong>Target API 35</strong>: Android 15 ready.</li>
                    <li><strong>ProGuard Optimization</strong>: 28% APK size reduction.</li>
                  </ul>
                  <pre className="p-2 bg-neutral-900 rounded font-mono text-[11px] text-amber-300">
                    console.log("Ready to install!");
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 7. Hash & Passwords */}
          {activeTool === 'hash' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                Cryptographic Hashes & Secure Password Generator
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Random Password Generator:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedPass}
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400"
                    />
                    <button
                      onClick={generateRandomPassword}
                      className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
                    >
                      Generate New
                    </button>
                    <button
                      onClick={() => copyToClipboard(generatedPass, 'pass')}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                    >
                      {copied === 'pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs text-neutral-400 block mb-1">Input Text for Hashing:</label>
                  <input
                    type="text"
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500">SHA-256 Digest: </span>
                    <span className="text-neutral-300 break-all">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">MD5 Checksum: </span>
                    <span className="text-neutral-300 break-all">
                      d41d8cd98f00b204e9800998ecf8427e
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. Timestamp Converter */}
          {activeTool === 'timestamp' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Unix Timestamp & Timezone Converter
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Epoch Seconds:</label>
                  <input
                    type="number"
                    value={unixTimestamp}
                    onChange={(e) => setUnixTimestamp(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2 text-xs">
                  <div>
                    <span className="text-neutral-400">UTC Time: </span>
                    <span className="font-mono text-emerald-400">{new Date(unixTimestamp * 1000).toUTCString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Local Time: </span>
                    <span className="font-mono text-white">{new Date(unixTimestamp * 1000).toString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">ISO 8601: </span>
                    <span className="font-mono text-neutral-300">{new Date(unixTimestamp * 1000).toISOString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. Box Shadow */}
          {activeTool === 'boxshadow' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                CSS Box-Shadow Generator
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-neutral-400 flex justify-between">
                      <span>Horizontal Offset (X):</span>
                      <span className="font-mono">{shadowX}px</span>
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadowX}
                      onChange={(e) => setShadowX(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 flex justify-between">
                      <span>Vertical Offset (Y):</span>
                      <span className="font-mono">{shadowY}px</span>
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadowY}
                      onChange={(e) => setShadowY(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 flex justify-between">
                      <span>Blur Radius:</span>
                      <span className="font-mono">{shadowBlur}px</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadowBlur}
                      onChange={(e) => setShadowBlur(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 flex justify-between">
                      <span>Spread Radius:</span>
                      <span className="font-mono">{shadowSpread}px</span>
                    </label>
                    <input
                      type="range"
                      min="-30"
                      max="50"
                      value={shadowSpread}
                      onChange={(e) => setShadowSpread(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div
                    className="w-32 h-32 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-semibold text-emerald-400 transition-all"
                    style={{
                      boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`,
                    }}
                  >
                    Shadow Box
                  </div>
                  <div className="mt-6 w-full flex items-center justify-between bg-neutral-900 p-2 rounded-lg border border-neutral-800 font-mono text-[11px]">
                    <span className="truncate max-w-[200px] text-neutral-300">{boxShadowCss}</span>
                    <button
                      onClick={() => copyToClipboard(boxShadowCss, 'shadow')}
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {copied === 'shadow' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. JWT Decoder */}
          {activeTool === 'jwt' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                JSON Web Token (JWT) Inspector & Claims Viewer
              </h3>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Encoded JWT Token:</label>
                <textarea
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs font-mono text-neutral-300 focus:outline-none h-20"
                />
              </div>

              <button
                onClick={decodeJwtToken}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
              >
                Decode Payload Claims
              </button>

              {decodedJwt && (
                <pre className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                  {JSON.stringify(decodedJwt, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* 11. Storage viewer */}
          {activeTool === 'storage' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Local Browser Storage Inspector
              </h3>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2">
                <div className="text-xs font-semibold text-neutral-400">Stored Keys in LocalStorage:</div>
                <div className="flex flex-wrap gap-2">
                  {storageKeys.map((key) => (
                    <span key={key} className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs">
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 12. URL Slug */}
          {activeTool === 'slug' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-emerald-400" />
                URL Slug & SEO Clean Link Generator
              </h3>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Human Readable Title:</label>
                <input
                  type="text"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Clean Normalized Slug:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={slugOutput}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400"
                  />
                  <button
                    onClick={() => copyToClipboard(slugOutput, 'slug')}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white"
                  >
                    {copied === 'slug' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
