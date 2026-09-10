"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Truck, Bot } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shipments", label: "Shipments", icon: Package },
  { href: "/carriers", label: "Carriers", icon: Truck },
  { href: "/chat", label: "AI Copilot", icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "#101B2D",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ padding: "0 12px", marginBottom: 32 }}>
        <div
          style={{
            color: "#fff",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: -0.2,
          }}
        >
          LogiPilot
        </div>
        <div
          style={{
            color: "#F0A345",
            fontSize: 11,
            fontWeight: 500,
            marginTop: 2,
          }}
        >
          Freight Ops
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#fff" : "#94A3B8",
                background: isActive ? "rgba(240,163,69,0.1)" : "transparent",
                borderLeft: isActive
                  ? "2px solid #F0A345"
                  : "2px solid transparent",
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
