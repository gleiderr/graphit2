import { graphit, Baasa } from "./1 Rs 15.33";
import { Markdown } from "./Markdown";

graphit.salvar("Bíblia.json");

const markdown = new Markdown(graphit);
console.log("----------------------------------");
markdown.imprimir(Baasa);
