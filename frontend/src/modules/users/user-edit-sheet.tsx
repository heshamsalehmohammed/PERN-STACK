"use client";

/* eslint-disable react/no-children-prop */
import { Suspense, use, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { updateUser } from "./user.actions";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import FormSkeleton from "@/features/skeletons/form-skeleton";
import { handleAction } from "@/lib/ui/handle-action";
import { Checkbox } from "@/components/ui/checkbox";
import { ALL_PERMISSIONS, USER_ROLES } from "./user.const";

type TUserPermission = (typeof ALL_PERMISSIONS)[number]["value"];
type TUserRole = (typeof USER_ROLES)[number]["value"];

const getAllPermissionValues = (): TUserPermission[] =>
  ALL_PERMISSIONS.map((p) => p.value);

const getNonDeletePermissionValues = (): TUserPermission[] =>
  ALL_PERMISSIONS.filter((p) => !p.value.includes("DELETE")).map(
    (p) => p.value
  );

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .max(50, "Password must be at most 50 characters.")
    .optional(),
  role: z.enum(["master", "admin", "user"]),
  permissions: z.array(z.custom<TUserPermission>()).optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserEditFormProps {
  userPromise: Promise<IDataResponse<IUser>>;
  onSuccess: () => void;
  onPendingChange: (pending: boolean) => void;
}

function UserEditForm({
  userPromise,
  onSuccess,
  onPendingChange,
}: UserEditFormProps) {
  const result = use(userPromise);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const user = result.data;

  const initialValues: UserFormValues = {
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? "user",
    permissions: user?.permissions ?? [],
  };

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!user) return;

      const userData: Partial<IUserInsertDTO> = {
        email: value.email,
        role: value.role,
        permissions:
          value.role !== "master" && value.permissions?.length
            ? value.permissions
            : undefined,
        ...(value.password && { password: value.password }),
      };

      onPendingChange(true);
      startTransition(async () => {
        await handleAction(() => updateUser(user.user_id, userData), {
          successMessage: "User updated successfully",
          onSuccess: () => {
            onSuccess();
            router.refresh();
          },
        });
        onPendingChange(false);
      });
    },
  });

  const handleRoleChange = (newRole: TUserRole) => {
    form.setFieldValue("role", newRole);

    let newPermissions: TUserPermission[] = [];

    switch (newRole) {
      case "master":
        newPermissions = [];
        break;

      case "admin":
        newPermissions = getAllPermissionValues();
        break;

      case "user":
        newPermissions = getNonDeletePermissionValues();
        break;

      default:
        newPermissions = [];
        break;
    }

    form.setFieldValue("permissions", newPermissions);
  };

  if (!result.success || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <p>Failed to load user data</p>
        <p className="text-sm">{result.message}</p>
      </div>
    );
  }

  return (
    <>
      <form
        id="edit-user-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex-1 overflow-y-auto px-4 py-2"
      >
        <fieldset disabled={pending} className="disabled:opacity-50">
          <FieldGroup className="gap-5">
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Email <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="user@example.com"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Password{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional, leave blank to keep current)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="role"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Role <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={handleRoleChange}
                      disabled={pending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="permissions"
              children={(field) => {
                const currentPermissions = field.state.value || [];
                const isMaster = form.getFieldValue("role") === "master";

                return (
                  <Field>
                    <FieldLabel>Permissions</FieldLabel>

                    {isMaster ? (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                        Master users are granted all permissions automatically
                        by the system.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        {ALL_PERMISSIONS.map((permission) => (
                          <div
                            key={permission.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={permission.value}
                              checked={currentPermissions.includes(
                                permission.value
                              )}
                              onCheckedChange={(checked) => {
                                field.handleChange(
                                  checked
                                    ? [...currentPermissions, permission.value]
                                    : currentPermissions.filter(
                                        (p) => p !== permission.value
                                      )
                                );
                              }}
                            />
                            <label
                              htmlFor={permission.value}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </fieldset>
      </form>
      <SheetFooter className="px-4 pt-4 border-t gap-3">
        <Button
          type="submit"
          form="edit-user-form"
          disabled={pending}
          className="flex-1 cursor-pointer"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Changes
            </>
          )}
        </Button>
      </SheetFooter>
    </>
  );
}

interface UserEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userPromise: Promise<IDataResponse<IUser>> | null;
}

export function UserEditSheet({
  open,
  onOpenChange,
  userPromise,
}: UserEditSheetProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => !isPending && onOpenChange(value)}
    >
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl">Edit User</SheetTitle>
          <SheetDescription>
            Update the credentials, role, and permissions for the user.
          </SheetDescription>
        </SheetHeader>
        {userPromise && (
          <Suspense fallback={<FormSkeleton />}>
            <UserEditForm
              userPromise={userPromise}
              onSuccess={() => onOpenChange(false)}
              onPendingChange={setIsPending}
            />
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}
