import axios from 'axios'

const API_BASE_URL = 'http://www.braincoach.kr'
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NmQ0MzJmMS1kNzZlLTRlZjEtYWJkNC0wYzBjMDc4MmM2NjAiLCJ1c2VySWQiOiJTb3llb25LIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzUzNjI2NjA1LCJleHAiOjE3NTM2ODc4MDV9.aikPXAR7qhVkS3yQKHND2p7eD9B1xxSo29j-VKuxsyg'

// API 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  },
})

// 데이터 타입 정의
export interface ImageObject {
  key: string
  url: string
}

// getProducts용 (URL만)
export interface ProductItem {
  id: string
  title: string
  companyName: string
  content: string
  startDate: string | null
  endDate: string | null
  postingPeriodType: string
  logoImageUrl: string
  productImageUrl: string
  phoneNumber?: string
  isActive?: boolean
}

// getProductById용 (객체 형태)
export interface ProductDetail {
  id: string
  title: string
  companyName: string
  content: string
  startDate: string | null
  endDate: string | null
  postingPeriodType: string
  logoImage: ImageObject
  productImage: ImageObject
  phoneNumber: string
  isActive: boolean
}

export interface ProductMeta {
  totalItems: number
  itemCount: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

export interface ProductResponse {
  success: boolean
  data: {
    items: ProductItem[]
    meta: ProductMeta
  }
}

export interface CreateProductRequest {
  title: string
  content: string
  phoneNumber: string
  logoImageKey: string
  productImageKey: string
  isActive: boolean
  startDate: string | null
  endDate: string | null
  postingPeriodType: string
  companyId: string
}

export interface ImageUploadResponse {
  success: boolean
  data: {
    key: string
    url: string
  }
}

export interface CreateProductResponse {
  success: boolean
  data: ProductDetail
}

// 전체 제품 데이터 가져오기
export const getProducts = async (page: number = 1, limit: number = 10): Promise<ProductResponse> => {
  try {
    const response = await api.get(`/products?page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('API 호출 실패:', error)
    throw error
  }
}

// 개별 제품 상세 정보 가져오기
export const getProductById = async (id: string): Promise<ProductDetail> => {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data.data
  } catch (error) {
    console.error('개별 제품 API 호출 실패:', error)
    throw error
  }
}

// 이미지 업로드 API
export const uploadImage = async (imageFile: File): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await axios.post(`${API_BASE_URL}/products/upload-image`, formData, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('이미지 업로드 실패:', error)
    throw error
  }
}

// 제품 생성 API
export const createProduct = async (productData: CreateProductRequest): Promise<CreateProductResponse> => {
  try {
    const response = await api.post('/products', productData)
    return response.data
  } catch (error) {
    console.error('제품 생성 실패:', error)
    throw error
  }
}

// 제품 수정 API
export const updateProduct = async (id: string, productData: CreateProductRequest): Promise<CreateProductResponse> => {
  try {
    // PATCH 대신 PUT 사용 (CORS 문제 해결 시도)
    const response = await api.patch(`/products/${id}`, productData)
    return response.data
  } catch (error) {
    console.error('제품 수정 실패:', error)
    throw error
  }
}

// 제품 삭제 API
export const deleteProduct = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error('제품 삭제 실패:', error)
    throw error
  }
}

export default api 