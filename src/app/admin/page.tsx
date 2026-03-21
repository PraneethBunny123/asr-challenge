import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex flex-col">
      Admin Page
      <Link href="/dashboard">
        Back to Dashboard
      </Link>
    </div>
  )
}
