"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { formatCurrency } from "../../../../../lib/utils";
import Drawer from "@/components/ui/Drawer";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import Radio from "@/components/ui/Radio";
import {
  ShoppingBag,
  HourGlass,
  CancelCircle,
  TickCircle,
} from "../../../../../public/svg/svg";
import { Check, Repeat2 } from "lucide-react";
import Button from "@/components/ui/Button";

const statusVariants = {
  "in progress": "bg-warning-50 text-warning-500",
  successful: "bg-green-50 text-green-500",
  failed: "bg-red-50 text-red-500",
};

const statusIcon = {
  "in progress": <HourGlass />,
  successful: <TickCircle />,
  failed: <CancelCircle />,
};

const timelineStatus: OrderTimeline = {
  orderReceived: true,
  shoppingInProgress: false,
  readyForPickup: false,
  delivered: false,
};

const orderTimelines = [
  {
    title: "Order received",
    key: "orderReceived",
    time: "11:42 am",
  },
  {
    title: "Shopping in progress",
    key: "shoppingInProgress",
  },
  {
    title: "Ready for pickup",
    key: "readyForPickup",
  },
  {
    title: "Delivered",
    key: "delivered",
  },
];

const OrderItemRow = ({ ...props }: OrderProperties) => {
  const cancelReasons = [
    "I added the wrong items",
    "I no longer need th color",
    "I want to change my delivery address",
    "I found a better alternative",
  ];
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [showCOmodal, setShowCOModal] = useState(false); // confirm order modal
  const [cancelOrder, setCancelOrder] = useState(false); // cancel order modal
  const [order, setOrder] = useState<string | null>(null);
  return (
    <React.Fragment>
      <div
        className="md:hidden border border-[#E7E7E7] rounded-xl px-4 py-4 flex flex-col gap-3 hover:bg-green-50/40 cursor-default"
        onClick={() => {
          setShowOrderDetails(true);
          setOrder(props.orderId);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-50 p-2 flex items-center justify-center rounded-md">
              <ShoppingBag />
            </div>
            <div className="flex flex-col">
              <p className="text-grey-400 text-xs">Order ID</p>
              <p className="text-sm font-medium">{props.orderId}</p>
            </div>
          </div>
          <p
            className={clsx(
              "py-0.5 px-2 rounded-full body-xsmall capitalize flex items-center gap-1",
              statusVariants[props.status],
            )}
          >
            {statusIcon[props.status]}
            {props.status}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex flex-col">
            <p className="text-grey-400 text-xs">Date</p>
            <p>{props.date}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-grey-400 text-xs">Items</p>
            <p>{props.items.length}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-grey-400 text-xs">Total Price</p>
            <p>{formatCurrency(props.total, "NGN")}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-grey-400 text-xs">Market</p>
            <p>{props.market}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full">
          <Button
            as="button"
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setShowOrderDetails(true);
              setOrder(props.orderId);
            }}
          >
            Track Order
          </Button>
          <Button
            as="button"
            size="sm"
            variant="primary"
            leftIcon={<Repeat2 />}
            className="flex-1"
          >
            Reorder
          </Button>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-8 items-center justify-between w-full border border-[#E7E7E7] py-6 rounded-xl px-5 hover:bg-green-50/40 cursor-default" onClick={() => {
            setShowOrderDetails(true);
            setOrder(props.orderId);
          }}>
        <div className="flex items-start gap-2">
          <div className="bg-green-50 p-2 flex items-center justify-center rounded-md">
            <ShoppingBag />
          </div>

          <div className=" flex flex-col items-start">
            <p className="text-gray-400">Order ID</p>
            <p>{props.orderId}</p>
          </div>
        </div>
        <div className=" flex flex-col items-start">
          <p className="text-gray-400">Date</p>
          <p>{props.date}</p>
        </div>
        <div className=" flex flex-col items-start">
          <p className="text-gray-400">Items</p>
          <p>{props.items.length}</p>
        </div>
        <div className=" flex flex-col items-start">
          <p className="text-gray-400">Total Price</p>
          <p>{formatCurrency(props.total, "NGN")}</p>
        </div>
        <div className=" flex flex-col items-start">
          <p className="text-gray-400">Market</p>
          <p>{props.market}</p>
        </div>
        <div className=" flex flex-col items-start">
          <p className="text-gray-400">Status</p>
          <p
            className={clsx(
              "py-0.5 px-1.5 rounded-full body-small capitalize flex items-center gap-2",
              statusVariants[props.status],
            )}
          >
            {statusIcon[props.status]}
            {props.status}
          </p>
        </div>
        <div className=" flex items-center justify-end gap-4 col-span-2">
          <Button className="" as="button" size="sm" variant="secondary">
            Track Order
          </Button>
          <Button
            className=""
            as="button"
            size="sm"
            variant="primary"
            leftIcon={<Repeat2 />}
          >
            Reorder
          </Button>
        </div>
      </div>

      <Drawer
        title="Order Details"
        isOpen={showOrderDetails}
        onClose={() => setShowOrderDetails(false)}
      >
        <div className="border border-[#E7E7E7] px-3.5 py-4 flex items-center justify-between w-full rounded-md">
          <div className="flex items-start gap-2">
            <div className="bg-green-50 p-2 flex items-center justify-center rounded-md">
              <ShoppingBag />
            </div>

            <div className=" flex flex-col items-start">
              <p className="text-gray-400">Order ID</p>
              <p>{props.orderId}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <p
              className={clsx(
                "py-0.5 px-1.5 rounded-full body-small capitalize flex items-center gap-2",
                statusVariants[props.status],
              )}
            >
              {statusIcon[props.status]}
              {props.status}
            </p>
            <p>{props.date}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-b border-b-[#E7E7E7] py-4">
          <p className="uppercase text-300 body-medium text-medium">
            items ordered({props.items.length})
          </p>
          <div className="flex flex-col gap-2">
            {props.items.map((item) => (
              <div className="flex items-center justify-between" key={item.id}>
                <div className="flex items-center gap-2">
                  <div className="w-12.5 h-12.5 rounded-xl overflow-hidden">
                    <Image
                      src={item.image || "/assets/Untitled design.png"}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p>
                      {item.name} x{item.quantity}
                    </p>
                    <p className="text-grey-300">{item.unit}</p>
                  </div>
                </div>
                <p>{formatCurrency(item.price, "NGN")}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 border-b border-b-[#E7E7E7] py-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-grey-300">Subtotal</p>
            <p>{formatCurrency(props.subtotal, "NGN")}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-grey-300">Agent fee</p>
            <p>{formatCurrency(props.agentFee, "NGN")}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-grey-300">Delivery fee</p>
            <p>{formatCurrency(props.deliveryFee, "NGN")}</p>
          </div>
        </div>
        <div className="flex flex-col gap-5 border-b border-b-[#E7E7E7] py-4">
          <p className="text-grey-300 font-medium uppercase">payment details</p>
          <div className="flex items-center justify-between w-full">
            <p className="text-grey-300">Payment method</p>
            <p className="flex items-center gap-2">
              {props.payment.method} {props.payment?.maskedCard}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-b border-b-[#E7E7E7] py-4">
          <p className="text-grey-300 font-medium uppercase">
            delivery details
          </p>
          <div className="flex items-center justify-between w-full">
            <p className="text-grey-300">Delivery method</p>
            <p>{props.delivery.method}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-grey-300">Delivery address</p>
            <p>{props.delivery.address}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-grey-300">Estimated time</p>
            <p>{props.delivery.estimatedTime}</p>
          </div>
        </div>

        <div className="flex flex-col py-4">
          <p className="text-grey-300 font-medium uppercase mb-4">
            Status Timeline
          </p>

          {orderTimelines.map((item, index) => {
            const completed = timelineStatus[item.key as keyof OrderTimeline];

            const isLast = index === orderTimelines.length - 1;

            return (
              <div key={item.key} className="flex items-start gap-3">
                {/* Icon + Vertical Line */}
                <div className="flex flex-col items-center">
                  {completed ? (
                    <div className="w-5 h-5 rounded-full bg-green-700 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-300 bg-white" />
                  )}

                  {!isLast && <div className="w-px h-10 bg-gray-200" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{item.title}</p>

                    {index === 0 && (
                      <>
                        <div className="flex-1 border-t border-dashed border-gray-200" />
                        <p className="text-sm text-gray-500">{item.time}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-5 py-4 w-full">
          <Button
            as="button"
            size="sm"
            variant="secondary"
            className="text-red-500 border-red-500 hover:border-red-400 hover:text-red-400 w-full"
            onClick={() => {
              setShowOrderDetails(false);
              setCancelOrder(true);
            }}
          >
            Cancel
          </Button>

          <Button
            as="button"
            size="sm"
            variant="primary"
            className="w-full"
            onClick={() => {
              setShowOrderDetails(false);
              setShowCOModal(true);
            }}
          >
            Confirm Order
          </Button>
        </div>
      </Drawer>
      <Modal
        isOpen={showCOmodal}
        onClose={() => setShowCOModal(false)}
        title="Delivery address"
        className="w-[35%]"
      >
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <p className="text-grey-300 text-center  max-w-100">
            Please confirm that you have received your order. By confirming,
            this order will be marked as completed.
          </p>
          <div className="flex items-center gap-2 w-full">
            <Button
              as="button"
              size="sm"
              variant="secondary"
              className="bg-grey-50 text-black border-none w-full"
            >
              Cancel
            </Button>

            <Button as="button" size="sm" variant="primary" className="w-full">
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={cancelOrder}
        onClose={() => setCancelOrder(false)}
        className="w-[35%]"
      >
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <h6>Are you sure you want to cancel this order?</h6>
          <p className="text-grey-300 text-center">
            Once cancelled, this order cannot be restored and you&apos;ll need
            to place a new order if you&apos;d still like these items.
          </p>
        </div>

        <div className="border rounded-xl  bg-linear-to-tr from-white to-[#E6EDE8] border-green-100 p-4 flex flex-col items-start gap-2">
          {cancelReasons.map((reason, i) => (
            <div className="flex items-center gap-2" key={i}>
              <Radio
                isActive={cancelReason === reason}
                onChange={() => setCancelReason(reason)}
              />
              <p className="body-small text-grey-400">{reason}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full">
          <Button
            as="button"
            size="sm"
            variant="secondary"
            className="bg-grey-50 text-black border-none w-full"
          >
            Keep order
          </Button>

          <Button
            as="button"
            size="sm"
            variant="primary"
            className="w-full bg-red-500 text-white hover:bg-red-400"
          >
            Cancel order
          </Button>
        </div>
      </Modal>

      {showOrderDetails && (
        <div
          className="bg-black/60 fixed inset-0 w-full h-full z-30"
          onClick={() => setShowOrderDetails(false)}
        />
      )}
    </React.Fragment>
  );
};
export default OrderItemRow;
