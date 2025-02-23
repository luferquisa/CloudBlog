FROM python:3.10
WORKDIR /
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Expone el puerto en el que corre FastAPI
EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]