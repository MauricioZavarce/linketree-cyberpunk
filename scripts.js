// ==== GERADOR DE SOM SINTÉTICO ====
const contextoAudio = new (window.AudioContext || window.webkitAudioContext)();

function tocarSomBotao() {
    const o = contextoAudio.createOscillator();
    const g = contextoAudio.createGain();
    o.connect(g); g.connect(contextoAudio.destination);
    o.type = 'square';
    o.frequency.setValueAtTime(880, contextoAudio.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, contextoAudio.currentTime + 0.1);
    g.gain.setValueAtTime(0.08, contextoAudio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, contextoAudio.currentTime + 0.15);
    o.start(contextoAudio.currentTime);
    o.stop(contextoAudio.currentTime + 0.15);
}

function tocarSomAbrir() {
    const o = contextoAudio.createOscillator();
    const g = contextoAudio.createGain();
    o.connect(g); g.connect(contextoAudio.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(330, contextoAudio.currentTime);
    o.frequency.exponentialRampToValueAtTime(660, contextoAudio.currentTime + 0.12);
    g.gain.setValueAtTime(0.07, contextoAudio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, contextoAudio.currentTime + 0.18);
    o.start(contextoAudio.currentTime);
    o.stop(contextoAudio.currentTime + 0.18);
}

function tocarSomEnviar() {
    const notas = [523, 659, 784, 1047];
    notas.forEach((freq, i) => {
        setTimeout(() => {
            const o = contextoAudio.createOscillator();
            const g = contextoAudio.createGain();
            o.connect(g); g.connect(contextoAudio.destination);
            o.type = 'sine';
            o.frequency.setValueAtTime(freq, contextoAudio.currentTime);
            g.gain.setValueAtTime(0.08, contextoAudio.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, contextoAudio.currentTime + 0.2);
            o.start(contextoAudio.currentTime);
            o.stop(contextoAudio.currentTime + 0.2);
        }, i * 100);
    });
}

// ==== CONTROLE DOS MENUS SUSPENSOS ====
function alternarMenu(botao) {
    if (contextoAudio.state === 'suspended') contextoAudio.resume();

    const menu = botao.nextElementSibling;
    const estaAberto = menu.classList.contains('aberto');

    document.querySelectorAll('.menu-suspenso.aberto').forEach(m => {
        if (m !== menu) {
            m.classList.remove('aberto');
            m.previousElementSibling.classList.remove('aberto');
        }
    });

    if (estaAberto) {
        menu.classList.remove('aberto');
        botao.classList.remove('aberto');
        tocarSomBotao();
    } else {
        menu.classList.add('aberto');
        botao.classList.add('aberto');
        tocarSomAbrir();
    }
}

// Som ao passar nos links do menu
document.querySelectorAll('.menu-suspenso a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        if (contextoAudio.state === 'suspended') return;
        const o = contextoAudio.createOscillator();
        const g = contextoAudio.createGain();
        o.connect(g); g.connect(contextoAudio.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(520, contextoAudio.currentTime);
        g.gain.setValueAtTime(0.04, contextoAudio.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, contextoAudio.currentTime + 0.08);
        o.start(contextoAudio.currentTime);
        o.stop(contextoAudio.currentTime + 0.08);
    });
});

// ==== FORMULÁRIO — INTEGRADO COM FORMSPREE ====
const formContato = document.getElementById('formContato');
const statusMsg = document.getElementById('statusMsg');

formContato.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (contextoAudio.state === 'suspended') contextoAudio.resume();
    tocarSomEnviar();

    statusMsg.textContent = '⏳ TRANSMITINDO...';
    statusMsg.className = 'mensagem-status';

    const formData = new FormData(formContato);

    try {
        const resposta = await fetch(formContato.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (resposta.ok) {
            statusMsg.textContent = '✅ MENSAGEM ENVIADA!';
            statusMsg.className = 'mensagem-status sucesso';
            formContato.reset();
        } else {
            throw new Error('Erro');
        }
    } catch (erro) {
        statusMsg.textContent = '❌ FALHA NA TRANSMISSÃO. TENTE NOVAMENTE.';
        statusMsg.className = 'mensagem-status erro';
    }

    setTimeout(() => {
        statusMsg.textContent = '';
    }, 6000);
});

// ==== GERAR PARTÍCULAS DO FUNDO ====
const container = document.getElementById('particulas');
const qtdParticulas = 25;
for (let i = 0; i < qtdParticulas; i++) {
    const p = document.createElement('div');
    p.classList.add('particula');
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${6 + Math.random() * 10}s`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    const cores = ['#00fff9', '#ff00c8', '#ffd900', '#00ff88'];
    p.style.background = cores[Math.floor(Math.random() * cores.length)];
    p.style.boxShadow = `0 0 8px ${p.style.background}`;
    container.appendChild(p);
}