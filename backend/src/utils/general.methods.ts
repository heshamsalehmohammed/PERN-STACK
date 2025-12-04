// Purpose: General utility methods.

class GeneralMethods {
  public static normalizeUrlExtraSlashes(input: string): string {
    if (!/^https?:\/\//i.test(input)) {
      input = 'http://' + input;
    }
    const url = new URL(input);

    // Remove double or more slashes in the path
    url.pathname = url.pathname.replace(/\/{2,}/g, '/');

    return url.href;
  }
}

export default GeneralMethods;
