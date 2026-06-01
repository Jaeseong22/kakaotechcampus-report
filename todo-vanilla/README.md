# KTC Todo List (Vanilla JS)

HTML / CSS / Vanilla JS로 만든 Todo 웹 앱입니다.

## 실행 방법

1. 프로젝트 폴더로 이동
```bash
cd todo-vanilla
```

2. 로컬 서버 실행
```bash
python3 -m http.server 5500
```

3. 브라우저 접속
```text
http://localhost:5500
```

## 주요 기능

- Todo CRUD
  - 추가 / 수정 / 삭제 / 완료(토글)
- 상태 필터
  - 전체 / 진행 중 / 완료
- 검색
  - 제목 기준 실시간 검색
- 주간 뷰
  - 월요일~일요일 표시
  - 이전 주 / 다음 주 이동
  - 날짜 클릭 시 해당 날짜 Todo만 표시
  - 날짜별 Todo 개수 표시
  - 오늘 날짜 강조 스타일
- 시간 구간 입력
  - 시작 시간 / 종료 시간 선택
  - 카드에 `시작 - 종료` 형태로 표시
- 로컬스토리지 저장
  - 추가/수정/삭제/완료 시 자동 저장
  - 새로고침 시 복원
  - `JSON.stringify` / `JSON.parse` 사용

## 로컬스토리지 키

- `todoVanillaDailyItems`

브라우저 개발자도구에서 확인:
- `Application` → `Storage` → `Local storage` → `http://localhost:5500`

## 파일 구조

- `index.html`: 화면 구조(사이드바, 주간 뷰, 모달)
- `style.css`: 전체 스타일/레이아웃
- `app.js`: 상태 관리 및 이벤트 로직
