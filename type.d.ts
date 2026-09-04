// Svg Props
interface SvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

// Category type
interface CategoriesType {
  name: string;
  icon: React.FC<SvgProps>;
}

// Product Card Props
interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  imageURL: string;
  more: string;
  wishlisted?: boolean;
}

interface ShoppingListItem {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  imageURL: string;
  more: string;
  quantity: number;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageURL: string;
  unit: string; // Per bunch, Per kg, Per bottle
}

// Meal Props
interface MealIngredient {
  product: Product;
  quantity: number;
  optional?: boolean;
}

interface Meal {
  id: string;
  name: string;
  imageURL: string;
  description: string;
  servings: string; // serves 4-5
  totalPrice: number;
  wishlisted?: boolean;
  ingredients: MealIngredient[];
}

// Cart Item interface
interface CartItem {
  img: string
  productName: string
  meta: string
  quantity: number
  price: number
}





// Button Component Props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  label?: string;
  children: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  variant: "secondary" | "primary";
  size: "lg" | "sm";
  as: "button" | "link";
  className?: string;
  to?: string;
}

// Order Interfaces for the OrderItem, PaymentDetails, DeliveryDetails, OrderTimeline and the OrderProperties
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g. "Per Can", "Per Box"
  price: number;
  image?: string;
}

interface PaymentDetails {
  method: string; // Mastercard, Visa, Cash, Wallet
  maskedCard?: string; // ******9834
}

interface DeliveryDetails {
  method: string; // Ojarun delivery
  address: string;
  estimatedTime: string; // "20 Mins"
}

interface OrderTimeline {
  orderReceived: boolean;
  shoppingInProgress: boolean;
  readyForPickup: boolean;
  delivered: boolean;
}

interface OrderProperties {
  orderId: string;
  date: string;

  status: 'in progress' | 'successful' | 'failed';

  items: OrderItem[];

  subtotal: number;
  agentFee: number;
  deliveryFee: number;
  discount?: number;
  total: number;
  cancelReason?: string;

  payment: PaymentDetails;
  delivery: DeliveryDetails;

  timeline: OrderTimeline;

  market: string;
}


interface NotificationProps {
  id?: string;
  type: "promotion" | "order" | "profile";
  title: string;
  message: string;
  isRead: boolean;
}