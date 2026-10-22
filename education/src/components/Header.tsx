import { BookOpen, Compass, Network, Waypoints } from 'lucide-react';
import type { Language, View } from '../lib/state';

function Mark() {
  return <svg className="brand-mark" viewBox="0 0 80 43" fill="none" aria-hidden="true"><path d="M4 35q9-5 18-2t19 1 18-2 17 3M10 28l9-16q4-7 9 0l3 6 7-13q4-5 8 1l14 22M19 15l5 4 4-7M35 18l7 4 6-10M2 40q10-4 23-1t27 0 25 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="m56 31 6-13q3-5 6 0l5 14z" fill="currentColor"/></svg>;
}
export default function Header({ language, view, onView, onLanguage }: { language: Language; view: View; onView: (view: View) => void; onLanguage: (language: Language) => void }) {
  const links: { value: View; zh: string; en: string; icon: typeof Compass }[] = [
    { value: 'islands', zh: '探索群岛', en: 'Explore', icon: Compass },
    { value: 'atlas', zh: '全部图谱', en: 'Full atlas', icon: Network },
    { value: 'connections', zh: '联岛实验', en: 'Connections', icon: Waypoints },
    { value: 'journal', zh: '我的航记', en: 'Field notes', icon: BookOpen },
  ];
  return <header className="site-header">
    <a className="brand" href={`#view=islands&lang=${language}`} onClick={event => { event.preventDefault(); onView('islands'); }}><Mark/><span>{language === 'zh' ? '数学群岛' : 'Math Islands'}</span></a>
    <nav className="main-nav" aria-label={language === 'zh' ? '主导航' : 'Main navigation'}>{links.map(link => <button key={link.value} className={view === link.value ? 'active' : ''} aria-current={view === link.value ? 'page' : undefined} onClick={() => onView(link.value)}><link.icon size={17}/><span>{link[language]}</span></button>)}</nav>
    <div className="language-control" role="group" aria-label={language === 'zh' ? '语言' : 'Language'}><button aria-pressed={language === 'zh'} onClick={() => onLanguage('zh')}>中文</button><span aria-hidden="true">/</span><button aria-pressed={language === 'en'} onClick={() => onLanguage('en')}>EN</button></div>
  </header>;
}
