// ============================================================================
// 1. FUNÇÃO PRINCIPAL: SUBSCREVER NEWSLETTER (EMAILJS)
// ============================================================================
// [PRINCIPAL] Chamada pelo 'onsubmit' do formulário HTML.
function subscreverNewsletter(event) {
    // [AUXILIAR] Impede o envio padrão do formulário (recarregar a página).
    event.preventDefault();

    // [SUBAUXILIAR] Captura o elemento input.
    const emailInput = document.getElementById('newsletter-email');
    // [SUBSUBAUXILIAR] Validação defensiva: extrai o valor com segurança.
    const email = emailInput ? emailInput.value : '';

    // [SUBAUXILIAR] Parâmetros para o EmailJS.
    const templateParams = {
        user_email: email
    };

    // [SUBAUXILIAR] Envio assíncrono.
    emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', templateParams)
        .then(function(response) {
            // [SUBSUBAUXILIAR] Resposta de sucesso ao utilizador.
            alert(`Obrigado por se inscrever! Enviamos uma confirmação para: ${email}`);
            if (emailInput) emailInput.value = '';
        }, function(error) {
            // [SUBSUBAUXILIAR] Tratamento de erros.
            alert('Ocorreu um erro ao subscrever. Por favor, tente novamente.');
            console.error('Erro EmailJS:', error);
        });
}

// ============================================================================
// 2. FUNÇÃO PRINCIPAL: CALLBACK DO GOOGLE TRANSLATE
// ============================================================================
// [PRINCIPAL/EXTERNAL CALLBACK] Invocada automaticamente pela CDN do Google.
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt',      // Idioma de origem do site.
        autoDisplay: false      // Desativa barras automáticas nativas.
    }, 'google_translate_element');
}

