# KTC Todo — Next.js + FastAPI

2차 과제의 로컬스토리지 기반 Todo를 서버 API 기반 풀스택 앱으로 확장한 프로젝트입니다.

## 구현 기능

- Todo 생성, 목록 조회, 수정, 삭제
- 완료/미완료 상태 변경
- 날짜별 주간 Todo 보기
- URL 쿼리 기반 전체/진행 중/완료 필터
- URL 쿼리 기반 서버 검색
- Next.js `loading.tsx`, `error.tsx`, 동적 라우트
- Next.js Route Handler를 통한 FastAPI 프록시
- FastAPI + SQLAlchemy + SQLite 영구 저장
- 환경변수 기반 API 및 DB 주소 관리

## 데이터 흐름

```text
목록 조회: Server Component → actions.ts → FastAPI → SQLite
데이터 변경: Client Component → /api/todos Route Handler → FastAPI → SQLite
```

## 실행 방법

먼저 예제 파일을 복사해 환경변수를 준비합니다.

```bash
cp backend/.env.example backend/.env.local
cp frontend/.env.example frontend/.env.local
```

터미널 1 — 백엔드:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

터미널 2 — 프론트엔드:

```bash
cd frontend
npm install
npm run dev
```

- 앱: http://localhost:3000
- FastAPI 문서: http://localhost:8000/docs

## 환경변수

| 위치 | 변수 | 설명 |
| --- | --- | --- |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | 브라우저에서 사용하는 Next.js API 주소 |
| `frontend/.env.local` | `BACKEND_URL` | Next.js 서버에서 FastAPI로 요청할 주소 |
| `backend/.env.local` | `DATABASE_URL` | SQLAlchemy 데이터베이스 연결 주소 |
| `backend/.env.local` | `CORS_ORIGINS` | 허용할 프론트엔드 Origin 목록(쉼표 구분) |

## 주요 구조

```text
kakao-assignment-3/
├── frontend/
│   ├── app/
│   │   ├── api/todos/
│   │   ├── todos/[todoId]/
│   │   ├── todos/new/
│   │   └── actions.ts
│   ├── components/
│   ├── lib/
│   └── types/
└── backend/
    ├── main.py
    └── requirements.txt
```
