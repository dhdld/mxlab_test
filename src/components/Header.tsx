function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-[60px] flex items-center justify-between px-[20px] relative z-10">
      <div className="flex items-center">
        <img src="/header_logo.svg" alt="mxlab" className="h-8" />
      </div>
      <div>
        <button 
          className="px-4 py-2 text-[#AB43CE] text-[13px] border border-[#AB43CE] rounded-md"
        >
          로그아웃
        </button>
      </div>
    </header>
  )
}

export default Header 