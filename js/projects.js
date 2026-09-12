/* =========================================================================
   PROJETOS
   =========================================================================

   COMO ADICIONAR UM PROJETO NOVO — 3 passos
   -----------------------------------------------------------------------
   1. Salve a imagem em  assets/projetos/
      Use um nome sem espaço e sem acento:  cobranca-automatica.jpg
      Formato ideal: 1200 x 750 px (proporção 16:10), JPG ou PNG.

   2. Copie o bloco MODELO lá embaixo, cole no topo da lista window.PROJECTS
      e preencha. Projeto novo em cima, para aparecer primeiro.

   3. Salve o arquivo e recarregue a página. Pronto.
      (Se você usa o arquivo único, rode antes:  node build.js)

   O QUE CADA CAMPO FAZ
   -----------------------------------------------------------------------
   name         obrigatório. O título do card.
   description  obrigatório. Uma ou duas frases. O que é e para que serve.
   kind         etiqueta vermelha no topo do card: Automação, IA, Dados...
   year         aparece ao lado da etiqueta.
   image        caminho da imagem. Pode deixar de fora: o card mostra o
                número do projeto em marca-d'água e continua bonito.
   alt          descrição da imagem para leitor de tela e para quando ela
                não carregar. Só faz sentido se você preencheu `image`.
   tags         lista de tecnologias. Vira os chips embaixo da descrição.
   url          link do botão. GitHub, site no ar, vídeo, artigo.
   linkLabel    texto do botão. Sem isso, ele escreve "Ver projeto".
   note         use NO LUGAR de `url` quando o projeto não pode ser público
                (trabalho interno, cliente, NDA). Vira uma linha discreta.
   flow         opcional. O caminho problema → resultado. Se você preencher,
                o card ganha um "Ver o processo" que abre os cinco passos.
                Pode preencher só alguns; os vazios somem.

   TRADUÇÃO
   Os blocos `en:` e `es:` dentro de cada projeto guardam a versão em inglês
   e espanhol dos mesmos campos. O site escolhe pelo idioma da página. O que
   você não traduzir cai de volta no português — nada quebra.

   ATENÇÃO: vírgula entre um projeto e outro, e aspas fechadas. Se a seção
   sumir da página, é quase sempre uma vírgula faltando ou sobrando.
   Aspas dentro do texto: use 'simples' ou escreva \" com a barra na frente.
   ========================================================================= */

