export const TODO_STATUSES: { value: TTodoStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-gray-500" },
];

export const PRIORITY_OPTIONS = [
  { value: 1, label: "Low", color: "text-slate-500" },
  { value: 2, label: "Medium", color: "text-yellow-500" },
  { value: 3, label: "High", color: "text-orange-500" },
  { value: 4, label: "Critical", color: "text-red-500" },
] as const;
