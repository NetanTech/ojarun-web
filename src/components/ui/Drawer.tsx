"use client";

import { X } from "lucide-react";
import React, { useEffect } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Drawer = ({ ...props }: DrawerProps) => {
  useEffect(() => {
    const handleEscClick = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };

    document.addEventListener("keydown", handleEscClick);

    return () => document.removeEventListener("keydown", handleEscClick);
  }, [props]);

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl px-5 py-4 md:hidden ${props.isOpen ? "translate-y-0" : "translate-y-full"} transition-transform duration-300 ease-in-out`}
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center text-black justify-between my-3">
          <h6 className="font-medium">{props.title}</h6>
          <X className="text cursor-pointer" onClick={props.onClose} />
        </div>
        <div
          className="overflow-y-auto"
          style={{ scrollbarWidth: "none", maxHeight: "calc(90vh - 80px)" }}
        >
          {props.children}
        </div>
      </div>

      <div
        className={`hidden md:block w-137.5 top-0 bottom-0 fixed z-50 right-0 bg-white py-4 px-6 ${props.isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center text-black justify-between my-3">
          <h6 className="font-medium">{props.title}</h6>
          <X className="text cursor-pointer" onClick={props.onClose} />
        </div>
        <div
          className="h-full pb-10 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
