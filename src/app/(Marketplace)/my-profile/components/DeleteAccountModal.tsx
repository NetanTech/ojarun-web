"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { deactivateAccount, getToken, useCustomerSession } from "@/lib/customerAuth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const { logout } = useCustomerSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    const token = getToken();
    if (!token) return;

    setError(null);
    setLoading(true);
    try {
      await deactivateAccount(token);
      logout();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete your account" className="w-full max-w-100">
      <p className="body-medium text-grey-400">
        This deactivates your account and logs you out immediately. Your order
        history is kept, but you won&apos;t be able to sign back in until
        support reactivates it.
      </p>

      {error && <p className="body-small text-red-600">{error}</p>}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-lg border border-[#E7E7E7] px-4 py-2 body-medium font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="rounded-lg bg-red-500 text-white px-4 py-2 body-medium font-medium disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Yes, delete my account"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
