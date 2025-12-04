"use server";

// placeholder for resource access level retrieval logic
export async function getResourceAccessLevel(): Promise<IDataResponse<number>> {
  // intentional delay for development testing
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
  }

  return {
    success: true,
    message: "Resource access level retrieved successfully",
    data: 1, // example access level
  };
}
