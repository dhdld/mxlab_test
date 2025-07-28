interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'tel' | 'textarea' | 'select'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  placeholder?: string
  required?: boolean
  rows?: number
  options?: { value: string; label: string }[]
  disabled?: boolean
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  options = [],
  disabled = false
}: FormFieldProps) {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
                 return (
           <textarea
             name={name}
             value={value}
             onChange={onChange}
             rows={rows}
             className="w-[540px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE]"
             placeholder={placeholder}
             disabled={disabled}
           />
         )
      case 'select':
                 return (
           <select
             name={name}
             value={value}
             onChange={onChange}
             className="w-[540px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE]"
             disabled={disabled}
           >
             {options.map((option) => (
               <option key={option.value} value={option.value}>
                 {option.label}
               </option>
             ))}
           </select>
         )
      default:
                 return (
           <input
             type={type}
             name={name}
             value={value}
             onChange={onChange}
             className="w-[540px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE]"
             placeholder={placeholder}
             required={required}
             disabled={disabled}
           />
         )
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-[#AB43CE]">*</span>}
      </label>
      {renderInput()}
    </div>
  )
}

export default FormField 