"use client";

import { useState } from "react";

import type { CreatedOrder, TicketUpgradeInfo, TicketUpgradeTier } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const tierImages: Partial<Record<TicketUpgradeTier, string>> = {
  RUBY: "/img/rube.webp",
  VIP: "/img/vip.webp"
};

export function TicketUpgradePage() {
  const [orderCode, setOrderCode] = useState("");
  const [ticketInfo, setTicketInfo] = useState<TicketUpgradeInfo | null>(null);
  const [targetTier, setTargetTier] = useState<TicketUpgradeTier | "">("");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"ok" | "err" | "">("");

  async function lookupTicket() {
    const code = orderCode.trim();
    if (!code) {
      setTicketInfo(null);
      setTargetTier("");
      setMessage("Vui lòng nhập mã vé.");
      setMessageType("err");
      return;
    }

    setLoadingLookup(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/ticket-upgrade/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ orderCode: code })
      });
      const payload = (await response.json()) as {
        success: boolean;
        data?: TicketUpgradeInfo;
        error?: string;
      };

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "Không tìm thấy mã vé.");
      }

      setTicketInfo(payload.data);
      setTargetTier(payload.data.options[0]?.tier ?? "");
      setMessage(
        payload.data.options.length > 0
          ? "Đã tìm thấy vé. Vui lòng chọn hạng cần nâng."
          : "Vé này đang ở hạng VIP, không cần nâng hạng."
      );
      setMessageType("ok");
    } catch (error) {
      setTicketInfo(null);
      setTargetTier("");
      setMessage(error instanceof Error ? error.message : "Không tìm thấy mã vé.");
      setMessageType("err");
    } finally {
      setLoadingLookup(false);
    }
  }

  async function createUpgradeOrder() {
    if (!ticketInfo || !targetTier) return;

    setLoadingSubmit(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/ticket-upgrade/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderCode: ticketInfo.orderCode,
          targetTier
        })
      });
      const payload = (await response.json()) as {
        success: boolean;
        data?: CreatedOrder;
        error?: string;
      };

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "Không thể tạo yêu cầu nâng hạng.");
      }

      window.location.href = payload.data.redirect;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể tạo yêu cầu nâng hạng."
      );
      setMessageType("err");
      setLoadingSubmit(false);
    }
  }

  const selectedOption = ticketInfo?.options.find(
    (option) => option.tier === targetTier
  );

  return (
    <main className="page-shell upgrade-page">
      <div className="bsp">
        <header className="bsp-hero">
          <h1 className="bsp-hero-title">
            <span>NÂNG HẠNG VÉ</span>
            <span>BEAUTY SUMMIT 2026</span>
          </h1>
          <div className="bsp-hero-line" />
        </header>

        <div className="bsp-g upgrade-layout">
          <section className="bsp-c upgrade-card">
            <div className="bsp-ct">Tra cứu mã vé</div>

            <div className="bsp-f">
              <label className="bsp-lb">Mã vé</label>
              <div className="bsp-vw">
                <input
                  className="bsp-vi"
                  placeholder="Nhập mã vé"
                  type="text"
                  value={orderCode}
                  onChange={(event) => {
                    setOrderCode(event.target.value.toUpperCase());
                    setTicketInfo(null);
                    setTargetTier("");
                  }}
                />
                <button
                  className="bsp-vb"
                  disabled={loadingLookup}
                  type="button"
                  onClick={() => void lookupTicket()}
                >
                  {loadingLookup ? "Đang tìm..." : "Tra cứu"}
                </button>
              </div>
              <div className={`bsp-vm ${messageType}`}>{message}</div>
            </div>
          </section>

          <section className="bsp-c upgrade-card">
            <div className="bsp-ct">Thông tin nâng hạng</div>

            {!ticketInfo ? (
              <div className="bsp-de upgrade-empty">
                <p>Nhập mã vé để xem thông tin và các hạng có thể nâng.</p>
              </div>
            ) : (
              <>
                <div className="bsp-sm upgrade-summary">
                  <div className="bsp-sr">
                    <span>Mã vé</span>
                    <strong>{ticketInfo.orderCode}</strong>
                  </div>
                  <div className="bsp-sr">
                    <span>Khách hàng</span>
                    <strong>{ticketInfo.customerName}</strong>
                  </div>
                  <div className="bsp-sr">
                    <span>Hạng hiện tại</span>
                    <strong>{ticketInfo.currentTier}</strong>
                  </div>
                </div>

                {ticketInfo.options.length > 0 ? (
                  <>
                    <div className="bsp-tl upgrade-ticket-list">
                      {ticketInfo.options.map((option) => (
                        <button
                          className={`bsp-tk upgrade-ticket upgrade-ticket-${option.tier.toLowerCase()} ${
                            targetTier === option.tier ? "on" : ""
                          }`}
                          key={option.tier}
                          type="button"
                          onClick={() => setTargetTier(option.tier)}
                        >
                          <div className="bsp-tk-main upgrade-ticket-copy">
                            <span className="upgrade-ticket-kicker">Nâng hạng</span>
                            <div className="bsp-tk-nm">
                              {ticketInfo.currentTier} lên {option.tier}
                            </div>
                            <div className="bsp-tk-pr">{formatCurrency(option.amount)}</div>
                          </div>
                          <div className="upgrade-ticket-preview" aria-hidden="true">
                            {tierImages[option.tier] ? (
                              <img
                                className="upgrade-ticket-image"
                                src={tierImages[option.tier]}
                                alt=""
                              />
                            ) : (
                              <div className="upgrade-ticket-image upgrade-ticket-fallback">
                                <span>Beauty Summit</span>
                                <strong>{option.tier}</strong>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="upgrade-total">
                      <div>
                        <span>Tổng thanh toán</span>
                        <strong>{formatCurrency(selectedOption?.amount ?? 0)}</strong>
                      </div>
                      <small>
                        Thanh toán phần chênh lệch để nâng vé lên hạng{" "}
                        {targetTier || "..."}.
                      </small>
                    </div>

                    <button
                      className="bsp-pay upgrade-pay"
                      disabled={loadingSubmit || !targetTier}
                      type="button"
                      onClick={() => void createUpgradeOrder()}
                    >
                      {loadingSubmit ? "Đang xử lý..." : "Thanh toán nâng hạng"}
                    </button>
                  </>
                ) : (
                  <div className="bsp-de upgrade-empty">
                    <p>Vé VIP không thể nâng hạng thêm.</p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
