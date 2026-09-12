"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Diamond } from "lucide-react";
import BreadCrumb from "../Acomponents/bread-crumb";
import { Home } from "../../../../public/svg/svg";
import { useCustomerSession } from "@/lib/customerAuth";
import {
  fetchRewardsSummary,
  fetchRewardTransactions,
  RewardsSummary,
  RewardTransaction,
} from "@/lib/rewards";
import TierCard from "./components/TierCard";
import SummaryCard from "./components/SummaryCard";
import ReferralCard from "./components/ReferralCard";
import ActivityTable from "./components/ActivityTable";

const PAGE_SIZE = 5;

const RewardsPage = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { customer, ready } = useCustomerSession();

  const [summary, setSummary] = useState<RewardsSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!ready) return;
    if (!customer) {
      router.replace("/login");
      return;
    }
    fetchRewardsSummary()
      .then(setSummary)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your rewards."))
      .finally(() => setSummaryLoading(false));
  }, [ready, customer, router]);

  useEffect(() => {
    if (!ready || !customer) return;
    fetchRewardTransactions(page, PAGE_SIZE)
      .then((res) => {
        setTransactions(res.items);
        setTotalPages(res.totalPages);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your activity."))
      .finally(() => setTransactionsLoading(false));
  }, [ready, customer, page]);

  const handlePageChange = (nextPage: number) => {
    setTransactionsLoading(true);
    setPage(nextPage);
  };

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
            title: "Rewards",
            href: pathName,
          },
        ]}
      />

      <div className="flex flex-col gap-3">
        <h5>Rewards</h5>
        <p className="text-grey-300 body-medium">
          Earn points to shop with for loyalty and referral
        </p>
      </div>

      {error && <p className="text-red-600 body-medium">{error}</p>}

      {summaryLoading || !summary ? (
        <p className="text-grey-300 body-medium">Loading your rewards...</p>
      ) : (
        <>
          <div className="bg-linear-to-r from-[#00892E] to-[#004A19] rounded-[20px] w-full p-6 md:p-10 flex flex-col gap-6 overflow-hidden relative">
            <div className="flex items-center gap-1">
              <p className="text-grey-50 h6">Total OjaPoints</p>
              <Diamond size={16} className="text-white" />
            </div>
            <p className="text-white font-mono text-[40px] md:text-[48px] leading-[56px] font-medium tracking-[-0.01em]">
              {summary.points.toLocaleString()}
            </p>
            <span className="bg-white/30 border-[0.5px] border-white text-white rounded-lg px-2 py-1 w-fit body-medium font-medium">
              Tier {summary.tierIndex}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 w-full items-start">
            <div className="flex flex-col gap-6 w-full">
              <TierCard summary={summary} />

              <div className="border border-[#E7E7E7] rounded-[20px] p-6 flex flex-col gap-2 bg-white w-full">
                <h6>How it works:</h6>
                <p className="text-grey-400 body-medium">
                  • Earn 10 points for every ₦1,000 spent.
                  <br />• Use points on delivery fees or order totals.
                </p>
              </div>

              <ActivityTable
                items={transactions}
                loading={transactionsLoading}
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            <div className="flex flex-col gap-6 w-full">
              <SummaryCard summary={summary} />
              <ReferralCard summary={summary} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RewardsPage;
