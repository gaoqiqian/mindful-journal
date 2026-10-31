import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 保留开发期诊断信息；生产环境不向用户暴露技术细节.
    console.error('Mindful Journal rendering error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-recovery" role="alert">
          <div className="eyebrow">LET US TRY AGAIN</div>
          <h1>This page could not be opened.</h1>
          <p>Your saved demo entries remain in this browser. Reload to continue.</p>
          <button className="btn" onClick={() => window.location.reload()}>Try again</button>
        </main>
      )
    }
    return this.props.children
  }
}
