
import { ThemeProvider } from './components/ThemeProvider'
import { TaskGrid } from './components/TaskGrid'

export default function App() {
  return (
    <ThemeProvider>
      <TaskGrid />
    </ThemeProvider>
  )
}