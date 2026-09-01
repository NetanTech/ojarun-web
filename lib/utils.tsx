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