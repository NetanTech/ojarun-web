"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { MapPin2, MapPin3 } from "../../../../../public/svg/svg";
import React, { useEffect, useState } from "react";
import {
  SavedAddress,
  fetchAddresses,
  createAddress,
  deleteAddress,
  formatAddress,
} from "@/lib/addresses";

interface DeliveryAddressProps {
  selected: string;
  onSelect: (formatted: string) => void;
}

const DeliveryAddress = ({ selected, onSelect }: DeliveryAddressProps) => {
  const [openDAModal, setOpenDAModal] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newLandmark, setNewLandmark] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses()
      .then((list) => {
        setAddresses(list);
        if (!selected) {
          const def = list.find((a) => a.isDefault) || list[0];
          if (def) onSelect(formatAddress(def));
        }
      })
      .catch((err) => setListError(err instanceof Error ? err.message : "Could not load your addresses."))
      .finally(() => setLoading(false));
    // Only run once on mount — this component owns the initial default pick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (address: SavedAddress) => {
    onSelect(formatAddress(address));
    setOpenDAModal(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      const updated = addresses.filter((a) => a.id !== id);
      setAddresses(updated);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Could not delete this address.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const created = await createAddress({
        address: newAddress.trim(),
        landmark: newLandmark.trim() || undefined,
        label: newLabel.trim() || undefined,
      });
      setAddresses((prev) => [created, ...prev]);
      handleSelect(created);
      setNewAddress("");
      setNewLandmark("");
      setNewLabel("");
      setShowAddForm(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save this address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <p className="font-medium">Delivery address</p>
      <div
        className="border w-full flex items-center justify-between gap-3 border-[#E7E7E7] p-2 rounded-xl py-3"
        onClick={() => setOpenDAModal(true)}
      >
        <div className="flex items-center gap-2 md:gap-5">
          <MapPin2 />
          <p>{selected || (loading ? "Loading your addresses..." : "Add a delivery address")}</p>
        </div>

        <button
          className="bg-green-500 text-white p-2 px-4 rounded-full flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDAModal(true);
          }}
        >
          change
        </button>
      </div>

      <Modal
        isOpen={openDAModal}
        onClose={() => setOpenDAModal(false)}
        title="Delivery address"
        className="w-[35%]"
      >
        <div className="flex flex-col gap-4 w-full">
          {listError && <p className="text-sm text-red-600">{listError}</p>}

          {addresses.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              {addresses.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-center justify-between gap-2 border rounded-xl p-3 cursor-pointer ${
                    formatAddress(a) === selected
                      ? "border-primary bg-primary/5"
                      : "border-[#E7E7E7]"
                  }`}
                  onClick={() => handleSelect(a)}
                >
                  <div className="flex items-start gap-2">
                    <MapPin2 />
                    <div className="flex flex-col">
                      {a.label && <p className="font-medium">{a.label}</p>}
                      <p className="body-small">{formatAddress(a)}</p>
                      {a.isDefault && (
                        <p className="text-grey-300 body-xsmall">Default</p>
                      )}
                    </div>
                  </div>
                  <button
                    className="text-red-500 text-sm shrink-0"
                    disabled={deletingId === a.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(a.id);
                    }}
                  >
                    {deletingId === a.id ? "..." : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddForm ? (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-2 w-full border border-[#E7E7E7] rounded-xl p-3">
                <MapPin3 />
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="focus-within:outline-0 flex-1"
                  placeholder="Enter a delivery address"
                />
              </div>
              <input
                type="text"
                value={newLandmark}
                onChange={(e) => setNewLandmark(e.target.value)}
                className="w-full border border-[#E7E7E7] rounded-xl p-3 focus-within:outline-0"
                placeholder="Landmark (optional)"
              />
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full border border-[#E7E7E7] rounded-xl p-3 focus-within:outline-0"
                placeholder="Label, e.g. Home, Office (optional)"
              />

              {saveError && <p className="text-sm text-red-600">{saveError}</p>}

              <Button
                as="button"
                size="lg"
                variant="primary"
                className="w-full"
                isDisabled={!newAddress.trim()}
                isLoading={saving}
                onClick={handleAddAddress}
              >
                Save &amp; use this address
              </Button>
            </div>
          ) : (
            <Button
              as="button"
              size="lg"
              variant="secondary"
              className="w-full"
              isDisabled={addresses.length >= 5}
              onClick={() => setShowAddForm(true)}
            >
              {addresses.length >= 5 ? "Address limit reached (5)" : "+ Add new address"}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DeliveryAddress;
