import Image from "next/image";
import logo from "../../public/brand/logo.png";

type Props = { size?: number; className?: string; preload?: boolean; alt?: string };

export function Logo({ size = 40, className = "", preload = false, alt = "" }: Props) {
  return <Image src={logo} width={size} height={size} alt={alt} preload={preload} className={className} />;
}
