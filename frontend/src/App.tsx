import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <h1 className="text-3xl font-bold text-blue-600 mb-6">
        React Counter Sample
      </h1>
  )
}

export default App
