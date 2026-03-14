"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"
import { useRecords } from "../hooks/useRecords"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteDialogIconProps {
  name: string,
  id: string
}

export function DeleteDialogIcon({name, id} : DeleteDialogIconProps) {
  const {deleteRecord} = useRecords()
  const [deleting, setDeleting] = useState<boolean>(false)

  const handleDelete = async () => {
    setDeleting(true) 
    try {
      await deleteRecord(id)
      toast.success(`Record: ${name} deleted successfully`)
    } catch (err) {
      toast.error("Failed to delete record. Please try again")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="hover:bg-red-500 hover:text-white"
          disabled={deleting}  
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete this speciman record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>{deleting ? "Deleting..." : "Delete"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
