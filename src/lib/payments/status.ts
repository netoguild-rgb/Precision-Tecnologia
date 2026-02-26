import { OrderStatus, PaymentStatus } from "@prisma/client";

export function mapPaymentStatusToOrderStatus(paymentStatus: PaymentStatus): OrderStatus | null {
    switch (paymentStatus) {
        case PaymentStatus.PAID:
            return OrderStatus.PAID;
        case PaymentStatus.REFUNDED:
            return OrderStatus.REFUNDED;
        case PaymentStatus.FAILED:
        case PaymentStatus.EXPIRED:
            return OrderStatus.CANCELLED;
        default:
            return null;
    }
}

