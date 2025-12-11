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
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import FormSkeleton from "@/features/skeletons/form-skeleton";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  user_name: z
    .string()
    .min(1, "user name is required")
    .max(255, "user name must be less than 255 characters"),
  email: z.email(),
  is_admin: z.boolean().optional().default(false),
  password: z.string().min(4, "password need to be more than 4").max(10),
});

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

  const form = useForm({
    defaultValues: {
      user_name: user?.user_name ?? "",
      email: user?.email ?? "",
      is_admin: user?.is_admin ?? false,
      password: user?.password ?? "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!user) return;

      const userData: Partial<IUserUpdateDTO> = {
        user_name: value.user_name,
        email: value.email,
        is_admin: value.is_admin,
        password: value.password,
      };

      onPendingChange(true);
      startTransition(async () => {
        const updateResult = await updateUser(user.user_id, userData);

        onPendingChange(false);
        if (updateResult.success) {
          toast.success("User updated successfully");
          onSuccess();
          router.refresh();
        } else {
          toast.error(updateResult.message || "Failed to update user");
        }
      });
    },
  });

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
              name="user_name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      User Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="What needs to be done?"
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
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Add some details..."
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="is_admin"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Role</FieldLabel>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.state.value}
                          onCheckedChange={(value: boolean) =>
                            field.handleChange(value)
                          }
                          disabled={pending}
                        />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Set As Admin
                        </label>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
            <div className="grid gap-4">
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
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Add some details..."
                        autoComplete="off"
                        type="password"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </FieldGroup>
        </fieldset>
      </form>
      <SheetFooter className="px-4 pt-4 border-t gap-3">
        <Button
          type="submit"
          form="edit-user-form"
          disabled={pending}
          className="flex-1"
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
            Update the details of your user item.
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
