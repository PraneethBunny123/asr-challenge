import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 h-14">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          VectorCam
        </Link>
        <UserAvatar />
      </div>
    </header>
  );
}