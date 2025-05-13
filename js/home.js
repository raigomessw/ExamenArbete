/**
 * ARQUIVO: home.js
 * DESCRIÇÃO: Lógica JavaScript para a aplicação web do trabalho de tese
 * AUTOR: Rai Gomes
 * VERSÃO: 2.0
 * DATA: 12 de maio de 2025
 */

// Correção imediata para garantir que seções importantes sejam visíveis em dispositivos móveis
(function() {
    // Verificar se estamos em dispositivo móvel
    const isMobile = window.innerWidth <= 768;
    
    // Aplicar visibilidade imediata às seções importantes
    const importantSections = ['introduktion'];
    
    importantSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            // Adicionar classes necessárias para visibilidade
            section.classList.add('in-viewport');
            
            // Em dispositivos móveis, aplicar estilos inline para garantir visibilidade
            if (isMobile) {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.transform = 'none';
                section.style.display = 'block';
            }
            
            // Tornar elementos internos visíveis também
            const elementsToShow = section.querySelectorAll('.feature-box, .fade-in, .slide-in');
            elementsToShow.forEach(el => {
                el.classList.add('visible');
                
                // Em dispositivos móveis, aplicar estilos inline para garantir visibilidade
                if (isMobile) {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                    el.style.transform = 'none';
                    el.style.display = 'block';
                }
            });
        }
    });
    
    // Adicionar um manipulador de evento para quando a página for totalmente carregada
    window.addEventListener('load', function() {
        // Verificar novamente as seções importantes após o carregamento completo
        importantSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('in-viewport');
                const elementsToShow = section.querySelectorAll('.feature-box, .fade-in, .slide-in');
                elementsToShow.forEach(el => el.classList.add('visible'));
            }
        });
    });
})();

// Função de carregador para melhor gerenciamento de eventos
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de componentes
    initPageLoader();
    initThemeToggle(); // Inicializar antes dos outros componentes para aplicar o tema correto
    initFormValidation();
    initSmoothScrolling();
    initScrollToTop();
    initCharts();
    initGallery();
    initBeforeAfterSlider();
    initEnhancedComparison(); // Nova função para interação aprimorada
    initMobileMenu();
    initAnimationObserver();
    initAccordion(); // Função para accordions
    initTabs(); // Função para sistema de abas
    initFloatingNav(); // Função para navegação flutuante e indicador de progresso
    initScrollAnimation(); // Nova função para animações de rolagem
    initCarousel(); // Nova função para carrossel de imagens
    animateStatBars(); // Função para animar barras de estatísticas
    initSectionCards(); // Função para interatividade dos cards de seção
    
    // Header novo - Inicialização
    initializeNyHeader();

    // Verificar e atualizar os gráficos após um breve atraso
    setTimeout(function() {
        if (typeof Chart !== 'undefined') {
            refreshCharts();
        }
    }, 500);
});

// =======================================
// ACCORDION
// =======================================
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (!accordionHeaders.length) return;
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class no cabeçalho
            this.classList.toggle('active');
            
            // Toggle active class no corpo
            const body = this.nextElementSibling;
            body.classList.toggle('active');
            
            // Atualizar aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Rotação do ícone já está no CSS
        });
    });
}

// =======================================
// SISTEMA DE ABAS
// =======================================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Pegar todos os botões relacionados com o mesmo pai
            const parentTabsContainer = this.closest('.tabs');
            const siblingsButtons = parentTabsContainer.querySelectorAll('.tab-button');
            
            // Remover active de todas as abas
            siblingsButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Adicionar active para a aba atual
            this.classList.add('active');
            
            // Pegar o identificador da aba
            const tabId = this.getAttribute('data-tab');
            
            // Esconder todos os conteúdos de abas
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar o conteúdo da aba selecionada
            const targetTabContent = document.getElementById(tabId);
            if (targetTabContent) {
                targetTabContent.classList.add('active');
            }
            
            // Anunciar para leitores de tela
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', 'polite');
            announcer.className = 'sr-only';
            announcer.textContent = `Flik ${this.textContent.trim()} aktiverad`;
            document.body.appendChild(announcer);
            
            setTimeout(() => {
                document.body.removeChild(announcer);
            }, 1000);
        });
    });
}

// =======================================
// GALERIA DE IMAGENS
// =======================================
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryContainer = document.querySelector('.gallery-container');

    if (!galleryItems.length || !galleryContainer) return;

    galleryItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir comportamento padrão do clique

            const img = item.querySelector('img');
            if (!img) return;

            // Adicionar um efeito visual ao clicar na imagem
            img.style.cursor = 'zoom-in';

            // Garantir que o lightbox seja acessível via teclado
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Visualizar imagem: ${img.alt}`);
            item.tabIndex = 0;

            // Adicionar suporte para ativação via teclado
            item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    item.click();
                }
            });

            // Atualizar o lightbox existente, se já estiver aberto
            const existingLightbox = document.querySelector('.inline-lightbox');
            if (existingLightbox) {
                const lightboxImage = existingLightbox.querySelector('.lightbox-image');
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                return;
            }

            // Criar o container para a imagem ampliada
            const lightbox = document.createElement('div');
            lightbox.className = 'inline-lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}" class="lightbox-image" />
                    <button class="close-lightbox" aria-label="Fechar visualização">&times;</button>
                </div>
            `;

            // Adicionar o lightbox ao container da galeria
            galleryContainer.appendChild(lightbox);

            // Ajustar a imagem para caber na tela e centralizar o lightbox
            const lightboxContent = lightbox.querySelector('.lightbox-content');
            lightboxContent.style.display = 'flex';
            lightboxContent.style.justifyContent = 'center';
            lightboxContent.style.alignItems = 'center';
            lightboxContent.style.height = '100vh';
            lightboxContent.style.width = '100%';
            lightboxContent.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

            const lightboxImage = lightbox.querySelector('.lightbox-image');
            lightboxImage.style.maxWidth = '90%';
            lightboxImage.style.maxHeight = '90%';
            lightboxImage.style.objectFit = 'contain';

            // Rolar automaticamente para o lightbox
            lightbox.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Fechar o lightbox ao clicar fora da imagem
            lightbox.addEventListener('click', (event) => {
                if (event.target === lightbox) {
                    galleryContainer.removeChild(lightbox);
                }
            });

            // Fechar o lightbox ao clicar no botão de fechar
            const closeButton = lightbox.querySelector('.close-lightbox');
            closeButton.addEventListener('click', () => {
                galleryContainer.removeChild(lightbox);
            });
        });
    });
}

