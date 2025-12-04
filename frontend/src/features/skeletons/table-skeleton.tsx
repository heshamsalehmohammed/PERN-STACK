"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";


export default function TableSkeleton() {


  return (
    <div className={"p-6 "}>
      <div className="mb-4 text-sm">
        <Skeleton className="h-4 w-48 mb-2" />
      </div>
      <div>
        <table className="min-w-full">
          <thead>
            <tr>
              {Array.from({ length: 7 }).map((_, idx) => (
                <th key={idx} className="px-4 py-2">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 15 rows as in the image */}
            {Array.from({ length: 12 }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {/* 7 columns as in the image */}
                {Array.from({ length: 7 }).map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination skeleton */}
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center space-x-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-8 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
}
