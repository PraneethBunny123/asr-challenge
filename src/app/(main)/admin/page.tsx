"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/app/(main)/dashboard/hooks/useRole";
import { useRouter } from "next/navigation";
import { AppRole, UserRow } from "@/app/(main)/dashboard/types";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const roleBadgeVariant: Record<
  AppRole,
  "secondary" | "default" | "destructive"
> = {
  viewer: "secondary",
  reviewer: "default",
  admin: "destructive",
};

export default function AdminPage() {
  const router = useRouter();

  const { isPending } = useSession();
  const { isAdmin } = useRole();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)

  useEffect(() => {
    if (isPending) return;

    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }

    async function fetchUsers() {
      setLoading(true);
      try {
        const { data, error } = await authClient.admin.listUsers({
          query: {
            limit: 20,
          },
        });

        if (!data || error) {
          toast.error("Failed to load users");
          return;
        }

        const fetchedUsers = data.users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as AppRole,
          createdAt: user.createdAt,
        }));

        setUsers(fetchedUsers);
      } catch (err) {
        toast.error("Something went wrong loading users");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [isAdmin, router, isPending]);

  async function handleRoleChange(userId: string, newRole: AppRole) {
    // role change logic
    setUpdatingRole(userId)
    const {error} = await authClient.admin.setRole({
      userId,
      role: newRole
    })

    if(error) {
      toast.error(error.message || "Failed to update role")
    } else {
      setUsers((prevUser) => prevUser.map((u) => u.id === userId ? {...u, role: newRole} : u))
      toast.success("Updated role successfully")
    }
    setUpdatingRole(null)
  }

  if (isPending) return null;
  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboard")}
        className="gap-1 text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage roles for all registered users. Changes take effect on their
          next sign-in.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading users...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-36">Current role</TableHead>
                <TableHead className="w-48">Change role</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="w-36">
                    <Badge variant={roleBadgeVariant[user.role]}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-48">
                    <Select 
                      defaultValue={user.role}
                      onValueChange={(v) => handleRoleChange(user.id, v as AppRole)}
                      disabled={updatingRole === user.id}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="viewer">viewer</SelectItem>
                          <SelectItem value="reviewer">reviewer</SelectItem>
                          <SelectItem value="admin">admin</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