// =======================================
// OTIMIZAÇÃO DO MODAL PARA MOBILE
// =======================================
function optimizeGalleryModalForMobile() {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');

    if (!modal || !modalImage) return;

    // Adicionar classes específicas para mobile
    function applyMobileStyles() {
        if (window.innerWidth <= 768) {
            modal.classList.add('mobile-optimized');
            modalImage.style.maxWidth = '90%';
            modalImage.style.maxHeight = '70%';
        } else {
            modal.classList.remove('mobile-optimized');
            modalImage.style.maxWidth = '';
            modalImage.style.maxHeight = '';
        }
    }

    // Aplicar estilos ao carregar a página e ao redimensionar
    applyMobileStyles();
    window.addEventListener('resize', applyMobileStyles);
}

// =======================================
// NAVEGAÇÃO MÓVEL (DROPDOWN)
// =======================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const header = document.querySelector('header');
    
    if (!menuToggle || !dropdownMenu) {
        console.log('Menu dropdown ou botão não encontrados');
        return;
    }
    
    // Garantir que os elementos estejam visíveis em telas móveis
    if (window.innerWidth <= 768) {
        if (mobileMenuContainer) {
            mobileMenuContainer.style.display = 'block';
        }
        
        menuToggle.style.display = 'flex';
        menuToggle.style.visibility = 'visible';
        menuToggle.style.opacity = '1';
    }
    
    // Verificar e corrigir o estado do menu ao carregar a página
    if (menuToggle.getAttribute('aria-expanded') === 'true') {
        dropdownMenu.classList.add('show');
        menuToggle.classList.add('active');
    } else {
        dropdownMenu.classList.remove('show');
        menuToggle.classList.remove('active');
    }
    
    // Função para verificar se estamos em visualização móvel
    function isMobileView() {
        return window.innerWidth <= 768;
    }
    
    // Gerenciar estado do menu dropdown
    menuToggle.addEventListener('click', function(event) {
        // Prevenir que o clique propague para o document
        event.stopPropagation();
        
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        // Se já estiver expandido, apenas feche o menu
        if (isExpanded) {
            console.log('Menu está aberto, fechando...');
            closeMenu();
            return;
        }
        
        // Se chegou aqui, é para abrir o menu
        console.log('Menu está fechado, abrindo...');
        
        // Alternar o estado do botão
        menuToggle.setAttribute('aria-expanded', 'true');
        
        // Mostrar o dropdown
        dropdownMenu.classList.add('show');
        
        // Animar o ícone hamburger
        menuToggle.classList.add('active');
        
        // Garantir que o container do menu esteja visível
        const mobileMenuContainer = document.querySelector('.mobile-menu-container');
        if (mobileMenuContainer) {
            mobileMenuContainer.style.display = 'block';
        }
        
        // Anunciar para leitores de tela
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        announcer.textContent = newState ? 'Meny öppnad' : 'Meny stängd';
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    });
    
    // Função para fechar o menu
    function closeMenu() {
        console.log('Fechando menu dropdown');
        
        // Remover classe show do dropdown
        dropdownMenu.classList.remove('show');
        
        // Restaurar o estado do botão
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        
        // Garantir que as classes CSS estejam corretas
        const hamburger = menuToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        
        // Anunciar para leitores de tela
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        announcer.textContent = 'Meny stängd';
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }
    
    // Fechar menu ao clicar em links de navegação
    const navLinks = dropdownMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Fechar o menu
            closeMenu();
            
            // Se o link for para um elemento na mesma página, fazemos scroll suave
            if (link.getAttribute('href').startsWith('#')) {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Verificar preferência por movimento reduzido
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
                    
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior, block: 'start' });
                    }, 100);
                }
            }
        });
    });
    
    // Adicionar evento de click diretamente ao elemento hamburger
    const hamburgerElement = menuToggle.querySelector('.hamburger');
    if (hamburgerElement) {
        hamburgerElement.addEventListener('click', function(event) {
            event.stopPropagation();
            
            // Se o menu estiver expandido, fecha
            if (menuToggle.getAttribute('aria-expanded') === 'true') {
                closeMenu();
            } else {
                // Alternar o estado do botão para abrir
                menuToggle.setAttribute('aria-expanded', 'true');
                menuToggle.classList.add('active');
                dropdownMenu.classList.add('show');
            }
        });
    }
    
    // Fechar o dropdown ao clicar em qualquer lugar fora do menu
    document.addEventListener('click', function(event) {
        if (dropdownMenu.classList.contains('show') && 
            !dropdownMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });
    
    // Tornar o header mais compacto ao rolar
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        if (!isMobileView() || !header) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adicionar classe compact ao header quando rolar para baixo
        if (scrollTop > 50) {
            header.classList.add('compact');
        } else {
            header.classList.remove('compact');
        }
        
        // Esconder/mostrar o header baseado na direção da rolagem
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            // Rolando para baixo
            header.style.transform = 'translateY(-100%)';
        } else {
            // Rolando para cima
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Fechar menu ao redimensionar a janela
    window.addEventListener('resize', () => {
        if (dropdownMenu.classList.contains('show')) {
            closeMenu();
        }
    });
}

