document.addEventListener('DOMContentLoaded', () => {

    const formComentario = document.getElementById('form-comentario');
    
    if (!formComentario) {
        return; 
    }

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
});