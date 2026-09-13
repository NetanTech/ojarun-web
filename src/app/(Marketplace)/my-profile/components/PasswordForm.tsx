"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { changePassword, getToken } from "@/lib/customerAuth";

type FieldKey = "current" | "next" | "confirm";

const PasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState<Record<FieldKey, boolean>>({
    current: false,
    next: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleVisible = (key: FieldKey) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await changePassword(token, { currentPassword, newPassword });
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const fields: Array<{
    key: FieldKey;
    label: string;
    value: string;
    setValue: (v: string) => void;
  }> = [
    {
      key: "current",
      label: "Current Password",
      value: currentPassword,
      setValue: setCurrentPassword,
    },
    {
      key: "next",
      label: "New Password",
      value: newPassword,
      setValue: setNewPassword,
    },
    {
      key: "confirm",
      label: "Confirm New Password",
      value: confirmPassword,
      setValue: setConfirmPassword,
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#E7E7E7] rounded-[10px] p-5 flex flex-col gap-6 bg-white w-full"
    >
      <div className="flex flex-col gap-1">
        <h6>Change Password</h6>
        <p className="body-medium text-black">
          Update your password regularly to keep your account secure.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {fields.map((f) => (
          <label key={f.key} className="flex flex-col gap-2.5">
            <span className="body-medium font-medium text-grey-700">{f.label}</span>
            <div className="relative w-full">
              <input
                type={visible[f.key] ? "text" : "password"}
                value={f.value}
                onChange={(e) => f.setValue(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-[#E7E7E7] px-4 py-3 pr-12 body-medium outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => toggleVisible(f.key)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-400"
                aria-label={visible[f.key] ? "Hide password" : "Show password"}
              >
                {visible[f.key] ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </label>
        ))}
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
  );
};

export default PasswordForm;
