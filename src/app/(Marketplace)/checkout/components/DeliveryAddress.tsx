"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { MapPin2 } from "../../../../../public/svg/svg";
import React, { useEffect, useState } from "react";
import {
  SavedAddress,
  fetchAddresses,
  createAddress,
  deleteAddress,
  formatAddress,
  hasPin,
} from "@/lib/addresses";
import { DeliverySelection } from "@/lib/delivery";
import AddressMapPicker from "./AddressMapPicker";

interface DeliveryAddressProps {
  selected: DeliverySelection | null;
  onSelect: (selection: DeliverySelection | null) => void;
}

const DeliveryAddress = ({ selected, onSelect }: DeliveryAddressProps) => {
  const [openDAModal, setOpenDAModal] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLandmark, setNewLandmark] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [pendingPin, setPendingPin] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses()
      .then((list) => {
        setAddresses(list);
        if (!selected) {
          const withPin = list.filter(hasPin);
          const def =
            withPin.find((a) => a.isDefault) || withPin[0] || null;
          if (def && def.lat != null && def.lng != null) {
            onSelect({
              address: formatAddress(def),
              lat: def.lat,
              lng: def.lng,
              landmark: def.landmark || undefined,
              label: def.label || undefined,
            });
          }
        }
      })
      .catch((err) =>
        setListError(
          err instanceof Error ? err.message : "Could not load your addresses.",
        ),
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (address: SavedAddress) => {
    if (!hasPin(address) || address.lat == null || address.lng == null) {
      setListError(
        "This saved address has no map pin. Add it again with the map.",
      );
      return;
    }
    onSelect({
      address: formatAddress(address),
      lat: address.lat,
      lng: address.lng,
      landmark: address.landmark || undefined,
      label: address.label || undefined,
    });
    setOpenDAModal(false);
    setShowAddForm(false);
    setPendingPin(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      const updated = addresses.filter((a) => a.id !== id);
      setAddresses(updated);
      if (
        selected &&
        addresses.find((a) => a.id === id && formatAddress(a) === selected.address)
      ) {
        onSelect(null);
      }
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : "Could not delete this address.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handlePinConfirmed = (pin: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setPendingPin(pin);
  };

  const handleSavePinnedAddress = async () => {
    if (!pendingPin) return;
    setSaving(true);
    setSaveError(null);
    try {
      const created = await createAddress({
        address: pendingPin.address,
        landmark: newLandmark.trim() || undefined,
        label: newLabel.trim() || undefined,
        lat: pendingPin.lat,
        lng: pendingPin.lng,
      });
      setAddresses((prev) => [created, ...prev]);
      handleSelect(created);
      setNewLandmark("");
      setNewLabel("");
      setPendingPin(null);
      setShowAddForm(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save this address.",
      );
    } finally {
      setSaving(false);
    }
  };

  const display =
    selected?.address ||
    (loading ? "Loading your addresses..." : "Drop a pin for delivery");

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <p className="font-medium">Delivery address</p>
      <div
        className="border w-full flex items-center justify-between gap-3 border-[#E7E7E7] p-2 rounded-xl py-3 cursor-pointer"
        onClick={() => setOpenDAModal(true)}
      >
        <div className="flex items-center gap-2 md:gap-5 min-w-0 flex-1">
          <MapPin2 className="shrink-0" />
          <p className="truncate">{display}</p>
        </div>

        <button
          className="bg-green-500 text-white p-2 px-4 rounded-full flex items-center justify-center shrink-0"
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
        onClose={() => {
          setOpenDAModal(false);
          setShowAddForm(false);
          setPendingPin(null);
        }}
        title="Delivery address"
        className="w-[92%] md:w-[520px] max-w-[560px]"
      >
        <div className="flex flex-col gap-4 w-full">
          {listError && <p className="text-sm text-red-600">{listError}</p>}

          {!showAddForm && addresses.length > 0 && (
            <div className="flex flex-col gap-2 w-full max-h-48 overflow-y-auto">
              {addresses.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-center justify-between gap-2 border rounded-xl p-3 cursor-pointer ${
                    selected && formatAddress(a) === selected.address
                      ? "border-primary bg-primary/5"
                      : "border-[#E7E7E7]"
                  } ${!hasPin(a) ? "opacity-60" : ""}`}
                  onClick={() => handleSelect(a)}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <MapPin2 className="shrink-0" />
                    <div className="flex flex-col min-w-0">
                      {a.label && <p className="font-medium">{a.label}</p>}
                      <p className="body-small break-words">{formatAddress(a)}</p>
                      {!hasPin(a) && (
                        <p className="text-amber-600 body-xsmall">
                          Needs a map pin — add again
                        </p>
                      )}
                      {a.isDefault && hasPin(a) && (
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
              {!pendingPin ? (
                <AddressMapPicker
                  onConfirm={handlePinConfirmed}
                  confirming={saving}
                />
              ) : (
                <>
                  <div className="rounded-xl bg-[#F5F7F5] p-3">
                    <p className="body-small text-grey-300">Pinned location</p>
                    <p className="font-medium break-words">{pendingPin.address}</p>
                    <button
                      type="button"
                      className="text-sm text-primary mt-1 underline"
                      onClick={() => setPendingPin(null)}
                    >
                      Move pin
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    className="w-full border border-[#E7E7E7] rounded-xl p-3 focus-within:outline-0"
                    placeholder="Landmark for the rider (optional)"
                  />
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full border border-[#E7E7E7] rounded-xl p-3 focus-within:outline-0"
                    placeholder="Label, e.g. Home, Office (optional)"
                  />
                  {saveError && (
                    <p className="text-sm text-red-600">{saveError}</p>
                  )}
                  <Button
                    as="button"
                    size="lg"
                    variant="primary"
                    className="w-full"
                    isLoading={saving}
                    onClick={handleSavePinnedAddress}
                  >
                    Save &amp; use this pin
                  </Button>
                  <button
                    type="button"
                    className="w-full rounded-full border border-[#E7E7E7] px-4 py-3 text-sm font-medium"
                    disabled={saving}
                    onClick={() => {
                      onSelect({
                        address: newLandmark.trim()
                          ? `${pendingPin.address} (${newLandmark.trim()})`
                          : pendingPin.address,
                        lat: pendingPin.lat,
                        lng: pendingPin.lng,
                        landmark: newLandmark.trim() || undefined,
                        label: newLabel.trim() || undefined,
                      });
                      setOpenDAModal(false);
                      setShowAddForm(false);
                      setPendingPin(null);
                      setNewLandmark("");
                      setNewLabel("");
                    }}
                  >
                    Use once without saving
                  </button>
                </>
              )}
            </div>
          ) : (
            <Button
              as="button"
              size="lg"
              variant="secondary"
              className="w-full"
              isDisabled={addresses.length >= 5}
              onClick={() => {
                setShowAddForm(true);
                setPendingPin(null);
                setListError(null);
              }}
            >
              {addresses.length >= 5
                ? "Address limit reached (5)"
                : "+ Drop a new pin"}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DeliveryAddress;
