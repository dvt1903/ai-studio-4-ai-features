FROM node:22-slim AS web
WORKDIR /web
COPY web/package*.json ./
RUN npm install --no-audit --no-fund
COPY web/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir torch==2.8.0 torchvision==0.23.0 --index-url https://download.pytorch.org/whl/cpu \
 && pip install --no-cache-dir -r requirements.txt
COPY config.py ./
COPY core/ core/
COPY api/ api/
COPY scripts/ scripts/
COPY data/kb/ data/kb/
COPY artifacts/ artifacts/
ENV APP_ROOT=/app HF_HOME=/app/.cache LLM_MODEL=Qwen/Qwen2.5-0.5B-Instruct TORCH_NUM_THREADS=2
RUN python scripts/prepare.py && rm -rf data/flowers data/coco128 data/*.tgz data/*.zip
COPY --from=web /web/dist web/dist
RUN useradd -m app && chown -R app /app
USER app
EXPOSE 7860
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "7860"]
