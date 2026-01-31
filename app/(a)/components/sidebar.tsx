import Link from "next/link";

const nav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Customers", href: "/customers" },
  { label: "Settings", href: "/settings" },

];

export default function Sidebar() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <p className="text-lg font-semibold">Bizflow Lite</p>
      </div>

      <nav className="space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
