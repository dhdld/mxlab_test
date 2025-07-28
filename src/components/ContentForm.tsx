import { useState } from 'react'
import { uploadImage, createProduct } from '../services/api'
import type { CreateProductRequest } from '../services/api'

interface ContentFormProps {
  onClose: () => void
}

function ContentForm({ onClose }: ContentFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    phoneNumber: '',
    content: '',
    isActive: true,
    startDate: '',
    endDate: '',
    postingPeriodType: 'FIXED_PERIOD'
  })

  const [logoImage, setLogoImage] = useState<File | null>(null)
  const [cardImage, setCardImage] = useState<File | null>(null)
  const [isPermanent, setIsPermanent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'card') => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === 'logo') {
        setLogoImage(file)
      } else {
        setCardImage(file)
      }
    }
  }

  const isFormValid = () => {
    const requiredFields = [
      formData.title.trim(),
      formData.companyName.trim(),
      formData.phoneNumber.trim(),
      formData.content.trim()
    ]
    
    const hasRequiredFields = requiredFields.every(field => field !== '')
    const hasRequiredImages = logoImage !== null && cardImage !== null
    const hasValidDates = isPermanent || (formData.startDate && formData.endDate)
    
    return hasRequiredFields && hasRequiredImages && hasValidDates
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // 1. 이미지 업로드
      console.log('이미지 업로드 시작...')
      const [logoResponse, cardResponse] = await Promise.all([
        uploadImage(logoImage!),
        uploadImage(cardImage!)
      ])

      if (!logoResponse.success || !cardResponse.success) {
        throw new Error('이미지 업로드에 실패했습니다.')
      }

      console.log('이미지 업로드 완료:', {
        logo: logoResponse.data.key,
        card: cardResponse.data.key
      })

      // 2. 제품 데이터 생성
      const productData: CreateProductRequest = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        logoImageKey: logoResponse.data.key,
        productImageKey: cardResponse.data.key,
        isActive: formData.isActive,
        startDate: isPermanent ? null : formData.startDate,
        endDate: isPermanent ? null : formData.endDate,
        postingPeriodType: formData.postingPeriodType,
        companyId: '053a5ada-77b5-4646-aecd-4447234e6979'
      }

      console.log('제품 생성 요청:', productData)

      // 3. 제품 생성
      const createResponse = await createProduct(productData)
      
      if (createResponse.success) {
        alert('컨텐츠가 성공적으로 등록되었습니다!')
        onClose()
      } else {
        console.log('제품 생성 실패:', createResponse)
        throw new Error('제품 생성에 실패했습니다.')
      }

    } catch (error) {
      console.error('등록 실패:', error)
      alert(`등록 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex-1 p-[40px]">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-[20px]">
        <div className="flex flex-col">
          <div className="text-sm text-[#AB43CE] font-medium mb-1">설정</div>
          <h1 className="text-[36px] font-bold">컨텐츠 등록</h1>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          목록으로
        </button>
      </div>

             <div className="flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
         <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-[#AB43CE]">*</span>
            </label>
                         <input
               type="text"
               name="title"
               value={formData.title}
               onChange={handleInputChange}
               className="w-[540px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE]"
               placeholder="제목을 입력하세요"
               required
             />
          </div>

          {/* 로고 이미지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">로고 이미지 <span className="text-[#AB43CE]">*</span></label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                {logoImage ? (
                  <img 
                    src={URL.createObjectURL(logoImage)} 
                    alt="로고 미리보기" 
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'logo')}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                파일 선택
              </label>
            </div>
          </div>

            {/* 업체명 */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              업체명 <span className="text-[#AB43CE]">*</span>
            </label>
                          <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-[540px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE]"
                placeholder="업체명을 입력하세요"
                required
              />
          </div>

          {/* 휴대폰번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              휴대폰번호 <span className="text-[#AB43CE]">*</span>
            </label>
                          <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-[540px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE]"
                placeholder="010-0000-0000"
                required
              />
          </div>

          {/* 카드 이미지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카드 이미지 <span className="text-[#AB43CE]">*</span></label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                {cardImage ? (
                  <img 
                    src={URL.createObjectURL(cardImage)} 
                    alt="카드 미리보기" 
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'card')}
                className="hidden"
                id="card-upload"
              />
              <label
                htmlFor="card-upload"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                파일 선택
              </label>
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">내용 <span className="text-[#AB43CE]">*</span></label>
                          <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className="w-[540px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE]"
                placeholder="내용을 입력하세요"
              />
          </div>

          {/* 활성 상태 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태 <span className="text-[#AB43CE]">*</span></label>
                          <select
                name="isActive"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                className="w-[540px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE]"
              >
              <option value="true">활성</option>
              <option value="false">비활성</option>
            </select>
          </div>

          {/* 게시 기간 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 justify-between">
              <label className="block text-sm font-medium text-gray-700">게시기간 <span className="text-[#AB43CE]">*</span></label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permanent"
                  checked={isPermanent}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setIsPermanent(checked)
                    setFormData(prev => ({
                      ...prev,
                      postingPeriodType: checked ? 'PERMANENT' : 'FIXED_PERIOD',
                      startDate: checked ? '' : prev.startDate,
                      endDate: checked ? '' : prev.endDate
                    }))
                  }}
                  className="w-4 h-4 text-[#AB43CE] border-gray-300 rounded focus:ring-[#AB43CE]"
                />
                <label htmlFor="permanent" className="text-sm text-gray-700">상시게시</label>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                disabled={isPermanent}
                className={`w-[265px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE] ${isPermanent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={isPermanent}
                className={`w-[265px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE] ${isPermanent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className='px-20 py-3 rounded-lg bg-[#AB43CE] text-white'
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default ContentForm 