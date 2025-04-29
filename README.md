# Job Counseling Chatbot

Next.js와 React를 기반으로 구축된 웹 기반 취업 상담 챗봇 애플리케이션입니다. 사용자는 미리 정의된 질문 옵션을 선택하여 취업, 학습, 진로 관련 정보를 얻을 수 있습니다.

## 주요 기능

-   **선택 기반 Q&A:** 사용자가 제시된 질문 옵션 중 하나를 선택하면, 그에 맞는 답변과 다음 단계 질문들을 제공합니다.
-   **단계별 대화 흐름:** 관련된 질문으로 자연스럽게 대화를 이어가며 필요한 정보를 탐색할 수 있습니다.
-   **간편한 네비게이션:** '뒤로 가기' 기능으로 이전 질문 단계로 돌아가거나, '처음으로' 버튼으로 대화를 초기화할 수 있습니다.
-   **직관적인 채팅 UI:** 사용자와 봇의 메시지를 명확히 구분하는 깔끔한 채팅 인터페이스를 제공합니다.

## 기술 스택

-   **프레임워크:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/)
-   **언어:** [TypeScript](https://www.typescriptlang.org/)
-   **스타일링:** [Styled Components](https://styled-components.com/)
-   **상태 관리:** React Hooks (`useState`, `useEffect`, `useRef`)
-   **배포:** [Vercel](https://vercel.com/)

## 시작하기

### 배포된 애플리케이션 사용

이 애플리케이션은 Vercel을 통해 배포되어 있으며, 아래 링크에서 바로 사용해볼 수 있습니다.

[**➡️ Job Counseling Chatbot 바로가기**](https://job-counseling-chatbot.vercel.app/)

### 로컬 개발 환경 설정 (선택 사항)

로컬 환경에서 프로젝트를 실행하거나 개발에 참여하려면 다음 단계를 따르세요.

**필수 요구사항:**

-   Node.js (권장 버전 확인 필요 - `package.json` 참고)
-   npm, yarn, pnpm 또는 bun

**설치 및 실행:**

```bash
# 1. 저장소 클론 (아직 안 했다면)
# git clone <repository-url>
# cd job-counseling-chatbot

# 2. 의존성 설치
npm install
# 또는 yarn install / pnpm install / bun install

# 3. 개발 서버 실행
npm run dev
# 또는 yarn dev / pnpm dev / bun dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:3000`으로 접속하여 확인할 수 있습니다.

## 프로젝트 구조

```
JobCounselingChatbot/
├── public/             # 정적 파일 (이미지, 폰트 등)
├── src/
│   ├── app/            # Next.js App Router 페이지
│   │   └── page.tsx    # 메인 페이지 (챗봇 UI 및 로직)
│   ├── components/     # (선택사항) 재사용 컴포넌트
│   └── data/
│       └── questions.ts # 질문 및 답변 데이터 정의
├── .gitignore          # Git 추적 제외 파일 목록
├── next.config.ts      # Next.js 설정
├── package.json        # 프로젝트 메타데이터 및 의존성
├── README.md           # 프로젝트 설명 파일
└── tsconfig.json       # TypeScript 설정
```

-   `src/app/page.tsx`: 챗봇의 UI 렌더링과 사용자 인터랙션 로직을 담당합니다.
-   `src/data/questions.ts`: 챗봇이 사용하는 질문, 답변, 그리고 다음 질문 옵션들의 구조화된 데이터를 포함합니다.

## 챗봇 로직

이 챗봇은 `src/data/questions.ts`에 정의된 트리 구조의 데이터를 기반으로 작동합니다.

1.  초기 질문 목록이 사용자에게 표시됩니다.
2.  사용자가 특정 질문(`Question`)을 선택하면:
    *   해당 질문 텍스트가 사용자의 메시지로 표시됩니다.
    *   해당 질문에 연결된 답변(`answer`)이 봇의 메시지로 표시됩니다.
    *   해당 질문의 하위 질문들(`children`)이 다음 선택 옵션으로 표시됩니다.
3.  사용자는 '뒤로 가기' 또는 '처음으로' 버튼을 통해 대화 흐름을 제어할 수 있습니다.

## UI 구현

-   `styled-components`를 사용하여 컴포넌트 기반의 스타일링을 적용했습니다.
-   메시지 버블, 옵션 버튼 등 각 UI 요소는 별도의 스타일 컴포넌트로 정의되어 가독성과 유지보수성을 높였습니다 (`src/app/page.tsx` 내부).
-   대화 내용이 길어질 경우 메시지 목록 영역에서 스크롤이 가능하도록 처리했습니다.

## 배포 정보

-   이 프로젝트는 [Vercel](https://vercel.com/)을 통해 지속적으로 배포됩니다.
-   Master (또는 Main) 브랜치에 변경 사항이 푸시되면 자동으로 빌드 및 배포가 진행됩니다.

## 미래 점진적인 내용 (Future Enhancements)

이 애플리케이션은 다음과 같은 방향으로 발전될 수 있습니다:

-   **자연어 처리(NLP) 통합:** 사용자가 직접 질문을 입력하고, 챗봇이 의미를 파악하여 답변하는 기능을 추가합니다.
-   **사용자 맞춤형 경험:** 사용자 프로필이나 이전 대화 내용을 기반으로 개인화된 질문 추천 및 답변을 제공합니다.
-   **대화 기록 저장:** 사용자와의 대화 내용을 저장하여 나중에 다시 확인하거나 이어갈 수 있도록 합니다.
-   **질문/답변 관리 시스템:** 관리자가 웹 인터페이스를 통해 쉽게 질문과 답변 데이터를 관리할 수 있는 기능을 구현합니다.
-   **외부 정보 연동:** 외부 API (예: 채용 정보 사이트)와 연동하여 실시간 정보를 제공합니다.

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참고하세요. (라이센스 파일은 필요시 추가해야 합니다)
