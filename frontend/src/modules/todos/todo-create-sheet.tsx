"use client";

/* eslint-disable react/no-children-prop */
import * as React from "react";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { createTodo } from "./todo.actions";
import { TODO_STATUSES, PRIORITY_OPTIONS } from "./todo.const";
import { toast } from "sonner";
import { Plus, Loader2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title must be at most 100 characters."),
  description: z.string(),
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]),
  priority: z
    .number()
    .min(1, "Priority must be at least 1")
    .max(4, "Priority must be at most 4"),
  due_date: z.string(),
});

export function TodoCreateSheet() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "pending" as TTodoStatus,
      priority: 1,
      due_date: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const todoData: ITodoInsertDTO = {
        title: value.title,
        description: value.description || undefined,
        status: value.status,
        priority: value.priority,
        due_date: value.due_date ? new Date(value.due_date) : undefined,
      };

      startTransition(async () => {
        const result = await createTodo(todoData);

        if (result.success) {
          toast.success("Todo created successfully");
        //   setOpen(false);
          form.reset();
          router.refresh();
        } else {
          toast.error(result.message || "Failed to create todo");
        }
      });
    },
  });

  return (
    <Sheet open={open} onOpenChange={(value) => !pending && setOpen(value)}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          New Todo
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl">Create New Todo</SheetTitle>
          <SheetDescription>
            Add a new task to your todo list. Fill in the details below.
          </SheetDescription>
        </SheetHeader>
        <form
          id="create-todo-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex-1 overflow-y-auto px-4 py-2"
        >
          <fieldset disabled={pending} className="disabled:opacity-50">
          <FieldGroup className="gap-5">
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Title <span className="text-destructive">*</span>
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
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Description{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
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
                name="status"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value: TTodoStatus) =>
                          field.handleChange(value)
                        }
                        disabled={pending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {TODO_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "size-2 rounded-full",
                                    status.color
                                  )}
                                />
                                {status.label}
                              </div>
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
                name="priority"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                      <Select
                        value={String(field.state.value)}
                        onValueChange={(value) =>
                          field.handleChange(parseInt(value))
                        }
                        disabled={pending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={String(priority.value)}
                            >
                              <span
                                className={cn("font-medium", priority.color)}
                              >
                                {priority.label}
                              </span>
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
            </div>

            <form.Field
              name="due_date"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Due Date{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className="w-full"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
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
            className="flex-1"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button
            type="submit"
            form="create-todo-form"
            disabled={pending}
            className="flex-1"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create Todo
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