// =======================================
// ANIMAÇÕES AO SCROLLAR
// =======================================
function initAnimationObserver() {
    // Usar IntersectionObserver para animações baseadas em visibilidade
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-viewport');
                
                // Animar elementos filhos
                const elementsToAnimate = entry.target.querySelectorAll('.feature-box, .fade-in, .slide-in');
                elementsToAnimate.forEach((element, index) => {
                    // Respeitar preferências de redução de movimento
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    
                    if (prefersReducedMotion) {
                        element.classList.add('visible');
                    } else {
                        setTimeout(() => {
                            element.classList.add('visible');
                        }, index * 200); // Animação escalonada
                    }
                });
                
                // Não removemos a observação para garantir que a visibilidade seja mantida
                // em dispositivos móveis quando a página é recarregada
                // observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px' }); // Reduzido o threshold e removido o rootMargin negativo
    
    // Garantir que a seção de introdução sempre tenha a classe in-viewport
    const introSection = document.getElementById('introduktion');
    if (introSection) {
        introSection.classList.add('in-viewport');
        
        // Também garantir que os elementos internos sejam visíveis
        const introElements = introSection.querySelectorAll('.feature-box, .fade-in, .slide-in');
        introElements.forEach(element => {
            element.classList.add('visible');
        });
    }
    
    // Observar todas as seções
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// =======================================
// TEMA ESCURO
// =======================================
function initThemeToggle() {
    console.log("Inicializando controlador de tema...");
    const themeToggle = document.getElementById('themeToggle');
    const footerThemeToggle = document.getElementById('footerThemeToggle');
    const themeToggles = [themeToggle, footerThemeToggle].filter(Boolean);
    
    // Se não encontrou os botões, tenta criar um botão de fallback
    if (!themeToggles.length) {
        console.warn("Botões de tema não encontrados, criando botão de fallback");
        const fallbackToggle = document.createElement('button');
        fallbackToggle.id = 'themeToggle';
        fallbackToggle.className = 'theme-toggle';
        fallbackToggle.setAttribute('aria-label', 'Växla mörkt läge');
        fallbackToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
        
        // Adiciona o botão ao topo da página
        document.body.insertBefore(fallbackToggle, document.body.firstChild);
        themeToggles.push(fallbackToggle);
    }
    
    // Verificar preferência do usuário ou configuração salva
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    // Aplicar tema salvo ou preferência do sistema
    const isDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDarkScheme.matches);
    
    // Aplicar a classe antes de qualquer coisa para evitar flash de conteúdo
    if (isDarkMode) {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
        document.body.classList.remove('dark-theme');
    }
    
    console.log("Tema atual:", isDarkMode ? "escuro" : "claro");
    
    // Atualizar todos os ícones
    updateAllThemeIcons(isDarkMode);
    
    // Adicionar event listeners a todos os botões de tema
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            console.log("Botão de tema clicado");
            const newDarkMode = !document.body.classList.contains('dark-theme');
            
            // Aplicar ao HTML e ao BODY para garantir que todos os estilos sejam aplicados
            document.documentElement.classList.toggle('dark-theme', newDarkMode);
            document.body.classList.toggle('dark-theme', newDarkMode);
            
            localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
            updateAllThemeIcons(newDarkMode);
            announceThemeChange(newDarkMode);
            
            // Atualizar os gráficos quando o tema mudar
            refreshCharts();
            
            console.log("Tema alterado para:", newDarkMode ? "escuro" : "claro");
        });
    });
    
    // Atualizar todos os ícones de tema
    function updateAllThemeIcons(isDarkMode) {
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                if (isDarkMode) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                    toggle.setAttribute('aria-label', 'Växla till ljust läge');
                    toggle.classList.add('is-dark-mode');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    toggle.setAttribute('aria-label', 'Växla till mörkt läge');
                    toggle.classList.remove('is-dark-mode');
                }
            }
        });
    }
    
    // Anunciar mudança de tema para leitores de tela
    function announceThemeChange(isDarkMode) {
        // Atualizar a meta tag theme-color para corresponder ao tema atual
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', isDarkMode ? '#1c1c1e' : '#4a69bd');
        }
        
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        announcer.textContent = isDarkMode ? 'Mörkt läge aktiverat' : 'Ljust läge aktiverat';
        document.body.appendChild(announcer);
        
        // Aplicar classe na transição ao corpo do documento para efeitos de animação
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 1000);
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }
    
    // Atualizar tema quando a preferência do sistema mudar
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const systemIsDark = e.matches;
            document.body.classList.toggle('dark-theme', systemIsDark);
            updateAllThemeIcons(systemIsDark);
        }
    });
}

// Função para atualizar os gráficos quando o tema mudar
function refreshCharts() {
    // Verificar se o Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error("Chart.js não está disponível para atualização dos gráficos");
        return;
    }
    
    console.log("Atualizando gráficos para o novo tema");
    
    try {
        // Remover mensagens de erro, se existirem
        document.querySelectorAll('.chart-error').forEach(error => error.remove());
        
        // Mostrar os canvas novamente
        document.querySelectorAll('.chart').forEach(chart => {
            chart.style.display = 'block';
        });
        
        // Destruir gráficos existentes para recriá-los com o novo tema
        if (window.navChart) {
            window.navChart.destroy();
            window.navChart = null;
        }
        
        if (window.designChart) {
            window.designChart.destroy();
            window.designChart = null;
        }
        
        // Inicializar os gráficos novamente com o novo tema
        setTimeout(() => {
            initNavChart();
            initDesignChart();
        }, 100); // Pequeno atraso para garantir que o DOM foi atualizado
    } catch (error) {
        console.error("Erro ao atualizar os gráficos:", error);
    }
}

// Função para verificar o status dos gráficos e reinicializá-los se necessário
function checkChartsStatus() {
    // Verificar se os gráficos estão visíveis na página
    const navChartEl = document.getElementById('navChart');
    const designChartEl = document.getElementById('designChart');
    
    if (navChartEl && !window.navChart) {
        console.log("Reinicializando gráfico de navegação");
        initNavChart();
    }
    
    if (designChartEl && !window.designChart) {
        console.log("Reinicializando gráfico de design");
        initDesignChart();
    }
    
    // Verificar se estamos no modo escuro e se os gráficos têm o tema correto
    const isDarkMode = document.body.classList.contains('dark-theme');
    if ((window.navChart && window.navChart._darkMode !== isDarkMode) || 
        (window.designChart && window.designChart._darkMode !== isDarkMode)) {
        console.log("Atualizando tema dos gráficos");
        refreshCharts();
    }
    
    // Registrar o modo escuro nos gráficos para verificações futuras
    if (window.navChart) window.navChart._darkMode = isDarkMode;
    if (window.designChart) window.designChart._darkMode = isDarkMode;
}

