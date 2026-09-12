/* =========================================================================
   DOMÍNIO — troca o endereço do site em todos os lugares de uma vez
   -------------------------------------------------------------------------
   Uso:  node set-domain.js https://vitucezario.github.io

   O endereço do site aparece no canonical, no og:url, no og:image e nas três
   tags hreflang. Errar um deles não quebra nada visualmente — só faz o link
   compartilhado no LinkedIn aparecer sem imagem, e o Google tratar as versões
   em português, inglês e espanhol como conteúdo duplicado.

   Por isso existe este script: um comando, todos os lugares, os três idiomas.
   Ele mexe apenas no index.html e depois roda o translate.js, que propaga.
   ========================================================================= */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const ATUAL = "https://SEU-DOMINIO.com.br";

let novo = process.argv[2];

if (!novo) {
  const atual = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const achado = (atual.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  console.log("Uso:  node set-domain.js <endereco-do-site>\n");
  console.log("Exemplos:");
  console.log("  node set-domain.js https://vitucezario.github.io");
  console.log("  node set-domain.js https://vitormedeiros.com.br\n");
  console.log("Endereco configurado agora: " + (achado || "nenhum"));
  process.exit(1);
}

/* Normaliza: sem barra no fim, sempre com https */
novo = novo.trim().replace(/\/+$/, "");
if (!/^https?:\/\//.test(novo)) novo = "https://" + novo;

const alvo = path.join(root, "index.html");
let html = fs.readFileSync(alvo, "utf8");

/* Pega tanto o placeholder original quanto um dominio ja configurado antes,
   para o script poder ser rodado de novo se voce mudar de endereco. */
const anterior = (html.match(/<link rel="canonical" href="(https?:\/\/[^"/]+)/) || [])[1] || ATUAL;

const antes = (html.match(new RegExp(anterior.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
if (!antes) {
  console.error("Nenhuma ocorrencia de " + anterior + " encontrada no index.html.");
  process.exit(1);
}

html = html.split(anterior).join(novo);

/* O comentario de aviso perde a razao de existir quando o dominio esta certo */
html = html.replace(
  /<!-- ================= ANTES DE PUBLICAR =================[\s\S]*?===================================================== -->\n/,
  ""
);

fs.writeFileSync(alvo, html, "utf8");
console.log("index.html: " + antes + " ocorrencia(s) trocadas para " + novo);

/* Propaga para en/ e es/ */
execFileSync(process.execPath, [path.join(root, "translate.js")], { stdio: "inherit" });
console.log("\nPronto. Rode `node build.js` se voce tambem usa o arquivo unico.");
