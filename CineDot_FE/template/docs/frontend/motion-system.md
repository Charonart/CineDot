# Hệ Thống Chuyển Động CINE (CINE Motion System)

Chuyển động trong dự án **CINE** không đơn thuần chỉ là trang trí, mà là một ngôn ngữ chỉ dẫn hành vi của người dùng, mang lại nhịp điệu điện ảnh cao cấp và cảm giác phản hồi tức thì.

---

## 1. Hàm Biến Đổi Tốc Độ (Easing & Timing Curves)

Chúng tôi tuyệt đối không sử dụng hàm easing tuyến tính (`linear`) hoặc các hàm mặc định thô sơ (`ease-in`, `ease-out`). Thay vào đó, toàn bộ chuyển động đều sử dụng **Apple-inspired Cubic Bezier Curves**:

* **Premium Slide / Fade**:
  `cubic-bezier(0.22, 1, 0.36, 1)`
  *Độ dài*: `0.8s` đến `1.2s`. Hiệu ứng này tạo cảm giác khởi đầu rất nhanh và lướt dừng lại từ từ cực kỳ mượt mà.
* **Hand-drawn Underline SVGs**:
  `cubic-bezier(0.65, 0, 0.35, 1)`
  *Độ dài*: `0.8s`. Hàm uốn lượn có tính đàn hồi tự nhiên như nét bút vẽ thực tế của họa sĩ.

---

## 2. Hiệu Ứng Trượt Trái (slideLeft Effect)

Hiệu ứng chủ đạo được áp dụng cho toàn bộ các tiêu đề chính (`.scroll-text-slide-left`) khi người dùng cuộn trang:

* **Trạng thái ẩn (Initial State)**:
  * `opacity: 0;`
  * `transform: translateX(100px) skewX(4deg);`
  * Dịch chuyển lệch bên phải `100px` kết hợp góc xiên nhẹ tạo quán tính chuyển động trước khi trượt.
* **Trạng thái hiện (Active State)**:
  * `opacity: 1;`
  * `transform: translateX(0) skewX(0);`
  * `transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);`

---

## 3. Tiêu Chuẩn An Toàn Cho Người Dùng (Reduced Motion Safety)

Theo hướng dẫn tiếp cận web quốc tế (W3C Web Accessibility Guidelines), một số người dùng có hội chứng rối loạn tiền đình hoặc nhạy cảm với chuyển động mạnh trên màn hình.

Hệ thống CINE tích hợp sẵn cơ chế **Reduced Motion Safety** tự động vô hiệu hóa toàn bộ chuyển động nghiêng, trượt mạnh và chuyển đổi sang hiệu ứng mờ dần nhẹ nhàng:

```css
@media (prefers-reduced-motion: reduce) {
  .scroll-text-slide-left {
    transform: none !important;
    transition: opacity 0.8s ease !important;
  }
  
  .cine-video-player *, 
  .theme-selector-slider, 
  .highlight-path {
    transition-duration: 0.1s !important;
    animation-duration: 0.1s !important;
  }
}
```

*Cơ chế này giúp trang web CINE không chỉ đẹp mắt vượt trội mà còn đạt chuẩn tiếp cận nhân văn và chuyên nghiệp nhất.*
