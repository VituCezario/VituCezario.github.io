/* =========================================================================
   TRADUÇÃO — gera as versões em inglês e espanhol
   -------------------------------------------------------------------------
   Uso:  node translate.js

   O index.html em português é a ÚNICA fonte de estrutura. Este script copia
   ele, troca os textos pelo dicionário de i18n/<idioma>.json e grava em
   en/index.html e es/index.html.

   Consequência prática: mudou o layout? Mexa só no index.html e rode isto
   de novo. As três versões nunca saem de sincronia.
   Mudou um texto? Ajuste o index.html E a chave correspondente nos dois JSON.

   O script avisa quais chaves do dicionário não foram encontradas — se você
   editar uma frase no index.html e esquecer de atualizar o JSON, ele reclama.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const root = __dirname;
const fonte = fs.readFileSync(path.join(root, "index.html"), "utf8");

function escapar(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* Casa a frase mesmo quebrada em varias linhas com indentacao no meio */
function flexivel(frase) {
  return new RegExp(frase.trim().split(/\s+/).map(escapar).join("\\s+"), "g");
}

["en", "es"].forEach((idioma) => {
  const dic = JSON.parse(fs.readFileSync(path.join(root, "i18n", idioma + ".json"), "utf8"));
  const lang = dic._lang;
  const dir = dic._dir;

  let out = fonte;
  const naoAchou = [];

  /* --- 1. textos ---
     Frase mais longa primeiro. Sem isso, "IA generativa" seria trocada antes
     de "IA generativa aplicada a processos corporativos", e a chave longa
     nunca mais casaria. */
  Object.keys(dic)
    .filter((k) => !k.startsWith("_"))
    .sort((a, b) => b.length - a.length)
    .forEach((pt) => {
      const re = flexivel(pt);
      if (!re.test(out)) { naoAchou.push(pt); return; }
      re.lastIndex = 0;
      out = out.replace(re, dic[pt].replace(/\$/g, "$$$$"));
    });

  /* --- 2. atributo lang e raiz dos caminhos --- */
  out = out.replace('<html lang="pt-BR">', '<html lang="' + lang + '" data-root="../">');

  /* --- 3. caminhos: a pagina passa a viver um nivel abaixo ---
     Comentarios ficam de fora: eles sao instrucoes para quem edita o projeto
     e falam da estrutura da raiz. Reescrever o caminho dentro deles deixaria
     a orientacao errada no arquivo gerado. */
  out = out
    .split(/(<!--[\s\S]*?-->)/)
    .map((parte) =>
      parte.startsWith("<!--")
        ? parte
        : parte.replace(/(href|src)="(css\/|js\/|assets\/)/g, '$1="../$2')
    )
    .join("");

  /* --- 3b. aviso no topo: este arquivo e gerado --- */
  out = out.replace(
    "<head>",
    "<head>\n<!-- ============================================================\n" +
      "     ARQUIVO GERADO AUTOMATICAMENTE — NAO EDITE ESTE ARQUIVO.\n" +
      "     Fonte da estrutura:  index.html\n" +
      "     Fonte dos textos:    i18n/" + idioma + ".json\n" +
      "     Para mudar algo aqui, edite um dos dois e rode: node translate.js\n" +
      "     ============================================================ -->"
  );

  /* --- 4. seletor de idioma: o caminho muda em cada versao --- */
  const alvos = { "pt-BR": "../index.html", en: "../en/index.html", es: "../es/index.html" };
  alvos[lang] = "index.html";
  out = out.replace(
    /<a href="[^"]*" hreflang="(pt-BR|en|es)"( aria-current="true")?>/g,
    (m, hl) => '<a href="' + alvos[hl] + '" hreflang="' + hl + '"' + (hl === lang ? ' aria-current="true"' : "") + ">"
  );

  /* --- 5. canonical e og:url apontam para a propria versao ---
     O dominio nao pode estar cravado aqui: depois de rodar o set-domain.js
     ele muda, e uma expressao presa ao endereco de exemplo deixaria de casar
     em silencio — o /en/ e o /es/ passariam a se declarar como a raiz, que e
     exatamente o erro que o canonical existe para evitar. */
  out = out.replace(
    /(<link rel="canonical" href="https?:\/\/[^"]+?)\/">/,
    '$1/' + dir + '/">'
  );
  out = out.replace(
    /(<meta property="og:url" content="https?:\/\/[^"]+?)\/">/,
    '$1/' + dir + '/">'
  );

  /* --- 6. grava --- */
  const destino = path.join(root, dir);
  fs.mkdirSync(destino, { recursive: true });
  fs.writeFileSync(path.join(destino, "index.html"), out, "utf8");

  console.log(dir + "/index.html  (" + dic._nome + ")");
  const total = Object.keys(dic).filter((k) => !k.startsWith("_")).length;
  console.log("  traduzidas: " + (total - naoAchou.length) + " de " + total);
  if (naoAchou.length) {
    console.log("  NAO ENCONTRADAS no index.html (o texto mudou?):");
    naoAchou.forEach((k) => console.log("    - " + k.slice(0, 70) + (k.length > 70 ? "..." : "")));
  }

  /* Sobrou portugues no texto visivel? Comentarios e o sprite de icones ficam
     em portugues de proposito — sao para quem edita o site, nao para quem le. */
  const visivel = out
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<svg[\s\S]*?<\/svg>/g, "");
  /* Só palavras que existem em português e NÃO em espanhol, e só em minúscula,
     para "São Paulo" e o espanhol "cada / porque" não darem alarme falso. */
  const suspeitas = [...new Set(
    visivel.match(/\b(você|não|então|também|quando|minha|meu|onde|aqui|nossa|muito|isso|essa|esse|pelo|pela|dele|dela)\b/g) || []
  )];
  if (suspeitas.length) {
    console.log("  ATENCAO, portugues no texto visivel: " + suspeitas.join(", "));
  }
  console.log("");
});
