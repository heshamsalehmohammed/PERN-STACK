export enum PermissionCombinationIdentifier {
  HAS_ANY = "HAS_ANY",
  HAS_ALL = "HAS_ALL",
  DOES_NOT_HAVE_ANY = "DOES_NOT_HAVE_ANY",
  DOES_NOT_HAVE_ALL = "DOES_NOT_HAVE_ALL",
}

export function checkCombination(
  userValues: string[],
  required: string[],
  mode: PermissionCombinationIdentifier
): boolean {
  if (!required.length) return true;

  switch (mode) {
    case PermissionCombinationIdentifier.HAS_ANY:
      return required.some((value) => userValues.includes(value));
    case PermissionCombinationIdentifier.HAS_ALL:
      return required.every((value) => userValues.includes(value));
    case PermissionCombinationIdentifier.DOES_NOT_HAVE_ANY:
      return required.some((value) => !userValues.includes(value));
    case PermissionCombinationIdentifier.DOES_NOT_HAVE_ALL:
      return required.every((value) => !userValues.includes(value));
    default:
      return false;
  }
}
