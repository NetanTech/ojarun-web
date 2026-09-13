"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { getToken, updateProfile, useCustomerSession } from "@/lib/customerAuth";
import DeleteAccountModal from "./DeleteAccountModal";

function getInitials(name: string | null, phone: string): string {
  const source = name?.trim() || phone;
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const ProfileForm = () => {
  const { customer, login } = useCustomerSession();
  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [deliveryArea, setDeliveryArea] = useState(customer?.deliveryArea ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!customer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const updated = await updateProfile(token, { name, email, deliveryArea });
      login(token, updated);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <form
        onSubmit={handleSubmit}
        className="border border-[#E7E7E7] rounded-[10px] p-5 flex flex-col gap-8 bg-white w-full"
      >
        <div className="flex flex-col gap-1">
          <h6>Profile Information</h6>
          <p className="body-medium text-black">Update your personal details.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-25 h-25 shrink-0">
            <div className="w-25 h-25 rounded-full bg-[#FFE7CC] flex items-center justify-center text-2xl font-medium text-black">
              {getInitials(customer.name, customer.phone)}
            </div>
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-grey-50 border-[1.5px] border-white flex items-center justify-center">
              <Pencil size={12} />
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="body-medium font-medium">Profile Photo</p>
            <p className="body-small text-grey-400">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <label className="flex-1 flex flex-col gap-2.5">
              <span className="body-medium font-medium text-grey-700">Full Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="w-full rounded-lg border border-[#E7E7E7] px-4 py-3 body-medium outline-none focus:border-primary"
              />
            </label>
            <label className="flex-1 flex flex-col gap-2.5">
              <span className="body-medium font-medium text-grey-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E7E7E7] px-4 py-3 body-medium outline-none focus:border-primary"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2.5">
            <span className="body-medium font-medium text-grey-700">Delivery Address</span>
            <input
              value={deliveryArea}
              onChange={(e) => setDeliveryArea(e.target.value)}
              placeholder="e.g. Bodija, Ibadan"
              className="w-full rounded-lg border border-[#E7E7E7] px-4 py-3 body-medium outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-2.5">
            <span className="body-medium font-medium text-grey-700">Phone Number</span>
            <div className="w-full rounded-lg border border-[#E7E7E7] px-4 py-3 flex items-center gap-2 bg-[#F9F9F9]">
              <span className="flex h-4 w-6 overflow-hidden rounded-sm shrink-0">
                <span className="h-full w-1/3 bg-green-700" />
                <span className="h-full w-1/3 bg-white" />
                <span className="h-full w-1/3 bg-green-700" />
              </span>
              <span className="body-medium text-grey-400">{customer.phone}</span>
            </div>
          </label>
        </div>

        {error && <p className="body-small text-red-600">{error}</p>}
        {success && <p className="body-small text-green-600">{success}</p>}

        <Button
          as="button"
          type="submit"
          variant="primary"
          size="lg"
          isLoading={saving}
          className="w-fit"
        >
          Update
        </Button>
      </form>

      <div className="border border-[#E7E7E7] rounded-[10px] p-4 flex items-center justify-between gap-4 flex-wrap bg-white w-full">
        <p className="body-medium font-medium text-red-500">Delete Your Account</p>
        <Button as="button" variant="primary" size="sm" onClick={() => setDeleteOpen(true)}>
          Delete Account
        </Button>
      </div>

      <DeleteAccountModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </div>
  );
};

export default ProfileForm;
