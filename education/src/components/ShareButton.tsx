import { Check, Link } from 'lucide-react';
import { useState } from 'react';
import type { Language } from '../lib/state';
export default function ShareButton({ language, label }: { language: Language; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(location.href); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    catch { setFallback(true); }
  };
  return <div className="share-control"><button className="text-action" onClick={copy}>{copied ? <Check size={16}/> : <Link size={16}/>}<span>{copied ? (language === 'zh' ? '链接已复制' : 'Link copied') : (label || (language === 'zh' ? '分享这座岛' : 'Share this island'))}</span></button>{fallback && <label className="share-fallback">{language === 'zh' ? '复制下方链接' : 'Copy this link'}<input readOnly value={location.href} onFocus={e => e.target.select()}/></label>}<span className="sr-only" aria-live="polite">{copied ? (language === 'zh' ? '链接已复制' : 'Link copied') : ''}</span></div>;
}
