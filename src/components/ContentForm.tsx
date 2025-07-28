import { useState, useEffect } from 'react'
import { uploadImage, createProduct, updateProduct, getProductById, deleteProduct } from '../services/api'
import type { CreateProductRequest, ProductDetail } from '../services/api'
import ImageUpload from './ImageUpload'
import FormField from './FormField'
import DateRangeField from './DateRangeField'
import FormButtons from './FormButtons'

interface ContentFormProps {
  onClose: () => void
  editMode?: boolean
  productId?: string
}

function ContentForm({ onClose, editMode = false, productId }: ContentFormProps) {
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
  const [isLoading, setIsLoading] = useState(false)
  const [existingProduct, setExistingProduct] = useState<ProductDetail | null>(null)

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (editMode && productId) {
      setIsLoading(true)
              getProductById(productId)
          .then((product) => {
            console.log('로드된 제품 데이터:', product) // 디버깅용
            setExistingProduct(product)
          setFormData({
            companyName: product.companyName || '',
            title: product.title || '',
            phoneNumber: product.phoneNumber || '',
            content: product.content || '',
            isActive: product.isActive ?? true,
            startDate: product.startDate || '',
            endDate: product.endDate || '',
            postingPeriodType: product.postingPeriodType || 'FIXED_PERIOD'
          })
          setIsPermanent(product.postingPeriodType === 'PERMANENT')
        })
        .catch((error) => {
          console.error('제품 데이터 로드 실패:', error)
          alert('제품 정보를 불러오는데 실패했습니다.')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [editMode, productId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const isFormValid = (): boolean => {
    const requiredFields = [
      formData.title.trim(),
      formData.companyName.trim(),
      formData.phoneNumber.trim(),
      formData.content.trim()
    ]
    
    const hasRequiredFields = requiredFields.every(field => field !== '')
    
    // 수정 모드에서는 이미지가 없어도 됨 (기존 이미지 사용)
    const hasRequiredImages = editMode ? true : (logoImage !== null && cardImage !== null)
    const hasValidDates = isPermanent || (!!formData.startDate && !!formData.endDate)
    
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
      // 1. 이미지 업로드 (새 이미지가 있는 경우에만)
      let logoImageKey = existingProduct?.logoImage?.key || ''
      let productImageKey = existingProduct?.productImage?.key || ''

      const uploadPromises = []
      if (logoImage) {
        uploadPromises.push(uploadImage(logoImage))
      }
      if (cardImage) {
        uploadPromises.push(uploadImage(cardImage))
      }

      if (uploadPromises.length > 0) {
        console.log('이미지 업로드 시작...')
        const uploadResults = await Promise.all(uploadPromises)
        
        let resultIndex = 0
        if (logoImage) {
          const logoResponse = uploadResults[resultIndex++]
          if (!logoResponse.success) {
            throw new Error('로고 이미지 업로드에 실패했습니다.')
          }
          logoImageKey = logoResponse.data.key
          console.log('새로운 로고 키:', logoImageKey)
        }
        if (cardImage) {
          const cardResponse = uploadResults[resultIndex++]
          console.log('제품 업로드 응답:', cardResponse)
          if (!cardResponse.success) {
            throw new Error('카드 이미지 업로드에 실패했습니다.')
          }
          productImageKey = cardResponse.data.key
        }
      }

      // 2. 제품 데이터 생성
      const productData: CreateProductRequest = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        logoImageKey,
        productImageKey,
        isActive: formData.isActive,
        startDate: isPermanent ? null : formData.startDate,
        endDate: isPermanent ? null : formData.endDate,
        postingPeriodType: formData.postingPeriodType,
        companyId: '053a5ada-77b5-4646-aecd-4447234e6979'
      }

      console.log(`제품 ${editMode ? '수정' : '생성'} 요청:`, productData)

      // 3. 제품 생성 또는 수정
      const response = editMode 
        ? await updateProduct(productId!, productData)
        : await createProduct(productData)
      
      console.log(response)
      if (response.success) {
        alert(`컨텐츠가 성공적으로 ${editMode ? '수정' : '등록'}되었습니다!`)
        onClose()
      } else {
        throw new Error(`제품 ${editMode ? '수정' : '생성'}에 실패했습니다.`)
      }

    } catch (error) {
      console.error('처리 실패:', error)
      alert(`${editMode ? '수정' : '등록'} 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!editMode || !productId) return

    setIsSubmitting(true)
    try {
      const response = await deleteProduct(productId)
      if (response.success) {
        alert('컨텐츠가 성공적으로 삭제되었습니다!')
        onClose()
      } else {
        throw new Error('삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('삭제 실패:', error)
      alert(`삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex-1 p-[40px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-[40px]">
              {/* 페이지 헤더 */}
        <div className="flex flex-col mb-[20px]">
          <div className="text-sm text-[#AB43CE] font-medium mb-1">컨텐츠 관리</div>
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <svg className="w-11 h-11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-[36px] font-bold">{editMode ? '컨텐츠 상세 관리' : '컨텐츠 등록'}</h1>
          </div>
        </div>

             <div className="flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
         <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
          <FormField
            label="제목"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="제목을 입력하세요"
            required
          />

          {/* 로고 이미지 */}
          <ImageUpload
            label="로고 이미지"
            id="logo-upload"
            image={logoImage}
            existingImageUrl={existingProduct?.logoImage?.url}
            onImageChange={setLogoImage}
            required={!editMode}
            width="w-50"
            height="h-50"
          />

                        {/* 업체명 */}
            <FormField
              label="업체명"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="업체명을 입력하세요"
              required
            />

                    {/* 휴대폰번호 */}
          <FormField
            label="휴대폰번호"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="010-0000-0000"
            required
          />

          {/* 카드 이미지 */}
          <ImageUpload
            label="카드 이미지"
            id="card-upload"
            image={cardImage}
            existingImageUrl={existingProduct?.productImage?.url}
            onImageChange={setCardImage}
            width="w-50"
            height="h-50"
            required={!editMode}
          />

                    {/* 내용 */}
          <FormField
            label="내용"
            name="content"
            type="textarea"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="내용을 입력하세요"
            required
            rows={6}
          />

                    {/* 활성 상태 */}
          <FormField
            label="상태"
            name="isActive"
            type="select"
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
            required
            options={[
              { value: 'true', label: '활성' },
              { value: 'false', label: '비활성' }
            ]}
          />

          {/* 게시 기간 */}
          <DateRangeField
            startDate={formData.startDate}
            endDate={formData.endDate}
            isPermanent={isPermanent}
            onStartDateChange={handleInputChange}
            onEndDateChange={handleInputChange}
            onPermanentChange={(checked) => {
              setIsPermanent(checked)
              setFormData(prev => ({
                ...prev,
                postingPeriodType: checked ? 'PERMANENT' : 'FIXED_PERIOD',
                startDate: checked ? '' : prev.startDate,
                endDate: checked ? '' : prev.endDate
              }))
            }}
          />

          {/* 버튼 */}
          <FormButtons
            editMode={editMode}
            isFormValid={isFormValid()}
            isSubmitting={isSubmitting}
            onDelete={editMode ? handleDelete : undefined}
            onSubmit={() => {}}
          />
        </form>
      </div>
    </main>
  )
}

export default ContentForm 