import Image from "next/image";
import Link from "next/link";
import { MdFacebook } from "react-icons/md";
import { RiFacebookLine, RiInstagramLine, RiTwitterLine } from "react-icons/ri";

const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: <RiFacebookLine />
  },
  {
    name: "Instgram",
    url: "https://www.instgram.com",
    icon: <RiInstagramLine />
  },
  {
    name: "Twitter",
    url: "https://www.twitter.com",
    icon: <RiTwitterLine />
  },
]

const paymentMethods = [
  {
    name: "Visa",
    image: "/images/visa.svg",
  },
  {
    name: "Mastercard",
    image: "/images/mastercard.svg",
  },
  {
    name: "Payfast",
    image: "/images/payfast.svg",
  },
]

const Socials = () => {
  return (
    <div className="w-full">
      <h3 className="text-slate-200 font-medium text-2xl uppercase">
        Follow Us
      </h3>
      <div className="mt-2 flex gap-3">
        {socialLinks.map((link, i) => (
          <Link key={i} href={link.url}>
            <p className="sr-only">{link.name}</p>
            <span className="h-8 w-8 text-slate-300">{link.icon}</span>
          </Link>
        ))}
      </div>
      <h3 className="text-slate-200 font-medium mt-8 text-2xl uppercase">
        Payment Methods
      </h3>
      <div className="mt-2 flex items-center gap-3">
        {paymentMethods.map((link, i) => (
          <div key={i}>
            <p className="sr-only">{link.name}</p>
            <Image className="w-16 object-cover text-slate-300" width={76} height={20} src={link.image} alt={link.name}/>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Socials;