// ============================================================================
// 3. CICLO DE VIDA PRINCIPAL: DOMCONTENTLOADED
// ============================================================================
// [PRINCIPAL] Executa assim que a estrutura do HTML estiver pronta.
document.addEventListener("DOMContentLoaded", function () {

    // [AUXILIAR] Função de verificação do breakpoint responsive.
    const isMobile = () => window.innerWidth <= 768;

    // ========================================================================
    // 3.1. MÓDULO AUXILIAR: GESTÃO DO GOOGLE TRANSLATE
    // ========================================================================
    // [SUBAUXILIAR] Tabela de idiomas suportados.
    const idiomasMaisFalados = [
        { code: "pt", name: "Português" },
        { code: "en", name: "English" },
        { code: "zh-CN", name: "中文 (Mandarim)" },
        { code: "hi", name: "Hindi" },
        { code: "es", name: "Español" },
        { code: "fr", name: "Français" },
        { code: "ar", name: "العربية" },
        { code: "bn", name: "Bengali" },
        { code: "ru", name: "Русский" },
        { code: "ur", name: "Urdu" },
        { code: "id", name: "Bahasa Indonesia" },
        { code: "de", name: "Deutsch" },
        { code: "ja", name: "日本語" },
        { code: "mr", name: "Marathi" },
        { code: "te", name: "Telugu" },
        { code: "tr", name: "Türkçe" },
        { code: "ta", name: "Tamil" },
        { code: "it", name: "Italiano" },
        { code: "vi", name: "Tiếng Việt" },
        { code: "tl", name: "Tagalog" }
    ];

    // [SUBAUXILIAR] Alimenta os elementos <select> personalizados.
    function popularSelectoresIdioma() {
        // [SUBSUBAUXILIAR] Ignora o select original gerado pelo Google.
        const selectores = document.querySelectorAll('select:not(.goog-te-combo)');
        
        selectores.forEach(select => {
            if (!select) return;
            
            select.options.length = 0;

            idiomasMaisFalados.forEach(idioma => {
                const option = new Option(idioma.name, idioma.code);
                if (idioma.code === 'pt') {
                    option.selected = true;
                }
                select.add(option);
            });

            select.onchange = (e) => {
                trocarIdioma(e.target.value);
            };
        });
    }

    // [SUBAUXILIAR] Altera o idioma no elemento nativo do Google Translate.
    window.trocarIdioma = function(codigoIdioma) {
        console.log("Idioma selecionado:", codigoIdioma);

        // [SUBSUBAUXILIAR] Mantém todos os seletores visuais em sintonia.
        const selectores = document.querySelectorAll('select:not(.goog-te-combo)');
        selectores.forEach(select => {
            select.value = codigoIdioma;
        });

        document.documentElement.lang = codigoIdioma;

        // [SUBSUBAUXILIAR] Dispara o evento de alteração do Google Translate.
        const selectGoogle = document.querySelector('.goog-te-combo');
        if (selectGoogle) {
            selectGoogle.value = codigoIdioma;
            selectGoogle.dispatchEvent(new Event('change'));
        } else {
            // [MECANISMO DE RETRY] Re-executa caso a API externa demore a carregar.
            setTimeout(() => trocarIdioma(codigoIdioma), 500);
        }
    };

    popularSelectoresIdioma();

    // ========================================================================
    // 3.2. MÓDULO AUXILIAR: MENU HAMBÚRGUER (MOBILE)
    // ========================================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    // [SUBAUXILIAR] Oculta o menu lateral e repõe submenus visíveis.
    function fecharMenuMobileCompleto() {
        if (hamburgerBtn) hamburgerBtn.classList.remove('ativo');
        if (navLinks) navLinks.classList.remove('menu-aberto');
        
        // [SUBSUBAUXILIAR] Esconde menus desdobráveis abertos.
        document.querySelectorAll('.dropdown-content').forEach(sub => {
            sub.classList.remove('submenu-visivel');
            sub.style.display = 'none';
            setTimeout(() => sub.style.display = '', 200);
        });
    }

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('ativo');
            navLinks.classList.toggle('menu-aberto');
        });
    }

    // ========================================================================
    // 3.3. MÓDULO AUXILIAR: GESTÃO DE MENU E DROPDOWNS
    // ========================================================================
    const links = document.querySelectorAll(".nav-links a, .dropdown-content a");
    const seccoes = document.querySelectorAll(".conteudo-seccao");
    const carousel = document.querySelector(".carousel-container");
    const navProfile = document.querySelector(".nav-profile");

    const seccaoNoticias = document.getElementById("noticias");
    const seccaoContacto = document.getElementById("contato");
    const carouselList = document.getElementById('carousel-list');
    const newsList = document.getElementById('news-list');

    const dropdowns = document.querySelectorAll('.dropdown');

    // [SUBAUXILIAR] Fecha submenus para prevenir sobreposição de elementos no ecrã.
    function fecharSubmenusDescendentes(elemento) {
        if (!elemento) return;
        
        const linkAtivo = elemento.querySelector('a:focus');
        if (linkAtivo) linkAtivo.blur();

        const submenus = elemento.querySelectorAll('.dropdown-content');
        submenus.forEach(content => {
            content.style.pointerEvents = 'none';
            content.style.opacity = '0';
            content.style.visibility = 'hidden';
            content.style.display = 'none';
        });

        // [SUBSUBAUXILIAR] Restaura propriedades CSS para animações futuras.
        setTimeout(() => {
            submenus.forEach(content => {
                content.style.removeProperty('pointer-events');
                content.style.removeProperty('opacity');
                content.style.removeProperty('visibility');
                content.style.removeProperty('display');
            });
        }, 150);
    }

    function fecharTodosDropdowns() {
        fecharSubmenusDescendentes(document);
    }

    // [SUBAUXILIAR] Estados de controlo do temporizador do duplo clique.
    let cliqueTimer = null;
    let contadorCliques = 0;
    let ultimoMenuClicado = null;
    const JANELA_TEMPO_DUPLO_CLIQUE = 1000;

    dropdowns.forEach(dropdown => {
        // [SUBAUXILIAR] Evento Mouseenter (Desktop).
        dropdown.addEventListener('mouseenter', function (e) {
            if (!isMobile()) {
                e.stopPropagation();

                // [SUBSUBAUXILIAR] Oculta menus irmãos abertos.
                const pai = this.parentElement;
                if (pai) {
                    const irmaos = pai.querySelectorAll(':scope > .dropdown');
                    irmaos.forEach(irmao => {
                        if (irmao !== this) {
                            fecharSubmenusDescendentes(irmao);
                        }
                    });
                }

                // [SUBSUBAUXILIAR] Deteção de bordas da janela (Edge detection).
                const submenuAtual = this.querySelector(':scope > .dropdown-content');
                if (submenuAtual) {
                    submenuAtual.style.removeProperty('display');
                    submenuAtual.style.removeProperty('opacity');
                    submenuAtual.style.removeProperty('visibility');
                    submenuAtual.style.removeProperty('pointer-events');

                    submenuAtual.classList.remove('abrir-esquerda');
                    const rect = submenuAtual.getBoundingClientRect();
                    const espacoDisponivelDireita = window.innerWidth - rect.right;
                    
                    if (espacoDisponivelDireita < 10) { 
                        submenuAtual.classList.add('abrir-esquerda');
                    }
                }
            }
        });

        // [SUBAUXILIAR] Lógica de clique (Simples vs Duplo) para touch / mobile.
        const linkPrincipal = dropdown.querySelector(':scope > a');
        if (linkPrincipal) {
            linkPrincipal.addEventListener('click', (e) => {
                const submenuAtual = dropdown.querySelector(':scope > .dropdown-content');

                if (submenuAtual) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (ultimoMenuClicado !== dropdown) {
                        clearTimeout(cliqueTimer);
                        contadorCliques = 0;
                        ultimoMenuClicado = dropdown;
                    }

                    contadorCliques++;

                    if (contadorCliques === 1) {
                        // [SUBSUBAUXILIAR] 1.º Clique: Expande o submenu.
                        if (isMobile()) {
                            const pai = dropdown.parentElement;
                            if (pai) {
                                const irmaos = pai.querySelectorAll(':scope > .dropdown');
                                irmaos.forEach(irmao => {
                                    if (irmao !== dropdown) {
                                        const submenusIrmao = irmao.querySelectorAll('.dropdown-content');
                                        submenusIrmao.forEach(sub => sub.classList.remove('submenu-visivel'));
                                    }
                                });
                            }
                            submenuAtual.classList.toggle('submenu-visivel');
                        }

                        cliqueTimer = setTimeout(() => {
                            contadorCliques = 0;
                        }, JANELA_TEMPO_DUPLO_CLIQUE);

                    } else if (contadorCliques === 2) {
                        // [SUBSUBAUXILIAR] 2.º Clique: Navega diretamente para o link.
                        clearTimeout(cliqueTimer);
                        contadorCliques = 0;

                        const targetId = linkPrincipal.getAttribute("href");
                        if (targetId && targetId.startsWith("#")) {
                            navegarParaSecao(targetId);
                        }

                        if (isMobile()) {
                            fecharMenuMobileCompleto();
                        } else {
                            fecharTodosDropdowns();
                        }
                    }
                }
            });
        }
    });

    const todosLinks = document.querySelectorAll('.nav-links a');
    todosLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const temFilhos = link.parentElement.querySelector(':scope > .dropdown-content');
            if (!temFilhos) {
                if (isMobile()) {
                    fecharMenuMobileCompleto();
                } else {
                    fecharTodosDropdowns();
                }
            }
        });
    });

    // ========================================================================
    // 3.4. MÓDULO AUXILIAR: ANIMAÇÃO DO CARROSSEL
    // ========================================================================
    if (carouselList) {
        let animando = false;

        // [SUBAUXILIAR] Rotação contínua dos slides.
        setInterval(() => {
            if (animando) return;

            const primeiroItem = carouselList.firstElementChild;
            if (!primeiroItem) return;

            const larguraItem = primeiroItem.offsetWidth;
            animando = true;

            // [SUBSUBAUXILIAR] Transição Suave.
            carouselList.style.transition = 'transform 0.8s ease-in-out';
            carouselList.style.transform = `translateX(-${larguraItem}px)`;

            // [SUBSUBAUXILIAR] Reordenação de elementos no DOM.
            setTimeout(() => {
                carouselList.style.transition = 'none';
                carouselList.appendChild(primeiroItem);
                carouselList.style.transform = 'translateX(0)';
                animando = false;
            }, 800);

        }, 4000);
    }

    // ========================================================================
    // 3.5. MÓDULO AUXILIAR: GRELHA DE NOTÍCIAS
    // ========================================================================
    if (newsList) {
        // [SUBAUXILIAR] Rotação dos cartões de notícias.
        setInterval(() => {
            const emPrimeiro = newsList.firstElementChild;
            if (!emPrimeiro) return;

            // [SUBSUBAUXILIAR] Animação de remoção CSS.
            emPrimeiro.classList.add('saindo');

            setTimeout(() => {
                emPrimeiro.classList.remove('saindo');
                newsList.appendChild(emPrimeiro);

                const novoSexto = newsList.children[5];
                if (novoSexto) {
                    novoSexto.classList.add('entrando');
                    setTimeout(() => novoSexto.classList.remove('entrando'), 600);
                }
            }, 600);
        }, 8000);
    }

    // ========================================================================
    // 3.6. MÓDULO AUXILIAR: NAVEGAÇÃO SPA (SINGLE PAGE APPLICATION)
    // ========================================================================
    // [SUBAUXILIAR] Restaura a visibilidade da página inicial.
    function mostrarPaginaInicial() {
        seccoes.forEach(seccao => seccao.classList.remove("ativo"));
        if (carousel) carousel.classList.remove("escondido");
        if (seccaoNoticias) seccaoNoticias.classList.add("ativo");
        if (seccaoContacto) seccaoContacto.classList.add("ativo");
        history.pushState(null, null, window.location.pathname);
    }

    // [SUBAUXILIAR] Muda a página ativa para a secção desejada.
    function navegarParaSecao(targetId) {
        if (!targetId || !targetId.startsWith("#")) return;

        if (carousel) carousel.classList.add("escondido");
        seccoes.forEach(seccao => seccao.classList.remove("ativo"));

        const seccaoAlvo = document.querySelector(targetId);
        if (seccaoAlvo) {
            seccaoAlvo.classList.add("ativo");
            seccaoAlvo.scrollIntoView({ behavior: 'smooth' });
        }

        // [SUBSUBAUXILIAR] Histórico do browser.
        if (window.location.hash !== targetId) {
            history.pushState(null, null, targetId);
        }
    }

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                navegarParaSecao(targetId);
            }
        });
    });

    if (navProfile) {
        navProfile.addEventListener("click", function (e) {
            e.preventDefault();
            mostrarPaginaInicial();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // [SUBAUXILIAR] Deteção de Hash direta na URL ao abrir a página.
    function carregarEstadoInicialOuHash() {
        const hash = window.location.hash;
        if (hash && document.querySelector(hash)) {
            navegarParaSecao(hash);
        } else {
            mostrarPaginaInicial();
        }
    }

    carregarEstadoInicialOuHash();
    // [SUBSUBAUXILIAR] Controlo de botões de navegação do browser (Avançar/Recuar).
    window.addEventListener("popstate", carregarEstadoInicialOuHash);

    // ========================================================================
    // 3.7. MÓDULO AUXILIAR: SISTEMA DE PESQUISA INTERNA
    // ========================================================================
    // [SUBAUXILIAR] Procura e exibe secções que contêm o termo pesquisado.
    function executarPesquisa(termo) {
        const termoFormatado = termo.trim().toLowerCase();

        if (termoFormatado === "") {
            carregarEstadoInicialOuHash();
            return;
        }

        if (carousel) carousel.classList.add("escondido");

        let encontrouResultados = false;

        // [SUBSUBAUXILIAR] Filtragem visual baseada no conteúdo textual.
        seccoes.forEach(seccao => {
            const textoSecao = seccao.textContent.toLowerCase();
            
            if (textoSecao.includes(termoFormatado)) {
                seccao.classList.add("ativo");
                encontrouResultados = true;
            } else {
                seccao.classList.remove("ativo");
            }
        });

        if (!encontrouResultados) {
            console.log("Nenhum resultado encontrado para: " + termo);
        }
    }

    // [SUBAUXILIAR] Eventos da Pesquisa Mobile.
    const searchContainer = document.getElementById('searchContainer');
    const searchOpenBtn = document.getElementById('searchOpenBtn');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const searchInput = document.getElementById('searchInput');
    const navHeader = document.querySelector('.nav-header');

    if (searchOpenBtn && searchContainer) {
        searchOpenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchContainer.classList.add('ativo');
            if (navHeader) navHeader.classList.add('search-active');
            if (searchInput) searchInput.focus();
        });

        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchContainer.classList.remove('ativo');
                if (navHeader) navHeader.classList.remove('search-active');
            }
        });

        if (searchCloseBtn) {
            searchCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                searchContainer.classList.remove('ativo');
                if (navHeader) navHeader.classList.remove('search-active');
            });
        }

        searchContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            executarPesquisa(e.target.value);
        });
    }

    // [SUBAUXILIAR] Eventos da Pesquisa Desktop.
    const searchDesktopWrapper = document.getElementById('searchDesktopWrapper');
    const searchDesktopBtn = document.getElementById('searchDesktopBtn');
    const searchDesktopClose = document.getElementById('searchDesktopClose');
    const searchInputDesktop = document.getElementById('searchInputDesktop');

    if (searchDesktopBtn && searchDesktopWrapper) {
        searchDesktopBtn.addEventListener('click', (e) => {
            if (!isMobile()) {
                e.stopPropagation();
                searchDesktopWrapper.classList.add('ativo');
                if (searchInputDesktop) searchInputDesktop.focus();
            }
        });

        if (searchDesktopClose) {
            searchDesktopClose.addEventListener('click', (e) => {
                if (!isMobile()) {
                    e.stopPropagation();
                    searchDesktopWrapper.classList.remove('ativo');
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (!isMobile() && searchDesktopWrapper && !searchDesktopWrapper.contains(e.target)) {
                searchDesktopWrapper.classList.remove('ativo');
            }
        });

        searchDesktopWrapper.addEventListener('click', (e) => {
            if (!isMobile()) {
                e.stopPropagation();
            }
        });
    }

    if (searchInputDesktop) {
        searchInputDesktop.addEventListener('input', (e) => {
            if (!isMobile()) {
                executarPesquisa(e.target.value);
            }
        });
    }
});