// Função para exibir erro em caso de falha no carregamento do gráfico
function displayChartError(chartElement, errorMessage) {
    if (!chartElement) return;
    
    // Criar container de erro para substituir o gráfico
    const errorContainer = document.createElement('div');
    errorContainer.className = 'chart-error';
    errorContainer.innerHTML = `
        <div class="chart-error-icon">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="chart-error-message">
            ${errorMessage}
        </div>
        <button class="chart-retry-btn">
            <i class="fas fa-sync-alt"></i> Försök igen
        </button>
    `;
    
    // Substituir o canvas pelo container de erro
    chartElement.style.display = 'none';
    chartElement.parentNode.appendChild(errorContainer);
    
    // Adicionar botão para tentar novamente
    const retryBtn = errorContainer.querySelector('.chart-retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            // Remover container de erro
            errorContainer.remove();
            
            // Mostrar canvas novamente
            chartElement.style.display = 'block';
            
            // Tentar inicializar os gráficos novamente
            if (chartElement.id === 'navChart') {
                initNavChart();
            } else if (chartElement.id === 'designChart') {
                initDesignChart();
            }
        });
    }
}

// =======================================
// NAVEGAÇÃO FLUTUANTE E INDICADOR DE PROGRESSO
// =======================================
function initFloatingNav() {
    const floatingNav = document.querySelector('.floating-nav');
    const sections = document.querySelectorAll('section[id]');
    const progressIndicator = document.querySelector('.progress-indicator');
    
    if (!floatingNav || !sections.length || !progressIndicator) return;
    
    // Mostrar a navegação após rolagem inicial
    window.addEventListener('scroll', () => {
        // Mostrar após rolar um pouco
        if (window.scrollY > 300) {
            floatingNav.classList.add('visible');
        } else {
            floatingNav.classList.remove('visible');
        }
        
        // Atualizar indicador de progresso
        const scrollPosition = window.scrollY;
        const documentHeight = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = (scrollPosition / documentHeight) * 100;
        
        progressIndicator.style.width = `${scrollProgress}%`;
        
        // Atualizar item ativo na navegação
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Atualizando classes ativas
        document.querySelectorAll('.floating-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === currentSection) {
                item.classList.add('active');
            }
        });
    });
}

// =======================================
// CARREGAMENTO DE PÁGINA
// =======================================
function initPageLoader() {
    const pageLoader = document.getElementById('pageLoader');
    
    if (!pageLoader) return;
    
    // Exibir carregador durante o carregamento inicial
    window.addEventListener('load', function() {
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.style.display = 'none';
                // Anunciar para leitores de tela
                const announcer = document.createElement('div');
                announcer.setAttribute('aria-live', 'assertive');
                announcer.className = 'sr-only';
                announcer.textContent = 'Webbplatsen har laddats klart';
                document.body.appendChild(announcer);
                
                setTimeout(() => {
                    document.body.removeChild(announcer);
                }, 1000);
            }, 300);
        }, 500); // Atraso para garantir que tudo esteja carregado
    });
}

// =======================================
// ANIMAÇÃO DE ROLAGEM
// =======================================
function initScrollAnimation() {
    // Verificar se o usuário prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Se preferir movimento reduzido, não adicionar animações
        console.log('Animações de rolagem desativadas devido à preferência de redução de movimento');
        return;
    }
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Parar de observar depois que a animação for aplicada
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Adicionar atraso para elementos dentro de contêineres
    document.querySelectorAll('.stagger-container').forEach(container => {
        const elements = container.querySelectorAll('.stagger-item');
        elements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// =======================================
// ROLAGEM SUAVE
// =======================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Não fazer nada se for um link vazio
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                
                // Verificar preferências de redução de movimento
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                if (prefersReducedMotion) {
                    // Rolagem instantânea para usuários que preferem movimento reduzido
                    target.scrollIntoView();
                } else {
                    // Rolagem suave para outros usuários
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Focar no elemento alvo para melhor acessibilidade
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
                
                // Atualizar histórico de URL
                history.pushState(null, '', targetId);
            }
        });
    });
}

// =======================================
// BOTÃO VOLTAR AO TOPO
// =======================================
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    // Mostrar o botão quando o usuário rolar para baixo
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Voltar ao topo ao clicar no botão
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Verificar preferências de redução de movimento
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// =======================================
// FORMULÁRIO DE CONTATO
// =======================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    if (!forms.length) return;
    
    forms.forEach(form => {
        form.setAttribute('novalidate', '');
        
        form.addEventListener('submit', function(event) {
            if (!validateForm(form)) {
                event.preventDefault();
            }
        });
        
        // Validação ao perder o foco
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
    });
    
    function validateForm(form) {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateInput(input) {
        // Valor é requerido mas está vazio
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, 'Detta fält är obligatoriskt');
            return false;
        }
        
        // Validação de email
        if (input.type === 'email' && input.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value)) {
                showError(input, 'Vänligen ange en giltig e-postadress');
                return false;
            }
        }
        
        // Validação de telefone
        if (input.type === 'tel' && input.value.trim()) {
            const phonePattern = /^[0-9\s\-\+\(\)]{8,20}$/;
            if (!phonePattern.test(input.value)) {
                showError(input, 'Vänligen ange ett giltigt telefonnummer');
                return false;
            }
        }
        
        // Se chegou aqui, está tudo OK
        clearError(input);
        return true;
    }
    
    function showError(input, message) {
        // Limpar erro existente primeiro
        clearError(input);
        
        input.classList.add('error');
        
        // Criar elemento de erro
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        
        // Adicionar mensagem depois do input
        input.parentNode.insertBefore(errorMsg, input.nextSibling);
        
        // Configurar aria attributes para acessibilidade
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `error-${input.name || input.id}`);
        errorMsg.id = `error-${input.name || input.id}`;
    }
    
    function clearError(input) {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
        
        // Remover mensagem de erro
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.parentNode.removeChild(errorMsg);
        }
    }
}

