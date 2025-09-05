// Utility for accessibility helpers
export function focusFirstError() {
  const error = document.querySelector('[role="alert"]');
  if (error) {
    (error as HTMLElement).focus();
  }
}
