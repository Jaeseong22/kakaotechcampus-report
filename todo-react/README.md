# KTC Todo React

기존에 Vanilla JS로 만들었던 Todo 앱을 React로 다시 만든 프로젝트입니다.
Vite로 프로젝트를 만들었고 스타일은 Tailwind CSS v4를 사용했습니다.

아직 완전한 서비스라기보다는 1차 과제에서 만든 기능들을 React 방식으로 옮겨보는 것에 집중했습니다.

## 실행 방법

```bash
npm install
npm run dev
```

실행하면 보통 아래 주소로 들어가면 됩니다.

```text
http://localhost:5173
```

## 사용한 것

- React
- Vite
- Tailwind CSS v4
- localStorage
- lucide-react 아이콘

## 구현한 기능

- Todo 추가, 조회, 수정, 삭제
- 완료 처리
- 완료된 Todo는 취소선으로 표시
- 전체 / 진행 중 / 완료 필터
- 날짜별 Todo 관리
- 이전 날짜 / 다음 날짜 이동
- 이전 주 / 다음 주 이동
- 주간 뷰에서 월요일부터 일요일까지 표시
- 날짜별 Todo 개수 표시
- 오늘 날짜 표시
- localStorage 저장
- 새로고침 후 데이터 복원

## React로 바꾸면서 신경쓴 부분

Vanilla JS에서는 DOM을 직접 찾고 수정하는 방식이 많았습니다.
React로 옮기면서는 `useState`로 상태를 관리하고, 상태가 바뀌면 화면이 다시 그려지도록 만들었습니다.

수정 기능도 예전처럼 `prompt()`를 쓰지 않고, Todo 카드 안에서 바로 입력창으로 바뀌게 만들었습니다.
이 부분은 `isEditing` 상태를 사용했습니다.

필터 기능도 DOM을 숨기는 방식이 아니라, `activeTab` 상태에 따라 보여줄 Todo만 `filter()`로 골라서 렌더링했습니다.

## 로컬스토리지

Todo 데이터는 localStorage에 JSON 형태로 저장됩니다.

```js
JSON.stringify(todos)
JSON.parse(savedValue)
```

Todo가 추가, 수정, 삭제, 완료 처리될 때마다 `todos` 상태가 바뀌고,
`useEffect`에서 자동으로 localStorage에 저장되도록 했습니다.

## 파일 구조

```text
src/
  components/
    Header.jsx
    Sidebar.jsx
    StatusTabs.jsx
    TodoCard.jsx
    TodoModal.jsx
    WeekView.jsx
  App.jsx
  index.css
```

## 아쉬운 점

기능은 대부분 옮겼지만 컴포넌트를 더 깔끔하게 나눌 수 있을 것 같습니다.
그리고 날짜 관련 로직이 `App.jsx`에 조금 많이 있어서 나중에는 따로 분리하면 좋을 것 같습니다.

디자인은 기존에 만들었던 Todo 앱 디자인을 React에서도 비슷하게 유지하려고 했습니다.
