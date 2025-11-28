from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.todo import router as todos_router

app = FastAPI(
    title="Todo API",
    version="1.0.0",
    description="API REST para gestión de tareas con FastAPI y MySQL"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos_router)

@app.get("/")
def read_root():
    return {
        "message": "Todo API con FastAPI",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}