window.PROJECTS = [

  {
    name: "Coleta de evidências sem abrir o navegador",
    en: {
          "name": "Collecting evidence without opening a browser",
          "kind": "Automation",
          "description": "Evidence for an R&D&I project lives scattered across internal web systems. Opening, filtering, exporting and renaming file by file is robot work — so it became robot work.",
          "note": "Internal project — no public link",
          "flow": {
                "problema": "Hours a week spent downloading and organising evidence by hand, with the risk of missing an item at review time.",
                "ideia": "Stop operating the system and start instructing a script that operates the system.",
                "tecnologia": "Playwright to navigate and authenticate, Python to orchestrate, a spreadsheet as the source of parameters and the log.",
                "solucao": "A routine that walks the list, collects each piece of evidence, names it to the dossier's standard and records what it got.",
                "resultado": "Collection stopped competing with analysis. The time went back to the part that needs a human head."
          }
    },
    es: {
          "name": "Recolección de evidencias sin abrir el navegador",
          "kind": "Automatización",
          "description": "La evidencia de un proyecto de I+D+i vive dispersa en sistemas web internos. Abrir, filtrar, exportar y renombrar archivo por archivo es trabajo de robot — así que se volvió trabajo de robot.",
          "note": "Proyecto interno — sin enlace público",
          "flow": {
                "problema": "Horas por semana descargando y organizando evidencias a mano, con riesgo de olvidar un ítem a la hora de la verificación.",
                "ideia": "Dejar de operar el sistema y pasar a instruir un script que opera el sistema.",
                "tecnologia": "Playwright para navegar y autenticar, Python para orquestar, una hoja de cálculo como fuente de los parámetros y del registro.",
                "solucao": "Rutina que recorre la lista, recoge cada evidencia, la nombra según el estándar del expediente y registra lo que obtuvo.",
                "resultado": "La recolección dejó de competir con el análisis. El tiempo volvió a la parte que exige cabeza humana."
          }
    },
    kind: "Automação",
    year: "2026",
    image: "",
    alt: "",
    description:
      "Evidência de projeto de PD&I mora espalhada em sistemas web internos. " +
      "Abrir, filtrar, exportar e renomear arquivo por arquivo é trabalho de " +
      "robô — então virou trabalho de robô.",
    tags: ["Python", "Playwright", "Excel"],
    note: "Projeto interno — sem link público",
    flow: {
      problema: "Horas por semana gastas baixando e organizando evidências manualmente, com risco de esquecer um item na hora da checagem.",
      ideia: "Deixar de operar o sistema e passar a instruir um script que opera o sistema.",
      tecnologia: "Playwright para navegar e autenticar, Python para orquestrar, planilha como fonte dos parâmetros e do log.",
      solucao: "Rotina que percorre a lista, coleta cada evidência, nomeia segundo o padrão do dossiê e registra o que foi obtido.",
      resultado: "A coleta deixou de competir com a análise. O tempo voltou para a parte que exige cabeça humana."
    }
  },

  {
    name: "Uma base só, no lugar de dezessete planilhas",
    en: {
          "name": "One database instead of seventeen spreadsheets",
          "kind": "Data",
          "description": "Project data arrives from different areas, in different formats, with columns that change name along the way. Consolidating by hand is where the error is born.",
          "note": "Internal project — no public link",
          "flow": {
                "problema": "Manual consolidation of several spreadsheets per cycle, with rework every time a new version came in.",
                "ideia": "Stop fixing the result and fix the path: turn consolidation into a pipeline.",
                "tecnologia": "Power Query with versioned steps for cleaning, column standardisation and type validation.",
                "solucao": "A single base that refreshes with one click and flags on the spot when a file arrives off-standard.",
                "resultado": "A predictable, traceable close: you can answer where every number came from."
          }
    },
    es: {
          "name": "Una sola base, en lugar de diecisiete hojas de cálculo",
          "kind": "Datos",
          "description": "Los datos de proyecto llegan de áreas distintas, en formatos distintos, con columnas que cambian de nombre por el camino. Consolidar a mano es donde nace el error.",
          "note": "Proyecto interno — sin enlace público",
          "flow": {
                "problema": "Consolidación manual de varias hojas por ciclo, con retrabajo en cada nueva versión recibida.",
                "ideia": "Dejar de arreglar el resultado y arreglar el camino: convertir la consolidación en un pipeline.",
                "tecnologia": "Power Query con pasos versionados de limpieza, estandarización de columnas y validación de tipos.",
                "solucao": "Base única que se actualiza con un clic y avisa al instante cuando un archivo llega fuera de estándar.",
                "resultado": "Cierre predecible y trazable: se puede responder de dónde vino cada número."
          }
    },
    kind: "Dados",
    year: "2026",
    image: "",
    alt: "",
    description:
      "Dados de projeto chegam de áreas diferentes, em formatos diferentes, " +
      "com colunas que mudam de nome no meio do caminho. Consolidar na mão é " +
      "onde o erro nasce.",
    tags: ["Power Query", "Excel", "Modelagem"],
    note: "Projeto interno — sem link público",
    flow: {
      problema: "Consolidação manual de várias planilhas por ciclo, com retrabalho a cada nova versão recebida.",
      ideia: "Parar de consertar o resultado e consertar o caminho: transformar a consolidação em pipeline.",
      tecnologia: "Power Query com etapas versionadas de limpeza, padronização de colunas e validação de tipos.",
      solucao: "Base única que se atualiza com um clique e acusa na hora quando um arquivo chega fora do padrão.",
      resultado: "Fechamento previsível e rastreável: dá para responder de onde veio cada número."
    }
  },

  {
    name: "IA como primeira leitura, nunca como palavra final",
    en: {
          "name": "AI as the first read, never the final word",
          "kind": "Artificial Intelligence",
          "description": "I use language models to do the first pass on technical descriptions and point out where the argument is thin. The decision stays mine — and so does the checking.",
          "note": "Internal project — no public link",
          "flow": {
                "problema": "Reading dozens of project descriptions to find which ones hold an element of innovation and which won't survive eligibility review.",
                "ideia": "Use AI for the sweep and for framing questions, keeping technical judgement for the human step.",
                "tecnologia": "Prompts structured around the law's criteria, with output in fixed fields for fast checking.",
                "solucao": "A pre-analysis that flags gaps and suggests the right questions for the interview with the technical team.",
                "resultado": "I show up to the meeting knowing what to ask. The conversation goes further and the dossier starts stronger."
          }
    },
    es: {
          "name": "IA como primera lectura, nunca como palabra final",
          "kind": "Inteligencia Artificial",
          "description": "Uso modelos de lenguaje para el triaje inicial de descripciones técnicas y para señalar dónde falta argumento. La decisión sigue siendo mía — y la verificación también.",
          "note": "Proyecto interno — sin enlace público",
          "flow": {
                "problema": "Leer decenas de descripciones de proyecto para descubrir cuáles tienen elemento de innovación y cuáles no sostienen el encuadre.",
                "ideia": "Usar IA para el barrido y la formulación de preguntas, guardando el juicio técnico para la etapa humana.",
                "tecnologia": "Prompts estructurados sobre los criterios de la ley, con salida en campos fijos para verificación rápida.",
                "solucao": "Pre-análisis que señala vacíos y sugiere las preguntas correctas para la entrevista con el equipo técnico.",
                "resultado": "Llego a la reunión sabiendo qué preguntar. La conversación rinde más y el expediente nace más fuerte."
          }
    },
    kind: "Inteligência Artificial",
    year: "2026",
    image: "",
    alt: "",
    description:
      "Uso modelos de linguagem para fazer a triagem inicial de descrições " +
      "técnicas e apontar onde falta argumento. A decisão continua sendo " +
      "minha — e a checagem também.",
    tags: ["LLMs", "Prompting", "Python"],
    note: "Projeto interno — sem link público",
    flow: {
      problema: "Ler dezenas de descrições de projeto para descobrir quais têm elemento de inovação e quais não sustentam o enquadramento.",
      ideia: "Usar IA para a varredura e a formulação de perguntas, guardando o julgamento técnico para a etapa humana.",
      tecnologia: "Prompts estruturados sobre os critérios da lei, com saída em campos fixos para conferência rápida.",
      solucao: "Pré-análise que aponta lacunas e sugere as perguntas certas para a entrevista com o time técnico.",
      resultado: "Chego na reunião sabendo o que perguntar. A conversa rende mais e o dossiê nasce mais forte."
    }
  }

];

/* =========================================================================
   MODELO — copie daqui para baixo, cole lá em cima e preencha
   =========================================================================

  {
    name: "Nome do projeto",
    kind: "Automação",
    year: "2026",
    image: "assets/projetos/nome-do-arquivo.jpg",
    alt: "Descrição curta do que aparece na imagem",
    description: "Uma ou duas frases explicando o que é e por que existe.",
    tags: ["Python", "IA"],
    url: "https://github.com/seu-usuario/repositorio",
    linkLabel: "Ver no GitHub",
    flow: {
      problema: "",
      ideia: "",
      tecnologia: "",
      solucao: "",
      resultado: ""
    }
  },

   ========================================================================= */
