# Portfólio — Vitor de Medeiros Cezário

Site pessoal em português, inglês e espanhol. HTML, CSS e JavaScript puros,
sem framework e sem dependência: os arquivos que estão aqui são exatamente
os que vão para o ar.

🔗 [vitucezario.github.io](https://vitucezario.github.io) ·
[LinkedIn](https://www.linkedin.com/in/vitor-de-medeiros-cezario/)

---

## Como o projeto está organizado

```
index.html          o site em português — ÚNICA fonte de estrutura
en/index.html       gerado automaticamente, não edite
es/index.html       gerado automaticamente, não edite

css/style.css       toda a identidade visual, em tokens no topo do arquivo
js/
  main.js           comportamento: retrato, malha de fundo, revelações
  projects.js       DADOS dos projetos — é aqui que você adiciona um novo
  hero-image.js     a foto do hero em base64 (o canvas precisa ler os pixels)
i18n/
  en.json           dicionário português → inglês
  es.json           dicionário português → espanhol
assets/
  img/              foto do hero, fotos da trajetória, favicon
  logos/            logos das empresas (opcional — há monograma de reserva)
  projetos/         capturas de tela dos projetos (opcional)

translate.js        gera en/ e es/ a partir do index.html + i18n/
build.js            empacota cada idioma num arquivo único em dist/
set-domain.js       troca o endereço do site em todos os lugares
```

---

## Tarefas do dia a dia

### Adicionar um projeto
Edite `js/projects.js`. Tem um bloco MODELO comentado no fim do arquivo e a
explicação de cada campo no cabeçalho. Imagem em `assets/projetos/`.

### Mudar um texto
Edite o `index.html`, ajuste a chave correspondente em `i18n/en.json` e
`i18n/es.json`, e rode:

```bash
node translate.js
```

O script avisa quais chaves do dicionário não encontrou — se você mudou uma
frase e esqueceu de atualizar os JSON, ele reclama com o texto na tela.

### Mudar o layout
Edite só o `index.html` e rode `node translate.js`. As três versões nunca
saem de sincronia porque só existe uma fonte de estrutura.

### Trocar o endereço do site
```bash
node set-domain.js https://seu-endereco.com
```

### Gerar a versão de arquivo único
```bash
node build.js
```
Sai em `dist/`, um arquivo por idioma, com CSS, JS e imagens embutidos.
Serve para mandar por e-mail ou abrir sem servidor.

---

## Publicar no GitHub Pages

O site já está pronto para servir direto da raiz do repositório. Não há etapa
de build no servidor: o `.nojekyll` desliga o processamento do GitHub e os
arquivos são entregues como estão.

1. Crie o repositório **público** com o nome `VituCezario.github.io`
2. `git remote add origin https://github.com/VituCezario/VituCezario.github.io.git`
3. `git push -u origin main`
4. Em **Settings → Pages**, deixe *Source: Deploy from a branch*, branch `main`,
   pasta `/ (root)`
5. `node set-domain.js https://vitucezario.github.io` e faça um novo commit

O ar leva de um a dois minutos na primeira vez.

---

## O que fica de fora do repositório

`Apoio/` está no `.gitignore` de propósito. É a pasta com as anotações
pessoais que serviram de base para escrever o site. Num repositório público
ela ficaria legível para qualquer pessoa — e o histórico do Git não esquece,
mesmo depois que o arquivo é apagado.
