"use client";

import Image from "next/image";
import React, { useState } from "react";
import { formatCurrency } from "../../../../../lib/utils";
import Button from "@/components/ui/Button";
import { SuccessIcon } from "../../../../../public/svg/AnimatedSvgs/fun-svg";
import Modal from "@/components/ui/Modal";
import { useCart } from "@/lib/cart";
import { useCustomerSession } from "@/lib/customerAuth";
import { createOrder, PromoValidation } from "@/lib/orders";
import { DeliveryQuote, DeliverySelection } from "@/lib/delivery";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderSummaryProps {
  paymentMethod: "cash" | "card";
  note?: string;
  promo?: PromoValidation | null;
  delivery: DeliverySelection | null;
  quote: DeliveryQuote | null;
  quoteLoading?: boolean;
  quoteError?: string | null;
}

const OrderSummary = ({
  paymentMethod,
  note,
  promo,
  delivery,
  quote,
  quoteLoading = false,
  quoteError = null,
}: OrderSummaryProps) => {
  const cart = useCart();
  const router = useRouter();
  const { customer, ready } = useCustomerSession();
  const [placeOrder, setPlaceOrder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasItems = cart.lines.length > 0;
  const discount = hasItems ? promo?.discountAmount || 0 : 0;
  const serviceFee = hasItems && quote?.serviceable ? quote.serviceFee : 0;
  const deliveryFee = hasItems && quote?.serviceable ? quote.deliveryFee : 0;
  const total = Math.max(cart.subtotal + serviceFee + deliveryFee - discount, 0);
  const loggedOut = ready && !customer;
  const canPlace =
    hasItems &&
    !loggedOut &&
    !loading &&
    !quoteLoading &&
    !!delivery &&
    !!quote?.serviceable;

  const handlePlaceOrder = async () => {
    if (!hasItems || !customer || !delivery || !quote?.serviceable) return;
    setError(null);
    setLoading(true);
    try {
      const result = await createOrder({
        items: cart.lines.map((line) => ({
          productId: /^[0-9a-f-]{36}$/i.test(line.id) ? line.id : undefined,
          name: line.name,
          unit: line.unit,
          price: line.price,
          quantity: line.quantity,
        })),
        deliveryAddress: delivery.address,
        lat: delivery.lat,
        lng: delivery.lng,
        paymentMethod,
        note: note?.trim() || undefined,
        promoCode: promo?.code,
      });

      if (result.paymentError) {
        setError(result.paymentError);
        return;
      }

      cart.clear();

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      setPlaceOrder(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl flex flex-col w-full lg:w-[30%] gap-2 p-3">
        <p className="body-medium font-medium">Order summary</p>

        {hasItems ? (
          cart.lines.map((line) => (
            <div
              className="flex items-center justify-between  border-b border-[#E7E7E7] py-3"
              key={line.id}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-12.5 h-12.5 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={line.image || "/assets/Untitled design.png"}
                    alt={line.name}
                    className="object-cover w-full h-full"
                    width={50}
                    height={50}
                  />
                </div>

                <div className="flex flex-col gap-2 min-w-0">
                  <p className="body-medium font-medium truncate">{line.name}</p>
                  <p className="text-grey-300 body-small">
                    {formatCurrency(line.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 body-medium text-white shrink-0">
                x{line.quantity}
              </div>
            </div>
          ))
        ) : (
          <p className="text-grey-300 body-small py-3">Your cart is empty.</p>
        )}

        <div className="flex items-center justify-between text-grey-300">
          <p>Subtotal({cart.totalItems} items)</p>
          <p> {formatCurrency(cart.subtotal)} </p>
        </div>
        <div className="flex items-center justify-between text-grey-300">
          <p>Shopper fee</p>
          <p>
            {quoteLoading
              ? "…"
              : formatCurrency(serviceFee)}
          </p>
        </div>
        <div className="flex items-center justify-between text-grey-300">
          <p>
            Delivery
            {quote?.distanceKm != null ? ` (~${quote.distanceKm} km)` : ""}
          </p>
          <p>
            {quoteLoading
              ? "…"
              : formatCurrency(deliveryFee)}
          </p>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <p>Discount ({promo?.code})</p>
            <p>-{formatCurrency(discount)}</p>
          </div>
        )}
        <div className="flex items-center justify-between font-medium">
          <p>Total</p>
          <p> {formatCurrency(total)} </p>
        </div>

        {!delivery && hasItems && (
          <p className="text-sm text-amber-700">
            Drop a map pin so we can calculate your delivery fee.
          </p>
        )}

        {quoteError && <p className="text-sm text-red-600">{quoteError}</p>}

        {loggedOut && (
          <p className="text-sm text-red-600">
            <Link href="/login" className="underline font-medium">
              Log in
            </Link>{" "}
            to place your order.
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          as="button"
          size="sm"
          variant="primary"
          isDisabled={!canPlace}
          onClick={handlePlaceOrder}
        >
          {loading
            ? "Placing order..."
            : quoteLoading
              ? "Calculating delivery..."
              : "Place order"}
        </Button>
      </div>

      <Modal
        isOpen={placeOrder}
        onClose={() => {
          setPlaceOrder(false);
          router.push("/marketplace");
        }}
        className="w-[30%]"
      >
        <div className="flex flex-col gap-2 w-full items-center justify-center">
          <SuccessIcon />
          <p className="body-large font-medium">Order placed successfully</p>
        </div>
      </Modal>
    </>
  );
};

export default OrderSummary;