// =======================================
// GRÁFICOS E VISUALIZAÇÃO DE DADOS
// =======================================
function initCharts() {
    // Inicialização dos gráficos gerais
    console.log('Inicializando gráficos e visualizações de dados');
    
    // Verificar se o Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está carregado');
        return;
    }
    
    // Inicializar visualização sazonal
    initSeasonalVisualization();
    
    // Inicializar os gráficos Chart.js
    initNavChart();
    initDesignChart();
}

// Configurações comuns para os gráficos (considerando modo escuro)
function getChartConfig() {
    // Verificar se estamos no modo escuro
    const isDarkMode = document.body.classList.contains('dark-theme');
    
    return {
        color: isDarkMode ? '#f0f0f0' : '#333333',
        gridColor: isDarkMode ? '#444444' : '#dddddd',
        backgroundColor: isDarkMode ? '#252525' : '#ffffff',
        borderColor: isDarkMode ? '#555555' : '#e0e0e0',
        pointBackgroundColor: isDarkMode ? '#7aa3ff' : '#4a69bd',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        tooltipBackgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        tooltipColor: isDarkMode ? '#f0f0f0' : '#333333',
        tooltipBorderColor: isDarkMode ? '#555555' : '#dddddd'
    };
}

// Inicializar gráfico de navegação
function initNavChart() {
    const navChartEl = document.getElementById('navChart');
    if (!navChartEl) return;
    
    try {
        const config = getChartConfig();
        
        // Dados do gráfico de navegação
        const navData = {
            labels: ['Mycket svår', 'Svår', 'Neutral', 'Lätt', 'Mycket lätt'],
            datasets: [{
                label: 'Användarens betyg',
                data: [30, 35, 20, 10, 5],
                backgroundColor: [
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(243, 156, 18, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(39, 174, 96, 0.7)'
                ],
                borderColor: [
                    'rgba(231, 76, 60, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(39, 174, 96, 1)'
                ],
                borderWidth: 1
            }]
        };
        
        // Opções do gráfico
        const navOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: config.fontFamily
                        },
                        color: config.color
                    }
                },
                title: {
                    display: true,
                    text: 'Användares navigeringsbetyg',
                    color: config.color,
                    font: {
                        family: config.fontFamily,
                        size: 16
                    }
                },
                tooltip: {
                    backgroundColor: config.tooltipBackgroundColor,
                    titleColor: config.tooltipColor,
                    bodyColor: config.tooltipColor,
                    borderColor: config.tooltipBorderColor,
                    borderWidth: 1,
                    displayColors: true,
                    boxPadding: 5
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: config.color,
                        font: {
                            family: config.fontFamily
                        }
                    },
                    grid: {
                        color: config.gridColor
                    }
                },
                x: {
                    ticks: {
                        color: config.color,
                        font: {
                            family: config.fontFamily
                        }
                    },
                    grid: {
                        color: config.gridColor
                    }
                }
            }
        };
        
        // Criar o gráfico
        window.navChart = new Chart(navChartEl, {
            type: 'bar',
            data: navData,
            options: navOptions
        });
        
    } catch (error) {
        console.error("Erro ao inicializar o gráfico de navegação:", error);
        displayChartError(navChartEl, "Fel vid ladda navigeringsdiagrammet");
    }
}

// Inicializar gráfico de design visual
function initDesignChart() {
    const designChartEl = document.getElementById('designChart');
    if (!designChartEl) return;
    
    try {
        const config = getChartConfig();
        
        // Dados do gráfico de design - usando tipo gráfico de linha já que radar pode não ser bem suportado
        const designData = {
            labels: ['Modern design', 'Färgschema', 'Läsbarhet', 'Layout', 'Responsivitet'],
            datasets: [{
                label: 'Positiva omdömen',
                data: [25, 80, 55, 40, 50],
                backgroundColor: 'rgba(74, 105, 189, 0.2)',
                borderColor: 'rgba(74, 105, 189, 1)',
                pointBackgroundColor: config.pointBackgroundColor,
                pointBorderColor: config.borderColor,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(74, 105, 189, 1)',
                borderWidth: 2,
                tension: 0.3
            }]
        };
        
        // Opções do gráfico
        const designOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: config.fontFamily
                        },
                        color: config.color
                    }
                },
                title: {
                    display: true,
                    text: 'Positiva omdömen om designelement (%)',
                    color: config.color,
                    font: {
                        family: config.fontFamily,
                        size: 16
                    }
                },
                tooltip: {
                    backgroundColor: config.tooltipBackgroundColor,
                    titleColor: config.tooltipColor,
                    bodyColor: config.tooltipColor,
                    borderColor: config.tooltipBorderColor,
                    borderWidth: 1,
                    displayColors: true,
                    boxPadding: 5
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: config.color,
                        font: {
                            family: config.fontFamily
                        }
                    },
                    grid: {
                        color: config.gridColor
                    },
                    title: {
                        display: true,
                        text: 'Percentage (%)',
                        color: config.color,
                        font: {
                            family: config.fontFamily
                        }
                    }
                },
                x: {
                    ticks: {
                        color: config.color,
                        font: {
                            family: config.fontFamily
                        }
                    },
                    grid: {
                        color: config.gridColor
                    }
                }
            }
        };
        
        // Criar o gráfico
        window.designChart = new Chart(designChartEl, {
            type: 'line',  // Alterado de radar para linha para melhor compatibilidade
            data: designData,
            options: designOptions
        });
        
    } catch (error) {
        console.error("Erro ao inicializar o gráfico de design:", error);
        displayChartError(designChartEl, "Fel vid ladda designdiagrammet");
    }
}

