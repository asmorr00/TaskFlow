
import { ThemeProvider } from './components/ThemeProvider'
import { TaskGrid } from './components/TaskGrid'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TaskGrid />
      </ThemeProvider>
    </ErrorBoundary>
  )
}