// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a biblioteca de animação
    AOS.init({
        duration: 800,
        once: true
    });
    // Seleciona todos os blocos <code> dentro de uma tag <pre>
    const codeBlocks = document.querySelectorAll('code > pre');

    codeBlocks.forEach(code => {
        // Verifica se o bloco de código NÃO possui uma classe que começa com "language-"
        if (![...code.classList].some(cls => cls.startsWith('language-'))) {
        // Se não tiver, adiciona a classe padrão 'language-html'
        code.classList.add('language-html');
        }
    });
});
  