## 🛠️ 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd mxlab
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:5173`로 접속하세요.

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Header.tsx      # 헤더 컴포넌트
│   ├── Sidebar.tsx     # 사이드바 컴포넌트
│   ├── ContentManagement.tsx  # 메인 컨텐츠 관리
│   ├── ContentTable.tsx       # 컨텐츠 테이블
│   ├── ContentForm.tsx        # 컨텐츠 등록/수정 폼
│   ├── ImageUpload.tsx        # 이미지 업로드 컴포넌트
│   ├── FormField.tsx          # 폼 필드 컴포넌트
│   ├── DateRangeField.tsx     # 날짜 범위 필드
│   └── FormButtons.tsx        # 폼 버튼 컴포넌트
├── services/           # API 서비스
│   └── api.ts         # API 함수 및 타입 정의
├── App.tsx            # 메인 앱 컴포넌트
├── main.tsx
└── index.css         # Tailwind CSS 설정
```
