/**
 * Todo Module Constants
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TODO_STATUS = ['pending', 'in-progress', 'completed', 'cancelled'] as const;

export type TTodoStatus = (typeof TODO_STATUS)[number];
