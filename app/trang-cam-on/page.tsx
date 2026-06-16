export const dynamic = "force-dynamic";

export default function ThankYouPage({
  searchParams
}: {
  searchParams: { orderid?: string };
}) {
  const orderId = searchParams.orderid ?? "";

  return (
    <main className="thanks-page">
      <section className="thanks-card">
        <span className="thanks-badge">Thanh toán thành công</span>
        <h2>Cảm ơn bạn đã đăng ký tham dự Beauty Summit 2026</h2>
        <p>
          Hệ thống đã ghi nhận đơn hàng của bạn. Ban Tổ Chức có thể tiếp tục gửi
          vé và thông tin sự kiện qua email/số điện thoại đã đăng ký.
        </p>
        <p>
          Kiểm tra hòm thư email để biết các thông tin chi tiết liên quan đến sự kiện.
        </p>
        {orderId ? (
          <div className="thanks-order">
            Mã đơn hàng: <strong>{orderId}</strong>
          </div>
        ) : null}
        <div className="thanks-actions">
          <a
            className="thanks-link"
            href="https://beautysummit.vn/cam-nang-mini-app-beauty-summit"
            target="_blank"
            rel="noreferrer"
          >
            Xem hướng dẫn check-in sự kiện
          </a>
          <a
            className="thanks-link thanks-link-secondary"
            href="https://zalo.me/s/3374320125227368636/"
            target="_blank"
            rel="noreferrer"
          >
            Truy cập mini app
          </a>
        </div>
        <p>
          Truy cập mini app để tạo QR check-in tham dự sự kiện Beauty Summit 2026.
        </p>
      </section>

      <section className="thanks-poster" aria-label="Thanh toán thành công">
        <div className="thanks-stars" aria-hidden="true" />
        <img className="thanks-mascot" src="/img/mascot.webp" alt="Beauty Summit" />
        <h1>Chúc bạn có hành trình vui vẻ tại Beauty Summit 2026</h1>
        <div className="thanks-brand-row" aria-hidden="true">
          <img src="/img/favicon-bs.webp" alt="Beauty Summit" />
          <span />
          <img src="/img/favicon-nextgency.webp" alt="Nextgency" />
        </div>
      </section>
    </main>
  );
}
