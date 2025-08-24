import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`absolute left-5 top-6 z-10 flex ${className}`}>
      <Link href="/">
        <h1 className="text-xl font-semibold hover:cursor-pointer">Acme</h1>
      </Link>
    </div>
  );
}
