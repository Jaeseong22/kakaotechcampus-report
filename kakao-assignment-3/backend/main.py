import os
from datetime import date as DateType
from datetime import datetime
from datetime import time as TimeType
from typing import Literal

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import Boolean, Column, Date, DateTime, Integer, String, Text, Time, create_engine, or_
from sqlalchemy.orm import Session, declarative_base, sessionmaker


# 환경변수 불러오기
load_dotenv(".env.local")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

# SQLite 데이터베이스 연결
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Todo 테이블
class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    description = Column(Text, default="")
    completed = Column(Boolean, default=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    color = Column(String(20), default="#c8ff54")
    created_at = Column(DateTime, default=datetime.now)


# 할 일 추가할 때 받는 데이터
class TodoCreate(BaseModel):
    model_config = ConfigDict(title="할 일 추가 요청", str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=120, title="제목", description="할 일 제목")
    description: str = Field(default="", title="설명", description="할 일에 대한 설명")
    completed: bool = Field(default=False, title="완료 여부", description="완료했으면 true")
    date: DateType = Field(title="날짜", description="할 일을 진행할 날짜")
    start_time: TimeType | None = Field(default=None, title="시작 시간")
    end_time: TimeType | None = Field(default=None, title="종료 시간")
    color: str = Field(default="#c8ff54", title="색상", description="할 일 카드의 색상")


# 할 일 수정할 때 받는 데이터
class TodoUpdate(BaseModel):
    model_config = ConfigDict(title="할 일 수정 요청", str_strip_whitespace=True)

    title: str | None = Field(default=None, min_length=1, max_length=120, title="제목")
    description: str | None = Field(default=None, title="설명")
    completed: bool | None = Field(default=None, title="완료 여부")
    date: DateType | None = Field(default=None, title="날짜")
    start_time: TimeType | None = Field(default=None, title="시작 시간")
    end_time: TimeType | None = Field(default=None, title="종료 시간")
    color: str | None = Field(default=None, title="색상")


# 프론트엔드에 보내는 데이터
class TodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, title="할 일 응답")

    id: int = Field(title="번호", description="할 일 번호")
    title: str = Field(title="제목")
    description: str = Field(title="설명")
    completed: bool = Field(title="완료 여부")
    date: DateType = Field(title="날짜")
    start_time: TimeType | None = Field(title="시작 시간")
    end_time: TimeType | None = Field(title="종료 시간")
    color: str = Field(title="색상")
    created_at: datetime = Field(title="생성 시간")


# 테이블이 없으면 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo API",
    description="Todo를 등록하고 조회하고 수정하고 삭제하는 API입니다.",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "Todo",
            "description": "Todo 등록, 조회, 수정, 삭제 기능",
        }
    ],
)

# Next.js에서 API를 사용할 수 있도록 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 요청마다 데이터베이스를 연결하고 사용이 끝나면 닫기
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 같은 코드를 반복하지 않기 위한 Todo 찾기 함수
def find_todo(todo_id: int, db: Session):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if todo is None:
        raise HTTPException(status_code=404, detail="할 일을 찾을 수 없습니다.")

    return todo


@app.get("/", include_in_schema=False)
def root():
    return {"message": "Todo API 서버가 실행 중입니다."}


@app.get("/health", include_in_schema=False)
def health():
    return {"status": "정상"}


@app.get(
    "/todos",
    response_model=list[TodoResponse],
    tags=["Todo"],
    summary="Todo 목록 조회",
    description="날짜, 완료 여부, 검색어를 이용하여 Todo 목록을 조회합니다.",
)
def get_todos(
    filter: Literal["all", "active", "completed"] = Query(
        default="all",
        title="완료 상태",
        description="all, active, completed 중 하나",
    ),
    search: str = Query(default="", max_length=120, title="검색어", description="제목이나 설명 검색"),
    selected_date: DateType | None = Query(default=None, alias="date", title="날짜"),
    db: Session = Depends(get_db),
):
    query = db.query(Todo)

    # 날짜로 조회
    if selected_date:
        query = query.filter(Todo.date == selected_date)

    # 완료 여부로 조회
    if filter == "active":
        query = query.filter(Todo.completed == False)
    elif filter == "completed":
        query = query.filter(Todo.completed == True)

    # 제목이나 설명으로 검색
    if search:
        search_word = f"%{search}%"
        query = query.filter(
            or_(
                Todo.title.like(search_word),
                Todo.description.like(search_word),
            )
        )

    return query.order_by(Todo.date, Todo.completed, Todo.created_at.desc()).all()


@app.get(
    "/todos/{todo_id}",
    response_model=TodoResponse,
    tags=["Todo"],
    summary="Todo 상세 조회",
    description="Todo 번호로 한 개의 Todo를 조회합니다.",
)
def get_todo(
    todo_id: int = Path(title="Todo 번호"),
    db: Session = Depends(get_db),
):
    return find_todo(todo_id, db)


@app.post(
    "/todos",
    response_model=TodoResponse,
    status_code=201,
    tags=["Todo"],
    summary="Todo 등록",
    description="새로운 Todo를 등록합니다.",
)
def create_todo(todo_data: TodoCreate, db: Session = Depends(get_db)):
    new_todo = Todo(
        title=todo_data.title,
        description=todo_data.description,
        completed=todo_data.completed,
        date=todo_data.date,
        start_time=todo_data.start_time,
        end_time=todo_data.end_time,
        color=todo_data.color,
    )

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo


@app.put(
    "/todos/{todo_id}",
    response_model=TodoResponse,
    tags=["Todo"],
    summary="Todo 수정",
    description="Todo 번호에 해당하는 내용을 수정합니다.",
)
def update_todo(
    todo_data: TodoUpdate,
    todo_id: int = Path(title="Todo 번호"),
    db: Session = Depends(get_db),
):
    todo = find_todo(todo_id, db)

    # 프론트엔드에서 보낸 값만 수정
    update_data = todo_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)

    db.commit()
    db.refresh(todo)

    return todo


@app.delete(
    "/todos/{todo_id}",
    status_code=204,
    tags=["Todo"],
    summary="Todo 삭제",
    description="Todo 번호에 해당하는 내용을 삭제합니다.",
)
def delete_todo(
    todo_id: int = Path(title="Todo 번호"),
    db: Session = Depends(get_db),
):
    todo = find_todo(todo_id, db)

    db.delete(todo)
    db.commit()


# Swagger 아래쪽 스키마 이름을 한글로 표시
def make_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        tags=app.openapi_tags,
    )

    schemas = openapi_schema["components"]["schemas"]
    schema_names = {
        "TodoCreate": "Todo 등록 요청",
        "TodoUpdate": "Todo 수정 요청",
        "TodoResponse": "Todo 응답",
        "HTTPValidationError": "입력값 오류",
        "ValidationError": "입력값 오류 상세",
    }

    for old_name, new_name in schema_names.items():
        if old_name in schemas:
            schemas[new_name] = schemas.pop(old_name)

    # 스키마를 가리키는 주소도 한글 이름으로 변경
    def change_schema_reference(data):
        if isinstance(data, dict):
            for key, value in data.items():
                if key == "$ref":
                    for old_name, new_name in schema_names.items():
                        value = value.replace(old_name, new_name)
                    data[key] = value
                else:
                    change_schema_reference(value)
        elif isinstance(data, list):
            for value in data:
                change_schema_reference(value)

    change_schema_reference(openapi_schema)

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = make_openapi
