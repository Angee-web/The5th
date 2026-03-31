import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="text-center">
        <h1 className="font-serif text-8xl text-brand-gold mb-4">404</h1>
        <h2 className="font-serif text-2xl text-brand-black mb-3">Page Not Found</h2>
        <p className="text-brand-gray text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/shop" className="btn-outline">Shop Now</Link>
        </div>
      </div>
    </div>
  );
}
