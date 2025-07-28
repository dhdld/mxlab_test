import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ContentManagement from './components/ContentManagement'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex">
        <Sidebar />
        <ContentManagement />
      </div>
    </div>
  )
}

export default App
