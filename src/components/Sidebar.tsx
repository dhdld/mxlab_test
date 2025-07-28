function Sidebar() {

  return (
    <aside className="w-[280px] border-r border-gray-200 min-h-[calc(100vh-60px)] gap-4">
      {/* 사이드바 로고 섹션 */}
      <div className="flex flex-col rounded-xl border border-[rgba(219,220,223,0.52)] bg-gradient-to-b from-gray-100 to-white m-4 p-4">
        <div className="flex items-center gap-1">
          <img src="/logo.svg" alt="MXLAB" className="w-[28px] h-[28px]" />
          <div className="font-bold">MXLAB</div>
        </div>
        <div className="flex gap-1 pl-[32px]">
          <div className="text-[10px] text-gray-700">홍길동</div>
          <div className="text-[10px] text-gray-400">시스템 관리자</div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-200"></div>

      {/* 메뉴 버튼 */}
      <div className="ml-4 my-1 flex align-center">
        <button className="w-[35px] h-[21px] text-[10px] bg-gray-100 rounded-md font-medium">
          Menu
        </button>
      </div>

      <div className="w-full h-[1px] bg-gray-200"></div>

      {/* 설정 메뉴 */}
      <div className="mb-2 m-4">
        <button 
          className="w-full flex items-center gap-1 py-2 px-3 text-xs hover:bg-gray-100 rounded-md"
        >
          <svg 
            className={`w-4 h-4 transition-transform rotate-90`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>          
          <span>설정</span>
        </button>
        
        {/* 하위 메뉴 */}
        <div className="ml-4 mt-1">
            <button className="w-full text-left py-2 px-3 text-xs text-gray-700 bg-gray-100 rounded-md">
              컨텐츠 관리
            </button>
          </div>
      </div>
    </aside>
  )
}

export default Sidebar 