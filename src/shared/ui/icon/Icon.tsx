import type { IconProps } from "./types";
import { ActivityIcon } from "./icons/ActivityIcon";
import { BanknoteIcon } from "./icons/BanknoteIcon";
import { CheckIcon } from "./icons/CheckIcon";
import { CloseIcon } from "./icons/CloseIcon";
import { CreditCardIcon } from "./icons/CreditCardIcon";
import { DollarSignIcon } from "./icons/DollarSignIcon";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";
import { FileTextIcon } from "./icons/FileTextIcon";
import { HeartIcon } from "./icons/HeartIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { LayoutIcon } from "./icons/LayoutIcon";
import { MailIcon } from "./icons/MailIcon";
import { MapPinIcon } from "./icons/MapPinIcon";
import { MessageCircleIcon } from "./icons/MessageCircleIcon";
import { PackageIcon } from "./icons/PackageIcon";
import { PhoneIcon } from "./icons/PhoneIcon";
import { SendIcon } from "./icons/SendIcon";
import { StarIcon } from "./icons/StarIcon";
import { UsersIcon } from "./icons/UsersIcon";

const iconRegistry = {
  Activity: ActivityIcon,
  Banknote: BanknoteIcon,
  Check: CheckIcon,
  Close: CloseIcon,
  CreditCard: CreditCardIcon,
  DollarSign: DollarSignIcon,
  ExternalLink: ExternalLinkIcon,
  FileText: FileTextIcon,
  Heart: HeartIcon,
  Home: HomeIcon,
  Layout: LayoutIcon,
  Mail: MailIcon,
  MapPin: MapPinIcon,
  MessageCircle: MessageCircleIcon,
  Package: PackageIcon,
  Phone: PhoneIcon,
  Send: SendIcon,
  Star: StarIcon,
  Users: UsersIcon,
} as const;

export type IconName = keyof typeof iconRegistry;

interface IconComponentProps extends IconProps {
  name: IconName;
}

export function Icon({ name, ...props }: IconComponentProps) {
  const IconComponent = iconRegistry[name];
  return <IconComponent {...props} />;
}
