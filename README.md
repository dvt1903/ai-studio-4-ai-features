# AI Studio — Web tích hợp 4 chức năng AI

Dự án bài tập xây dựng website có **4 chức năng AI**, phát triển từ notebook `AI_Web_Apps_Streamlit_React.ipynb` của giảng viên. Frontend dùng **React + Vite**, backend dùng **FastAPI**.

## ✅ Nội dung bài nộp

- Mã nguồn đầy đủ trên repository này.
- README có ảnh giao diện thực tế.
- Slide ngắn gọn về cách làm: [`docs/AI_Studio_Cach_Lam.pptx`](docs/AI_Studio_Cach_Lam.pptx).

## 4 chức năng AI

| Chức năng | AI / công nghệ | Mô tả |
|---|---|---|
| 🌼 Nhận diện loài hoa | ResNet-18 + ImageNet1K V1 | Nhận diện 5 lớp: daisy, dandelion, roses, sunflowers, tulips |
| 🚗 Phát hiện đối tượng | YOLO11n | Phát hiện 80 lớp COCO, hiển thị bounding box và confidence |
| 🔎 Tìm kiếm ảnh | CLIP ViT-B/32 + FAISS | Tìm ảnh tương đồng bằng câu mô tả hoặc ảnh mẫu |
| 💬 Chatbot RAG ShopLite | Qwen2.5-0.5B + MiniLM | Trả lời dựa trên 6 tài liệu chính sách và hiển thị nguồn |

## Ảnh giao diện

### 1. Nhận diện hoa
![Nhận diện hoa](docs/screenshots/01-classify.jpg)

### 2. Phát hiện đối tượng
![Phát hiện đối tượng](docs/screenshots/02-detect.jpg)

### 3. Tìm kiếm ảnh
![Tìm kiếm ảnh](docs/screenshots/03-search.jpg)

### 4. Chatbot RAG
![Chatbot RAG](docs/screenshots/04-chat.jpg)

### Giao diện mobile
![Mobile](docs/screenshots/05-mobile.jpg)

## Kiến trúc

```text
React (web/) → FastAPI (api/) → AI models (core/)
                              ├─ ResNet-18
                              ├─ YOLO11n
                              ├─ CLIP + FAISS
                              └─ Qwen2.5 + MiniLM RAG
```

Backend nạp các mô hình một lần và phục vụ API. React gửi ảnh/câu hỏi tới FastAPI; API trả JSON cho tác vụ ảnh và stream kết quả chatbot bằng Server-Sent Events.

## Cấu trúc chính

```text
api/                 FastAPI backend
core/                4 module AI
web/                 React + Vite frontend
scripts/             chuẩn bị dữ liệu/model, benchmark, smoke test
tests/               API tests
data/kb/             tài liệu RAG ShopLite
artifacts/classifier metrics và danh sách lớp
docs/                ảnh giao diện, benchmark và slide
```

## Chạy dự án trên Windows

Yêu cầu: **Python 3.12** và **Node.js 22+**.

```bat
start.bat
```

Script sẽ tạo môi trường Python, cài thư viện, chuẩn bị dữ liệu/model, build React và chạy tại:

```text
http://localhost:8000
```

Lần chạy đầu cần Internet để tải dataset và pretrained models. Không cần API key.

## Chạy thủ công

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python scripts/prepare.py
cd web
npm install
npm run build
cd ..
python -m uvicorn api.main:app --host 127.0.0.1 --port 8000
```

## Kết quả kiểm thử

ResNet-18 đạt khoảng **90,19% accuracy** và **90,14% macro F1** trên 367 ảnh test Flowers. Repo có test API, smoke test và benchmark trong `tests/`, `scripts/` và `docs/`.

## API chính

- `GET /api/health`
- `GET /api/models`
- `POST /api/classify`
- `POST /api/detect`
- `POST /api/search/text`
- `POST /api/search/image`
- `POST /api/chat`
- `POST /api/chat/sync`

Swagger khi chạy: `http://localhost:8000/docs`.

## AI / phiên bản sử dụng

- ResNet-18 / ImageNet1K V1
- YOLO11n / Ultralytics 8.3.203
- OpenAI CLIP ViT-B/32 + FAISS 1.12.0
- Qwen2.5-0.5B-Instruct
- `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`
- Python 3.12, PyTorch 2.8.0, torchvision 0.23.0, transformers 4.57.1
- React + Vite + FastAPI

**AI hỗ trợ hoàn thiện và đóng gói bài nộp:** ChatGPT — **GPT-5.6 Sol**.

## Slide cách làm

📎 [`AI_Studio_Cach_Lam.pptx`](docs/AI_Studio_Cach_Lam.pptx)

Slide trình bày ngắn gọn kiến trúc React → FastAPI → AI models, 4 chức năng và cách chạy dự án.

## Link nộp bài

**Repository:** https://github.com/dvt1903/ai-studio-4-ai-features

> Không commit `.venv`, `node_modules`, cache, dataset tải về hoặc trọng số model lớn. Các tài nguyên cần thiết được chuẩn bị bởi `scripts/prepare.py`.
