import Link from "next/link";
import Socials from "./Socials";

const links = [
  {
    heading: "Podium Push",
    links: [
      { name: "About Us", link: "/about_us" },
      { name: "Contact Us", link: "/contact_us" },
      { name: "Delivery", link: "/delivery" },
      { name: "Privacy Policy", link: "/privacy_policy" },
      { name: "Terms & Conditions", link: "/terms_and_conditions" },
    ],
  },
  {
    heading: "Help & Support",
    links: [
      { name: "Warranty", link: "/warranty" },
      { name: "Payment Methods", link: "/payment_methods" },
      { name: "Refunds", link: "/refunds" },
      { name: "Returns", link: "/returns" },
    ],
  },
];

const date = new Date();
const year = date.getFullYear();

const Links = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {links.map((linkGroup, i) => (
          <div key={i} className="w-full text-slate-200">
            <h3 className="font-medium uppercase text-2xl">
              {linkGroup.heading}
            </h3>
            <div className="w-full mt-2 flex flex-col gap-2">
              {linkGroup.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.link}
                  className="text-slate-300 text-md"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Socials />
      </div>
      <div className="w-full border-t border-slate-400  flex justify-between mt-6">
        <p className="text-sm text-slate-100 py-2">
          Copyright &copy;{" "}
          <Link
            href="https://athenamedia.co.za"
            className="text-sm text-slate-100"
          >
            Athena Media {year}
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Links;
