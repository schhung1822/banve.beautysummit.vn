import { mockTickets, mockVouchers } from "@/lib/constants";
import type { OrderRecord, Ticket, TicketUpgradeTier } from "@/lib/types";

type MutableVoucher = {
  voucher: string;
  classy: "money" | "rate";
  class: string;
  rate: number | null;
  money: number | null;
  number: number;
  fromDate: string;
  toDate: string;
};

const tickets: Ticket[] = [...mockTickets];
const vouchers = new Map<string, MutableVoucher>(
  mockVouchers.map((voucher) => [
    voucher.voucher.toUpperCase(),
    {
      ...voucher,
      number: voucher.number ?? 0
    }
  ])
);
const orders = new Map<string, OrderRecord[]>();
const upgradeRequests = new Map<
  string,
  {
    requestId: string;
    orderCode: string;
    fromClass: TicketUpgradeTier;
    toClass: TicketUpgradeTier;
    amount: number;
    originalMoney: number;
    status: string;
    createTime: string;
    updateTime: string | null;
  }
>();

export function getMockTickets() {
  return tickets;
}

export function getMockVoucher(code: string) {
  return vouchers.get(code.trim().toUpperCase()) ?? null;
}

export function decreaseMockVoucher(code: string) {
  const voucher = vouchers.get(code.trim().toUpperCase());
  if (!voucher || voucher.number <= 0) return;
  voucher.number -= 1;
}

export function hasMockOrderCode(orderCode: string) {
  for (const records of orders.values()) {
    if (records.some((record) => record.orderCode === orderCode)) {
      return true;
    }
  }
  return false;
}

export function hasMockOrderId(orderId: string) {
  return orders.has(orderId);
}

export function saveMockOrder(orderId: string, records: OrderRecord[]) {
  orders.set(orderId, records);
}

export function getMockOrder(orderId: string) {
  return orders.get(orderId) ?? null;
}

export function getMockOrderByOrderCode(orderCode: string) {
  const code = orderCode.trim();
  for (const records of orders.values()) {
    const record = records.find((item) => item.orderCode === code);
    if (record) return record;
  }
  return null;
}

export function saveMockUpgradeRequest(request: {
  requestId: string;
  orderCode: string;
  fromClass: TicketUpgradeTier;
  toClass: TicketUpgradeTier;
  amount: number;
  originalMoney: number;
  status: string;
  createTime: string;
  updateTime: string | null;
}) {
  upgradeRequests.set(request.requestId, request);
}

export function getMockUpgradeRequest(requestId: string) {
  return upgradeRequests.get(requestId.trim()) ?? null;
}

export function completeMockUpgradeRequest(requestId: string, updateTime: string) {
  const request = getMockUpgradeRequest(requestId);
  if (!request) return false;

  let updatedTicket = false;
  for (const [orderId, records] of orders.entries()) {
    const nextRecords = records.map((record) =>
      record.orderCode === request.orderCode
        ? {
            ...record,
            className: request.toClass,
            money: request.originalMoney + request.amount,
            status: "paydone"
          }
        : record
    );

    if (nextRecords.some((record) => record.orderCode === request.orderCode)) {
      orders.set(orderId, nextRecords);
      updatedTicket = true;
    }
  }

  if (!updatedTicket) return false;

  upgradeRequests.set(requestId, {
    ...request,
    status: "paydone",
    updateTime
  });
  return true;
}

export function markMockOrderPaid(orderId: string) {
  if (completeMockUpgradeRequest(orderId, new Date().toISOString())) {
    return true;
  }

  const records = orders.get(orderId);
  if (!records) return false;
  orders.set(
    orderId,
    records.map((record) => ({
      ...record,
      status: "paydone"
    }))
  );
  return true;
}
