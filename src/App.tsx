import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* 로고 섹션 */}
        <div className="flex justify-center items-center gap-8 mb-12">
          <a 
            href="https://vite.dev" 
            target="_blank" 
            className="transition-transform hover:scale-110 duration-300"
          >
            <img 
              src={viteLogo} 
              className="h-20 w-20 drop-shadow-lg hover:drop-shadow-xl" 
              alt="Vite logo" 
            />
          </a>
          <a 
            href="https://react.dev" 
            target="_blank"
            className="transition-transform hover:scale-110 duration-300"
          >
            <img 
              src={reactLogo} 
              className="h-20 w-20 drop-shadow-lg hover:drop-shadow-xl animate-spin-slow" 
              alt="React logo" 
            />
          </a>
        </div>

        {/* 메인 타이틀 */}
        <h1 className="text-6xl font-bold text-white mb-12">
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Vite + React
          </span>
        </h1>

        {/* 카운터 카드 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            count is {count}
          </button>
          <p className="text-gray-300 mt-4">
            Edit <code className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm">src/App.tsx</code> and save to test HMR
          </p>
        </div>

        {/* 안내 텍스트 */}
        <p className="text-gray-400 text-lg">
          Click on the Vite and React logos to learn more
        </p>

        {/* Tailwind CSS 안내 */}
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-300 font-medium">
            🎉 Tailwind CSS가 성공적으로 설정되었습니다!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
