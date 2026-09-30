# Model card: AI Studio 1.0

## Mục đích
Web học tập minh họa bốn ứng dụng AI theo notebook AI_Web_Apps_Streamlit_React.ipynb của giảng viên. Không dùng kết quả để ra quyết định quan trọng tự động.

## Mô hình và dữ liệu
- **Nhận diện hoa:** ResNet-18, trọng số ImageNet1K V1. Đóng băng backbone, huấn luyện lớp Linear 512 → 5 trên TF Flowers (3.670 ảnh). Chia phân tầng train/validation/test 80/10/10, seed 42. Chuẩn hóa theo ImageNet. Huấn luyện 25 epoch, AdamW lr 0.003. Chọn checkpoint bằng validation; đánh giá test riêng một lần.
- **Phát hiện:** YOLO11n pretrained trên COCO 80 lớp, không fine-tune thêm. Ngưỡng confidence người dùng chỉnh được. Ảnh mẫu bus.jpg của Ultralytics.
- **Tìm ảnh:** CLIP ViT-B/32, vector chuẩn hóa, FAISS IndexFlatIP. Kho 628 ảnh gồm COCO128 và 100 ảnh mỗi loài Flowers. Cosine similarity không phải xác suất.
- **Chatbot:** Qwen2.5-0.5B-Instruct trên CPU (1.5B trên GPU nếu dùng mặc định); embedding paraphrase-multilingual-MiniLM-L12-v2 + FAISS. Sáu tài liệu chính sách ShopLite giả lập của notebook. Không có dữ liệu khách hàng thật.

## Kết quả và giới hạn
Accuracy phân loại 0.901907, macro F1 0.901393 trên 367 ảnh test; chi tiết ma trận nhầm lẫn trong artifacts/classifier/metrics.json. Chỉ số này không đảm bảo đúng với ảnh ngoài 5 loài hoa, ảnh bị che, ảnh vẽ hoặc ảnh mờ. Cờ confidence là ngưỡng softmax, không phải bộ phát hiện OOD.

YOLO có thể bỏ sót hoặc nhầm đối tượng nhỏ. Chưa đo mAP trong phiên bản bài nộp này. CLIP phù hợp truy vấn tiếng Anh hơn tiếng Việt. Chưa đo Precision@5 tổng quát. LLM nhỏ có thể trả lời sai hoặc không tuân thủ đầy đủ yêu cầu trích nguồn. Giao diện luôn hiển thị các đoạn tài liệu truy xuất để người dùng đối chiếu. Các phép thử tích hợp xác minh hệ thống hoạt động, không chứng minh chất lượng mọi câu hỏi.

## Quyền riêng tư và vận hành
Ảnh tải lên được đọc trong bộ nhớ và không được lưu thành tệp bởi API. Lịch sử chat ở trạng thái React và mất khi tải lại trang. Các mô hình tải từ Internet lần đầu. Thời gian chạy phụ thuộc CPU/GPU, RAM và số người sử dụng đồng thời. Phiên bản này phù hợp demo nhóm nhỏ. Cần bổ sung kiểm soát truy cập và rate limit khi triển khai công khai rộng rãi.

## Nguồn và giấy phép
Notebook giảng viên là mã nguồn khởi đầu; nhóm chỉnh giao diện và bổ sung script chuẩn bị, kiểm thử, tài liệu. Các nguồn dữ liệu/model: TF Flowers (đọc LICENSE của bộ dữ liệu), COCO (giấy phép từng ảnh), Ultralytics YOLO11 (AGPL-3.0), CLIP, Qwen và model card MiniLM trên Hugging Face. Kiểm tra giấy phép trước khi dùng thương mại.

## AI hỗ trợ phát triển
GPT-6 (Codex) hỗ trợ lập trình và soạn tài liệu. Tên phiên bản mô hình ứng dụng và thư viện được ghi trong README và /api/models.
