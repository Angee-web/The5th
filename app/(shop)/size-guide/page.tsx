import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Size Guide | 5thJohnson",
  description: "Find your perfect fit with the 5thJohnson size guide.",
};

const measurements = [
  { size: "XS", bust: "80–83", waist: "62–65", hips: "87–90", uk: "6", us: "2" },
  { size: "S", bust: "84–87", waist: "66–69", hips: "91–94", uk: "8", us: "4" },
  { size: "M", bust: "88–91", waist: "70–73", hips: "95–98", uk: "10", us: "6" },
  { size: "L", bust: "92–96", waist: "74–78", hips: "99–103", uk: "12", us: "8" },
  { size: "XL", bust: "97–102", waist: "79–84", hips: "104–109", uk: "14", us: "10" },
  { size: "XXL", bust: "103–109", waist: "85–91", hips: "110–116", uk: "16", us: "12" },
];

export default function SizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="section-subtitle">Fit Guide</p>
        <h1 className="section-title text-4xl">Size Guide</h1>
        <p className="text-brand-gray mt-4 text-sm max-w-xl mx-auto">
          All measurements are in centimetres. If you're between sizes, we recommend sizing up for a comfortable fit.
        </p>
      </div>

      {/* How to measure */}
      <div className="bg-brand-cream p-6 mb-10">
        <h2 className="font-serif text-xl mb-4">How To Measure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-brand-gray">
          <div>
            <p className="font-medium text-brand-black mb-1">Bust</p>
            <p>Measure around the fullest part of your chest, keeping the tape parallel to the ground.</p>
          </div>
          <div>
            <p className="font-medium text-brand-black mb-1">Waist</p>
            <p>Measure around your natural waistline — the narrowest part of your torso.</p>
          </div>
          <div>
            <p className="font-medium text-brand-black mb-1">Hips</p>
            <p>Measure around the fullest part of your hips, about 20cm below your waistline.</p>
          </div>
        </div>
      </div>

      {/* Size table */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-brand-black text-white">
              <th className="px-4 py-3 font-medium tracking-widest uppercase text-xs">Size</th>
              <th className="px-4 py-3 font-medium tracking-widest uppercase text-xs">Bust (cm)</th>
              <th className="px-4 py-3 font-medium tracking-widest uppercase text-xs">Waist (cm)</th>
              <th className="px-4 py-3 font-medium tracking-widest uppercase text-xs">Hips (cm)</th>
              <th className="px-4 py-3 font-medium tracking-widest uppercase text-xs">UK</th>
              <th className="px-4 py-3 font-medium tracking-widest uppercase text-xs">US</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((row, i) => (
              <tr key={row.size} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream"}>
                <td className="px-4 py-3 font-serif font-semibold">{row.size}</td>
                <td className="px-4 py-3 text-brand-gray">{row.bust}</td>
                <td className="px-4 py-3 text-brand-gray">{row.waist}</td>
                <td className="px-4 py-3 text-brand-gray">{row.hips}</td>
                <td className="px-4 py-3 text-brand-gray">{row.uk}</td>
                <td className="px-4 py-3 text-brand-gray">{row.us}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-brand-cream p-6 text-sm text-brand-gray">
        <p className="font-medium text-brand-black mb-2">Still unsure?</p>
        <p>Contact us on <Link href="/contact" className="underline hover:text-brand-black">WhatsApp or email</Link> and we'll help you find your perfect size before you order.</p>
      </div>
    </div>
  );
}
