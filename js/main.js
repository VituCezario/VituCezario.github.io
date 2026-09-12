/* =========================================================================
   VITOR — COMPORTAMENTO
   1. Ano no rodapé
   3. Revelação na rolagem
   4. Espinha: progresso e seção ativa
   5. Retrato: foto que vira matriz de dados
   6. Malha de fundo que reage ao cursor
   ========================================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- IDIOMA ----------
     Parte do texto do site nasce aqui no JavaScript, nao no HTML: o tempo de
     casa, os rotulos do processo dos projetos e os estados do retrato. Essas
     frases precisam acompanhar o idioma da pagina, lido do <html lang>. */
  var LANG = (document.documentElement.lang || "pt").slice(0, 2).toLowerCase();
  if (LANG !== "en" && LANG !== "es") LANG = "pt";

  var DICT = {
    pt: {
      recente: "Recém-chegado",
      ano: " ano", anos: " anos", mes: " mês", meses: " meses", e: " e ",
      verProcesso: "Ver o processo",
      verProjeto: "Ver projeto",
      passos: { problema: "Problema", ideia: "Ideia", tecnologia: "Tecnologia", solucao: "Solução", resultado: "Resultado" },
      matriz: "Matriz", convertendo: "Convertendo", lendo: "Lendo", varrendo: "Varrendo", foto: "Fotografia",
      cliqueVoltar: "Clique de novo para voltar"
    },
    en: {
      recente: "Just started",
      ano: " year", anos: " years", mes: " month", meses: " months", e: " and ",
      verProcesso: "See the process",
      verProjeto: "View project",
      passos: { problema: "Problem", ideia: "Idea", tecnologia: "Technology", solucao: "Solution", resultado: "Result" },
      matriz: "Matrix", convertendo: "Converting", lendo: "Reading", varrendo: "Scanning", foto: "Photograph",
      cliqueVoltar: "Click again to go back"
    },
    es: {
      recente: "Recién llegado",
      ano: " año", anos: " años", mes: " mes", meses: " meses", e: " y ",
      verProcesso: "Ver el proceso",
      verProjeto: "Ver proyecto",
      passos: { problema: "Problema", ideia: "Idea", tecnologia: "Tecnología", solucao: "Solución", resultado: "Resultado" },
      matriz: "Matriz", convertendo: "Convirtiendo", lendo: "Leyendo", varrendo: "Escaneando", foto: "Fotografía",
      cliqueVoltar: "Haz clic de nuevo para volver"
    }
  };

  var T = DICT[LANG];

  /* Quando a pagina vive em /en/ ou /es/, os caminhos de imagem dos projetos
     precisam subir um nivel. O translate.js marca isso no <html data-root>. */
  var ROOT = document.documentElement.getAttribute("data-root") || "";

  /* ---------- 1. ANO ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 1b. TEMPO DE CASA ----------
     Qualquer elemento com data-since="AAAA-MM" mostra sozinho quanto tempo
     se passou. Evita o "10 meses" congelado no HTML daqui a dois anos. */
  (function since() {
    [].slice.call(document.querySelectorAll("[data-since]")).forEach(function (el) {
      var parts = el.getAttribute("data-since").split("-");
      var start = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
      var now = new Date();
      var months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
      if (months < 1) { el.textContent = T.recente; return; }

      var years = Math.floor(months / 12);
      var rest = months % 12;
      var out = [];
      if (years) out.push(years + (years === 1 ? T.ano : T.anos));
      if (rest) out.push(rest + (rest === 1 ? T.mes : T.meses));
      el.textContent = out.join(T.e);
    });
  })();

  /* ---------- 1c. O NOME SENDO DIGITADO ----------
     O ponto final vermelho faz as vezes de cursor: pisca durante a digitação
     e para quando o nome fecha. O ciclo se repete, mas com uma pausa longa —
     o nome fica parado a maior parte do tempo, senão vira letreiro. */
  (function typeName() {
    var el = document.getElementById("heroTyped");
    var stop = document.getElementById("heroStop");
    if (!el || !stop || reduced) return;

    var full = el.textContent;
    var TYPE = 95;      /* ms por letra, escrevendo */
    var ERASE = 55;     /* apagando, mais rápido: ninguém lê de trás para frente */
    var HOLD = 7000;    /* quanto tempo o nome fica inteiro na tela */
    var GAP = 500;      /* respiro entre apagar e escrever de novo */

    var i = 0;
    var timer;
    var awake = true;

    function at(n) { el.textContent = full.slice(0, n); }

    function wait(ms, next) {
      timer = window.setTimeout(function () {
        if (awake) { next(); return; }
        /* Fora da tela: espera a volta em vez de animar para ninguém */
        wait(600, next);
      }, ms);
    }

    function write() {
      stop.classList.add("is-typing");
      at(++i);
      if (i < full.length) { timer = window.setTimeout(write, TYPE); return; }
      stop.classList.remove("is-typing");
      wait(HOLD, erase);
    }

    function erase() {
      stop.classList.add("is-typing");
      at(--i);
      if (i > 0) { timer = window.setTimeout(erase, ERASE); return; }
      wait(GAP, write);
    }

    /* Pausa o ciclo enquanto o hero não está visível */
    if ("IntersectionObserver" in window) {
      var hero = document.getElementById("inicio");
      if (hero) {
        new IntersectionObserver(function (entries) {
          awake = entries[0].isIntersecting;
        }, { threshold: 0.15 }).observe(hero);
      }
    }

    at(0);
    window.setTimeout(write, 260);
  })();


  /* ---------- 2. PROJETOS ----------
     Cards montados a partir de js/projects.js. Roda antes da revelação
     abaixo, porque ela precisa medir a página já com os cards no lugar. */
  (function renderProjects() {
    var host = document.getElementById("projectGrid");
    if (!host || !window.PROJECTS) return;

    var FLOW_LABELS = T.passos;

    function el(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text) node.textContent = text;
      return node;
    }

    window.PROJECTS.forEach(function (dado, i) {
      /* Campo traduzido quando existe; senão, o português original.
         A imagem, o ano e as tags não se traduzem — vêm sempre da raiz. */
      var t = (LANG !== "pt" && dado[LANG]) || {};
      var item = {
        name: t.name || dado.name,
        kind: t.kind || dado.kind,
        description: t.description || dado.description,
        note: t.note || dado.note,
        linkLabel: t.linkLabel || dado.linkLabel,
        flow: t.flow || dado.flow,
        year: dado.year,
        image: dado.image,
        alt: t.alt || dado.alt,
        tags: dado.tags,
        url: dado.url
      };

      var card = el("article", "pcard");
      var index = (i + 1 < 10 ? "0" : "") + (i + 1);

      /* Imagem — ou a marca-d'água com o número, quando ainda não há captura */
      var media = el("div", "pcard__media");
      if (item.image) {
        var img = el("img");
        img.src = ROOT + item.image;
        img.alt = item.alt || item.name;
        img.loading = "lazy";
        media.appendChild(img);
      } else {
        media.className = "pcard__media pcard__media--empty";
        media.appendChild(el("span", null, index));
      }
      card.appendChild(media);

      var body = el("div", "pcard__body");

      var eyebrow = el("div", "pcard__eyebrow");
      if (item.kind) eyebrow.appendChild(el("span", "pcard__kind", item.kind));
      if (item.year) eyebrow.appendChild(el("span", null, item.year));
      if (eyebrow.childNodes.length) body.appendChild(eyebrow);

      body.appendChild(el("h3", "pcard__title", item.name));
      body.appendChild(el("p", "pcard__desc", item.description));

      if (item.tags && item.tags.length) {
        var tags = el("div", "pcard__tags");
        item.tags.forEach(function (t) { tags.appendChild(el("span", "tag", t)); });
        body.appendChild(tags);
      }

      /* Processo, só quando o projeto tem algo preenchido em `flow` */
      if (item.flow) {
        var steps = Object.keys(FLOW_LABELS).filter(function (k) { return item.flow[k]; });
        if (steps.length) {
          var details = el("details", "pflow");
          var summary = el("summary", null, T.verProcesso);
          details.appendChild(summary);

          steps.forEach(function (key, n) {
            var step = el("div", "flow__step" + (key === "resultado" ? " flow__step--out" : ""));
            if (n === steps.length - 1) step.style.borderBottom = "0";
            step.appendChild(el("span", "flow__key", FLOW_LABELS[key]));
            step.appendChild(el("span", "flow__val", item.flow[key]));
            details.appendChild(step);
          });

          body.appendChild(details);
        }
      }

      var foot = el("div", "pcard__foot");
      if (item.url) {
        var btn = el("a", "btn");
        btn.href = item.url;
        btn.target = "_blank";
        btn.rel = "noopener";
        btn.appendChild(document.createTextNode(item.linkLabel || T.verProjeto));
        btn.appendChild(el("i", null, "↗"));
        foot.appendChild(btn);
      } else if (item.note) {
        foot.appendChild(el("span", "pcard__nolink", item.note));
      }
      if (foot.childNodes.length) body.appendChild(foot);

      card.appendChild(body);
      host.appendChild(card);
    });
  })();

  /* ---------- 3. REVELAÇÃO NA ROLAGEM ----------
     Só entra em estado invisível o que já nasce abaixo da dobra. O que está
     na primeira tela aparece imediatamente — e sem JS, tudo aparece. */
  (function reveal() {
    if (reduced || !("IntersectionObserver" in window)) return;

    var items = [].slice.call(document.querySelectorAll(".rv"));
    var fold = window.innerHeight * 0.92;
    var pending = items.filter(function (el) {
      return el.getBoundingClientRect().top > fold;
    });
    if (!pending.length) return;

    pending.forEach(function (el) { el.classList.add("is-pending"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("is-pending");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    pending.forEach(function (el) { io.observe(el); });
  })();

  /* Barras das ferramentas: crescem quando o bloco entra em cena */
  (function toolBars() {
    var tools = document.getElementById("tools");
    if (!tools) return;
    if (reduced || !("IntersectionObserver" in window)) {
      tools.classList.add("is-in");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tools.classList.add("is-in");
        io.disconnect();
      });
    }, { threshold: 0.25 });
    io.observe(tools);
  })();

  /* ---------- 4. ESPINHA ---------- */
  (function spine() {
    var fill = document.getElementById("spineFill");
    var topFill = document.getElementById("topFill");
    var links = [].slice.call(document.querySelectorAll(".spine__link"));
    var targets = links.map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    });
    var ticking = false;

    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      if (fill) fill.style.height = (pct * 100) + "%";
      if (topFill) topFill.style.width = (pct * 100) + "%";

      var mark = window.scrollY + window.innerHeight * 0.35;
      var active = 0;
      targets.forEach(function (section, i) {
        if (section && section.offsetTop <= mark) active = i;
      });
      links.forEach(function (a, i) {
        a.setAttribute("aria-current", i === active ? "true" : "false");
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  })();
  /* ---------- 5. RETRATO ----------
     A fotografia é desenhada em canvas. Por cima existe a mesma imagem
     convertida em matriz de pontos, e uma máscara decide onde ela aparece:

       - uma varredura ambiente atravessa o retrato de tempos em tempos,
         sozinha, para a imagem parada não ficar morta
       - o cursor abre uma lente e digitaliza a região onde passa
       - um clique em qualquer lugar da página converte a imagem inteira

     Entre uma varredura ambiente e outra o laço de animação dorme. */
  (function portrait() {
    var GROUND = "#0B0A0C";   /* --void  */
    var INK    = "#F4EFEC";   /* --ink   */
    var RED    = "#E11D2E";   /* --red   */
    var DEEP   = "#2A5A70";   /* azul-petróleo, tirado do terno da foto */
    var CELL   = 8;           /* lado da célula, em px de CSS */
    var FEATHER = 0.3;        /* suavidade da frente de varredura do clique */

    var AMB_SWEEP = 3200;     /* duração de uma passada da varredura ambiente */
    var AMB_PAUSE = 7200;     /* descanso entre uma passada e a seguinte */
    var AMB_BAND = 0.2;       /* altura da faixa, em fração do retrato */
    var AMB_PEAK = 0.62;      /* intensidade máxima — abaixo da lente, de propósito */

    var host = document.getElementById("portrait");
    var canvas = document.getElementById("portraitCanvas");
    var signalEl = document.getElementById("readSignal");
    var modeEl = document.getElementById("readMode");
    var cueEl = document.getElementById("heroCue");
    var heroEl = document.getElementById("inicio");
    if (!host || !canvas || !canvas.getContext || !window.HERO_IMAGE_SRC) return;

    var ctx = canvas.getContext("2d");
    var matrix = document.createElement("canvas");
    var mask = document.createElement("canvas");
    var layer = document.createElement("canvas");
    var sample = document.createElement("canvas");
    var mctx = matrix.getContext("2d");
    var kctx = mask.getContext("2d");
    var lctx = layer.getContext("2d");
    var sctx = sample.getContext("2d", { willReadFrequently: true });

    var img = new Image();
    var W = 0, H = 0, dpr = 1;
    var cols = 0, rows = 0, cw = 0, ch = 0;
    var target = 0, current = 0;          /* varredura do clique: 0 = foto, 1 = matriz */
    var lens = 0, lensTarget = 0;         /* intensidade da lente do cursor */
    var px = 0.5, py = 0.5;               /* posição do cursor, normalizada */
    var ambStart = 0, ambPos = -1;        /* varredura ambiente */
    var ambTimer;
    var running = false, ready = false, clicked = false, onScreen = true;

    /* Dimensiona os canvas e recalcula a grade. Roda no início e no resize. */
    function layout() {
      var rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.round(rect.width);
      H = Math.round(rect.height);

      [canvas, matrix, mask, layer].forEach(function (c) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      });
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      [ctx, mctx, kctx, lctx].forEach(function (c) { c.setTransform(dpr, 0, 0, dpr, 0, 0); });

      cols = Math.max(24, Math.round(W / CELL));
      rows = Math.max(24, Math.round(H / CELL));
      cw = W / cols;
      ch = H / rows;
      sample.width = cols;
      sample.height = rows;
      return true;
    }

    /* Lê a foto na resolução da grade e pinta a camada de pontos. Uma vez só. */
    function sampleMatrix() {
      /* O próprio navegador faz a média dos pixels ao reduzir para a grade */
      try {
        sctx.drawImage(img, 0, 0, cols, rows);
      } catch (e) {
        return false;
      }

      var data;
      try {
        data = sctx.getImageData(0, 0, cols, rows).data;
      } catch (e) {
        return false; /* imagem de outra origem: mantém só a fotografia */
      }

      mctx.clearRect(0, 0, W, H);
      mctx.fillStyle = GROUND;
      mctx.fillRect(0, 0, W, H);

      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var i = (y * cols + x) * 4;
          var lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
          if (lum < 0.10) continue;

          var color, alpha;
          if (lum >= 0.60) {
            color = INK;
            alpha = 0.45 + lum * 0.55;
          } else if (lum >= 0.28) {
            /* Faixa média: o vermelho entra pontilhado, como acento e não como base */
            var hot = (x + y * 2) % 5 === 0;
            color = hot ? RED : INK;
            alpha = hot ? 0.95 : 0.30 + lum * 0.4;
          } else {
            color = DEEP;
            alpha = 0.28 + lum * 0.5;
          }

          var dot = Math.max(1, cw * (0.22 + lum * 0.62));
          mctx.globalAlpha = alpha;
          mctx.fillStyle = color;
          mctx.fillRect(
            x * cw + (cw - dot) / 2,
            y * ch + (ch - dot) / 2,
            dot,
            Math.max(1, dot * (ch / cw))
          );
        }
      }
      mctx.globalAlpha = 1;
      return true;
    }

    function paintMask() {
      kctx.clearRect(0, 0, W, H);

      /* Frente de varredura do clique, descendo a imagem inteira */
      if (current > 0.001) {
        var pos = current * (1 + FEATHER);
        var g = kctx.createLinearGradient(0, 0, 0, H);
        var a = Math.max(0, Math.min(1, pos - FEATHER));
        var b = Math.max(0, Math.min(1, pos));
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(a, "rgba(255,255,255,1)");
        if (b > a) g.addColorStop(b, "rgba(255,255,255,0)");
        if (b < 1) g.addColorStop(1, "rgba(255,255,255,0)");
        kctx.fillStyle = g;
        kctx.fillRect(0, 0, W, H);
      }

      /* Faixa ambiente: atravessa sozinha, fraca, e some nas bordas */
      if (ambPos >= 0 && current < 0.98) {
        var band = AMB_BAND * H;
        var cy = ambPos * (H + band * 2) - band;
        var fade = Math.sin(Math.min(1, Math.max(0, ambPos)) * Math.PI); /* entra e sai */
        var peak = AMB_PEAK * fade * (1 - current);
        if (peak > 0.01) {
          var bg = kctx.createLinearGradient(0, cy - band, 0, cy + band);
          bg.addColorStop(0, "rgba(255,255,255,0)");
          bg.addColorStop(0.5, "rgba(255,255,255," + peak + ")");
          bg.addColorStop(1, "rgba(255,255,255,0)");
          kctx.fillStyle = bg;
          kctx.fillRect(0, cy - band, W, band * 2);
        }
      }

      /* Lente do cursor */
      if (lens > 0.001) {
        var r = W * 0.44;
        var lx = px * W;
        var ly = py * H;
        var rg = kctx.createRadialGradient(lx, ly, 0, lx, ly, r);
        rg.addColorStop(0, "rgba(255,255,255," + lens + ")");
        rg.addColorStop(0.55, "rgba(255,255,255," + (lens * 0.75) + ")");
        rg.addColorStop(1, "rgba(255,255,255,0)");
        kctx.fillStyle = rg;
        kctx.fillRect(0, 0, W, H);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = GROUND;
      ctx.fillRect(0, 0, W, H);

      /* A fotografia, cobrindo a caixa */
      var scale = Math.max(W / img.width, H / img.height);
      var dw = img.width * scale;
      var dh = img.height * scale;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

      /* A matriz, recortada pela máscara */
      paintMask();
      lctx.clearRect(0, 0, W, H);
      lctx.globalCompositeOperation = "source-over";
      lctx.drawImage(matrix, 0, 0, W, H);
      lctx.globalCompositeOperation = "destination-in";
      lctx.drawImage(mask, 0, 0, W, H);
      lctx.globalCompositeOperation = "source-over";
      ctx.drawImage(layer, 0, 0, W, H);

      /* Linha vermelha, só na varredura do clique — a ambiente é silenciosa */
      var pos = current * (1 + FEATHER);
      if (pos > 0.001 && pos < 1) {
        var y = pos * H;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = RED;
        ctx.fillRect(0, y, W, 1);
        ctx.globalAlpha = 0.16;
        ctx.fillRect(0, y - 22, W, 22);
        ctx.globalAlpha = 1;
      }

      if (signalEl) {
        var s = Math.round(Math.max(current, lens * 0.55, ambPos >= 0 ? 0.12 : 0) * 100);
        signalEl.textContent = s < 10 ? "0" + s : String(s);
      }
      if (modeEl) {
        modeEl.textContent = current > 0.98 ? T.matriz
          : current > 0.02 ? T.convertendo
          : lens > 0.05 ? T.lendo
          : ambPos >= 0 ? T.varrendo : T.foto;
      }
    }

    /* A varredura ambiente acorda, atravessa e volta a dormir */
    function scheduleAmbient(delay) {
      window.clearTimeout(ambTimer);
      ambTimer = window.setTimeout(function () {
        if (reduced || !onScreen) { scheduleAmbient(2000); return; }
        /* Tem que ser o mesmo relógio do requestAnimationFrame, senão a conta
           do progresso da varredura sai errada */
        ambStart = (window.performance && window.performance.now)
          ? window.performance.now()
          : 0;
        if (!ambStart) ambStart = 0.0001;
        kick();
      }, delay);
    }

    function tick(now) {
      current += (target - current) * 0.075;
      lens += (lensTarget - lens) * 0.12;

      if (ambStart) {
        var t = (now - ambStart) / AMB_SWEEP;
        if (t >= 1) {
          ambStart = 0;
          ambPos = -1;
          scheduleAmbient(AMB_PAUSE);
        } else {
          ambPos = t;
        }
      }

      var settled = Math.abs(target - current) < 0.002 && Math.abs(lensTarget - lens) < 0.004;
      if (settled) {
        current = target;
        lens = lensTarget;
      }

      draw();

      if (settled && !ambStart) { running = false; return; }
      window.requestAnimationFrame(tick);
    }

    function kick() {
      if (reduced) { current = target; lens = lensTarget; draw(); return; }
      if (running) return;
      running = true;
      window.requestAnimationFrame(tick);
    }

    /* Profundidade: o retrato, a moldura e o tabuleiro de fundo reagem ao
       cursor em velocidades diferentes. Poucos pixels — é paralaxe, não gangorra. */
    function bindParallax() {
      if (reduced || !heroEl || !window.matchMedia("(pointer: fine)").matches) return;

      heroEl.addEventListener("pointermove", function (e) {
        var rect = heroEl.getBoundingClientRect();
        var dx = (e.clientX - rect.left) / rect.width - 0.5;
        var dy = (e.clientY - rect.top) / rect.height - 0.5;
        host.style.setProperty("--tilt-x", (dx * 18).toFixed(1) + "px");
        host.style.setProperty("--tilt-y", (dy * 14).toFixed(1) + "px");
      });

      heroEl.addEventListener("pointerleave", function () {
        host.style.setProperty("--tilt-x", "0px");
        host.style.setProperty("--tilt-y", "0px");
      });
    }

    function bindInteractions() {
      /* A lente responde ao cursor mesmo com movimento reduzido ligado: quem
         move o mouse pediu para acontecer. O que o ajuste desliga é o que se
         move sozinho — a varredura ambiente, a digitação e a paralaxe. */
      canvas.addEventListener("pointermove", function (e) {
        var rect = canvas.getBoundingClientRect();
        px = (e.clientX - rect.left) / rect.width;
        py = (e.clientY - rect.top) / rect.height;
        lensTarget = 1;
        kick();
      });
      canvas.addEventListener("pointerleave", function () {
        lensTarget = 0;
        kick();
      });

      /* Um clique em qualquer lugar da página vira ou desvira a imagem */
      document.addEventListener("click", function (e) {
        if (!ready) return;
        if (e.target && e.target.closest && e.target.closest("a, button, input, textarea, select, summary, details")) return;
        target = target > 0.5 ? 0 : 1;
        if (!clicked && cueEl) {
          clicked = true;
          cueEl.textContent = T.cliqueVoltar;
        }
        kick();
      });

      var resizeTimer;
      window.addEventListener("resize", function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
          if (layout()) { sampleMatrix(); draw(); }
        }, 180);
      });

      /* Fora da tela, nada anima. Bateria de quem visita importa. */
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
          if (onScreen) kick();
        }, { threshold: 0.05 }).observe(host);
      }
    }

    img.onload = function () {
      if (!layout()) return;
      if (!sampleMatrix()) return;

      ready = true;
      host.setAttribute("data-ready", "true");
      draw();
      bindInteractions();
      bindParallax();
      scheduleAmbient(1800);
    };

    img.src = window.HERO_IMAGE_SRC;
  })();

  /* ---------- 6. MALHA DE FUNDO ----------
     Uma grade de pontos cobre a página inteira, fraca a ponto de passar por
     textura. O cursor a energiza: os pontos perto dele acendem, ganham
     vermelho no núcleo e são empurrados para fora, como um campo.

     É a mesma matriz do retrato do hero, estendida ao site — o cursor lê a
     página do mesmo jeito que lê a fotografia.

     Custo: a malha em repouso é desenhada uma vez num canvas de apoio e
     copiada de uma vez só por quadro; só os pontos dentro do raio do cursor
     são recalculados. Quando o cursor para, o laço dorme. */
  (function field() {
    var canvas = document.getElementById("field");
    if (!canvas || !canvas.getContext) return;

    var GRID = 30;          /* espaçamento da malha, em px */
    var RADIUS = 210;       /* alcance do cursor */
    var PUSH = 7;           /* quanto o ponto foge do cursor, em px */
    var BASE = 0.05;        /* opacidade da malha em repouso */
    var INK = "244,239,236";
    var RED = "225,29,46";

    var ctx = canvas.getContext("2d");
    var rest = document.createElement("canvas");
    var rctx = rest.getContext("2d");

    var W = 0, H = 0, dpr = 1;
    var tx = -9999, ty = -9999;     /* para onde o cursor foi */
    var cx = -9999, cy = -9999;     /* onde a malha acha que ele está */
    var energy = 0, energyTarget = 0;
    var running = false;

    var fine = window.matchMedia("(pointer: fine)").matches;

    /* A malha parada: desenhada uma vez, reutilizada em todo quadro */
    function buildRest() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;

      [canvas, rest].forEach(function (c) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      });
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      [ctx, rctx].forEach(function (c) { c.setTransform(dpr, 0, 0, dpr, 0, 0); });

      rctx.clearRect(0, 0, W, H);
      rctx.fillStyle = "rgba(" + INK + "," + BASE + ")";
      for (var y = GRID / 2; y < H; y += GRID) {
        for (var x = GRID / 2; x < W; x += GRID) {
          rctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }
    }

    /* Só os pontos na vizinhança do cursor são recalculados */
    function drawHot() {
      if (energy < 0.01) return;

      var x0 = Math.max(GRID / 2, Math.floor((cx - RADIUS) / GRID) * GRID + GRID / 2);
      var x1 = Math.min(W, cx + RADIUS);
      var y0 = Math.max(GRID / 2, Math.floor((cy - RADIUS) / GRID) * GRID + GRID / 2);
      var y1 = Math.min(H, cy + RADIUS);

      for (var y = y0; y < y1; y += GRID) {
        for (var x = x0; x < x1; x += GRID) {
          var dx = x - cx;
          var dy = y - cy;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > RADIUS) continue;

          /* Queda suave do centro para a borda do alcance */
          var near = 1 - dist / RADIUS;
          var falloff = near * near;
          var a = falloff * energy;
          if (a < 0.015) continue;

          /* O ponto foge do cursor — é isso que dá sensação de campo */
          var shove = (dist > 0.5) ? (PUSH * falloff) / dist : 0;
          var pxp = x + dx * shove;
          var pyp = y + dy * shove;

          /* Vermelho só no núcleo; o resto é tinta clara */
          var size = 2 + falloff * 2.2;
          if (near > 0.72) {
            ctx.fillStyle = "rgba(" + RED + "," + (a * 0.95).toFixed(3) + ")";
          } else {
            ctx.fillStyle = "rgba(" + INK + "," + (a * 0.55).toFixed(3) + ")";
          }
          ctx.fillRect(pxp - size / 2, pyp - size / 2, size, size);
        }
      }
    }

    function frame() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      energy += (energyTarget - energy) * 0.09;

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(rest, 0, 0, W, H);
      drawHot();

      var parado = Math.abs(tx - cx) < 0.4 && Math.abs(ty - cy) < 0.4 &&
                   Math.abs(energyTarget - energy) < 0.005;

      if (parado && energyTarget === 0) {
        /* Apagou de vez: deixa só a malha em repouso e dorme */
        energy = 0;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(rest, 0, 0, W, H);
        running = false;
        return;
      }

      window.requestAnimationFrame(frame);
    }

    function wake() {
      if (running) return;
      running = true;
      window.requestAnimationFrame(frame);
    }

    buildRest();
    ctx.drawImage(rest, 0, 0, W, H);

    /* Sem mouse ou com movimento reduzido, a malha fica só como textura */
    if (!fine || reduced) return;

    window.addEventListener("pointermove", function (e) {
      if (cx < -9000) { cx = e.clientX; cy = e.clientY; }
      tx = e.clientX;
      ty = e.clientY;
      energyTarget = 1;
      wake();
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      energyTarget = 0;
      wake();
    });

    window.addEventListener("blur", function () {
      energyTarget = 0;
      wake();
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        buildRest();
        ctx.drawImage(rest, 0, 0, W, H);
        wake();
      }, 160);
    });
  })();

})();
