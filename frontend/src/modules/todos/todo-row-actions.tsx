// src/features/todos/todo-row-actions.tsx

"use client";

import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { deleteTodo, getTodoById } from "./todo.actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TodoEditSheet } from "./todo-edit-sheet";
import FullScreenLoader from "@/features/dialogs/loading-dialog";
import { handleAction } from "@/lib/ui/handle-action";
// Import the necessary components and constants
import { AuthorizationGateClient } from "@/modules/auth/auth-gates-client";
import {
  PermissionCombinationIdentifier,
  UserPermissions,
  UserRoles,
} from "@/modules/auth/permission-helpers";

interface TodoRowActionsProps {
  row: Row<ITodo>;
}

export function TodoRowActions({ row }: TodoRowActionsProps) {
  const rowData = row.original;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [todoPromise, setTodoPromise] = useState<Promise<
    IDataResponse<ITodo>
  > | null>(null);

  function onDelete() {
    startTransition(async () => {
      await handleAction(() => deleteTodo(rowData.todo_id), {
        successMessage: "Todo deleted successfully",
        onSuccess: () => {
          router.refresh();
        },
      });
    });
  }

  function onEditClick() {
    const promise = getTodoById(rowData.todo_id);
    setTodoPromise(promise);
    setShowEditSheet(true);
  }

  return (
    <AuthorizationGateClient
      roles={[UserRoles.MASTER]}
      permissions={[
        UserPermissions.CAN_DELETE_TODO,
        UserPermissions.CAN_EDIT_TODO,
      ]}
      permissionsAllowIf={PermissionCombinationIdentifier.HAS_ANY}
    >
      <>
        <FullScreenLoader isLoading={isPending} headerText="Deleting todo..." />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <EllipsisIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuGroup>
              <AuthorizationGateClient
                roles={[UserRoles.MASTER]}
                permissions={[UserPermissions.CAN_EDIT_TODO]}
              >
                <DropdownMenuItem onSelect={onEditClick}>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </AuthorizationGateClient>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <AuthorizationGateClient
                roles={[UserRoles.MASTER]}
                permissions={[UserPermissions.CAN_DELETE_TODO]}
              >
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => setShowDeleteDialog(true)}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              </AuthorizationGateClient>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <TodoEditSheet
          open={showEditSheet}
          onOpenChange={setShowEditSheet}
          todoPromise={todoPromise}
        />
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You&apos;re about to delete &quot;{rowData.title}&quot;. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                disabled={isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    </AuthorizationGateClient>
  );
}
