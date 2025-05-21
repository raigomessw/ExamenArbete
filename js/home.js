/**
 * FIL: home.js
 * BESKRIVNING: JavaScript-logik för examensarbetets webbapplikation
 * FÖRFATTARE: Rai Gomes
 * VERSION: 2.0
 * DATUM: 12 maj 2025
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
// DRAGSPEL
// =======================================
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (!accordionHeaders.length) return;
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Växla active-klass på rubriken
            this.classList.toggle('active');
            
            // Växla active-klass på innehållet
            const body = this.nextElementSibling;
            body.classList.toggle('active');
            
            // Uppdatera aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Ikonrotation är redan i CSS
        });
    });
}

// =======================================
// FLIKSYSTEM
// =======================================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Kolla om det är Figma-länken (om ja, låt standardbeteendet fortsätta utan att aktivera fliken)
            if (this.classList.contains('figma-link')) {
                // Förhindra inte standardbeteendet för länken
                return;
            }
            
            // För vanliga flikar, förhindra standardbeteendet
            event.preventDefault();
            
            // Hämta alla knappar med samma förälder
            const parentTabsContainer = this.closest('.tabs');
            const siblingsButtons = parentTabsContainer.querySelectorAll('.tab-button');
            
            // Ta bort active från alla flikar
            siblingsButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Lägg till active för aktuell flik
            this.classList.add('active');
            
            // Hämta flik-ID
            const tabId = this.getAttribute('data-tab');
            
            // Dölj alla flikinnehåll
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Visa innehållet för den valda fliken
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
// BILDGALLERI
// =======================================
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryContainer = document.querySelector('.gallery-container');

    if (!galleryItems.length || !galleryContainer) return;

    galleryItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Förhindra standardbeteende vid klick

            const img = item.querySelector('img');
            if (!img) return;

            // Hitta olika bildversioner (desktop, mobil, tablet)
            const imagePath = img.src.split('/').pop();  // Hämtar filnamnet från sökvägen
            const imageBaseName = imagePath.replace(/\.[^/.]+$/, ""); // Ta bort filändelse
            
            console.log('Laddar bildvarianter för: ' + imageBaseName);
            
            // Försök hitta motsvarande mobil- och surfplattversioner
            // Hanterar flera namnkonventioner som upptäckts i filerna
            const mobileVersions = [
                `${imageBaseName}VyMobile.jpg`,
                `${imageBaseName}VyMobile..jpg`,
                `${imageBaseName}VyTabletMobile.jpg`, // För filer som använder denna namnkonvention
                `${imageBaseName} VyMobile.jpg` // För filer med mellanslag
            ];
            
            const tabletVersions = [
                `${imageBaseName}VyTablet.jpg`,
                `${imageBaseName} VyTablet.jpg` // För filer med mellanslag
            ];

            // Lägg till visuell effekt vid klick
            img.style.cursor = 'zoom-in';

            // Garantera att lightbox är tillgänglig via tangentbord
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Visa bild: ${img.alt}`);
            item.tabIndex = 0;

            // Lägg till stöd för tangentbordsaktivering
            item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    item.click();
                }
            });

            // Uppdatera existerande lightbox om den redan är öppen
            const existingLightbox = document.querySelector('.inline-lightbox');
            if (existingLightbox) {
                updateLightboxWithResponsiveImages(
                    existingLightbox.querySelector('.lightbox-image'), 
                    img.src, 
                    img.alt, 
                    mobileVersions, 
                    tabletVersions
                );
                return;
            }

            // Skapa container för den förstorade bilden
            const lightbox = document.createElement('div');
            lightbox.className = 'inline-lightbox';
            
            // Skapa grundläggande struktur för lightbox
            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';
            
            // Skapa bildkomponent
            const lightboxImage = document.createElement('img');
            lightboxImage.className = 'lightbox-image';
            lightboxImage.alt = img.alt;
            
            // Skapa responsiv bildvisning med korrekt versionshantering
            updateLightboxWithResponsiveImages(
                lightboxImage, 
                img.src, 
                img.alt, 
                mobileVersions, 
                tabletVersions
            );
            
            // Skapa stängknapp
            const closeButton = document.createElement('button');
            closeButton.className = 'close-lightbox';
            closeButton.setAttribute('aria-label', 'Stäng förhandsgranskning');
            closeButton.innerHTML = '&times;';
            
            // Skapa knappar för att växla mellan versioner
            const versionButtons = document.createElement('div');
            versionButtons.className = 'version-buttons';
            
            // Hjälpfunktion för att kontrollera bildtillgänglighet
            const findAndLoadImage = function(versionList, onFound) {
                const basePath = img.src.substring(0, img.src.lastIndexOf('/') + 1);
                let imageFound = false;
                
                // Kontrollera alla möjliga versioner
                const checkNextImage = function(index) {
                    if (index >= versionList.length) {
                        // Om vi har kontrollerat alla versioner och inte hittat någon
                        console.log('Ingen version hittades');
                        return;
                    }
                    
                    const version = versionList[index];
                    const imgUrl = basePath + 'assets/' + version;
                    
                    const testImage = new Image();
                    testImage.onload = function() {
                        // Om bilden finns, ladda den i lightbox
                        imageFound = true;
                        onFound(this.src);
                    };
                    testImage.onerror = function() {
                        // Prova nästa version om den här inte finns
                        if (!imageFound) {
                            checkNextImage(index + 1);
                        }
                    };
                    testImage.src = imgUrl;
                };
                
                // Börja kontrollera från första versionen
                checkNextImage(0);
            };
            
            const desktopButton = createVersionButton('Desktop', () => {
                // Desktop-versionen är redan laddad i img-elementet
                lightboxImage.src = img.src;
                
                // Markera den aktiva knappen
                document.querySelectorAll('.version-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                desktopButton.classList.add('active');
            });
            
            const mobileButton = createVersionButton('Mobil', () => {
                findAndLoadImage(mobileVersions, (src) => {
                    lightboxImage.src = src;
                    
                    // Markera den aktiva knappen
                    document.querySelectorAll('.version-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    mobileButton.classList.add('active');
                });
            });
            
            const tabletButton = createVersionButton('Surfplatta', () => {
                findAndLoadImage(tabletVersions, (src) => {
                    lightboxImage.src = src;
                    
                    // Markera den aktiva knappen
                    document.querySelectorAll('.version-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    tabletButton.classList.add('active');
                });
            });
            
            versionButtons.appendChild(desktopButton);
            versionButtons.appendChild(mobileButton);
            versionButtons.appendChild(tabletButton);
            
            // Lägg till komponenter i lightbox
            lightboxContent.appendChild(lightboxImage);
            lightboxContent.appendChild(closeButton);
            lightboxContent.appendChild(versionButtons);
            lightbox.appendChild(lightboxContent);
            
            // Markera desktop-knappen som aktiv som standard
            desktopButton.classList.add('active');

            // Lägg till lightbox i galleriet
            galleryContainer.appendChild(lightbox);

            // Justera bilden för att passa skärmen och centrera lightbox
            lightboxContent.style.display = 'flex';
            lightboxContent.style.flexDirection = 'column';
            lightboxContent.style.justifyContent = 'center';
            lightboxContent.style.alignItems = 'center';
            lightboxContent.style.height = '100vh';
            lightboxContent.style.width = '100%';
            lightboxContent.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

            lightboxImage.style.maxWidth = '90%';
            lightboxImage.style.maxHeight = '80%'; // Minska för att ge plats åt knappar
            lightboxImage.style.objectFit = 'contain';
            
            // Styla versionsknappar
            versionButtons.style.display = 'flex';
            versionButtons.style.justifyContent = 'center';
            versionButtons.style.marginTop = '15px';
            versionButtons.style.gap = '10px';

            // Rulla automatiskt till lightbox
            lightbox.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Stäng lightbox vid klick utanför bilden
            lightbox.addEventListener('click', (event) => {
                if (event.target === lightbox) {
                    galleryContainer.removeChild(lightbox);
                }
            });

            // Stäng lightbox vid klick på stängknappen
            closeButton.addEventListener('click', () => {
                galleryContainer.removeChild(lightbox);
            });
        });
    });
}

// Hjälpfunktion för att skapa versionsväxlingsknappar
function createVersionButton(label, clickHandler) {
    const button = document.createElement('button');
    button.className = 'version-button';
    button.textContent = label;
    button.style.padding = '8px 12px';
    button.style.margin = '0 5px';
    button.style.backgroundColor = '#333';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.3s';
    
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#555';
    });
    
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#333';
    });
    
    button.addEventListener('click', clickHandler);
    
    return button;
}

// Funktion för att uppdatera lightbox med responsiva bilder
function updateLightboxWithResponsiveImages(imageElement, defaultSrc, altText, mobileVersions, tabletVersions) {
    imageElement.src = defaultSrc;
    imageElement.alt = altText;
    
    // Preload mobil- och surfplattversioner för snabbare växling
    const basePath = defaultSrc.substring(0, defaultSrc.lastIndexOf('/') + 1);
    
    // Skapa en hjälpfunktion för att kontrollera om en bild finns
    const checkImage = function(urlToCheck, callback) {
        const img = new Image();
        img.onload = function() { 
            callback(true, this.src); 
        };
        img.onerror = function() { 
            callback(false, this.src); 
        };
        img.src = urlToCheck;
    };
    
    // Försök förladda mobilversioner
    mobileVersions.forEach(version => {
        const imgUrl = basePath + 'assets/' + version;
        checkImage(imgUrl, (exists) => {
            if (exists) {
                console.log('Förladdar mobil version: ' + imgUrl);
            }
        });
    });
    
    // Försök förladda surfplattversioner
    tabletVersions.forEach(version => {
        const imgUrl = basePath + 'assets/' + version;
        checkImage(imgUrl, (exists) => {
            if (exists) {
                console.log('Förladdar surfplatta version: ' + imgUrl);
            }
        });
    });
}

// =======================================
// OPTIMERING AV MODAL FÖR MOBIL
// =======================================
function optimizeGalleryModalForMobile() {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');

    if (!modal || !modalImage) return;

    // Lägg till mobilspecifika klasser
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
// MOBILNAVIGATION (OFF-CANVAS)
// =======================================
function initMobileMenu() {
    // Seletor mais preciso para o botão de menu
    const menuToggle = document.querySelector('.menu-toggle.off-canvas-trigger');
    const offCanvasMenu = document.querySelector('.off-canvas-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const closeButton = document.querySelector('.off-canvas-close');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const header = document.querySelector('header');
    
    if (!menuToggle || !offCanvasMenu) {
        console.log('Off-canvas-meny eller knapp hittades inte');
        console.log('menuToggle:', menuToggle);
        console.log('offCanvasMenu:', offCanvasMenu);
        return;
    }
    
    console.log('Menu toggle and off-canvas menu found');
    
    // Forçar visualização do conteúdo do menu
    const offCanvasContent = offCanvasMenu.querySelector('.off-canvas-content');
    if (offCanvasContent) {
        offCanvasContent.style.visibility = 'visible';
        offCanvasContent.style.opacity = '1';
        offCanvasContent.style.display = 'flex';
    }
    
    // Forçar visibilidade dos links
    const navItems = offCanvasMenu.querySelectorAll('.nav-item, .nav-item-portfolio-link');
    navItems.forEach(item => {
        item.style.visibility = 'visible';
        item.style.opacity = '1';
        item.style.display = 'block';
        
        const link = item.querySelector('a');
        if (link) {
            link.style.visibility = 'visible';
            link.style.opacity = '1';
            link.style.display = 'flex';
            link.style.pointerEvents = 'auto';
        }
    });
    
    // Se till att elementen är synliga på mobilskärmar
    if (window.innerWidth <= 768) {
        if (mobileMenuContainer) {
            mobileMenuContainer.style.display = 'block';
        }
        
        menuToggle.style.display = 'flex';
        menuToggle.style.visibility = 'visible';
        menuToggle.style.opacity = '1';
    }
    
    // Kontrollera och korrigera menytillståndet när sidan laddas
    if (menuToggle.getAttribute('aria-expanded') === 'true') {
        offCanvasMenu.classList.add('active');
        menuOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.classList.add('menu-open'); // Förhindra scrollning när menyn är öppen
    } else {
        offCanvasMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    // Funktion för att kontrollera om vi är i mobilvy
    function isMobileView() {
        return window.innerWidth <= 768;
    }
    
    // Hantera tillstånd för off-canvas-menyn
    menuToggle.addEventListener('click', function(event) {
        // Prevenir que o clique propague para o document
        event.stopPropagation();
        event.preventDefault();
        
        console.log('Menu toggle clicked!');
        
        // Implementação mais direta para alternar menu
        const isActive = offCanvasMenu.classList.contains('active');
        
        if (isActive) {
            console.log('Closing menu');
            // Certifique-se de fechar o menu completamente
            closeMenu();
        } else {
            console.log('Opening menu');
            
            // Limpar quaisquer estilos inline que possam estar causando problemas
            offCanvasMenu.removeAttribute('style');
            
            // Alternar o estado do botão
            menuToggle.setAttribute('aria-expanded', 'true');
            
            // Ativar menu - usar manipulação direta do DOM e classes CSS
            offCanvasMenu.classList.add('active');
            offCanvasMenu.style.right = '0';
            
            // Verificar se o menu está realmente visível após adicionar a classe
            setTimeout(() => {
                // Se por algum motivo o menu não estiver visível, forçar a visibilidade
                if (window.getComputedStyle(offCanvasMenu).right !== '0px') {
                    offCanvasMenu.style.right = '0';
                }
                console.log('Menu position after opening:', window.getComputedStyle(offCanvasMenu).right);
            }, 50);
            
            // Garantir que o conteúdo do menu esteja visível
            const offCanvasContent = offCanvasMenu.querySelector('.off-canvas-content');
            if (offCanvasContent) {
                offCanvasContent.style.display = 'flex';
                offCanvasContent.style.visibility = 'visible';
                offCanvasContent.style.opacity = '1';
            }
            
            // Garantir que os links do menu estejam visíveis
            const navItems = offCanvasMenu.querySelectorAll('.nav-item, .nav-item-portfolio-link');
            navItems.forEach(item => {
                item.style.visibility = 'visible';
                item.style.opacity = '1';
                item.style.display = 'block';
                
                const link = item.querySelector('a');
                if (link) {
                    link.style.visibility = 'visible';
                    link.style.opacity = '1';
                    link.style.display = 'flex';
                    link.style.pointerEvents = 'auto';
                }
            });
            
            // Garantir que a lista de navegação esteja visível
            const navList = offCanvasMenu.querySelector('.nav-list');
            if (navList) {
                navList.style.display = 'block';
                navList.style.visibility = 'visible';
                navList.style.opacity = '1';
            }
            
            // Ativar overlay
            if (menuOverlay) {
                menuOverlay.classList.add('active');
                menuOverlay.style.display = 'block';
            }
            
            // Animar o ícone hamburger
            menuToggle.classList.add('active');
            
            // Impedir rolagem da página quando menu está aberto
            document.body.classList.add('menu-open');
            
            // Garantir que o container do menu esteja visível
            const mobileMenuContainer = document.querySelector('.mobile-menu-container');
            if (mobileMenuContainer) {
                mobileMenuContainer.style.display = 'block';
            }
            
            // Anunciar para leitores de tela
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', 'polite');
            announcer.className = 'sr-only';
            announcer.textContent = 'Meny öppnad';
            document.body.appendChild(announcer);
            
            setTimeout(() => {
                document.body.removeChild(announcer);
            }, 1000);
        }
    });
    
    // Funktion för att stänga menyn
    function closeMenu() {
        console.log('Stänger off-canvas-menyn');
        
        // Ta bort aktiva klasser från menu och overlay
        offCanvasMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        
        // Garantir que o menu volte para fora da tela
        offCanvasMenu.style.right = '-280px';
        offCanvasMenu.style.transform = 'translateX(0)';
        offCanvasMenu.style.visibility = 'hidden';
        offCanvasMenu.style.opacity = '0';
        offCanvasMenu.style.pointerEvents = 'none';
        
        // Remover todos os estilos inline que possam estar interferindo, mas manter os de visibilidade
        offCanvasMenu.style.display = 'flex'; // Mantemos display flex para preservar a estrutura
        
        // Återställ knappens tillstånd
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        
        // Garantir que as classes CSS estejam corretas
        const hamburger = menuToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        
        // Ocultar overlay completamente
        if (menuOverlay) {
            menuOverlay.style.display = 'none';
            menuOverlay.classList.remove('active');
        }
        
        // Förhindra scrollning av sidan när menyn är stängd
        document.body.classList.remove('menu-open');
        
        // Anunciar para leitores de tela
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        announcer.textContent = 'Meny stängd';
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
        
        // Adicionar evento para verificar se o menu fechou completamente
        const checkMenuClosed = () => {
            const menuRight = window.getComputedStyle(offCanvasMenu).right;
            console.log("Menu position after closing:", menuRight);
            
            if (menuRight !== '-280px') {
                console.warn("Menu didn't close properly, forcing closure");
                offCanvasMenu.style.right = '-280px';
                offCanvasMenu.style.visibility = 'hidden';
                offCanvasMenu.style.opacity = '0';
                offCanvasMenu.style.pointerEvents = 'none';
                offCanvasMenu.style.transform = 'translateX(0)';
                
                // Não precisamos mais tornar o menu visível após fechá-lo
            }
        };
        
        // Verificar após a transição terminar
        setTimeout(checkMenuClosed, 350);
    }
    
    // Fechar menu ao clicar em links de navegação
    const navLinks = offCanvasMenu.querySelectorAll('a');
    console.log('Links de navegação encontrados no menu:', navLinks.length);
    
    navLinks.forEach((link, index) => {
        console.log(`Link ${index + 1}:`, link.textContent.trim(), link.getAttribute('href'));
        
        link.addEventListener('click', function(e) {
            console.log('Link clicado:', this.textContent.trim());
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
    
    // Fechar a janela ao clicar no botão de fechar
    if (closeButton) {
        closeButton.addEventListener('click', function(event) {
            console.log('Close button clicked');
            event.preventDefault();
            event.stopPropagation();
            closeMenu();
        });
    }

    // Fechar a janela ao clicar no overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function(event) {
            console.log('Overlay clicked');
            event.preventDefault();
            event.stopPropagation();
            closeMenu();
        });
    }
    
    // Fechar o menu ao clicar em links (para navegação suave)
    const menuLinks = offCanvasMenu.querySelectorAll('a[href^="#"]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            closeMenu();
        });
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
        if (offCanvasMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Implementar fechamento do menu com a tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && offCanvasMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Melhorar acessibilidade focando no primeiro elemento quando o menu é aberto
    menuToggle.addEventListener('click', function() {
        if (offCanvasMenu.classList.contains('active')) {
            setTimeout(() => {
                const firstElement = offCanvasMenu.querySelector('a:first-of-type');
                if (firstElement) {
                    firstElement.focus();
                }
            }, 100);
        }
    });
}

// =======================================
// SCROLLANIMATIONER
// =======================================
function initAnimationObserver() {
    // Använd IntersectionObserver för synlighetsbaserade animeringar
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-viewport');
                
                // Animera barn-element
                const elementsToAnimate = entry.target.querySelectorAll('.feature-box, .fade-in, .slide-in');
                elementsToAnimate.forEach((element, index) => {
                    // Respektera rörelsepreference
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    
                    if (prefersReducedMotion) {
                        element.classList.add('visible');
                    } else {
                        setTimeout(() => {
                            element.classList.add('visible');
                        }, index * 200); // Animação escalonada
                    }
                });
                
            }
        });
    }, { threshold: 0.1, rootMargin: '0px' }); 
    
    // Se till att introduktionssektionen alltid har klassen in-viewport
    const introSection = document.getElementById('introduktion');
    if (introSection) {
        introSection.classList.add('in-viewport');
        
        // Se också till att interna element är synliga
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
// MÖRKT TEMA
// =======================================
function initThemeToggle() {
    console.log("Initierar temakontroller...");
    const themeToggle = document.getElementById('themeToggle');
    const footerThemeToggle = document.getElementById('footerThemeToggle');
    const themeToggles = [themeToggle, footerThemeToggle].filter(Boolean);
    
    // Om knapparna inte hittas, försök skapa en reservknapp
    if (!themeToggles.length) {
        console.warn("Temaknappar hittades inte, skapar en reservknapp");
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
    
    console.log("Aktuellt tema:", isDarkMode ? "mörkt" : "ljust");
    
    // Uppdatera alla ikoner
    updateAllThemeIcons(isDarkMode);
    
    // Lägg till händelselyssnare till alla temaknappar
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
            
            console.log("Tema ändrat till:", newDarkMode ? "mörkt" : "ljust");
        });
    });
    
    // Uppdatera alla temaikoner
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
    
    // Tillkännage temaförändring för skärmläsare
    function announceThemeChange(isDarkMode) {
        // Uppdatera meta-taggen theme-color för att matcha aktuellt tema
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

// Funktion för att uppdatera diagram när temat ändras
function refreshCharts() {
    // Kontrollera om Chart.js är tillgängligt
    if (typeof Chart === 'undefined') {
        console.error("Chart.js är inte tillgängligt för diagramuppdatering");
        return;
    }
    
    console.log("Uppdaterar diagram för det nya temat");
    
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
// MJUK RULLNING
// =======================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Gör ingenting om det är en tom länk
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                
                // Kontrollera inställningar för reducerad rörelse
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                if (prefersReducedMotion) {
                    // Omedelbar rullning för användare som föredrar reducerad rörelse
                    target.scrollIntoView();
                } else {
                    // Mjuk rullning för andra användare
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Fokusera på målelementet för bättre tillgänglighet
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
                
                // Uppdatera URL-historik
                history.pushState(null, '', targetId);
            }
        });
    });
}

// =======================================
// TILLBAKA TILL TOPPEN-KNAPP
// =======================================
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    // Visa knappen när användaren rullar nedåt
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Gå tillbaka till toppen när användaren klickar på knappen
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Kontrollera inställningar för reducerad rörelse
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
// KONTAKTFORMULÄR
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
        
        // Validering när fokus förloras
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
        // Värdet är obligatoriskt men tomt
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, 'Detta fält är obligatoriskt');
            return false;
        }
        
        // E-postvalidering
        if (input.type === 'email' && input.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value)) {
                showError(input, 'Vänligen ange en giltig e-postadress');
                return false;
            }
        }
        
        // Telefonvalidering
        if (input.type === 'tel' && input.value.trim()) {
            const phonePattern = /^[0-9\s\-\+\(\)]{8,20}$/;
            if (!phonePattern.test(input.value)) {
                showError(input, 'Vänligen ange ett giltigt telefonnummer');
                return false;
            }
        }
        
        // Om vi kom hit är allt OK
        clearError(input);
        return true;
    }
    
    function showError(input, message) {
        // Rensa befintligt fel först
        clearError(input);
        
        input.classList.add('error');
        
        // Skapa felelement
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        
        // Lägg till meddelande efter input
        input.parentNode.insertBefore(errorMsg, input.nextSibling);
        
        // Konfigurera aria-attribut för tillgänglighet
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `error-${input.name || input.id}`);
        errorMsg.id = `error-${input.name || input.id}`;
    }
    
    function clearError(input) {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
        
        // Ta bort felmeddelande
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.parentNode.removeChild(errorMsg);
        }
    }
}

// =======================================
// DIAGRAM OCH DATAVISUALISERING
// =======================================
function initCharts() {
    // Initialisering av allmänna diagram
    console.log('Initierar diagram och datavisualiseringar');
    
    // Kontrollera om Chart.js är tillgängligt
    if (typeof Chart === 'undefined') {
        console.error('Chart.js är inte laddat');
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
    // Verificar se estar no modo escuro
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
// BILDKARUSELL
// =======================================
function initCarousel() {
    // Kontrollera om det finns karuseller på sidan
    const carousels = document.querySelectorAll('.carousel');
    
    // Om det inte finns några karuseller, avsluta funktionen
    if (!carousels.length) {
        console.log("Inga karuseller hittades på sidan - Funktionen avslutas");
        return;
    }
    
    // För varje karusell som hittats (även om den har tagits bort från DOM senare)
    carousels.forEach(carousel => {
        // Extra kontroll för att säkerställa att karusellen fortfarande existerar i DOM
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
        
        // Konfigurera initiala bredder
        container.style.width = `${totalItems * 100}%`;
        items.forEach(item => {
            item.style.width = `${100 / totalItems}%`;
        });
        
        // Initiera prickar
        if (dots.length) {
            dots[0].classList.add('active');
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
                
                // Tangentbordstillgänglighet
                dot.setAttribute('role', 'button');
                dot.setAttribute('aria-label', `Gå till bild ${index + 1}`);
                dot.tabIndex = 0;
                
                dot.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goToSlide(index);
                    }
                });
            });
        }
        
        // Konfigurera navigeringsknappar
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
        
        // Lägg till svep på mobila enheter
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
            const swipeThreshold = 50; // minsta antal pixlar för att räkna som ett svep
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Svep åt vänster (nästa)
                goToSlide(currentIndex + 1);
            }
            
            if (touchEndX > touchStartX + swipeThreshold) {
                // Svep åt höger (föregående)
                goToSlide(currentIndex - 1);
            }
        }
        
        // Auto-rotation (valfritt)
        let autoRotate = carousel.hasAttribute('data-auto-rotate');
        let rotationInterval;
        const rotationDelay = parseInt(carousel.getAttribute('data-rotation-delay') || '5000', 10);
        
        if (autoRotate) {
            startAutoRotation();
            
            // Pausa vid hovring eller fokus
            carousel.addEventListener('mouseenter', stopAutoRotation);
            carousel.addEventListener('mouseleave', startAutoRotation);
            carousel.addEventListener('focusin', stopAutoRotation);
            carousel.addEventListener('focusout', startAutoRotation);
        }
        
        function startAutoRotation() {
            // Kontrollera om användaren föredrar reducerad rörelse
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;
            
            rotationInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, rotationDelay);
        }
        
        function stopAutoRotation() {
            clearInterval(rotationInterval);
        }
        
        // Huvudfunktion för att navigera mellan bilder
        function goToSlide(index) {
            // Hantera wraparound
            if (index < 0) {
                index = totalItems - 1;
            } else if (index >= totalItems) {
                index = 0;
            }
            
            currentIndex = index;
            
            // Kontrollera inställningar för reducerad rörelse
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // Tillämpa mjuk eller omedelbar övergång enligt preferens
            if (prefersReducedMotion) {
                container.style.transition = 'none';
            } else {
                container.style.transition = 'transform 0.5s ease-in-out';
            }
            
            // Flytta behållaren
            const translateValue = -index * (100 / totalItems);
            container.style.transform = `translateX(${translateValue}%)`;
            
            // Uppdatera prickarna
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                dot.setAttribute('aria-current', i === index ? 'true' : 'false');
            });
            
            // Meddela skärmläsare
            announceSlideChange(index + 1, totalItems);
        }
        
        function announceSlideChange(current, total) {
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', 'polite');
            announcer.className = 'sr-only';
            
            // Hämta titel för aktuell bild om tillgänglig
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
// ANIMATION AV STATISTIKSTAPLAR
// =======================================
function animateStatBars() {
    const statBars = document.querySelectorAll('.stat-bar-fill');
    
    // Kontrollerar om webbläsaren stödjer IntersectionObserver
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Lägger till klass för att animera när den är synlig
                    entry.target.classList.add('animate');
                    
                    // Sluta observera efter animering
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
        
        // Observera varje stapel
        statBars.forEach(bar => {
            observer.observe(bar);
        });
    } else {
        // Reservlösning för äldre webbläsare
        statBars.forEach(bar => {
            bar.classList.add('animate');
        });
    }
    
    // Återapplicera om temat ändras
    document.getElementById('themeToggle').addEventListener('click', function() {
        // Kort fördröjning för att tillåta temaövergången först
        setTimeout(function() {
            // Ta bort och lägg till klasserna igen för att starta om animationerna
            document.querySelectorAll('.stat-bar-fill').forEach(bar => {
                bar.classList.remove('animate');
                void bar.offsetWidth; // Força reflow
                bar.classList.add('animate');
            });
        }, 300);
    });
}

// =======================================
// RESPONSIVITET FÖR ELEMENT
// =======================================
// Funktion för att hantera elementens responsivitet
function handleResponsiveElements() {
    // Justerar höjden på säsongskorten så att alla har samma höjd
    const seasonCards = document.querySelectorAll('.season-card');
    
    // Återställ höjder innan omberäkning
    seasonCards.forEach(card => {
        card.style.height = 'auto';
    });
    
    // Bara jämna ut höjderna på skärmar större än 767px
    if (window.innerWidth > 767) {
        let maxHeight = 0;
        
        // Hitta maxhöjden
        seasonCards.forEach(card => {
            const cardHeight = card.offsetHeight;
            maxHeight = Math.max(maxHeight, cardHeight);
        });
        
        // Tillämpa maxhöjden på alla kort
        seasonCards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    }
    
    // Kontrollera om vi är på en mobil enhet
    if (window.innerWidth <= 767) {
        // Tvinga synlighet för viktiga sektioner på mobila enheter
        const importantSections = ['introduktion'];
        importantSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                // Se till att sektionen är synlig
                section.classList.add('in-viewport');
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.display = 'block';
                
                // Se till att interna element också är synliga
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
    
    // Justera responsiva tabeller för mobila enheter
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

// Köra när sidan laddas och när den ändrar storlek
window.addEventListener('load', handleResponsiveElements);
window.addEventListener('resize', handleResponsiveElements);

// Se till att introduktionssektionen är synlig efter att sidan har laddats helt
window.addEventListener('load', function() {
    // Kort fördröjning för att säkerställa att DOM har laddats helt
    setTimeout(function() {
        // Tvinga synlighet för introduktionssektionen
        const introSection = document.getElementById('introduktion');
        if (introSection) {
            introSection.classList.add('in-viewport');
            
            // Interna element också synliga
            const introElements = introSection.querySelectorAll('.feature-box, .fade-in, .slide-in');
            introElements.forEach(element => {
                element.classList.add('visible');
            });
        }
        
        // Applicera responsivitet igen
        handleResponsiveElements();
    }, 500);
});

// Lägg till visuell ledtråd för scrollbara tabeller på mobila enheter
function addScrollHint() {
    const tables = document.querySelectorAll('.data-table-container');
    
    tables.forEach(table => {
        // Kontrollera om tabellen är horisontellt scrollbar
        if (table.scrollWidth > table.clientWidth) {
            // Kontrollera om tipset redan finns
            if (!table.querySelector('.scroll-hint')) {
                const hint = document.createElement('div');
                hint.className = 'scroll-hint';
                hint.innerHTML = '<i class="fas fa-arrows-left-right"></i> Scrolla för att se mer';
                hint.style.textAlign = 'center';
                hint.style.padding = '5px';
                hint.style.fontSize = '0.8rem';
                hint.style.color = 'var(--text-muted)';
                hint.style.marginBottom = '5px';
                
                // Infoga före tabellen
                table.parentNode.insertBefore(hint, table);
                
                // Ta bort tipset efter några sekunders rullning
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

// Köra efter att sidan har laddats
window.addEventListener('load', addScrollHint);

// =======================================
// HAMBURGARMENY
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
// SEKTIONSKORT
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
// JUSTERING AV INLINE LIGHTBOX FÖR FULLSTÄNDIG STORLEK
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

// Ersätta modal-initialiseringen med den nya funktionaliteten
initInlineLightbox();

/**
 * Initierar funktionerna för det nya moderna sidhuvudet
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
            console.log("Mobilmeny initialiserad");
            
            // Omedelbar initialisering för att säkerställa att det initiala tillståndet är korrekt
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('show');
            
            menuToggle.addEventListener('click', function() {
                console.log("Menyväxlare klickad");
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const newState = !isExpanded;
                
                // Uppdatera attribut och klasser
                this.setAttribute('aria-expanded', newState ? 'true' : 'false');
                mobileNav.classList.toggle('show', newState);
                document.body.classList.toggle('menu-open', newState);
                
                console.log("Menytillstånd:", newState ? "öppen" : "stängd");
                
                // Tvinga en omflödning för att säkerställa att övergångarna fungerar
                void mobileNav.offsetWidth;
            });
            
            // Lägg till stängning vid klick på länkar för bättre UX
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mobileNav.classList.remove('show');
                    document.body.classList.remove('menu-open');
                });
            });
        } else {
            console.warn("Mobilmeny hittades inte");
        }
    }
}

// =======================================
// ACESSIBILIDADE MENU FORA DA TELA
// =======================================
function setupTrapFocus() {
    const offCanvasMenu = document.querySelector('.off-canvas-menu');
    
    if (!offCanvasMenu) return;
    
    // Elementos focáveis dentro do menu
    const getFocusableElements = () => {
        return Array.from(
            offCanvasMenu.querySelectorAll(
                'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
            )
        ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    };
    
    // Função para manter o foco dentro do menu
    const trapFocus = (event) => {
        if (!offCanvasMenu.classList.contains('active')) return;
        
        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Se não houver elementos focáveis, retornamos
        if (focusableElements.length === 0) return;
        
        // Se estiver pressionando Tab sem Shift
        if (event.key === 'Tab' && !event.shiftKey) {
            // Se o elemento ativo é o último, movemos para o primeiro
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
        
        // Se estiver pressionando Tab com Shift
        if (event.key === 'Tab' && event.shiftKey) {
            // Se o elemento ativo é o primeiro, movemos para o último
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        }
    };
    
    // Adicionar listener quando o menu estiver ativo
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === 'class') {
                if (offCanvasMenu.classList.contains('active')) {
                    document.addEventListener('keydown', trapFocus);
                } else {
                    document.removeEventListener('keydown', trapFocus);
                }
            }
        }
    });
    
    observer.observe(offCanvasMenu, { attributes: true });
}

// Inicializar o trap focus quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona a inicialização do trapFocus no final do DOMContentLoaded
    setupTrapFocus();
});

// =======================================
// SUPORTE A GESTOS DE DESLIZE
// =======================================
function setupSwipeGestures() {
    const offCanvasMenu = document.querySelector('.off-canvas-menu');
    
    if (!offCanvasMenu) return;
    
    // Variáveis para rastrear o toque
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 100; // Distância mínima para considerar como um swipe (em pixels)
    
    // Buscar a função closeMenu do escopo parent
    let closeMenuFunction = null;
    
    // Inicializa eventos de toque
    offCanvasMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    offCanvasMenu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
    
    // Função para lidar com o gesto de deslize
    const handleSwipe = () => {
        // Verifica se o menu está ativo
        if (!offCanvasMenu.classList.contains('active')) return;
        
        // Calcula a distância do gesto
        const swipeDistance = touchStartX - touchEndX;
        
        // Se o usuário deslizou da direita para a esquerda (fechando o menu)
        if (swipeDistance > minSwipeDistance) {
            // Procura pela instância da função closeMenu
            if (!closeMenuFunction) {
                // Busca no contexto global
                const mobileMenuButtons = document.querySelectorAll('.menu-toggle, .off-canvas-close');
                
                for (const button of mobileMenuButtons) {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    
                    // Tenta fechar o menu simulando um clique no botão de fechar
                    button.dispatchEvent(clickEvent);
                    
                    // Se isso funcionou, saímos do loop
                    if (!offCanvasMenu.classList.contains('active')) {
                        break;
                    }
                }
            }
        }
    };
}

// Inicializar gestos de deslize quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona essa linha perto das outras inicializações
    setupSwipeGestures();
});