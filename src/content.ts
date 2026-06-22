import { createCommandWindow } from "./command-window";
import { commands } from "./commands";

const commandWindow = createCommandWindow(commands);

window.addEventListener(
  "keydown",
  (event) => {
    if (isOpenCommandWindowShortcut(event)) {
      event.preventDefault();
      event.stopPropagation();
      commandWindow.open();
    }
  },
  { capture: true },
);

function isOpenCommandWindowShortcut(event: KeyboardEvent) {
  return (
    event.ctrlKey &&
    !event.altKey &&
    !event.metaKey &&
    event.key.toLowerCase() === " "
  );
}

console.info("Ava's Commands loaded:", commands);
