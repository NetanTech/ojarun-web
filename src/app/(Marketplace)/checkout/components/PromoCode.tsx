"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { ChevronRight, Tag } from "../../../../../public/svg/svg";
import React, { useState } from "react";
import { useCart } from "@/lib/cart";
import { validatePromoCode, PromoValidation } from "@/lib/orders";
import { formatCurrency } from "../../../../../lib/utils";

interface PromoCodeProps {
  applied: PromoValidation | null;
  onApply: (promo: PromoValidation | null) => void;
}

const PromoCode = ({ applied, onApply }: PromoCodeProps) => {
  const cart = useCart();
  const [openPCModal, setOpenPCModal] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUseCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await validatePromoCode(code.trim(), cart.subtotal);
      onApply(result);
      setOpenPCModal(false);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not apply this code.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onApply(null);
    setError(null);
  };

  return (
    <>
      <div
        className="flex items-center gap-3 flex-1 w-full justify-between border border-[#E7E7E7] p-2 rounded-xl py-4"
        onClick={() => setOpenPCModal(true)}
      >
        <div className="flex items-center gap-2 md:gap-5">
          <Tag />
          <p className="body-medium">
            {applied
              ? `"${applied.code}" applied — -${formatCurrency(applied.discountAmount)}`
              : "Use promo code"}
          </p>
        </div>

        {applied ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="text-red-500 text-sm font-medium"
          >
            Remove
          </button>
        ) : (
          <button onClick={() => setOpenPCModal(true)}>
            <ChevronRight />
          </button>
        )}
      </div>

      <Modal
        isOpen={openPCModal}
        onClose={() => setOpenPCModal(false)}
        title="Promo code"
        className="w-[35%]"
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2 w-full border border-[#E7E7E7] rounded-xl p-3">
            <Tag />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="focus-within:outline-0 flex-1"
              placeholder="Add promo code"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            as="button"
            size="lg"
            variant="primary"
            className="w-full"
            isDisabled={!code.trim()}
            isLoading={loading}
            onClick={handleUseCode}
          >
            Use code
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PromoCode;
