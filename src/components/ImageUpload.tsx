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
      <div className="flex items-center justify-center space-x-4">
        <label 
          htmlFor={id}
          className={`${width} ${height} border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors`}
        >
          {image ? (
            <img 
              src={URL.createObjectURL(image)} 
              alt={`${label} 미리보기`} 
              className="w-48 h-48 object-cover rounded-lg"
            />
          ) : existingImageUrl ? (
            <img 
              src={existingImageUrl} 
              alt={`기존 ${label}`} 
              className="w-48 h-48 object-cover rounded-lg"
              onError={(e) => {
                console.log(`이미지 로드 실패: ${existingImageUrl}`)
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <svg className="w-48 h-48 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={id}
        />
        {image && (
          <span className="text-sm text-gray-600">{image.name}</span>
        )}
      </div>
    </div>
  )
}

export default ImageUpload 