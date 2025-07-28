interface ImageUploadProps {
  label: string
  id: string
  image: File | null
  existingImageUrl?: string
  onImageChange: (file: File | null) => void
  width?: string
  height?: string
  required?: boolean
}

function ImageUpload({
  label,
  id,
  image,
  existingImageUrl,
  onImageChange,
  width = "w-20",
  height = "h-20",
  required = false
}: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onImageChange(file)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-[#AB43CE]">*</span>}
      </label>
      <div className="flex items-center space-x-4">
        <div className={`${width} ${height} border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center`}>
          {image ? (
            <img 
              src={URL.createObjectURL(image)} 
              alt={`${label} 미리보기`} 
              className="w-full h-full object-cover rounded-md"
            />
          ) : existingImageUrl ? (
            <img 
              src={existingImageUrl} 
              alt={`기존 ${label}`} 
              className="w-full h-full object-cover rounded-md"
              onError={(e) => {
                console.log(`이미지 로드 실패: ${existingImageUrl}`)
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
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
          onChange={handleFileChange}
          className="hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
        >
          파일 선택
        </label>
        {image && (
          <span className="text-sm text-gray-600">{image.name}</span>
        )}
      </div>
    </div>
  )
}

export default ImageUpload 