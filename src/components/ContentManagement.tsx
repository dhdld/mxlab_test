import { useState, useEffect } from 'react'
import { getProducts, getProductById } from '../services/api'
import type { ProductMeta, ProductItem, ProductDetail } from '../services/api'
import ContentTable from './ContentTable'
import ContentForm from './ContentForm'
import Pagination from './Pagination'

function ContentManagement() {
  const [meta, setMeta] = useState<ProductMeta | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'edit'>('list')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts(currentPage, 20)
      console.log('페이지네이션 데이터:', response.data.meta) // 디버깅용
      
      if (response.success) {
        setMeta(response.data.meta)
        
        // 각 제품의 상세 정보 가져오기
        const detailedProducts = await Promise.all(
          response.data.items.map(async (product) => {
            try {
              const detailData: ProductDetail = await getProductById(product.id)
              return {
                ...product,
                phoneNumber: detailData.phoneNumber,
                isActive: detailData.isActive
              }
            } catch (error) {
              console.error(`제품 ${product.id} 상세 정보 로드 실패:`, error)
              return {
                ...product,
                phoneNumber: '010-1234-5678',
                isActive: true
              }
            }
          })
        )
        
        setProducts(detailedProducts)
        setError(null)
      } else {
        setError('데이터를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('API 호출 중 오류가 발생했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 현재 화면에 따라 다른 컴포넌트 렌더링
  if (currentView === 'form') {
    return <ContentForm onClose={() => setCurrentView('list')} />
  }

  if (currentView === 'edit' && selectedProductId) {
    return (
      <ContentForm 
        onClose={() => {
          setCurrentView('list')
          setSelectedProductId(null)
        }}
        editMode={true}
        productId={selectedProductId}
      />
    )
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

                <ContentTable
            products={products}
            meta={meta}
            loading={loading}
            error={error}
            currentPage={currentPage}
            onRefresh={fetchProducts}
            onEdit={(productId) => {
              setSelectedProductId(productId)
              setCurrentView('edit')
            }}
          />
          
          {/* 페이지네이션 */}
          {meta && (
            <Pagination 
              currentPage={currentPage}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
  )
}

export default ContentManagement 