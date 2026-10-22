import { Component, type ErrorInfo, type ReactNode } from 'react';
import { downloadText, JOURNAL_KEY, parseJournal } from '../lib/state';

/** Keeps a failed lazy module or rendering error from becoming an unexplained blank page. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Education view failed to render', error, info.componentStack);
  }
  exportNotes = () => {
    let data = { version: 1 as const, entries: {} };
    try { data = parseJournal(localStorage.getItem(JOURNAL_KEY)); } catch { /* Storage may be unavailable. */ }
    downloadText('math-islands-journal.json', JSON.stringify(data, null, 2), 'application/json');
  };
  render() {
    if (!this.state.failed) return this.props.children;
    const english = new URLSearchParams(location.hash.slice(1)).get('lang') === 'en';
    return <main className="error-page" role="main">
      <span className="error-mark" aria-hidden="true">⌁</span>
      <h1>{english ? 'This view could not be loaded.' : '这片海域暂时没有展开。'}</h1>
      <p>{english ? 'A page resource may be unavailable or the view encountered an error. Reload to try again. Your saved field notes remain in this browser.' : '页面资源可能未能载入，或当前视图出现错误。刷新后可以重试；已经保存的航记仍在当前浏览器中。'}</p>
      <div className="error-actions"><button className="primary-button" onClick={() => location.reload()}>{english ? 'Reload the page' : '刷新重试'}</button><button className="text-action" onClick={this.exportNotes}>{english ? 'Export saved field notes' : '导出已保存的航记'}</button></div>
      <a className="source-notice" href="https://github.com/Lightmaze/Math-Island/tree/main/education" target="_blank" rel="noreferrer">{english ? 'Read the documentation' : '阅读项目说明'}</a>
    </main>;
  }
}
