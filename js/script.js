document.addEventListener('DOMContentLoaded', () => {
    // Funções que devem rodar em TODAS as páginas
    AOS.init({
        duration: 800,
        once: true
    });
    
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    setupMobileMenu();
    setupThemeToggle();
    setupLanguageSwitcher();
    iniciarAnimacoesAvancadas();
    iniciarEfeitoMatrix();
    setupCommandPalette(); 

    // --- Lógica Condicional ---
    // Só executa as funções de renderização se os containers existirem na página atual

    // Verifica se a seção de PROJETOS está na página
    if (document.getElementById('projects-container')) {
        renderProjects(myProjects);
        setupFiltering();
    }

    // Verifica se a seção de ARTIGOS está na página
    if (document.getElementById('articles-container')) {
        renderArticles(myArticles);
    }

    if (document.getElementById('projects-container')) {
        renderProjects(myProjects);
        setupFiltering();
    }

    // Para a seção de ARTIGOS na PÁGINA INICIAL
    if (document.getElementById('articles-container')) {
        renderArticles(myArticles, 3, 'articles-container');
    }

    // Para a seção de ARTIGOS na PÁGINA DO BLOG
    if (document.getElementById('all-articles-container')) {
        renderArticles(myArticles, null, 'all-articles-container');
    }

    if (document.getElementById('projects-container')) {
        renderProjects(myProjects);
        setupFiltering();
    }

    if (document.getElementById('articles-container')) {
        renderArticles(myArticles, 3, 'articles-container');
    }

    // Verifica se está na PÁGINA DO BLOG para ativar o filtro de artigos
    if (document.getElementById('all-articles-container')) {
        renderArticles(myArticles, null, 'all-articles-container');
        displayArticleFilterButtons(); // <-- ADICIONE ESTA CHAMADA
    }
});

// Banco de dados de ações para a Paleta de Comandos
const commandActions = [
    { name: 'Ir para a Home', type: 'link', target: 'index.html', icon: 'home' },
    { name: 'Ver Projetos', type: 'scroll', target: '#projetos', icon: 'projects' },
    { name: 'Sobre Mim', type: 'scroll', target: '#sobre', icon: 'about' },
    { name: 'Falar Comigo', type: 'scroll', target: '#contato', icon: 'contact' },
    { name: 'Ver Galeria de Vídeos', type: 'link', target: 'videografia.html', icon: 'video' },
    { name: 'Ler Artigos', type: 'link', target: 'blog.html', icon: 'articles' },
    { name: 'Ver meu Processo', type: 'link', target: 'processo.html', icon: 'process' }
];

// Adiciona dinamicamente seus projetos e artigos à lista de ações
myProjects.forEach(project => {
    commandActions.push({
        name: `Ver Projeto: ${project.title}`,
        type: 'link',
        target: project.link,
        icon: 'projects'
    });
});
myArticles.forEach(article => {
    commandActions.push({
        name: `Ler Artigo: ${article.title}`,
        type: 'link',
        target: article.link,
        icon: 'articles'
    });
});

/**
 * Função ÚNICA e UNIFICADA para renderizar os cards de projeto na tela.
 * Ela também adiciona os efeitos de hover 3D.
 * @param {Array} projectsToRender - O array de projetos a ser exibido.
 */
