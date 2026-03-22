import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-slate-200 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-40">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          DataSpec Pro
        </Link>
        <UserAvatar />
      </div>
    </header>
  );
}