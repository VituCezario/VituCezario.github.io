/* =========================================================================
   BUILD — gera cada idioma em um arquivo único
   -------------------------------------------------------------------------
   Uso:  node build.js     (ele roda o translate.js sozinho, antes de empacotar)

   Saída, para cada idioma:
     dist/vitor-portfolio-pt.html     documento completo, um arquivo só
     dist/artifact-pt.html            o mesmo sem <html>/<head>/<body>

   CSS, JS e imagens entram embutidos. Serve para hospedar em qualquer lugar,
   mandar por e-mail ou abrir direto com dois cliques, sem servidor.
   O site "de verdade" continua sendo index.html + en/ + es/ + css/ + js/.
   ========================================================================= */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

/* Regera en/ e es/ a partir do index.html antes de empacotar, para o arquivo
   único nunca sair de uma tradução velha. */
try {
  execFileSync(process.execPath, [path.join(root, "translate.js")], { stdio: "inherit" });
} catch (e) {
  console.error("translate.js falhou — seguindo com as traducoes que ja existiam.\n");
}

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

/* prefixo = como aquela versão enxerga a raiz do projeto */
const IDIOMAS = [
  { id: "pt", arquivo: "index.html", prefixo: "" },
  { id: "en", arquivo: "en/index.html", prefixo: "../" },
  { id: "es", arquivo: "es/index.html", prefixo: "../" }
];

const dist = path.join(root, "dist");
fs.mkdirSync(dist, { recursive: true });

const kb = (s) => (Buffer.byteLength(s, "utf8") / 1024).toFixed(0) + " KB";

IDIOMAS.forEach(({ id, arquivo, prefixo }) => {
  if (!fs.existsSync(path.join(root, arquivo))) {
    console.log("pulado: " + arquivo + " (nao existe)");
    return;
  }

  let html = read(arquivo);

  /* --- CSS embutido --- */
  html = html.replace(
    '<link rel="stylesheet" href="' + prefixo + 'css/style.css">',
    "<style>\n" + read("css/style.css") + "\n</style>"
  );

  /* --- JS embutido, na mesma ordem do original --- */
  ["js/hero-image.js", "js/projects.js", "js/main.js"].forEach((file) => {
    html = html.replace(
      '<script src="' + prefixo + file + '"></script>',
      "<script>\n" + read(file) + "\n</script>"
    );
  });

  /* --- Num arquivo único tudo vira data URI, então não existe mais "um nível
         acima". Sem tirar o data-root, o renderizador de projetos ainda
         prefixaria "../" numa data URI e quebraria a imagem. --- */
  html = html.replace(/ data-root="\.\.\/"/, "");

  /* --- Imagens, logos e capturas viram data URI ---
         Casa só o valor inteiro do atributo, entre aspas. Sem isso a troca
         também atingiria a URL absoluta do og:image, que tem o domínio antes
         do caminho — e a foto do hero acabava duplicada dentro de uma meta. */
  ["assets/img", "assets/logos", "assets/projetos"].forEach((dir) => {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) return;

    fs.readdirSync(abs).forEach((name) => {
      const mime = MIME[path.extname(name).toLowerCase()];
      if (!mime) return; /* ignora LEIA-ME.txt e afins */

      const b64 = fs.readFileSync(path.join(abs, name)).toString("base64");
      const uri = '"data:' + mime + ";base64," + b64 + '"';
      const rel = dir + "/" + name;
      /* o HTML traduzido usa "../assets/..."; o projects.js sempre usa "assets/..." */
      [prefixo + rel, rel].forEach((caminho) => {
        html = html.split('"' + caminho + '"').join(uri);
      });
    });
  });

  /* --- Num arquivo único não existe pasta irmã: o seletor de idioma
         apontaria para o vazio, então sai. --- */
  html = html.replace(/<nav class="langs"[\s\S]*?<\/nav>\n?/, "");

  fs.writeFileSync(path.join(dist, "vitor-portfolio-" + id + ".html"), html, "utf8");

  /* Versão para Artifact: sem a casca do documento, que o host já fornece.
     Junto com a casca vai embora o <html lang>, e o JavaScript usa justamente
     ele para escolher o idioma dos textos que nascem no código. Por isso o
     idioma é reposto numa linha antes de qualquer outro script rodar. */
  let body = html
    .replace(/^[\s\S]*?<head>\s*/, "")
    .replace(/<meta charset="utf-8">\s*/, "")
    .replace(/<meta name="viewport"[^>]*>\s*/, "")
    .replace(/<\/head>\s*<body>\s*/, "")
    .replace(/\s*<\/body>\s*<\/html>\s*$/, "\n");

  const langDoc = { pt: "pt-BR", en: "en", es: "es" }[id];
  body = '<script>document.documentElement.lang = "' + langDoc + '";</script>\n' + body;

  fs.writeFileSync(path.join(dist, "artifact-" + id + ".html"), body, "utf8");

  console.log("dist/vitor-portfolio-" + id + ".html  " + kb(html));
});
