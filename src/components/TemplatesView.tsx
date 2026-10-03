import React from 'react';
import { Smartphone, ShoppingBag, Gamepad2, TrendingUp, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { AppProject } from '../types';
import { soundManager } from '../services/sound';

interface TemplatesViewProps {
  onSelectTemplate: (project: Partial<AppProject>) => void;
  language: 'en' | 'bn';
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onSelectTemplate,
  language,
}) => {
  const isBangla = language === 'bn';

  const templates = [
    {
      id: 'template_messenger',
      title: isBangla ? 'এপেক্স মেসেঞ্জার অ্যাপ' : 'Apex Messenger & Social',
      category: 'Social / Chat',
      desc: isBangla
        ? 'রিয়েল-টাইম চ্যাট বাবুলস, স্টোরি ক্যারোসেল এবং নেটিভ হ্যাপটিক ভাইব্রেশন সাপোর্টেড।'
        : 'Native chat UI with interactive story carousel, message bubbles, and hardware haptics.',
      icon: Smartphone,
      packageId: 'com.apexdroid.messenger',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="chat-app">
    <div class="top-bar">💬 Apex Messenger</div>
    <div class="chat-flow">
      <div class="bubble in">Hi there! Test the native APK runtime.</div>
      <div class="bubble out">Fast, responsive & Target SDK 35! 🚀</div>
    </div>
    <div class="input-bar">
      <input type="text" placeholder="Type message...">
      <button id="sendBtn">Send</button>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      css: `body { margin: 0; background: #0b0f19; color: #fff; font-family: sans-serif; }
.chat-app { display: flex; flex-direction: column; height: 100vh; }
.top-bar { padding: 16px; background: #111827; font-weight: bold; border-bottom: 1px solid #1f2937; }
.chat-flow { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.bubble { padding: 10px 14px; border-radius: 12px; max-width: 75%; font-size: 14px; }
.bubble.in { background: #1f2937; align-self: flex-start; }
.bubble.out { background: #10b981; color: #000; font-weight: 500; align-self: flex-end; }
.input-bar { display: flex; padding: 12px; background: #111827; gap: 8px; }
input { flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid #374151; background: #1f2937; color: #fff; }
button { background: #10b981; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; }`,
      js: `console.log('Messenger initialized');
document.getElementById('sendBtn')?.addEventListener('click', () => {
  if (navigator.vibrate) navigator.vibrate(50);
  alert('Message dispatched!');
});`,
    },
    {
      id: 'template_ecommerce',
      title: isBangla ? 'ই-কমার্স মোবাইল স্টোর' : 'Mobile E-Commerce Store',
      category: 'Shopping / Retail',
      desc: isBangla
        ? 'প্রোডাক্ট গ্রিড, অ্যাড-টু-কার্ট এবং বিকাশ পেমেন্ট ইন্টিগ্রেশন লেআউট।'
        : 'Catalog product cards, interactive shopping cart counter, and checkout flow.',
      icon: ShoppingBag,
      packageId: 'com.store.megashop',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="store">
    <header class="header">
      <h2>🛍️ Urban Kicks</h2>
      <div class="cart-pill">🛒 <span id="cartCount">0</span></div>
    </header>
    <div class="products">
      <div class="item-card">
        <div class="badge">Trending</div>
        <h3>Neon Cyber Sneaker</h3>
        <p class="price">৳3,450 BDT</p>
        <button class="add-btn" onclick="addToCart()">Add to Cart</button>
      </div>
      <div class="item-card">
        <div class="badge">Sale</div>
        <h3>Apex Runner v2</h3>
        <p class="price">৳2,800 BDT</p>
        <button class="add-btn" onclick="addToCart()">Add to Cart</button>
      </div>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      css: `body { margin: 0; background: #090d16; color: #fff; font-family: sans-serif; }
.store { padding: 16px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.cart-pill { background: #1e293b; padding: 6px 12px; border-radius: 20px; font-weight: bold; }
.products { display: grid; grid-template-columns: 1fr; gap: 16px; }
.item-card { background: #131c31; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; }
.badge { color: #10b981; font-size: 11px; font-weight: bold; text-transform: uppercase; }
.price { color: #38bdf8; font-weight: bold; font-size: 18px; margin: 8px 0; }
.add-btn { width: 100%; background: #0284c7; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; }`,
      js: `let count = 0;
function addToCart() {
  count++;
  document.getElementById('cartCount').innerText = count;
  if (navigator.vibrate) navigator.vibrate(80);
}`,
    },
    {
      id: 'template_game',
      title: isBangla ? 'রেট্রো ২ডি আর্কেড গেম' : 'Retro 2D Canvas Game',
      category: 'Games / Arcade',
      desc: isBangla
        ? 'এইচটিএমএল৫ ক্যানভাস ভিত্তিক স্মুথ ৬৫ এফপিএস আর্কেড গেম মেকানিক্স।'
        : '60fps HTML5 Canvas space arcade tap game with score tracking.',
      icon: Gamepad2,
      packageId: 'com.arcade.spacewar',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-container">
    <div class="hud">Score: <span id="score">0</span></div>
    <canvas id="gameCanvas" width="360" height="480"></canvas>
    <button id="tapBtn">TAP TO JUMP</button>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      css: `body { margin: 0; background: #000; color: #fff; display: flex; justify-content: center; font-family: monospace; }
.game-container { text-align: center; }
.hud { padding: 12px; font-size: 20px; color: #10b981; }
canvas { background: #0b0f19; border: 2px solid #1f2937; border-radius: 8px; }
#tapBtn { margin-top: 12px; width: 100%; padding: 12px; background: #e11d48; color: #fff; font-size: 16px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; }`,
      js: `const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let y = 200, vy = 0, score = 0;
function loop() {
  vy += 0.4; y += vy;
  if (y > 450) { y = 450; vy = 0; }
  ctx.fillStyle = '#0b0f19'; ctx.fillRect(0, 0, 360, 480);
  ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(180, y, 16, 0, Math.PI*2); ctx.fill();
  requestAnimationFrame(loop);
}
loop();
document.getElementById('tapBtn').addEventListener('click', () => {
  vy = -8; score += 10;
  document.getElementById('score').innerText = score;
  if (navigator.vibrate) navigator.vibrate(30);
});`,
    },
    {
      id: 'template_crypto',
      title: isBangla ? 'ক্রিপ্টো ও শেয়ার পোর্টফোলিও' : 'Crypto & Stock Ticker',
      category: 'Finance / Telemetry',
      desc: isBangla
        ? 'বিটকয়েন, ইথেরিয়াম ও কারেন্সি রেট ট্র্যাকার লাইভ ডাটা সিমুলেটর।'
        : 'Financial telemetry ticker with tabular numbers, sparklines, and currency exchange.',
      icon: TrendingUp,
      packageId: 'com.crypto.track',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="ticker-app">
    <div class="head"><h3>Market Ticker</h3></div>
    <div class="coin-row"><span class="coin">BTC/USD</span><span class="price">$64,820</span><span class="green">+4.2%</span></div>
    <div class="coin-row"><span class="coin">ETH/USD</span><span class="price">$3,490</span><span class="green">+2.8%</span></div>
    <div class="coin-row"><span class="coin">SOL/USD</span><span class="price">$152</span><span class="red">-1.1%</span></div>
  </div>
</body>
</html>`,
      css: `body { margin: 0; background: #090d16; color: #fff; font-family: monospace; }
.ticker-app { padding: 16px; }
.head { border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-bottom: 12px; }
.coin-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #131c31; }
.price { font-weight: bold; color: #fff; }
.green { color: #10b981; } .red { color: #f43f5e; }`,
      js: `console.log('Ticker stream connected');`,
    },
    {
      id: 'template_webview',
      title: isBangla ? 'ওয়েবসাইট টু অ্যান্ড্রয়েড এপিকে র্যাপার' : 'Universal Website to APK Wrapper',
      category: 'Utility / Wrapper',
      desc: isBangla
        ? 'যেকোনো পাবলিক ওয়েবসাইটের ফুল-স্ক্রিন অ্যান্ড্রয়েড এপিকে র্যাপার।'
        : 'Turn any responsive web application or portal into a native Android app.',
      icon: Globe,
      packageId: 'com.web.wrapper',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
    iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <iframe src="https://example.com" title="Embedded Web"></iframe>
</body>
</html>`,
      css: `body { margin: 0; }`,
      js: `console.log('Universal webview initialized');`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          {isBangla ? 'রেডিমেড অ্যাপ টেমপ্লেট লাইব্রেরি' : 'Production-Ready App Templates'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {isBangla
            ? '১-ক্লিকে টেমপ্লেট লোড করে সাথে সাথে এপিকে বিল্ড করুন।'
            : 'Select an architecture-tested starter and customize it inside the studio editor.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div
              key={tpl.id}
              className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    {tpl.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{tpl.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">{tpl.desc}</p>
                <div className="text-[11px] font-mono text-neutral-500 mb-4 truncate">
                  Package: {tpl.packageId}
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectTemplate({
                    name: tpl.title,
                    packageId: tpl.packageId,
                    html: tpl.html,
                    css: tpl.css,
                    js: tpl.js,
                  });
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>{isBangla ? 'এই টেমপ্লেটটি লোড করুন' : 'Load into Studio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
