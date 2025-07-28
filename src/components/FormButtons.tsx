interface FormButtonsProps {
  editMode: boolean
  isFormValid: boolean
  isSubmitting: boolean
  onDelete?: () => void
  onSubmit: () => void
}

function FormButtons({
  editMode,
  isFormValid,
  isSubmitting,
  onDelete,
  onSubmit
}: FormButtonsProps) {
  return (
    <div className="flex justify-center gap-4 pt-6">
      {editMode && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isSubmitting}
          className="px-20 py-3 rounded-lg bg-gray-200 text-gray-700"
        >
          {isSubmitting ? '처리 중...' : '삭제'}
        </button>
      )}
      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="px-20 py-3 rounded-lg bg-[#AB43CE] text-white"
        onClick={onSubmit}
      >
        {isSubmitting ? '처리 중...' : `${editMode ? '저장' : '등록'}`}
      </button>
    </div>
  )
}

export default FormButtons 