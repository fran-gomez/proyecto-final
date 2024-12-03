FROM python:3.12-alpine

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY main.py .
CMD ["python", "main.py"]