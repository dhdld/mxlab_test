import { useState, useEffect } from 'react'
import { getProducts, getProductById } from '../services/api'
import type { ProductItem, ProductMeta } from '../services/api'

function ContentTable() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [meta, setMeta] = useState<ProductMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // 1. 전체 목록 가져오기
      const response = await getProducts(1, 10)
      
      if (response.success) {
        setMeta(response.data.meta)
        
        // 2. 각 제품의 상세 정보 가져오기
        const detailedProducts = await Promise.all(
          response.data.items.map(async (product) => {
            try {
              const detailData = await getProductById(product.id)
              return {
                ...product,
                phoneNumber: detailData.phoneNumber,
                isActive: detailData.isActive
              }
            } catch (error) {
              console.error(`제품 ${product.id} 상세 정보 로드 실패:`, error)
              return {
                ...product,
                phoneNumber: '010-1234-5678', // 기본값
                isActive: true // 기본값
              }
            }
          })
        )
        
        setProducts(detailedProducts)
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '미정'
    return new Date(dateString).toLocaleDateString('ko-KR')
  }



  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-500">데이터를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-red-500">{error}</div>
        <button 
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-[#AB43CE] text-white rounded-md hover:bg-purple-700"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full border-collapse text-center table-fixed">
        {/* 테이블 헤더 */}
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            <th className="p-4 text-sm font-medium text-gray-700 border-r border-gray-200 w-[8%]">번호</th>
            <th className="p-4 text-sm font-medium text-gray-700 border-r border-gray-200 w-[10%]">로고 이미지</th>
            <th className="p-4 text-sm font-medium text-gray-700 border-r border-gray-200 w-[15%]">업체명</th>
            <th className="p-4 text-sm font-medium text-gray-700 border-r border-gray-200 w-[13%]">휴대폰번호</th>
            <th className="p-4 text-sm font-medium text-gray-700 border-r border-gray-200 w-[12%]">카드 이미지</th>
            <th className="p-4 text-sm font-medium text-gray-700 border-r border-gray-200 w-[18%]">제목</th>
            <th className="p-4 text-sm font-medium text-gray-700 border-r border-gray-200 w-[8%]">상태</th>
            <th className="p-4 text-sm font-medium text-gray-700 border-r border-gray-200 w-[14%]">게시기간</th>
            <th className="p-4 text-sm font-medium text-gray-700 w-[8%]">상세 관리</th>
          </tr>
        </thead>

        {/* 테이블 내용 */}
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="border-b border-gray-200 h-[140px]">
              <td className="p-4 text-xs border-r border-gray-200 align-middle">{meta?.totalItems ? meta.totalItems - index : index + 1}</td>
              <td className="p-4 text-xs border-r border-gray-200 align-middle">
                <div className="flex items-center justify-center">
                  {product.logoImageUrl ? (
                    <img 
                      src={product.logoImageUrl} 
                      alt="로고" 
                      className="w-8 h-8 rounded-md object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/logo.svg';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#AB43CE] rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">?</span>
                    </div>
                  )}
                </div>
              </td>
                             <td className="p-4 text-xs border-r border-gray-200 align-middle font-medium">{product.companyName || '미정'}</td>
               <td className="p-4 text-xs border-r border-gray-200 align-middle">{product.phoneNumber || '010-1234-5678'}</td>
              <td className="p-4 text-xs border-r border-gray-200 align-middle">
                <div className="flex items-center justify-center">
                  {product.productImageUrl ? (
                    <img 
                      src={product.productImageUrl} 
                      alt="제품" 
                      className="w-[120px] h-[120px] rounded-md object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/card.png'
                      }}
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] bg-orange-200 rounded-md flex items-center justify-center">
                      <span className="text-orange-600 text-base font-medium">No Image</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4 text-xs border-r border-gray-200 align-middle font-medium">{product.title}</td>
                             <td className="p-4 text-xs border-r border-gray-200 align-middle">
                 <select 
                   className="px-2 py-1 rounded text-xs font-medium border border-gray-300 bg-white"
                   defaultValue={product.isActive ? 'active' : 'inactive'}
                 >
                   <option value="active">활성</option>
                   <option value="inactive">비활성</option>
                 </select>
               </td>
              <td className="p-4 text-xs text-gray-500 border-r border-gray-200 align-middle">
                {formatDate(product.startDate)} ~ {formatDate(product.endDate)}
              </td>
                  <td className="p-4 text-xs align-middle">
                  <button>
                    <img src="/more.svg" alt="상세 관리" className="w-[35px] h-[35px]" />
                  </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ContentTable 