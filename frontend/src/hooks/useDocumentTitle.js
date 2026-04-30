import { useEffect } from "react";

const DEFAULT_TITLE = "TechHub";

/**
 * Sets document.title for the current view. Pass a short page name; "| TechHub" is appended.
 */
export function useDocumentTitle(pageTitle) {
  useEffect(() => {
    if (!pageTitle || pageTitle === DEFAULT_TITLE) {
      document.title = DEFAULT_TITLE;
      return;
    }
    document.title = `${pageTitle} | ${DEFAULT_TITLE}`;
  }, [pageTitle]);
}
