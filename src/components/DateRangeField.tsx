interface DateRangeFieldProps {
  startDate: string
  endDate: string
  isPermanent: boolean
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPermanentChange: (checked: boolean) => void
}

function DateRangeField({
  startDate,
  endDate,
  isPermanent,
  onStartDateChange,
  onEndDateChange,
  onPermanentChange
}: DateRangeFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 justify-between">
        <label className="block text-sm font-medium text-gray-700">
          게시기간 <span className="text-[#AB43CE]">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="permanent"
            checked={isPermanent}
            onChange={(e) => onPermanentChange(e.target.checked)}
            className="w-4 h-4 text-[#AB43CE] border-gray-300 rounded focus:ring-[#AB43CE]"
          />
          <label htmlFor="permanent" className="text-sm text-gray-700">상시게시</label>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={onStartDateChange}
          disabled={isPermanent}
          className={`w-[265px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE] ${
            isPermanent ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        />
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={onEndDateChange}
          disabled={isPermanent}
          className={`w-[265px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB43CE] ${
            isPermanent ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        />
      </div>
    </div>
  )
}

export default DateRangeField 