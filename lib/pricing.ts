import type { CartTicketInput, ValidatedVoucher } from "@/lib/types";
import { upperVi } from "@/lib/utils";

export function calculateCartSummary(
  tickets: CartTicketInput[],
  voucher: ValidatedVoucher | null
) {
  const subtotal = tickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  let discount = 0;

  if (voucher && subtotal > 0) {
    if (voucher.classy === "money") {
      if (voucher.class) {
        tickets.forEach((ticket) => {
          if (upperVi(ticket.name).includes(upperVi(voucher.class))) {
            discount += Math.min(ticket.price, voucher.money ?? 0) * ticket.quantity;
          }
        });
      } else {
        discount = voucher.money ?? 0;
      }
    }

    if (voucher.classy === "rate") {
      const rate = voucher.rate ?? 0;

      if (rate >= 100) {
        const targetClass = upperVi(voucher.class);
        const freeTicket = tickets.find((ticket) => {
          if (!targetClass) return ticket.quantity > 0;
          return ticket.quantity > 0 && upperVi(ticket.name).includes(targetClass);
        });

        if (freeTicket) {
          discount = freeTicket.price;
        }
      } else if (voucher.class) {
        tickets.forEach((ticket) => {
          if (upperVi(ticket.name).includes(upperVi(voucher.class))) {
            discount += Math.round((ticket.price * ticket.quantity * rate) / 100);
          }
        });
      } else {
        discount = Math.round((subtotal * rate) / 100);
      }
    }
  }

  discount = Math.min(discount, subtotal);

  return {
    subtotal,
    discount,
    total: subtotal - discount
  };
}
