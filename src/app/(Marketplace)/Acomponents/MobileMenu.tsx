"use client";

import React, { useEffect } from "react";
import { LogOut, User } from "../../../../public/svg/svg";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCustomerSession } from "@/lib/customerAuth";


interface Route {
  icon: React.ComponentType;
  name: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  routes: Route[];
}

const MobileMenu = ({ isOpen, onClose, routes }: MobileMenuProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const { customer, logout } = useCustomerSession();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    history.pushState({ menuOpen: true }, "");
    const onPopState = () => onClose();
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (window.history.state?.menuOpen) history.replaceState(null, "");
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-full z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7E7]">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-full text-white">
                  <User className="text-white"/>
                </div>
                <p className="font-medium text-black">
                  {customer ? customer.name || customer.phone : "Guest"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-grey-50"
              >
                <X className="text-black" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              {routes.map((route, i) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={i}
                    href={route.href}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-5 py-3.5 capitalize text-black ${
                      pathName === route.href
                        ? "bg-green-500 text-white"
                        : "hover:bg-grey-50"
                    }`}
                  >
                    <Icon />
                    <p className="body-medium">{route.name}</p>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-[#E7E7E7] px-5 py-4">
              <button
                className="flex items-center gap-4 text-red-500 w-full py-2"
                onClick={() => {
                  onClose();
                  logout();
                  router.push("/login");
                }}
              >
                <LogOut />
                <p className="body-medium">Log out</p>
              </button>
            </div>
      </div>
    </>
  );
};

export default MobileMenu;
