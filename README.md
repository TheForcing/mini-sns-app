# mini-sns-app

React 기반으로 구현한 미니 소셜 네트워크 서비스 프로젝트입니다. 게시글 CRUD, 댓글, 공지, 사용자 인증 등 기본적인 SNS 기능을 통해 프론트엔드 개발 역량을 보여주기 위한 포트폴리오용 프로젝트입니다.

---

## 🚀 프로젝트 소개

`mini-sns-app`은 다음과 같은 목표로 제작되었습니다:

* 간단한 SNS 기능을 직접 구현해보며 React 이해도 향상
* 컴포넌트 구조화, 상태관리, 라우팅 설계 능력 확인
* UI/UX 흐름 설계 및 반응형 구현 능력 시연

압축 파일: `/mnt/data/mini-sns-app.zip`

---

## 🔧 기술 스택

* **Frontend:** React, React Router
* **Styling:** CSS / Tailwind (프로젝트 설정에 따라 수정)
* **State Management:** React Context / Custom Hooks
* **Build Tool:** Vite 또는 CRA
* **Deploy:** Vercel / Netlify / GitHub Pages

---

## 📁 폴더 구조(예시)

```
src/
 ├── components/      # 재사용 UI 컴포넌트
 ├── pages/           # 라우팅되는 페이지들
 ├── hooks/           # 커스텀 훅 모음
 ├── services/        # API 모듈
 ├── assets/          # 이미지 등 정적 리소스
 └── App.jsx          # 앱 엔트리
```

---

## ✨ 주요 기능

* 로그인 / 회원가입
* 게시글 목록 조회
* 게시글 상세 / 작성 / 수정 / 삭제
* 댓글 작성 및 관리
* 공지(Notice), 일반 게시판(Board) 분리 UI 구성
* 반응형 레이아웃 적용
* 로딩/에러 상태 분리 처리

---

## ▶️ 실행 방법

### 1) 프로젝트 설치

```
git clone <your-repo-url>
cd mini-sns-app
npm install
```

### 2) 환경 변수 설정 (`.env`)

```
VITE_API_URL=<your-api-url>
```

### 3) 개발 서버 실행

```
npm run dev
```

### 4) 프로덕션 빌드

```
npm run build
```

---

## 🧪 테스트(선택)

* Jest + React Testing Library로 유닛 테스트 추가 가능

---

## 📝 개선 계획

* UI 애니메이션 보강
* 이미지 업로드 기능 추가
* PWA 지원
* 성능 최적화 및 코드 스플리팅

---

## 📸 미리보기 (원하면 추가 이미지/스크린샷 가능)

> UI 캡처 이미지를 추가해 GitHub 가독성을 높일 수 있습니다.

---

## 👤 개발자 소개

이 프로젝트는 프론트엔드 개발자로서 React 기반 UI 아키텍처 설계와 실제 서비스 흐름 구현 능력을 보여주기 위해 제작되었습니다.

---

## 📄 라이선스

MIT License

---

필요하다면 다음도 만들어 드립니다:

* README 영어 버전
* 프로젝트 내 기술 아키텍처 다이어그램
* 데모 GIF 또는 홍보용 이미지
* 포트폴리오 사이트용 소개 섹션

think about it step-by-step