// =======================================
// VISUALIZAÇÃO SAZONAL
// =======================================
function initSeasonalVisualization() {
    const seasonalStats = document.querySelectorAll('.season-card');
    if (!seasonalStats.length) return;
    
    // Inicializar o observador de interseção para animar quando visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const statBars = card.querySelectorAll('.stat-bar-fill');
                
                // Animar barras de estatísticas
                statBars.forEach(bar => {
                    bar.classList.add('animate');
                });
                
                // Não precisamos continuar observando depois de animar
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.2 });
    
    // Observar cada cartão sazonal
    seasonalStats.forEach(card => {
        observer.observe(card);
    });
    
    // Função para criar efeito de deslocamento suave com o mouse (3D hover)
    function addTiltEffect(element) {
        // Verificar se o usuário prefere movimento reduzido
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        
        element.addEventListener('mousemove', e => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        element.addEventListener('mouseleave', e => {
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }
    
    // Adicionar efeito 3D aos cartões sazonais
    seasonalStats.forEach(card => {
        addTiltEffect(card);
    });
}

// =======================================
// SUBSTITUIÇÃO DO SLIDER DE ANTES/DEPOIS
// =======================================
function initBeforeAfterSlider() {
    // Como removemos o slider, esta função agora apenas garante
    // que as comparações lado a lado estejam funcionando corretamente
    const comparisons = document.querySelectorAll('.comparison-item');
    
    if (!comparisons.length) return;
    
    // Adicionar efeitos de hover e foco
    comparisons.forEach(item => {
        const container = item.querySelector('.comparison-image-container');
        if (!container) return;
        
        // Tornar contêineres focáveis
        container.tabIndex = 0;
        
        // Adicionar indicações de foco
        container.addEventListener('focus', () => {
            container.classList.add('focused');
        });
        
        container.addEventListener('blur', () => {
            container.classList.remove('focused');
        });
    });
}

// =======================================
// INTERAÇÃO DE COMPARAÇÃO APRIMORADA
// =======================================
function initEnhancedComparison() {
    const comparisonItems = document.querySelectorAll('.comparison-item');
    
    if (!comparisonItems.length) return;
    
    comparisonItems.forEach(item => {
        const container = item.querySelector('.comparison-image-container');
        const img = container ? container.querySelector('img') : null;
        
        if (!container || !img) return;
        
        // Adicionar interatividade para teclado
        container.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Simular clique para mostrar imagem em tamanho completo
                // Esta funcionalidade poderia ser expandida para abrir um lightbox
                container.classList.add('active-focus');
                setTimeout(() => container.classList.remove('active-focus'), 1000);
            }
        });
        
        // Adicionar efeito de destaque ao passar o mouse
        container.addEventListener('mouseenter', () => {
            container.classList.add('hover-highlight');
        });
        
        container.addEventListener('mouseleave', () => {
            container.classList.remove('hover-highlight');
        });
        
        // Adicionar efeito 3D suave no movimento do mouse (se movimento não for reduzido)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            container.addEventListener('mousemove', e => {
                const bounds = container.getBoundingClientRect();
                const mouseX = e.clientX - bounds.left;
                const mouseY = e.clientY - bounds.top;
                
                const centerX = bounds.width / 2;
                const centerY = bounds.height / 2;
                
                const percentX = (mouseX - centerX) / centerX;
                const percentY = (mouseY - centerY) / centerY;
                
                // Movimento suave limitado a 5 graus
                const rotateX = percentY * -5;
                const rotateY = percentX * 5;
                
                container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            container.addEventListener('mouseleave', () => {
                // Resetar ao sair
                container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        }
    });
}

// =======================================
// CARROSSEL DE IMAGENS
// =======================================
function initCarousel() {
    // Verificar se há carrosséis na página
    const carousels = document.querySelectorAll('.carousel');
    
    // Se não houver carrosséis, encerrar a função
    if (!carousels.length) {
        console.log("Nenhum carrossel encontrado na página - Função encerrada");
        return;
    }
    
    // Para cada carrossel encontrado (mesmo que tenha sido removido do DOM posteriormente)
    carousels.forEach(carousel => {
        // Verificação extra para garantir que o carrossel ainda existe no DOM
        if (!document.body.contains(carousel)) {
            return;
        }
        
        const container = carousel.querySelector('.carousel-container');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        const dots = carousel.querySelectorAll('.carousel-dot');
        
        if (!container || !items.length) return;
        
        let currentIndex = 0;
        const totalItems = items.length;
        
        // Configurar larguras iniciais
        container.style.width = `${totalItems * 100}%`;
        items.forEach(item => {
            item.style.width = `${100 / totalItems}%`;
        });
        
        // Inicializar dots
        if (dots.length) {
            dots[0].classList.add('active');
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
                
                // Acessibilidade com teclado
                dot.setAttribute('role', 'button');
                dot.setAttribute('aria-label', `Vá para o slide ${index + 1}`);
                dot.tabIndex = 0;
                
                dot.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goToSlide(index);
                    }
                });
            });
        }
        
        // Configurar botões de navegação
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }
        
        // Adicionar swipe em dispositivos móveis
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50; // pixels mínimos para considerar um swipe
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe para a esquerda (próximo)
                goToSlide(currentIndex + 1);
            }
            
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe para a direita (anterior)
                goToSlide(currentIndex - 1);
            }
        }
        
        // Auto-rotação (opcional)
        let autoRotate = carousel.hasAttribute('data-auto-rotate');
        let rotationInterval;
        const rotationDelay = parseInt(carousel.getAttribute('data-rotation-delay') || '5000', 10);
        
        if (autoRotate) {
            startAutoRotation();
            
            // Pausar ao passar o mouse ou ao focar
            carousel.addEventListener('mouseenter', stopAutoRotation);
            carousel.addEventListener('mouseleave', startAutoRotation);
            carousel.addEventListener('focusin', stopAutoRotation);
            carousel.addEventListener('focusout', startAutoRotation);
        }
        
        function startAutoRotation() {
            // Verificar se o usuário prefere movimento reduzido
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;
            
            rotationInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, rotationDelay);
        }
        
        function stopAutoRotation() {
            clearInterval(rotationInterval);
        }
        
        // Função principal para navegar entre slides
        function goToSlide(index) {
            // Lidar com wraparound
            if (index < 0) {
                index = totalItems - 1;
            } else if (index >= totalItems) {
                index = 0;
            }
            
            currentIndex = index;
            
            // Verificar preferências de movimento reduzido
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // Aplicar transição suave ou instantânea conforme preferência
            if (prefersReducedMotion) {
                container.style.transition = 'none';
            } else {
                container.style.transition = 'transform 0.5s ease-in-out';
            }
            
            // Mover o contêiner
            const translateValue = -index * (100 / totalItems);
            container.style.transform = `translateX(${translateValue}%)`;
            
            // Atualizar dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                dot.setAttribute('aria-current', i === index ? 'true' : 'false');
            });
            
            // Anunciar para leitores de tela
            announceSlideChange(index + 1, totalItems);
        }
        
        function announceSlideChange(current, total) {
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', 'polite');
            announcer.className = 'sr-only';
            
            // Obter título do slide atual se disponível
            const currentSlide = items[currentIndex];
            const slideCaption = currentSlide.querySelector('.carousel-caption h3');
            const captionText = slideCaption ? slideCaption.textContent : '';
            
            announcer.textContent = `Slide ${current} de ${total}${captionText ? ': ' + captionText : ''}`;
            document.body.appendChild(announcer);
            
            setTimeout(() => {
                document.body.removeChild(announcer);
            }, 1000);
        }
    });
}

