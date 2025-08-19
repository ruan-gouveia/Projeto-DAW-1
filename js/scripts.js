document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');
    const nav = document.getElementById('main-nav');
    const slider = nav.querySelector('.slider');
    const navLinks = nav.querySelectorAll('a');

    const updateSlider = (activeLink) => {
        if (!activeLink) return;
        nav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        const activeLi = activeLink.parentElement;
        activeLi.classList.add('active');
        slider.style.width = `${activeLi.offsetWidth}px`;
        slider.style.transform = `translateX(${activeLi.offsetLeft}px)`;
    };

    const initCommentSection = () => {
        const formComentario = document.getElementById('form-comentario');
        if (!formComentario) return;

        const inputComentario = document.getElementById('input-comentario');
        const listaComentarios = document.getElementById('lista-comentarios');
        const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];

        const salvarComentarios = () => {
            localStorage.setItem('comentarios', JSON.stringify(comentarios));
        };

        const renderizarComentarios = () => {
            listaComentarios.innerHTML = '';
            comentarios.forEach((comentario, index) => {
                const item = document.createElement('div');
                item.className = 'comentario-item';
                const texto = document.createElement('p');
                texto.textContent = comentario.texto;
                const controles = document.createElement('div');
                controles.className = 'comentario-controls';
                const likeContainer = document.createElement('div');
                likeContainer.className = 'like-container';
                const btnLike = document.createElement('button');
                btnLike.className = 'btn-like';
                btnLike.innerHTML = '<i class="fas fa-thumbs-up"></i>';
                btnLike.dataset.index = index;
                const likeCount = document.createElement('span');
                likeCount.textContent = comentario.likes;
                const btnRemover = document.createElement('button');
                btnRemover.className = 'btn-remover';
                btnRemover.innerHTML = '<i class="fas fa-trash-alt"></i>';
                btnRemover.dataset.index = index;
                likeContainer.appendChild(btnLike);
                likeContainer.appendChild(likeCount);
                controles.appendChild(likeContainer);
                controles.appendChild(btnRemover);
                item.appendChild(texto);
                item.appendChild(controles);
                listaComentarios.appendChild(item);
            });
        };

        formComentario.addEventListener('submit', (event) => {
            event.preventDefault();
            const novoTexto = inputComentario.value.trim();
            if (novoTexto === '') return;
            comentarios.push({ texto: novoTexto, likes: 0 });
            inputComentario.value = '';
            salvarComentarios();
            renderizarComentarios();
        });

        listaComentarios.addEventListener('click', (event) => {
            const targetButton = event.target.closest('button');
            if (!targetButton) return;
            const index = targetButton.dataset.index;
            if (targetButton.classList.contains('btn-remover')) {
                comentarios.splice(index, 1);
                salvarComentarios();
                renderizarComentarios();
            }
            if (targetButton.classList.contains('btn-like')) {
                comentarios[index].likes++;
                salvarComentarios();
                renderizarComentarios();
            }
        });

        renderizarComentarios();
    };

    const setActiveLink = (url) => {
        const currentPath = new URL(url).pathname;
        let activeLink;

        activeLink = Array.from(navLinks).find(link => new URL(link.href).pathname === currentPath);
        
        if (!activeLink && (currentPath.endsWith('/') || !currentPath.split('/').pop().includes('.'))) {
            activeLink = Array.from(navLinks).find(link => link.href.endsWith('index.html'));
        }
        
        updateSlider(activeLink);
    };

    const loadPage = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                mainContent.innerHTML = '<h1>Erro ao carregar a página.</h1>';
                return;
            }
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            mainContent.innerHTML = doc.querySelector('main').innerHTML;
            document.title = doc.querySelector('title').innerText;
            
            setActiveLink(url);
            
            if (new URL(url).pathname.includes('informacoes.html')) {
                initCommentSection();
            }

        } catch (error) {
            console.error('Falha ao carregar a página:', error);
            mainContent.innerHTML = '<h1>Erro de conexão.</h1>';
        }
    };

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.matches('header nav a')) {
            e.preventDefault();
            const url = link.href;
            loadPage(url);
            history.pushState(null, '', url);
        }
    });

    window.addEventListener('popstate', () => {
        loadPage(location.href);
    });

    setActiveLink(window.location.href);

    if (window.location.pathname.includes('informacoes.html')) {
        initCommentSection();
    }
});