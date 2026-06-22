import { navigateTo } from "./navigate";

export type AvaCommand = {
  title: string;
  subtitle?: string;
  run: () => void;
};

export const commands: readonly AvaCommand[] = [
  {
    title: "Sök",
    subtitle: "Öppna sökfältet",
    run: clickAzaSearchLink,
  },
  {
    title: "Hem",
    subtitle: "Gå till /hem/hem.html",
    run: () => {
      navigateTo("/hem/hem.html");
    },
  },
  {
    title: "Översikt",
    subtitle: "Gå till /min-ekonomi/oversikt.html",
    run: () => {
      navigateTo("/min-ekonomi/oversikt.html");
    },
  },
  {
    title: "Innehav",
    subtitle: "Gå till /min-ekonomi/innehav.html",
    run: () => {
      navigateTo("/min-ekonomi/innehav.html");
    },
  },
  {
    title: "Ordrar",
    subtitle: "Gå till /min-ekonomi/ordrar.html",
    run: () => {
      navigateTo("/min-ekonomi/ordrar.html");
    },
  },
  {
    title: "Transaktioner",
    subtitle: "Gå till /min-ekonomi/transaktioner.html",
    run: () => {
      navigateTo("/min-ekonomi/transaktioner.html");
    },
  },
  {
    title: "Analys",
    subtitle: "Gå till /min-ekonomi/analys.html",
    run: () => {
      navigateTo("/min-ekonomi/analys.html");
    },
  },
  {
    title: "Kalender",
    subtitle: "Gå till /min-ekonomi/kalender.html",
    run: () => {
      navigateTo("/min-ekonomi/kalender.html");
    },
  },
];

function clickAzaSearchLink() {
  const searchButton = document.querySelector("aza-search-link button");

  if (
    !searchButton ||
    !("click" in searchButton) ||
    typeof searchButton.click !== "function"
  ) {
    console.warn("Ava's Commands could not find <aza-search-link> button.");
    return;
  }

  searchButton.click();
}