// =======================================
// ANIMAÇÃO DE BARRAS DE ESTATÍSTICAS
// =======================================
function animateStatBars() {
    const statBars = document.querySelectorAll('.stat-bar-fill');
    
    // Verifica se o navegador suporta IntersectionObserver
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona classe para animar quando estiver visível
                    entry.target.classList.add('animate');
                    
                    // Para de observar depois de animar
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
        
        // Observa cada barra
        statBars.forEach(bar => {
            observer.observe(bar);
        });
    } else {
        // Fallback para navegadores antigos
        statBars.forEach(bar => {
            bar.classList.add('animate');
        });
    }
    
    // Re-aplicar se o tema mudar
    document.getElementById('themeToggle').addEventListener('click', function() {
        // Pequeno atraso para permitir a transição do tema primeiro
        setTimeout(function() {
            // Remove e re-adiciona as classes para reiniciar as animações
            document.querySelectorAll('.stat-bar-fill').forEach(bar => {
                bar.classList.remove('animate');
                void bar.offsetWidth; // Força reflow
                bar.classList.add('animate');
            });
        }, 300);
    });
}

// =======================================
// RESPONSIVIDADE DOS ELEMENTOS
// =======================================
// Função para gerenciar a responsividade dos elementos
function handleResponsiveElements() {
    // Ajusta a altura dos cartões de estações para que todos tenham a mesma altura
    const seasonCards = document.querySelectorAll('.season-card');
    
    // Resetar alturas antes de recalcular
    seasonCards.forEach(card => {
        card.style.height = 'auto';
    });
    
    // Só igualar alturas em telas maiores que 767px
    if (window.innerWidth > 767) {
        let maxHeight = 0;
        
        // Encontrar a altura máxima
        seasonCards.forEach(card => {
            const cardHeight = card.offsetHeight;
            maxHeight = Math.max(maxHeight, cardHeight);
        });
        
        // Aplicar altura máxima a todos os cartões
        seasonCards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    }
    
    // Verificar se estamos em dispositivo móvel
    if (window.innerWidth <= 767) {
        // Forçar visibilidade para seções importantes em dispositivos móveis
        const importantSections = ['introduktion'];
        importantSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                // Garantir que a seção seja visível
                section.classList.add('in-viewport');
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.display = 'block';
                
                // Garantir que os elementos internos também sejam visíveis
                const elementsToShow = section.querySelectorAll('.feature-box, .fade-in, .slide-in');
                elementsToShow.forEach(el => {
                    el.classList.add('visible');
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                    el.style.transform = 'none';
                });
            }
        });
    }
    
    // Ajustar tabelas responsivas para dispositivos móveis
    const tables = document.querySelectorAll('.data-table-container');
    
    tables.forEach(table => {
        if (window.innerWidth <= 640) {
            table.setAttribute('role', 'region');
            table.setAttribute('aria-label', 'Scrollable table');
            table.setAttribute('tabindex', '0');
        } else {
            table.removeAttribute('role');
            table.removeAttribute('aria-label');
            table.removeAttribute('tabindex');
        }
    });
}

// Executar quando a página carregar e quando for redimensionada
window.addEventListener('load', handleResponsiveElements);
window.addEventListener('resize', handleResponsiveElements);

// Certificar-se de que a seção de Introdução seja visível após a carga completa da página
window.addEventListener('load', function() {
    // Pequeno atraso para garantir que o DOM foi completamente carregado
    setTimeout(function() {
        // Forçar visibilidade da seção de introdução
        const introSection = document.getElementById('introduktion');
        if (introSection) {
            introSection.classList.add('in-viewport');
            
            // Elementos internos também visíveis
            const introElements = introSection.querySelectorAll('.feature-box, .fade-in, .slide-in');
            introElements.forEach(element => {
                element.classList.add('visible');
            });
        }
        
        // Aplicar novamente a responsividade
        handleResponsiveElements();
    }, 500);
});

// Adicionar dica visual para tabelas scrolláveis em dispositivos móveis
function addScrollHint() {
    const tables = document.querySelectorAll('.data-table-container');
    
    tables.forEach(table => {
        // Verificar se a tabela é scrollável horizontalmente
        if (table.scrollWidth > table.clientWidth) {
            // Verificar se a dica já existe
            if (!table.querySelector('.scroll-hint')) {
                const hint = document.createElement('div');
                hint.className = 'scroll-hint';
                hint.innerHTML = '<i class="fas fa-arrows-left-right"></i> Scrolla för att se mer';
                hint.style.textAlign = 'center';
                hint.style.padding = '5px';
                hint.style.fontSize = '0.8rem';
                hint.style.color = 'var(--text-muted)';
                hint.style.marginBottom = '5px';
                
                // Inserir antes da tabela
                table.parentNode.insertBefore(hint, table);
                
                // Remover a dica após alguns segundos de scroll
                table.addEventListener('scroll', function() {
                    setTimeout(() => {
                        hint.style.opacity = '0';
                        hint.style.transition = 'opacity 0.5s ease';
                        
                        setTimeout(() => {
                            hint.remove();
                        }, 500);
                    }, 2000);
                });
            }
        }
    });
}

// Executar após carregar a página
window.addEventListener('load', addScrollHint);

