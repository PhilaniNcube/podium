import Link from "next/link";

const Banner = () => {
  return (
    <header className="py-2 bg-slate-600 text-white px-4 lg:px-0 shadow-lg">
    <div className="max-w-7xl mx-auto flex justify-between">
      <p>Do you have some 2nd hand items to sell?</p>
      <Link href="/register">Register</Link>
    </div>
    </header>
  );
};
export default Banner;
