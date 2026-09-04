"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AllBookmark,
  BagCheck,
  ChevronDown,
  GiftCard,
  Heart,
  HelpCircle,
  HeroTop,
  Logo,
  LogOut,
  MapPin,
  NotificationBell,
  Search2,
  ShoppingCart,
  User,
} from "../../../../public/svg/svg";
import { Menu } from "lucide-react";
import CartDrawer from "./CartDialog";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import MobileMenu from "./MobileMenu";
import { useCustomerSession } from "@/lib/customerAuth";
import { useCart } from "@/lib/cart";

const routes = [
  {
    icon: BagCheck,
    name: "order hisotry",
    href: "/order-history",
  },
  {
    icon: Heart,
    name: "Favourites",
    href: "/favourites",
  },
  {
    icon: AllBookmark,
    name: "shopping list",
    href: "/shopping-list",
  },
  {
    icon: GiftCard,
    name: "rewards",
    href: "/rewards",
  },
  {
    icon: NotificationBell,
    name: "Notifications",
    href: "/notifications",
  },
  {
    icon: HelpCircle,
    name: "Help and support ",
    href: "/helpme",
  },
  {
    icon: User,
    name: "my profile",
    href: "/my-profile",
  },
];

const Header = () => {
  const pathName = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { customer, ready, logout } = useCustomerSession();
  const cart = useCart();
  const [showCart, setShowCart] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    router.push(trimmed ? `/marketplace?q=${encodeURIComponent(trimmed)}` : "/marketplace");
  };
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showLocModal, setShowLocModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        window.innerWidth >= 768 &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu, setShowMenu]);
  return (
    <header className="bg-primary text-white  w-full z-50 sticky top-0 transition-colors duration-300 ">
      <div className="lg:max-w-300 relative w-full py-4 px-6  lg:mx-auto flex items-center justify-between">
        <HeroTop
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-10 md:-top-2 z-0  w-full"
        />
        <div className="flex items-center gap-10 z-20 bg-transparent">
          <Link href={"/"}>
            <Logo className="h-12 w-auto sm:h-16" />
          </Link>

          <button
            className="hidden lg:flex items-center gap-2 focus:outline-1 focus-within:p-2 focus-within:rounded-xl outline-[#e7e7e7]"
            onClick={() => setShowLocModal(true)}
          >
            <MapPin />
            <p className="hidden sm:inline">Secretariat-UI Road</p>
            <ChevronDown />
          </button>

          <Modal
            isOpen={showLocModal}
            onClose={() => setShowLocModal(false)}
            title="Location"
            className="w-[35%] text-black"
          >
            <div className="flex flex-col gap-2 w-full items-start">
              <div className=" w-full border rounded-lg flex items-center gap-2 px-3 py-4 border-[#e7e7e7] ">
                <MapPin  className="text-grey-300"/> 
                <input type="text" placeholder="Enter a delivery address" className="focus-within:outline-0 flex-1" />
              </div>
              <Button as="button" className="w-full" size="lg" variant="primary">
                Use precise location
              </Button>
            </div>
          </Modal>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center gap-1 p-2 bg-white w-[40%] rounded-lg z-20"
        >
          <button type="submit" aria-label="Search">
            <Search2 className="text-primary" />
          </button>
          <input
            className="focus-within:outline-0 flex-1 text-black"
            placeholder="Search items, meals, market"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        <div className="hidden lg:flex items-center text-black gap-5 z-20 relative ">
          <button
            className="relative bg-white px-3 py-2 flex rounded-lg items-center justify-center"
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                {cart.totalItems}
              </span>
            )}
          </button>

          {!ready ? null : !customer ? (
            <Link
              href="/login"
              className="bg-white text-black px-3 py-2 flex rounded-md text-sm font-medium items-center justify-center"
            >
              Login
            </Link>
          ) : (
            <div className=" w-full">
              <button
                className="bg-white body-small text-black px-3 py-2 flex rounded-md text-sm font-medium items-center justify-center gap-2"
                onClick={() => setShowMenu(true)}
              >
                <User /> {customer.name || customer.phone}
              </button>

              {/* Make this height expanding later on */}

              {showMenu && (
                <nav
                  className={`absolute left-0 w-52.5 top-full mt-3 shadow flex flex-col rounded-xl bg-white  overflow-hidden`}
                  ref={menuRef}
                >
                  {routes.map((route, i) => {
                    const Icon = route.icon;
                    return (
                      <Link
                        className={`flex cursor-default items-center gap-3 pl-4  px-3 py-2 capitalize ${pathName === route.href ? "bg-green-500 text-white hover:bg-green-400" : "hover:bg-grey-50"} `}
                        style={
                          i === 0
                            ? { paddingTop: "10px" }
                            : { paddingTop: "8px" }
                        }
                        href={route.href}
                        key={i}
                        onClick={() => setShowMenu(false)}
                      >
                        <Icon
                          className={`${pathName === route.href ? "text-white" : "text-[#004A19]"}`}
                        />
                        <p className="">{route.name}</p>
                      </Link>
                    );
                  })}

                  <button
                    className="flex cursor-default items-center gap-3 pl-4 hover:bg-grey-50 px-3 py-2 capitalize text-red-500 border-t border-t-[#E7E7E7] pb-3"
                    onClick={() => {
                      setShowMenu(false);
                      logout();
                      router.push("/login");
                    }}
                  >
                    <LogOut />
                    <p>Log out</p>
                  </button>
                </nav>
              )}
            </div>
          )}
        </div>

        <div className="lg:hidden z-20 text-black flex items-center gap-3">
          <button
            className="bg-white px-3 py-2 flex rounded-lg items-center justify-center"
            onClick={() => router.push("/marketplace")}
            aria-label="Search"
          >
            <Search2 size={20} />
          </button>
          <button
            className="relative bg-white px-3 py-2 flex rounded-lg items-center justify-center"
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                {cart.totalItems}
              </span>
            )}
          </button>

          <button
            className="border text-white border-white rounded-lg p-2"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
      {showCart && (
        <div
          className="bg-black/60 fixed inset-0 w-full h-full z-30"
          onClick={() => setShowCart(false)}
        />
      )}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        routes={routes}
      />
    </header>
  );
};

export default Header;
