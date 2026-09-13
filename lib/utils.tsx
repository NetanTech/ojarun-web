import { OfferNotIcon, ProfileNotIcon, ShoppingBag } from "../public/svg/svg"

export const formatCurrency = (value : number, currency = "NGN"): string => {
    try {
        return new Intl.NumberFormat( "en-NG", {
            style : 'currency',
            currency,
            maximumFractionDigits : 2
        }).format(value)
    } catch {
        return value.toFixed(2)
    }
}

export function getNotificationIcon(type : "promotion" | "order" | "profile") {
    if (type === 'promotion') {
        return <OfferNotIcon />;
    } else if ( type === 'order' ) {
        return <ShoppingBag />
    } else {
        return <ProfileNotIcon />
    }
}

export function formatNotificationTimestamp(createdAt: string): string {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "";

    const datePart = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    let relativePart: string;
    if (diffMin < 1) {
        relativePart = "Now";
    } else if (diffMin < 60) {
        relativePart = `${diffMin} minute${diffMin === 1 ? "" : "s"}`;
    } else if (diffHour < 24) {
        relativePart = `${diffHour} hour${diffHour === 1 ? "" : "s"}`;
    } else if (diffDay < 7) {
        relativePart = `${diffDay} day${diffDay === 1 ? "" : "s"}`;
    } else if (diffDay < 14) {
        relativePart = "Last week";
    } else if (diffDay < 30) {
        relativePart = `${Math.floor(diffDay / 7)} weeks ago`;
    } else {
        const diffMonth = Math.floor(diffDay / 30);
        relativePart = diffMonth < 12
            ? `${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`
            : `${Math.floor(diffMonth / 12)} year${Math.floor(diffMonth / 12) === 1 ? "" : "s"} ago`;
    }

    return `${datePart}. ${relativePart}`;
}