"use client";

import React, { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  getToken,
  removeAvatar,
  updateProfile,
  uploadAvatar,
  useCustomerSession,
} from "@/lib/customerAuth";
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
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!customer) return null;

  const handlePhotoChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again later
    if (!file) return;

    setPhotoError(null);
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      setPhotoError("Use a JPG, PNG, GIF or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Image is too large. Max size is 2MB.");
      return;
    }
    const token = getToken();
    if (!token) return;

    setPhotoBusy(true);
    try {
      const updated = await uploadAvatar(token, file);
      login(token, updated);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Could not upload your photo.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleRemovePhoto = async () => {
    const token = getToken();
    if (!token) return;
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      const updated = await removeAvatar(token);
      login(token, updated);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Could not remove your photo.");
    } finally {
      setPhotoBusy(false);
    }
  };

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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={photoBusy}
            aria-label="Change profile photo"
            className="relative w-25 h-25 shrink-0 rounded-full disabled:opacity-60"
          >
            {customer.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={customer.avatarUrl}
                alt="Profile photo"
                className="w-25 h-25 rounded-full object-cover"
              />
            ) : (
              <div className="w-25 h-25 rounded-full bg-[#FFE7CC] flex items-center justify-center text-2xl font-medium text-black">
                {getInitials(customer.name, customer.phone)}
              </div>
            )}
            {photoBusy && (
              <span className="absolute inset-0 rounded-full bg-white/60 flex items-center justify-center body-small font-medium">
                Saving...
              </span>
            )}
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-grey-50 border-[1.5px] border-white flex items-center justify-center">
              <Pencil size={12} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handlePhotoChosen}
          />
          <div className="flex flex-col gap-1 items-start">
            <p className="body-medium font-medium">Profile Photo</p>
            <p className="body-small text-grey-400">
              JPG, PNG, GIF or WebP. Max size 2MB.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoBusy}
                className="body-small font-semibold text-primary disabled:opacity-60"
              >
                {customer.avatarUrl ? "Change photo" : "Upload photo"}
              </button>
              {customer.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={photoBusy}
                  className="body-small font-semibold text-red-500 disabled:opacity-60"
                >
                  Remove
                </button>
              )}
            </div>
            {photoError && <p className="body-small text-red-500">{photoError}</p>}
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
