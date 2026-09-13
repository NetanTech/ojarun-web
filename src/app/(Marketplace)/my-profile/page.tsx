"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import BreadCrumb from "../Acomponents/bread-crumb";
import { Home } from "../../../../public/svg/svg";
import { useCustomerSession } from "@/lib/customerAuth";
import ProfileForm from "./components/ProfileForm";
import PasswordForm from "./components/PasswordForm";

type Tab = "profile" | "password";

const MyProfilePage = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { customer, ready } = useCustomerSession();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!ready) return;
    if (!customer) router.replace("/login");
  }, [ready, customer, router]);

  if (!ready || !customer) {
    return (
      <div className="md:max-w-300 lg:mx-auto mx-5 md:w-full my-5">
        <p className="text-grey-300 body-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="md:max-w-300 lg:mx-auto mx-5 md:w-full flex flex-col items-start gap-6 my-5">
      <BreadCrumb
        item={[
          {
            icon: <Home size={18} className="text-grey-300" />,
            title: "Home",
            href: "/",
          },
          {
            title: "Profile",
            href: pathName,
          },
        ]}
      />

      <h5>Profile</h5>

      <div className="grid grid-cols-1 lg:grid-cols-[292px_1fr] gap-6 w-full items-start">
        <div className="bg-[#F9F9F9] rounded-2xl p-6 flex flex-col gap-2 w-full lg:sticky lg:top-5">
          <button
            type="button"
            onClick={() => setTab("profile")}
            className={clsx(
              "text-left rounded-md px-3.5 py-2.5 body-medium transition",
              tab === "profile" ? "bg-green-50 text-black" : "text-grey-200",
            )}
          >
            Edit profile
          </button>
          <button
            type="button"
            onClick={() => setTab("password")}
            className={clsx(
              "text-left rounded-md px-3.5 py-2.5 body-medium transition",
              tab === "password" ? "bg-green-50 text-black" : "text-grey-200",
            )}
          >
            Change password
          </button>
        </div>

        <div className="w-full">
          {tab === "profile" ? <ProfileForm /> : <PasswordForm />}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