// =======================================
// MENU HAMBURGUER
// =======================================
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });
  }
});

// =======================================
// CARDS DE SEÇÃO
// =======================================
function initSectionCards() {
    const sectionCards = document.querySelectorAll('.section-card');

    sectionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });

        card.addEventListener('click', () => {
            const link = card.querySelector('a');
            if (link) {
                window.location.href = link.href;
            }
        });
    });
}

// =======================================
// AJUSTE DO LIGHTBOX INLINE PARA TAMANHO COMPLETO
// =======================================
function initInlineLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryContainer = document.querySelector('.gallery-container');

    if (!galleryItems.length || !galleryContainer) return;

    galleryItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir comportamento padrão do clique

            const img = item.querySelector('img');
            if (!img) return;

            // Adicionar um efeito visual ao clicar na imagem
            img.style.cursor = 'zoom-in';

            // Garantir que o lightbox seja acessível via teclado
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Visualizar imagem: ${img.alt}`);
            item.tabIndex = 0;

            // Adicionar suporte para ativação via teclado
            item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    item.click();
                }
            });

            // Atualizar o lightbox existente, se já estiver aberto
            const existingLightbox = document.querySelector('.inline-lightbox');
            if (existingLightbox) {
                const lightboxImage = existingLightbox.querySelector('.lightbox-image');
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                return;
            }

            // Criar o container para a imagem ampliada
            const lightbox = document.createElement('div');
            lightbox.className = 'inline-lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}" class="lightbox-image" />
                    <button class="close-lightbox" aria-label="Fechar visualização">&times;</button>
                </div>
            `;

            // Adicionar o lightbox ao container da galeria
            galleryContainer.appendChild(lightbox);

            // Ajustar a imagem para caber na tela e centralizar o lightbox
            const lightboxContent = lightbox.querySelector('.lightbox-content');
            lightboxContent.style.display = 'flex';
            lightboxContent.style.justifyContent = 'center';
            lightboxContent.style.alignItems = 'center';
            lightboxContent.style.height = '100vh';
            lightboxContent.style.width = '100%';
            lightboxContent.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

            const lightboxImage = lightbox.querySelector('.lightbox-image');
            lightboxImage.style.maxWidth = '90%';
            lightboxImage.style.maxHeight = '90%';
            lightboxImage.style.objectFit = 'contain';

            // Rolar automaticamente para o lightbox
            lightbox.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Fechar o lightbox ao clicar fora da imagem
            lightbox.addEventListener('click', (event) => {
                if (event.target === lightbox) {
                    galleryContainer.removeChild(lightbox);
                }
            });

            // Fechar o lightbox ao clicar no botão de fechar
            const closeButton = lightbox.querySelector('.close-lightbox');
            closeButton.addEventListener('click', () => {
                galleryContainer.removeChild(lightbox);
            });
        });
    });
}

// Substituir a inicialização do modal pela nova funcionalidade
initInlineLightbox();

/**
 * Inicializa as funções do novo header moderno
 */
function initializeNyHeader() {
    // Detectar scroll para mudar o header
    const nyHeader = document.querySelector('.ny-header');
    
    if (nyHeader) {
        const updateHeaderState = () => {
            if (window.scrollY > 20) {
                nyHeader.classList.add('scrolled');
                document.body.style.setProperty('--header-height', '65px');
            } else {
                nyHeader.classList.remove('scrolled');
                document.body.style.setProperty('--header-height', '75px');
            }
        };
        
        // Aplicar estado inicial
        updateHeaderState();
        
        window.addEventListener('scroll', updateHeaderState);
        
        // Dropdown do menu
        const dropdownToggles = document.querySelectorAll('.ny-dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdownMenu = this.nextElementSibling;
                const isActive = this.classList.contains('active');
                
                // Fechar todos os dropdowns
                document.querySelectorAll('.ny-dropdown-toggle').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.ny-dropdown-menu').forEach(m => m.classList.remove('show'));
                
                // Abrir o atual se não estiver ativo
                if (!isActive) {
                    this.classList.add('active');
                    dropdownMenu.classList.add('show');
                }
            });
        });
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.ny-dropdown')) {
                document.querySelectorAll('.ny-dropdown-toggle').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.ny-dropdown-menu').forEach(m => m.classList.remove('show'));
            }
        });
        
        // Botão de pesquisa
        const searchToggle = document.getElementById('searchToggle');
        const searchContainer = document.querySelector('.ny-search-container');
        const searchClose = document.querySelector('.ny-search-close');
        const searchInput = searchContainer?.querySelector('input[type="search"]');
        
        if (searchToggle && searchContainer) {
            searchToggle.addEventListener('click', function() {
                searchContainer.classList.add('show');
                searchToggle.setAttribute('aria-expanded', 'true');
                if (searchInput) searchInput.focus();
            });
            
            if (searchClose) {
                searchClose.addEventListener('click', function() {
                    searchContainer.classList.remove('show');
                    searchToggle.setAttribute('aria-expanded', 'false');
                });
            }
        }
        
        // Menu móvel
        const menuToggle = document.querySelector('.ny-menu-toggle');
        const mobileNav = document.querySelector('.ny-mobile-nav');
        
        if (menuToggle && mobileNav) {
            console.log("Menu móvel inicializado");
            
            // Inicialização imediata para garantir que o estado inicial está correto
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('show');
            
            menuToggle.addEventListener('click', function() {
                console.log("Menu toggle clicado");
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const newState = !isExpanded;
                
                // Atualiza atributos e classes
                this.setAttribute('aria-expanded', newState ? 'true' : 'false');
                mobileNav.classList.toggle('show', newState);
                document.body.classList.toggle('menu-open', newState);
                
                console.log("Estado do menu:", newState ? "aberto" : "fechado");
                
                // Forçar um reflow para garantir que as transições funcionem
                void mobileNav.offsetWidth;
            });
            
            // Adicionar fechamento ao clicar em links para melhor UX
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mobileNav.classList.remove('show');
                    document.body.classList.remove('menu-open');
                });
            });
        } else {
            console.warn("Menu móvel não encontrado");
        }
    }
}