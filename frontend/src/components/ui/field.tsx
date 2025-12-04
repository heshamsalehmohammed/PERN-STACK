"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

function Field({ className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <div
      data-slot="field"
      className={cn(
        "flex gap-2",
        orientation === "horizontal" ? "flex-row items-center" : "flex-col",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  errors?: unknown[]
}

function FieldError({ className, errors, ...props }: FieldErrorProps) {
  if (!errors || errors.length === 0) return null

  const errorMessages = errors
    .map((error) => {
      if (typeof error === "string") return error
      if (error && typeof error === "object" && "message" in error) {
        return (error as { message?: string }).message
      }
      return null
    })
    .filter(Boolean)

  if (errorMessages.length === 0) return null

  return (
    <p
      data-slot="field-error"
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {errorMessages[0]}
    </p>
  )
}

export { Field, FieldGroup, FieldLabel, FieldDescription, FieldError }