function renderProjects(projectsToRender) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = ''; // Limpa o container antes de adicionar novos projetos

    if (projectsToRender.length === 0) {
        container.innerHTML = `<p class="text-center col-span-full text-gray-400">Nenhum projeto encontrado nesta categoria.</p>`;
        return;
    }

    projectsToRender.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card bg-[#1B0E3F] rounded-lg overflow-hidden shadow-lg flex flex-col';
        
        projectCard.setAttribute('data-aos', 'fade-up');
        projectCard.setAttribute('data-aos-delay', (index % 4) * 100);

        let tagsHtml = '';
        if (project.tags && project.tags.length > 0) {
            const tagsString = project.tags.map(tag => 
                `<span class="tag-badge bg-purple-800 text-purple-200 text-xs font-semibold px-2.5 py-1 rounded-full">${tag}</span>`
            ).join('');
            
            tagsHtml = `<div class="flex flex-wrap gap-2 mt-4">${tagsString}</div>`;
        }

        // Card inteiro se torna um link clicável
        projectCard.innerHTML = `
            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="block h-full flex flex-col">
                <img src="${project.imageUrl}" loading="lazy" alt="${project.title}" class="w-full h-48 object-cover">
                <div class="p-6 flex flex-col flex-grow"> 
                    <div class="flex-grow">
                        <h3 class="text-xl font-bold text-purple-300">${project.title}</h3>
                        <p class="text-gray-400 mt-2 mb-4">${project.description}</p>
                        ${tagsHtml}
                    </div>
                </div>
            </a>
        `;
        
        container.appendChild(projectCard);

        // --- LÓGICA DO EFEITO 3D HOVER ---
        projectCard.addEventListener('mousemove', (e) => {
            const card = e.currentTarget;
            const { top, left, width, height } = card.getBoundingClientRect();
            const mouseX = e.clientX - left;
            const mouseY = e.clientY - top;
            const intensity = 20; 
            const rotateX = (mouseY / height - 0.5) * -intensity;
            const rotateY = (mouseX / width - 0.5) * intensity;
            card.style.transition = 'transform 0.05s linear';
            card.style.transform = `scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        projectCard.addEventListener('mouseleave', (e) => {
            const card = e.currentTarget;
            card.style.transition = 'transform 0.4s ease-out';
            card.style.transform = 'scale(1) rotateX(0) rotateY(0)';
        });
    });
}


/**
 * Configura os event listeners para os botões de filtro.
 */
function setupFiltering() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (buttons.length === 0) return;
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');

            const category = button.dataset.category;
            const filteredProjects = category === 'all' 
                ? myProjects 
                : myProjects.filter(project => project.category === category);

            renderProjects(filteredProjects);
        });
    });
}


/**
 * Inicia e controla a animação de fundo do Matrix.
 */
function iniciarEfeitoMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops = Array.from({ length: columns }).fill(1);

    const desenhar = () => {
        // Verifica se o modo claro está ativo
        const isLightMode = document.documentElement.classList.contains('light-mode');

        // Define as cores com base no tema
        const trailColor = isLightMode ? 'rgba(243, 244, 246, 0.1)' : 'rgba(11, 2, 29, 0.05)';
        const textColor = isLightMode ? '#9ca3af' : '#4C1D95'; // cinza para o modo claro, roxo para o escuro

        // Fundo semi-transparente para criar o efeito de rastro
        ctx.fillStyle = trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cor e fonte dos caracteres
        ctx.fillStyle = textColor;
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    setInterval(desenhar, 33);

    const secaoSobre = document.getElementById('sobre');
    window.addEventListener('scroll', () => {
        if (!secaoSobre) return;
        const rect = secaoSobre.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        const blurIntensity = isVisible ? 'blur(5px)' : 'blur(0px)';
        if (canvas.style.filter !== blurIntensity) {
            canvas.style.filter = blurIntensity;
            canvas.style.transition = 'filter 0.5s ease';
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Recalcula o número de colunas, mas não precisa resetar as gotas
    });
}
/**
 * Configura a funcionalidade do menu mobile (hambúrguer).
 */
function setupMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconHamburger = document.getElementById('icon-hamburger');
    const iconClose = document.getElementById('icon-close');

    if (!menuButton || !mobileMenu || !iconHamburger || !iconClose) return;

    menuButton.addEventListener('click', () => {
        // Alterna a visibilidade do menu
        mobileMenu.classList.toggle('hidden');
        // Alterna qual ícone é mostrado (hambúrguer ou X)
        iconHamburger.classList.toggle('hidden');
        iconClose.classList.toggle('hidden');
    });
}

/**
 * Configura o seletor de tema (light/dark mode) e salva a preferência.
 */
function setupThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    const root = document.documentElement; // A tag <html>

    // Função para aplicar o tema (adiciona/remove a classe e troca o ícone)
    const applyTheme = (theme) => {
        if (theme === 'light') {
            root.classList.add('light-mode');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            root.classList.remove('light-mode');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
        // Salva a preferência no localStorage
        localStorage.setItem('theme', theme);
    };

    // Adiciona o listener de clique no botão
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // Verifica a preferência salva ou do sistema ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

/**
 * Configura o seletor de idiomas animado.
 */
function setupLanguageSwitcher() {
    const switcher = document.getElementById('language-switcher');
    const pill = document.getElementById('language-pill');
    const links = document.querySelectorAll('.lang-link');

    if (!switcher || !pill || links.length === 0) return;

    // Função para mover a pílula para um elemento
    const movePill = (targetElement) => {
        pill.style.left = `${targetElement.offsetLeft}px`;
        pill.style.width = `${targetElement.offsetWidth}px`;

        // Lógica para deixar o texto do link ativo branco
        links.forEach(link => {
            link.classList.remove('active');
        });
        targetElement.classList.add('active');
    };

    // Encontra o link ativo inicial (baseado na classe do <body>)
    const currentLang = document.body.className.includes('lang-pt') ? 'pt' : 'en';
    const activeLink = document.querySelector(`.lang-link[data-lang="${currentLang}"]`);

    // Posição inicial da pílula (sem animação no carregamento)
    if (activeLink) {
        pill.style.transition = 'none'; // Desativa a transição para o posicionamento inicial
        movePill(activeLink);
        // Reativa a transição após um pequeno delay
        setTimeout(() => {
            pill.style.transition = 'all 0.3s ease-in-out';
        }, 100);
    }
    
    // Adiciona os listeners de hover
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            movePill(link);
        });
    });

    // Quando o mouse sai do seletor, a pílula volta para o idioma ativo
    switcher.addEventListener('mouseleave', () => {
        if (activeLink) {
            movePill(activeLink);
        }
    });
}
/**
 * Inicia as animações avançadas da página com GSAP.
 */
function iniciarAnimacoesAvancadas() {
    // Primeiro, precisamos "registrar" o plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animação 1: Entrada da seção de apresentação (Hero)
    // Usamos uma timeline para sequenciar as animações
    gsap.timeline()
        .from(".hero-section h1", { // Alvo: O título h1
            duration: 1.2,         // Duração da animação em segundos
            y: 100,                // Começa 100px abaixo da sua posição final
            opacity: 0,            // Começa invisível
            ease: "power3.out"     // Efeito de "desaceleração" suave
        })
        .from(".hero-section p", { // Alvo: O parágrafo de descrição
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.8"); // O "-=0.8" faz esta animação começar 0.8s ANTES do fim da anterior, criando uma sobreposição suave.

        // Adicione este código dentro da função iniciarAnimacoesAvancadas()

        // Animação para os cards de PROJETO com efeito "stagger" (sequência)
        gsap.from("#projects-container .project-card", {
            scrollTrigger: {
                trigger: "#projects-container", // O gatilho é o container dos projetos
                start: "top 80%",              // Começa quando o topo do container atinge 80% da tela
                toggleActions: "play none none none"
            },
            y: 50,                         // Começam 50px abaixo
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2                   // A mágica acontece aqui! Anima um card a cada 0.2 segundos.
        });

        gsap.from(".testimonial-card", {
            scrollTrigger: {
                trigger: "#depoimentos",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            scale: 0.9, // Começam um pouco menores
            opacity: 0,
            duration: 1,
            stagger: 0.3 // Também em sequência
        });

        gsap.from("#articles-container > a", {
            scrollTrigger: {
                trigger: "#artigos",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2
        });
}   

/**
 * Renderiza os cards de artigos na tela.
 * @param {Array} articlesToRender - O array de artigos a ser exibido.
 * @param {number|null} limit - O número máximo de artigos a serem exibidos. Se for nulo, mostra todos.
 * @param {string} containerId - O ID do container onde os artigos serão renderizados.
 */
function renderArticles(articlesToRender, limit = null, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    // Se um limite for fornecido, corta o array. Senão, usa o array completo.
    const articlesToShow = limit ? articlesToRender.slice(0, limit) : articlesToRender;

    articlesToShow.forEach(article => {
        const articleCard = document.createElement('a');
        articleCard.href = article.link;
        articleCard.className = 'block bg-[#1B0E3F] rounded-lg shadow-lg overflow-hidden group';
        articleCard.setAttribute('data-aos', 'fade-up');

        let tagsHtml = '';
        if (article.tags && article.tags.length > 0) {
            const tagsString = article.tags.map(tag => 
                `<span class="tag-badge inline-block bg-purple-800 text-purple-200 text-xs font-semibold px-2 py-1 rounded-full">${tag}</span>`
            ).join('');
            tagsHtml = `<div class="flex flex-wrap gap-2 mt-4">${tagsString}</div>`;
        }

        articleCard.innerHTML = `
            <div class="overflow-hidden">
                <img src="${article.imageUrl}" loading="lazy" alt="Capa do artigo ${article.title}" class="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300">
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-white mb-2">${article.title}</h3>
                <p class="text-gray-400 mb-4 text-base">${article.description}</p>
                ${tagsHtml}
            </div>
        `;

        container.appendChild(articleCard);
    });
}

/**
 * Configura a Paleta de Comandos (Ctrl+K).
 */
/**
 * Configura a Paleta de Comandos completa, com busca e execução de ações.
 */
function setupCommandPalette() {
    const palette = document.getElementById('command-palette');
    const searchInput = document.getElementById('palette-search-input');
    const resultsList = document.getElementById('palette-results');

    if (!palette || !searchInput || !resultsList) return;

    // --- ÍCONES PARA USAR NA LISTA ---
    const icons = {
        home: `<svg ...>...</svg>`, // Substitua pelos SVGs dos seus ícones
        projects: `<svg class="w-5 h-5 mr-3 text-gray-400" ...>...</svg>`,
        // ... adicione outros ícones aqui ...
        default: `<svg class="w-5 h-5 mr-3 text-gray-400" ...>...</svg>`
    };

    // --- FUNÇÃO PARA RENDERIZAR OS RESULTADOS ---
    const renderResults = (actions) => {
        resultsList.innerHTML = ''; // Limpa a lista
        if (actions.length === 0) {
            resultsList.innerHTML = `<li class="p-4 text-gray-500">Nenhum resultado encontrado.</li>`;
            return;
        }
        actions.forEach(action => {
            const li = document.createElement('li');
            li.className = 'p-4 flex items-center cursor-pointer hover:bg-purple-900 rounded-md';
            // Armazena os dados da ação no próprio elemento para uso posterior
            li.dataset.type = action.type;
            li.dataset.target = action.target;
            
            // Adicione um ícone se ele existir
            const iconSvg = icons[action.icon] || icons.default;
            
            li.innerHTML = `${iconSvg} <span>${action.name}</span>`;
            resultsList.appendChild(li);
        });
    };

    // --- LÓGICA DE ABERTURA E FECHAMENTO ---
    const openPalette = () => {
        palette.classList.remove('hidden');
        palette.classList.add('flex');
        searchInput.value = ''; // Limpa o input ao abrir
        renderResults(commandActions); // Mostra todos os comandos
        searchInput.focus();
    };

    const closePalette = () => {
        palette.classList.add('hidden');
        palette.classList.remove('flex');
    };

    // --- LISTENERS DE EVENTOS ---
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            palette.classList.contains('hidden') ? openPalette() : closePalette();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !palette.classList.contains('hidden')) closePalette();
    });

    palette.addEventListener('click', (e) => {
        if (e.target === palette) closePalette();
    });

    // --- LÓGICA DA BUSCA EM TEMPO REAL ---
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredActions = commandActions.filter(action => 
            action.name.toLowerCase().includes(query)
        );
        renderResults(filteredActions);
    });

    // --- LÓGICA PARA EXECUTAR A AÇÃO AO CLICAR ---
    resultsList.addEventListener('click', (e) => {
        const clickedLi = e.target.closest('li');
        if (!clickedLi) return;

        const { type, target } = clickedLi.dataset;

        if (type === 'link') {
            window.location.href = target;
        } else if (type === 'scroll') {
            // Verifica se está na página inicial antes de rolar
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
            } else {
                // Se não estiver na home, navega para a home com a âncora
                window.location.href = `index.html${target}`;
            }
        }
        closePalette();
    });
}

/**
 * Cria e exibe os botões de filtro para os artigos dinamicamente.
 */
function displayArticleFilterButtons() {
    const filterContainer = document.getElementById('article-filter-buttons');
    if (!filterContainer) return;

    // Extrai todas as tags de todos os artigos
    const allTags = myArticles.flatMap(article => article.tags);
    
    // Cria um conjunto de tags únicas para não haver botões repetidos e converte de volta para um array
    const uniqueTags = ['Todos', ...new Set(allTags)];

    // Gera o HTML para cada botão
    filterContainer.innerHTML = uniqueTags.map(tag => {
        // O botão "Todos" é o ativo por padrão
        const isActive = tag === 'Todos' ? 'active-filter' : '';
        return `<button class="filter-btn ${isActive}" data-tag="${tag}">${tag}</button>`;
    }).join('');

    // Depois que os botões são criados, adicionamos a funcionalidade de clique a eles
    setupArticleTagFiltering();
}

/**
 * Adiciona os event listeners aos botões de filtro de artigos.
 */
function setupArticleTagFiltering() {
    const buttons = document.querySelectorAll('#article-filter-buttons .filter-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Lógica para destacar o botão ativo
            buttons.forEach(btn => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');

            const selectedTag = button.dataset.tag;
            let filteredArticles;

            if (selectedTag === 'Todos') {
                filteredArticles = myArticles; // Mostra todos
            } else {
                // Filtra os artigos que contêm a tag selecionada no seu array de tags
                filteredArticles = myArticles.filter(article => article.tags.includes(selectedTag));
            }

            // Re-renderiza a galeria com os artigos filtrados
            renderArticles(filteredArticles, null, 'all-articles-container');
        });
    });
}