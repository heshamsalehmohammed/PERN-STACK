"use client";

/* eslint-disable react/no-children-prop */
import { useState, useTransition } from "react";
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
  SheetTrigger,
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

import { createUser } from "./user.actions";
import { Plus, Loader2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleAction } from "@/lib/ui/handle-action";
import { Checkbox } from "@/components/ui/checkbox";
import { ALL_PERMISSIONS, USER_ROLES } from "./user.const";


type TUserPermission = (typeof ALL_PERMISSIONS)[number]["value"]; 

const getAllPermissionValues = (): TUserPermission[] =>
  ALL_PERMISSIONS.map((p) => p.value);

const getNonDeletePermissionValues = (): TUserPermission[] =>
  ALL_PERMISSIONS.filter((p) => !p.value.includes("DELETE")).map(
    (p) => p.value
  );


const getInitialPermissions = (role: TUserRole): TUserPermission[] => {
  if (role === "master") {
    return [];
  }
  if (role === "admin") {
    return getAllPermissionValues();
  }
  if (role === "user") {
    return getNonDeletePermissionValues();
  }
  return [];
};

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password must be at most 50 characters."),
  role: z.enum(["master", "admin", "user"]),
  permissions: z.array(z.custom<TUserPermission>()).optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

const DEFAULT_ROLE: TUserRole = "user";

export function UserCreateSheet() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: DEFAULT_ROLE,
      permissions: getInitialPermissions(DEFAULT_ROLE), 
    } as UserFormValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const userData: IUserInsertDTO = {
        email: value.email,
        password: value.password,
        role: value.role,
        permissions:
          value.role !== "master" && value.permissions?.length
            ? value.permissions
            : undefined,
      };

      startTransition(async () => {
        await handleAction(() => createUser(userData), {
          successMessage: "User created successfully",
          onSuccess: () => {
            form.reset();
            router.refresh();
          },
        });
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

  return (
    <Sheet open={open} onOpenChange={(value) => !pending && setOpen(value)}>
      <SheetTrigger asChild>
        <Button size="sm" className="cursor-pointer">
          <Plus className="size-4" />
          New User
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl">Create New User</SheetTitle>
          <SheetDescription>
            Register a new system user and assign their role and permissions.
          </SheetDescription>
        </SheetHeader>
        <form
          id="create-user-form"
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
                        Password <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Secure password"
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
                      <FieldLabel>
                        Permissions{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </FieldLabel>

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
                                      ? [
                                          ...currentPermissions,
                                          permission.value,
                                        ]
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
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={pending}
            className="flex-1 cursor-pointer"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button
            type="submit"
            form="create-user-form"
            disabled={pending}
            className="flex-1 cursor-pointer"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create User
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
