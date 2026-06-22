import type { AvaCommand } from "./types";

type CommandWindow = {
  open: () => void;
};

export function createCommandWindow(
  commands: readonly AvaCommand[],
): CommandWindow {
  let filteredCommands = [...commands];
  let selectedIndex = 0;

  const host = document.createElement("div");
  host.id = "avas-command-window";

  const style = document.createElement("style");
  style.textContent = `
    #avas-command-window dialog {
      width: min(640px, calc(100vw - 32px));
      max-height: min(620px, calc(100vh - 32px));
      margin: 12vh auto auto;
      padding: 0;
      overflow: hidden;
      color: var(--mint-color-content-primary);
      background: var(--mint-color-container-primary);
      border: 0;
      border-radius: 10px;
      box-shadow: 0 0 20px var(--color-shadow-overlay), 0 0 5px var(--color-shadow-overlay);
    }

    #avas-command-window dialog::backdrop {
      background: rgb(0 0 0 / 35%);
    }

    #avas-command-window h1,
    #avas-command-window label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }

    #avas-command-window .search-row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 60px;
      padding: 0 16px;
      background: var(--mint-color-container-primary);
      border-bottom: 1px solid var(--mint-color-stroke-primary);
    }

    #avas-command-window input {
      min-width: 0;
      flex: 1;
      padding: 0;
      color: inherit;
      background: transparent;
      border: 0;
      outline: none;
      font: inherit;
      font-size: 16px;
      font-weight: 600;
    }

    #avas-command-window input::placeholder {
      color: var(--mint-color-content-secondary);
    }

    #avas-command-window [role="listbox"] {
      height: min(320px, calc(100vh - 170px));
      max-height: min(320px, calc(100vh - 170px));
      overflow-y: auto;
    }

    #avas-command-window [role="option"] {
      display: flex;
      align-items: center;
      gap: 16px;
      min-height: 44px;
      padding: 6px 16px;
      color: var(--mint-color-content-primary);
      cursor: default;
      user-select: none;
    }

    #avas-command-window [role="option"][aria-selected="true"] {
      background: var(--mint-color-container-primary-hover);
      box-shadow: inset 3px 0 var(--color-selectable-emphasize);
    }

    #avas-command-window .command-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    #avas-command-window .command-title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
    }

    #avas-command-window .command-subtitle {
      overflow: hidden;
      color: var(--mint-color-content-secondary);
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }

    #avas-command-window .empty {
      padding: 16px;
      color: var(--mint-color-content-secondary);
    }

  `;

  const dialog = document.createElement("dialog");
  dialog.setAttribute("aria-labelledby", "avas-command-window-title");

  const title = document.createElement("h1");
  title.id = "avas-command-window-title";
  title.textContent = "Run command";

  const label = document.createElement("label");
  label.htmlFor = "avas-command-window-query";
  label.textContent = "Search commands";

  const searchRow = document.createElement("div");
  searchRow.className = "search-row";

  const input = document.createElement("input");
  input.id = "avas-command-window-query";
  input.type = "text";
  input.autocomplete = "off";
  input.placeholder = "Kör snabbkommando...";
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-controls", "avas-command-window-command-list");
  input.setAttribute("role", "combobox");

  const list = document.createElement("div");
  list.id = "avas-command-window-command-list";
  list.setAttribute("role", "listbox");

  searchRow.append(input);
  dialog.append(title, label, searchRow, list);
  host.append(style, dialog);
  (document.body ?? document.documentElement).append(host);
  renderCommands();

  input.addEventListener("input", () => {
    filteredCommands = getMatchingCommands(input.value);
    selectedIndex = 0;
    renderCommands();
  });

  input.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveSelection(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveSelection(-1);
        break;
      case "Enter":
        event.preventDefault();
        runSelectedCommand();
        break;
    }
  });

  function renderCommands() {
    list.replaceChildren();

    if (filteredCommands.length === 0) {
      const emptyItem = document.createElement("div");
      emptyItem.className = "empty";
      emptyItem.textContent =
        commands.length === 0
          ? "Inga kommandon registrerade"
          : "Inga matchande kommandon";
      list.append(emptyItem);
      input.removeAttribute("aria-activedescendant");
      return;
    }

    for (const [index, command] of filteredCommands.entries()) {
      const item = document.createElement("div");
      const itemId = `avas-command-window-command-${index}`;
      item.id = itemId;
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", String(index === selectedIndex));

      const title = document.createElement("span");
      title.className = "command-title";
      title.textContent = command.title;

      const content = document.createElement("span");
      content.className = "command-content";
      content.append(title);

      if (command.subtitle) {
        const subtitle = document.createElement("span");
        subtitle.className = "command-subtitle";
        subtitle.textContent = command.subtitle;
        content.append(subtitle);
      }

      item.append(content);
      list.append(item);

      if (index === selectedIndex) {
        input.setAttribute("aria-activedescendant", itemId);
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }

  function getMatchingCommands(query: string) {
    const terms = normalizeSearchText(query)
      .replace(/^>\s*/, "")
      .split(/\s+/)
      .filter(Boolean);

    if (terms.length === 0) {
      return [...commands];
    }

    return commands.filter((command) => {
      const searchableText = normalizeSearchText(command.title);

      return terms.every((term) => searchableText.includes(term));
    });
  }

  function moveSelection(offset: number) {
    if (filteredCommands.length === 0) {
      return;
    }

    selectedIndex =
      (selectedIndex + offset + filteredCommands.length) %
      filteredCommands.length;
    renderCommands();
  }

  function runSelectedCommand() {
    const command = filteredCommands[selectedIndex];

    if (!command) {
      return;
    }

    dialog.close();
    command.run();
  }

  return {
    open() {
      if (dialog.open) {
        input.focus();
        return;
      }

      input.value = "";
      filteredCommands = [...commands];
      selectedIndex = 0;
      renderCommands();

      dialog.showModal();
      input.focus();
    },
  };
}

function normalizeSearchText(text: string) {
  return text
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
