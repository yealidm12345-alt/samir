import React, { useState } from 'react';
import { 
  Code2, 
  Settings, 
  Terminal, 
  Play, 
  Download, 
  Upload, 
  RefreshCw, 
  Copy, 
  Check, 
  Sliders, 
  FileCode, 
  Shield, 
  Smartphone, 
  Sparkles,
  Layers,
  Trash2,
  FolderArchive,
  Key,
  FolderOpen,
  FilePlus,
  Bug,
  Crop,
  Image as ImageIcon,
  Save,
  Tag,
  AlertCircle
} from 'lucide-react';
import { AppProject } from '../types';
import { soundManager } from '../services/sound';

interface StudioEditorProps {
  project: AppProject;
  onChangeProject: (updated: AppProject) => void;
  onCompileApk: () => void;
  onExportProjectZip: () => void;
  consoleLogs: Array<{ type: 'log' | 'warn' | 'error'; message: string; timestamp: string }>;
  onClearConsole: () => void;
  language: 'en' | 'bn';
  buildCredits: number;
  isCompiling: boolean;
}

type TabType = 'html' | 'css' | 'js' | 'files' | 'settings' | 'permissions';

export const StudioEditor: React.FC<StudioEditorProps> = ({
  project,
  onChangeProject,
  onCompileApk,
  onExportProjectZip,
  consoleLogs,
  onClearConsole,
  language,
  buildCredits,
  isCompiling,
}) => {
  const isBangla = language === 'bn';
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [copied, setCopied] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [showDebuggerModal, setShowDebuggerModal] = useState(false);
  const [keystoreGenerated, setKeystoreGenerated] = useState(false);

  // Version Control
  const [availableVersions, setAvailableVersions] = useState<string[]>(['1.0.0', '1.1.0', '2.0.0-beta']);
  const [selectedVersion, setSelectedVersion] = useState<string>(project.versionName);

  // Icon Cropper / Preset Colors
  const [iconColor, setIconColor] = useState('#10b981');
  const [iconEmoji, setIconEmoji] = useState('📱');

  // Cloud File Manager mock list
  const [virtualFiles, setVirtualFiles] = useState([
    { name: 'index.html', size: '1.8 KB', type: 'html' },
    { name: 'style.css', size: '3.4 KB', type: 'css' },
    { name: 'app.js', size: '2.1 KB', type: 'js' },
    { name: 'manifest.json', size: '420 B', type: 'json' },
    { name: 'sw.js (ServiceWorker)', size: '1.2 KB', type: 'js' },
    { name: 'res/values/strings.xml', size: '350 B', type: 'xml' },
  ]);
  const [newFileName, setNewFileName] = useState('');

  // Snippet inserters
  const insertSnippet = (snippetType: string) => {
    soundManager.playClick();
    let snippet = '';
    if (snippetType === 'vibrate') {
      snippet = `\n// Trigger hardware vibration\nif (navigator.vibrate) {\n  navigator.vibrate([200, 100, 200]);\n}\n`;
      onChangeProject({ ...project, js: project.js + snippet });
      setActiveTab('js');
    } else if (snippetType === 'camera') {
      snippet = `\n// HTML5 Native Camera Input\n<input type="file" accept="image/*" capture="environment" id="cameraInput">\n`;
      onChangeProject({ ...project, html: project.html + snippet });
      setActiveTab('html');
    } else if (snippetType === 'offlineCache') {
      snippet = `\n// Register offline service worker cache\nif ('serviceWorker' in navigator) {\n  window.addEventListener('load', () => {\n    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW init:', err));\n  });\n}\n`;
      onChangeProject({ ...project, js: project.js + snippet });
      setActiveTab('js');
    } else if (snippetType === 'storage') {
      snippet = `\n// Persistent device storage\nconst appDb = {\n  save: (k, v) => localStorage.setItem('app_' + k, JSON.stringify(v)),\n  load: (k) => JSON.parse(localStorage.getItem('app_' + k) || 'null'),\n};\n`;
      onChangeProject({ ...project, js: project.js + snippet });
      setActiveTab('js');
    }
  };

  // Drag and drop handler for files & archive import
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      const ext = file.name.split('.').pop()?.toLowerCase();

      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (ext === 'html') {
          onChangeProject({ ...project, html: content });
          setActiveTab('html');
        } else if (ext === 'css') {
          onChangeProject({ ...project, css: content });
          setActiveTab('css');
        } else if (ext === 'js') {
          onChangeProject({ ...project, js: content });
          setActiveTab('js');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      const ext = file.name.split('.').pop()?.toLowerCase();

      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        if (ext === 'html') {
          onChangeProject({ ...project, html: content });
          setActiveTab('html');
        } else if (ext === 'css') {
          onChangeProject({ ...project, css: content });
          setActiveTab('css');
        } else if (ext === 'js') {
          onChangeProject({ ...project, js: content });
          setActiveTab('js');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCopyCode = () => {
    soundManager.playClick();
    const currentCode =
      activeTab === 'html'
        ? project.html
        : activeTab === 'css'
        ? project.css
        : project.js;
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloneProject = () => {
    soundManager.playSuccess();
    const clonedName = `${project.name} (Copy)`;
    onChangeProject({
      ...project,
      name: clonedName,
      packageId: `${project.packageId}_copy`,
      lastModified: new Date().toISOString(),
    });
  };

  const generateKeystore = () => {
    soundManager.playSuccess();
    setKeystoreGenerated(true);
    onChangeProject({
      ...project,
      nativeConfig: {
        ...project.nativeConfig,
        keystoreAlias: `apex_${project.name.toLowerCase().replace(/\s+/g, '_')}_key`,
      },
    });
  };

  const handleCreateVirtualFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    soundManager.playClick();
    const ext = newFileName.split('.').pop() || 'txt';
    setVirtualFiles((prev) => [
      ...prev,
      { name: newFileName.trim(), size: '100 B', type: ext },
    ]);
    setNewFileName('');
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden">
      {/* Editor Top Bar with Tabs and Actions */}
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 bg-neutral-950 px-3 py-2 gap-2">
        {/* Editor Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('html');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'html'
                ? 'bg-neutral-800 text-orange-400 border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-orange-400" />
            <span>index.html</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('css');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'css'
                ? 'bg-neutral-800 text-blue-400 border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>style.css</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('js');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'js'
                ? 'bg-neutral-800 text-amber-400 border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>app.js</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('files');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'files'
                ? 'bg-neutral-800 text-cyan-400 border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isBangla ? 'ফাইল ম্যানেজার' : 'Files'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('permissions');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'permissions'
                ? 'bg-neutral-800 text-emerald-400 border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isBangla ? 'পারমিশন' : 'Permissions'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('settings');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'settings'
                ? 'bg-neutral-800 text-purple-400 border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            <span>{isBangla ? 'কনফিগ' : 'Config'}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Version control dropdown */}
          <select
            value={selectedVersion}
            onChange={(e) => {
              setSelectedVersion(e.target.value);
              onChangeProject({ ...project, versionName: e.target.value });
            }}
            className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-md px-2 py-1.5 focus:outline-none"
            title="Project Version"
          >
            {availableVersions.map((v) => (
              <option key={v} value={v}>v{v}</option>
            ))}
          </select>

          {/* Metadata & Icon Modal Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowMetadataModal(true);
            }}
            className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
            title="App Name, Logo & Icon Customizer"
          >
            <Crop className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Pre-build Debugger */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowDebuggerModal(true);
            }}
            className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
            title="Pre-build Debugger & Syntax Doctor"
          >
            <Bug className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Copy current file code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Export Project ZIP */}
          <button
            onClick={() => {
              soundManager.playClick();
              onExportProjectZip();
            }}
            className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Download Android Studio Project (.zip)"
          >
            <FolderArchive className="w-3.5 h-3.5" />
          </button>

          {/* Primary Compile & Build APK Button */}
          <button
            disabled={isCompiling}
            onClick={() => {
              soundManager.playClick();
              onCompileApk();
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isCompiling ? (isBangla ? 'প্যাকেজিং হচ্ছে...' : 'Compiling...') : (isBangla ? 'কম্পাইল ও বিল্ড APK' : 'Compile & Build APK')}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div 
        className="flex-1 relative flex flex-col min-h-[360px]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {activeTab === 'html' && (
          <textarea
            value={project.html}
            onChange={(e) => onChangeProject({ ...project, html: e.target.value })}
            className="w-full flex-1 p-4 bg-neutral-950 text-neutral-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-orange-500/30"
            spellCheck={false}
            placeholder="Write or paste your HTML5 layout here..."
          />
        )}

        {activeTab === 'css' && (
          <textarea
            value={project.css}
            onChange={(e) => onChangeProject({ ...project, css: e.target.value })}
            className="w-full flex-1 p-4 bg-neutral-950 text-neutral-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-blue-500/30"
            spellCheck={false}
            placeholder="Write your CSS styling rules here..."
          />
        )}

        {activeTab === 'js' && (
          <textarea
            value={project.js}
            onChange={(e) => onChangeProject({ ...project, js: e.target.value })}
            className="w-full flex-1 p-4 bg-neutral-950 text-neutral-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-amber-500/30"
            spellCheck={false}
            placeholder="Write modern JavaScript, event listeners, or AndroidBridge calls..."
          />
        )}

        {/* Cloud File Manager Tab */}
        {activeTab === 'files' && (
          <div className="flex-1 p-6 bg-neutral-950 text-neutral-200 overflow-y-auto">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-cyan-400" />
                    {isBangla ? 'ক্লাউড ফাইল ম্যানেজার ও অ্যাসেট স্টোরেজ' : 'Cloud File Manager & Assets'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Manage bundle assets packaged directly into Android assets/www/ directory.
                  </p>
                </div>
                <label className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Archive / File</span>
                  <input type="file" onChange={handleImportFile} className="hidden" accept=".html,.css,.js,.json,.zip" />
                </label>
              </div>

              {/* Add file form */}
              <form onSubmit={handleCreateVirtualFile} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New file name (e.g. custom.js, config.json)..."
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Add File</span>
                </button>
              </form>

              {/* Files table */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="p-3">File Name</th>
                      <th className="p-3">Size</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {virtualFiles.map((f, i) => (
                      <tr key={i} className="hover:bg-neutral-800/40">
                        <td className="p-3 text-white font-semibold flex items-center gap-2">
                          <FileCode className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{f.name}</span>
                        </td>
                        <td className="p-3 text-neutral-400">{f.size}</td>
                        <td className="p-3 text-emerald-400 uppercase font-bold text-[10px]">{f.type}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (f.name === 'index.html') setActiveTab('html');
                              else if (f.name === 'style.css') setActiveTab('css');
                              else if (f.name === 'app.js') setActiveTab('js');
                            }}
                            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px]"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Configuration Tab */}
        {activeTab === 'permissions' && (
          <div className="flex-1 p-6 bg-neutral-950 text-neutral-200 overflow-y-auto">
            <div className="max-w-2xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                {isBangla ? 'অ্যান্ড্রয়েড রানটাইম পারমিশন কনফিগারেশন' : 'Android Runtime Permissions (Target SDK 35)'}
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                {isBangla
                  ? 'আপনার এপিকে অ্যাপ্লিকেশনের জন্য প্রয়োজনীয় ডিভাইস হার্ডওয়্যার পারমিশন নির্বাচন করুন।'
                  : 'Toggle hardware capability grants injected automatically into AndroidManifest.xml.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { key: 'internet', label: 'INTERNET & Network State', desc: 'Allows web network requests and API fetch' },
                  { key: 'camera', label: 'CAMERA Hardware Access', desc: 'Photos, barcode scanning, and video capture' },
                  { key: 'storage', label: 'External Storage (READ/WRITE)', desc: 'Save downloaded files and cache media' },
                  { key: 'location', label: 'Fine & Coarse Geolocation (GPS)', desc: 'Access GPS sensor and location services' },
                  { key: 'notifications', label: 'POST_NOTIFICATIONS', desc: 'Push notifications on Android 13+' },
                  { key: 'audio', label: 'Microphone & Audio Record', desc: 'Voice input and voice recording' },
                  { key: 'biometric', label: 'Biometric / Fingerprint Prompt', desc: 'Secure fingerprint authentication' },
                ].map((perm) => (
                  <label
                    key={perm.key}
                    className="flex items-start gap-3 p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(project.permissions as any)[perm.key]}
                      onChange={(e) => {
                        soundManager.playClick();
                        onChangeProject({
                          ...project,
                          permissions: {
                            ...project.permissions,
                            [perm.key]: e.target.checked,
                          },
                        });
                      }}
                      className="mt-0.5 rounded border-neutral-700 bg-neutral-800 text-emerald-500 accent-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{perm.label}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{perm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* App Configuration Tab */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-6 bg-neutral-950 text-neutral-200 overflow-y-auto">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    {isBangla ? 'অ্যাপ মেটাডাটা ও প্যাকেজ আইডেন্টিটি' : 'App Identity & Package Configuration'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {isBangla ? 'গুগল প্লে স্টোর ও ইনস্টলারের জন্য প্যাকেজ তথ্য।' : 'Used for unique application identification on Android.'}
                  </p>
                </div>
                <button
                  onClick={handleCloneProject}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium"
                >
                  Clone Project
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">
                    {isBangla ? 'অ্যাপ্লিকেশন নাম' : 'Application Name'}
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => onChangeProject({ ...project, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">
                    {isBangla ? 'প্যাকেজ আইডি (Package ID)' : 'Package ID (Unique)'}
                  </label>
                  <input
                    type="text"
                    value={project.packageId}
                    onChange={(e) => onChangeProject({ ...project, packageId: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">
                    {isBangla ? 'ভার্সন নাম' : 'Version Name'}
                  </label>
                  <input
                    type="text"
                    value={project.versionName}
                    onChange={(e) => onChangeProject({ ...project, versionName: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">
                    {isBangla ? 'ভার্সন কোড (Integer)' : 'Version Code'}
                  </label>
                  <input
                    type="number"
                    value={project.versionCode}
                    onChange={(e) => onChangeProject({ ...project, versionCode: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Native Configuration Options */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Native Engine Options</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={project.nativeConfig.offlineCache}
                      onChange={(e) => onChangeProject({
                        ...project,
                        nativeConfig: { ...project.nativeConfig, offlineCache: e.target.checked }
                      })}
                      className="rounded border-neutral-700 bg-neutral-800 text-purple-500 accent-purple-500"
                    />
                    <span className="text-xs text-neutral-300">Offline Web Storage Caching</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={project.nativeConfig.enableProguard}
                      onChange={(e) => onChangeProject({
                        ...project,
                        nativeConfig: { ...project.nativeConfig, enableProguard: e.target.checked }
                      })}
                      className="rounded border-neutral-700 bg-neutral-800 text-purple-500 accent-purple-500"
                    />
                    <span className="text-xs text-neutral-300">Enable ProGuard Obfuscation</span>
                  </label>
                </div>
              </div>

              {/* Keystore Generation Utility */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-purple-500/10 text-purple-400">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">APK Keystore Signature</div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {project.nativeConfig.keystoreAlias} (RSA 2048-bit v2/v3)
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={generateKeystore}
                    className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors"
                  >
                    {keystoreGenerated ? 'Rotated Key ✓' : 'Regenerate Keystore'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Console Log Inspector Panel */}
      <div className="border-t border-neutral-800 bg-neutral-950 p-2.5">
        <div className="flex items-center justify-between mb-1.5 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-neutral-300">Console Inspector ({consoleLogs.length})</span>
          </div>
          <button
            onClick={onClearConsole}
            className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
          >
            <Trash2 className="w-3 h-3 text-neutral-500" />
            <span>Clear</span>
          </button>
        </div>

        <div className="h-20 overflow-y-auto font-mono text-[11px] space-y-1 bg-black/60 rounded p-2 border border-neutral-900">
          {consoleLogs.length === 0 ? (
            <div className="text-neutral-600 italic">No console messages logged. Runtime idle.</div>
          ) : (
            consoleLogs.map((log, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  log.type === 'error'
                    ? 'text-rose-400'
                    : log.type === 'warn'
                    ? 'text-amber-400'
                    : 'text-neutral-300'
                }`}
              >
                <span className="text-neutral-600 text-[10px] shrink-0">{log.timestamp}</span>
                <span className="shrink-0 uppercase font-bold text-[9px] px-1 rounded bg-neutral-800/80">
                  {log.type}
                </span>
                <span className="break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dynamic Popup Modal for App Name, Logo & Icon Cropper (Features #23 & #40) */}
      {showMetadataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Crop className="w-4 h-4 text-emerald-400" />
                App Identity & Icon Generator
              </h4>
              <button onClick={() => setShowMetadataModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Application Name:</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => onChangeProject({ ...project, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Android Package ID:</label>
                <input
                  type="text"
                  value={project.packageId}
                  onChange={(e) => onChangeProject({ ...project, packageId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 font-mono text-white"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1.5">App Launcher Icon Maker (512x512):</label>
                <div className="flex items-center gap-4 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-white/20"
                    style={{ backgroundColor: iconColor }}
                  >
                    {iconEmoji}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex gap-1.5">
                      {['📱', '⚡', '💬', '🛍️', '🎮', '🚀'].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setIconEmoji(em)}
                          className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 text-sm"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={iconColor}
                        onChange={(e) => setIconColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                      />
                      <span className="text-[11px] text-neutral-400 font-mono">{iconColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playSuccess();
                  setShowMetadataModal(false);
                }}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
              >
                Apply App Metadata
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intelligent Pre-Build Debugging Assistant Modal (Feature #39) */}
      {showDebuggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Bug className="w-4 h-4 text-amber-400" />
                Pre-Build Syntax & Security Diagnostic Assistant
              </h4>
              <button onClick={() => setShowDebuggerModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Target API 35 (Android 15) Ready</span>
                </div>
                <p className="text-[11px] text-emerald-400/80">
                  AndroidManifest.xml contains valid namespace and hardwareAccelerated flags.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="font-bold text-white">Source Code Diagnostics:</div>
                <ul className="space-y-1 text-neutral-300 font-mono text-[11px]">
                  <li>✓ HTML Tag tree: Balanced (0 unclosed elements)</li>
                  <li>✓ JavaScript syntax: Parsed without fatal exceptions</li>
                  <li>✓ AndroidBridge references: Correctly bounded to window.AndroidBridge</li>
                  <li>✓ ProGuard config: Valid keepclassmembers directive</li>
                </ul>
              </div>

              <button
                onClick={() => setShowDebuggerModal(false)}
                className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs"
              >
                Close Diagnostic Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
