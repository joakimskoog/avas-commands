/**
 * Avanza is a single-page application (SPA), which means that navigation between different views is handled client-side without full page reloads.
 * That's why we need this helper instead of doing `window.location.href = path` or similar.
 * @param path The path to navigate to.
 *
 * @returns void
 */
export function navigateTo(path: string) {
  const url = new URL(path, location.origin);
  if (url.href === location.href) {
    return;
  }

  history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
}
