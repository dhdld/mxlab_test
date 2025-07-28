import { useState, useEffect } from 'react'
import { getProducts } from '../services/api'
import type { ProductMeta } from '../services/api'
import ContentTable from './ContentTable'
import ContentForm from './ContentForm'

function ContentManagement() {
  const [meta, setMeta] = useState<ProductMeta | null>(null)
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list')

  useEffect(() => {
    fetchMeta()
  }, [])

  const fetchMeta = async () => {
    try {
      const response = await getProducts(1, 10)
      if (response.success) {
        setMeta(response.data.meta)
      }
    } catch (error) {
      console.error('메타 데이터 로드 실패:', error)
    }
  }

  // 현재 화면에 따라 다른 컴포넌트 렌더링
  if (currentView === 'form') {
    return <ContentForm onClose={() => setCurrentView('list')} />
  }

  return (
    <main className="flex-1 p-[40px]">
      <div className="flex flex-col mb-[20px]">
        <div className="text-sm text-[#AB43CE] font-medium mb-1">설정</div>
        <h1 className="text-[36px] font-bold">컨텐츠 관리</h1>
      </div>

      <div className="mb-[25px] flex justify-between items-end">
        <div className="text-sm">
          전체: {meta?.totalItems || 0}건
        </div>
        <button 
          onClick={() => setCurrentView('form')}
          className="px-4 py-2 text-[#AB43CE] border border-[#AB43CE] rounded-md hover:bg-purple-50"
        >
          컨텐츠 등록
        </button>
      </div>

      <ContentTable />
    </main>
  )
}

export default ContentManagement 