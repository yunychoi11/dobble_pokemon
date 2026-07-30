// Global state
let currentView = 'study';
let memorizedSymbols = new Set();
let dobbleDeck = [];
let soundEnabled = true;

// Web Audio API Context for synthesizer
let audioCtx = null;

// Stats & Game states
let quizState = {
    currentSymbol: null,
    score: 0,
    streak: 0,
    highStreak: 0,
    mode: 'choice', // 'choice' or 'write'
    answered: false
};

let dobbleState = {
    card1: null,
    card2: null,
    matchingSymbolId: null,
    score: 0,
    timeLeft: 60,
    timerInterval: null,
    gameActive: false,
    highScore: 0
};

let memoryState = {
    cards: [],
    flippedCards: [],
    matchesFound: 0,
    moves: 0,
    timerInterval: null,
    secondsElapsed: 0,
    gameActive: false,
    bestTime: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Generate Dobble mathematical deck
    dobbleDeck = generateDobbleCards();
    
    // Load local storage
    loadProgress();
    
    // Set up views and nav buttons
    setupNavigation();
    
    // Set up overall progress stats
    updateStatsWidget();
    
    // Initialize Study view by default
    initStudyMode();
    
    // Set up sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.checked = soundEnabled;
        soundToggle.addEventListener('change', (e) => {
            soundEnabled = e.target.checked;
            localStorage.setItem('dobble_sound', soundEnabled);
            playTone(440, 'sine', 0.05); // test beep
        });
    }

    // Bind logo click to go home
    document.querySelector('.logo-container').addEventListener('click', () => {
        switchView('study');
    });
});

// Sound synthesizer using Web Audio API
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, type, duration, delay = 0) {
    if (!soundEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
        // Exponential decay
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
    } catch (e) {
        console.error("Audio error", e);
    }
}

function playSound(name) {
    if (!soundEnabled) return;
    switch (name) {
        case 'flip':
            playTone(300, 'triangle', 0.15);
            playTone(600, 'triangle', 0.15, 0.05);
            break;
        case 'correct':
            playTone(523.25, 'sine', 0.1); // C5
            playTone(659.25, 'sine', 0.1, 0.08); // E5
            playTone(783.99, 'sine', 0.25, 0.16); // G5
            break;
        case 'wrong':
            playTone(180, 'sawtooth', 0.3);
            playTone(120, 'sawtooth', 0.3, 0.1);
            break;
        case 'success':
            playTone(523.25, 'sine', 0.12);
            playTone(659.25, 'sine', 0.12, 0.1);
            playTone(783.99, 'sine', 0.12, 0.2);
            playTone(1046.50, 'sine', 0.3, 0.3); // C6
            break;
        case 'click':
            playTone(400, 'sine', 0.05);
            break;
    }
}

// Local Storage Progress Handling
function loadProgress() {
    // Memorized list
    const saved = localStorage.getItem('memorized_symbols');
    if (saved) {
        try {
            memorizedSymbols = new Set(JSON.parse(saved));
        } catch(e) {
            memorizedSymbols = new Set();
        }
    }
    
    // High Scores
    quizState.highStreak = parseInt(localStorage.getItem('quiz_high_streak')) || 0;
    dobbleState.highScore = parseInt(localStorage.getItem('dobble_high_score')) || 0;
    memoryState.bestTime = localStorage.getItem('memory_best_time') ? parseInt(localStorage.getItem('memory_best_time')) : null;
    
    // Sound settings
    const savedSound = localStorage.getItem('dobble_sound');
    soundEnabled = savedSound !== 'false';
}

function saveProgress() {
    localStorage.setItem('memorized_symbols', JSON.stringify(Array.from(memorizedSymbols)));
    updateStatsWidget();
}

function updateStatsWidget() {
    const learnedCount = document.getElementById('learned-count');
    const learnedPercentageText = document.getElementById('learned-percentage-text');
    const overallProgress = document.getElementById('overall-progress-bar');
    
    if (learnedCount && learnedPercentageText && overallProgress) {
        const total = SYMBOLS.length;
        const count = memorizedSymbols.size;
        const pct = Math.round((count / total) * 100);
        
        learnedCount.textContent = `${count} / ${total}`;
        learnedPercentageText.textContent = `${pct}% 완료`;
        overallProgress.style.width = `${pct}%`;
    }
    
    // Update dashboard highscores if they exist
    const dsQuiz = document.getElementById('ds-quiz-streak');
    const dsDobble = document.getElementById('ds-dobble-score');
    const dsMemory = document.getElementById('ds-memory-time');
    
    if (dsQuiz) dsQuiz.textContent = `${quizState.highStreak} 콤보`;
    if (dsDobble) dsDobble.textContent = `${dobbleState.highScore}점`;
    if (dsMemory) dsMemory.textContent = memoryState.bestTime ? `${memoryState.bestTime}초` : '--초';
}

// Finite Projective Plane of Order 7 Card Generator
function generateDobbleCards() {
    const q = 7;
    const cards = [];

    // Card 1: Point at infinity card
    const infinityCard = [];
    for (let i = 0; i <= q; i++) {
        infinityCard.push(i); // Symbols 0 to 7
    }
    cards.push(infinityCard);

    // Group 2: Non-vertical lines
    for (let i = 0; i < q; i++) { // Slope
        for (let c = 0; c < q; c++) { // Intercept
            const card = [i]; // Point at infinity i
            for (let x = 0; x < q; x++) {
                const y = (i * x + c) % q;
                card.push(q + 1 + x * q + y); // Grid mapping
            }
            cards.push(card);
        }
    }

    // Group 3: Vertical lines
    for (let x = 0; x < q; x++) {
        const card = [q]; // Last point at infinity (7)
        for (let y = 0; y < q; y++) {
            card.push(q + 1 + x * q + y);
        }
        cards.push(card);
    }

    return cards;
}

// Navigation handling
function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.dataset.view;
            switchView(targetView);
        });
    });
}

function switchView(viewName) {
    if (currentView === viewName) return;
    
    playSound('click');
    
    // Stop timers of current modes
    if (currentView === 'dobble') stopDobbleGame();
    if (currentView === 'memory') stopMemoryGame();
    
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${viewName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    currentView = viewName;
    
    // Initialize corresponding view
    if (viewName === 'study') initStudyMode();
    else if (viewName === 'quiz') startQuiz();
    else if (viewName === 'dobble') initDobbleGame();
    else if (viewName === 'memory') initMemoryGame();
}

// ================= STUDY MODE (도감 학습) =================
function initStudyMode() {
    const grid = document.getElementById('study-grid');
    const search = document.getElementById('study-search');
    const filterTags = document.querySelectorAll('#study-section .filter-tag');
    
    if (!grid) return;
    
    let currentFilter = 'all';
    let searchQuery = '';
    
    const render = () => {
        grid.innerHTML = '';
        
        const filtered = SYMBOLS.filter(sym => {
            // Type filter
            if (currentFilter !== 'all') {
                if (currentFilter === 'items' && !['item', 'symbol'].includes(sym.type)) return false;
                if (currentFilter === 'pokemons' && ['item', 'symbol', 'character'].includes(sym.type)) return false;
                if (currentFilter === 'characters' && sym.type !== 'character') return false;
            }
            // Search query
            if (searchQuery) {
                const koMatch = sym.name.includes(searchQuery);
                const enMatch = sym.englishName.toLowerCase().includes(searchQuery.toLowerCase());
                if (!koMatch && !enMatch) return false;
            }
            return true;
        });
        
        filtered.forEach(sym => {
            const card = document.createElement('div');
            card.className = `study-card ${memorizedSymbols.has(sym.id) ? 'memorized' : ''}`;
            card.style.setProperty('--card-theme-color', sym.color);
            card.style.setProperty('--card-theme-glow', sym.color + '40');
            
            // Image source (PokeAPI official artwork or custom SVG)
            let imgHtml = '';
            if (sym.pokeApiId) {
                const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${sym.pokeApiId}.png`;
                imgHtml = `<img src="${imgUrl}" class="card-image" alt="${sym.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                           <div class="card-fallback-svg" style="display:none;">${getFallbackSvg(sym.type, sym.color)}</div>`;
            } else {
                imgHtml = `<div class="card-fallback-svg">${sym.svg}</div>`;
            }
            
            card.innerHTML = `
                <div class="card-image-container">
                    ${imgHtml}
                </div>
                <div class="card-name">${sym.name}</div>
                <div class="card-eng-name">${sym.englishName}</div>
                <span class="card-badge" style="border-color:${sym.color}; color:${sym.color}">${translateType(sym.type)}</span>
                <button class="card-learn-toggle">${memorizedSymbols.has(sym.id) ? '학습 취소' : '암기 완료'}</button>
            `;
            
            // Card Click => toggle memorization
            card.addEventListener('click', (e) => {
                // If clicked learn toggle button specifically or card
                e.stopPropagation();
                toggleMemorized(sym.id);
                playSound('flip');
                render();
            });
            
            grid.appendChild(card);
        });
    };
    
    // Bind search events
    search.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        render();
    });
    
    // Bind filter tags
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentFilter = tag.dataset.filter;
            render();
        });
    });
    
    render();
}

function toggleMemorized(id) {
    if (memorizedSymbols.has(id)) {
        memorizedSymbols.delete(id);
    } else {
        memorizedSymbols.add(id);
    }
    saveProgress();
}

function translateType(type) {
    const mapping = {
        'fire': '불꽃',
        'water': '물',
        'grass': '풀',
        'electric': '전기',
        'normal': '노말',
        'dark': '악',
        'fairy': '페어리',
        'bug': '벌레',
        'psychic': '에스퍼',
        'dragon': '드래곤',
        'ghost': '고스트',
        'rock': '바위',
        'ice': '얼음',
        'fighting': '격투',
        'item': '도구',
        'character': '인물',
        'symbol': '속성마크'
    };
    return mapping[type] || type;
}

function getFallbackSvg(type, color) {
    // Simple colored pokeball fallback if image loads offline fail
    return `<svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="${color}" stroke-width="4"/>
        <path d="M5 50 A 45 45 0 0 1 95 50 Z" fill="${color}" opacity="0.3"/>
        <line x1="5" y1="50" x2="95" y2="50" stroke="${color}" stroke-width="4"/>
        <circle cx="50" cy="50" r="12" fill="#fff" stroke="${color}" stroke-width="4"/>
    </svg>`;
}


// ================= QUIZ MODE (이름 맞히기 퀴즈) =================
function startQuiz() {
    quizState.score = 0;
    quizState.streak = 0;
    quizState.answered = false;
    
    // Bind buttons
    const modeBtns = document.querySelectorAll('.quiz-mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            quizState.mode = btn.dataset.mode;
            nextQuizQuestion();
        });
    });
    
    nextQuizQuestion();
}

function nextQuizQuestion() {
    quizState.answered = false;
    const container = document.getElementById('quiz-game-container');
    if (!container) return;
    
    // Select a random symbol
    const correctIdx = Math.floor(Math.random() * SYMBOLS.length);
    const correctSymbol = SYMBOLS[correctIdx];
    quizState.currentSymbol = correctSymbol;
    
    // Clear previous view
    container.innerHTML = '';
    
    // Generate layout
    const quizWrapper = document.createElement('div');
    quizWrapper.className = 'quiz-question-box';
    
    // Image container
    let imgHtml = '';
    if (correctSymbol.pokeApiId) {
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${correctSymbol.pokeApiId}.png`;
        imgHtml = `<img src="${imgUrl}" alt="퀴즈 그림" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div class="card-fallback-svg" style="display:none; width:120px; height:120px;">${getFallbackSvg(correctSymbol.type, correctSymbol.color)}</div>`;
    } else {
        imgHtml = `<div style="width:120px; height:120px;">${correctSymbol.svg}</div>`;
    }
    
    quizWrapper.innerHTML = `
        <div class="quiz-question-title">이 그림의 이름은 무엇일까요?</div>
        <div class="quiz-symbol-display" style="border-color:${correctSymbol.color}">
            ${imgHtml}
        </div>
    `;
    
    container.appendChild(quizWrapper);
    
    // Header updates
    updateQuizHeader();
    
    // Controls
    if (quizState.mode === 'choice') {
        renderQuizChoices(correctSymbol);
    } else {
        renderQuizInput();
    }
}

function updateQuizHeader() {
    const scoreVal = document.getElementById('quiz-score-val');
    const streakVal = document.getElementById('quiz-streak-val');
    
    if (scoreVal) scoreVal.textContent = quizState.score;
    if (streakVal) streakVal.textContent = `${quizState.streak} 콤보 (최고: ${quizState.highStreak})`;
}

function renderQuizChoices(correctSymbol) {
    const container = document.getElementById('quiz-game-container');
    const grid = document.createElement('div');
    grid.className = 'choices-grid';
    
    // Pick 3 random wrong symbols
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
        const rand = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        if (rand.id !== correctSymbol.id && !wrongOptions.find(o => o.id === rand.id)) {
            wrongOptions.push(rand);
        }
    }
    
    // Shuffle choices
    const choices = [correctSymbol, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.name;
        
        btn.addEventListener('click', () => {
            if (quizState.answered) return;
            quizState.answered = true;
            
            if (choice.id === correctSymbol.id) {
                // Correct!
                btn.classList.add('correct');
                playSound('correct');
                quizState.score += 10;
                quizState.streak += 1;
                if (quizState.streak > quizState.highStreak) {
                    quizState.highStreak = quizState.streak;
                    localStorage.setItem('quiz_high_streak', quizState.highStreak);
                }
                // Update stats progress on correct answer
                if (!memorizedSymbols.has(correctSymbol.id)) {
                    memorizedSymbols.add(correctSymbol.id);
                    saveProgress();
                }
            } else {
                // Incorrect
                btn.classList.add('wrong');
                // Highlight correct one
                const buttons = grid.querySelectorAll('.choice-btn');
                buttons.forEach(b => {
                    if (b.textContent === correctSymbol.name) {
                        b.classList.add('correct');
                    }
                });
                playSound('wrong');
                quizState.streak = 0;
            }
            updateQuizHeader();
            updateStatsWidget();
            
            // Next question after a delay
            setTimeout(nextQuizQuestion, 1500);
        });
        grid.appendChild(btn);
    });
    
    container.appendChild(grid);
}

function renderQuizInput() {
    const container = document.getElementById('quiz-game-container');
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'quiz-input-wrapper';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'quiz-text-input';
    input.placeholder = '이름을 입력하세요 (예: 피카츄)';
    input.autofocus = true;
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'quiz-submit-btn';
    submitBtn.textContent = '확인';
    
    const evaluate = () => {
        if (quizState.answered) return;
        const value = input.value.trim();
        if (!value) return;
        
        quizState.answered = true;
        const isCorrect = value === quizState.currentSymbol.name;
        
        if (isCorrect) {
            input.style.borderColor = '#00cc44';
            input.style.backgroundColor = 'rgba(0, 204, 68, 0.1)';
            playSound('correct');
            quizState.score += 15; // Higher score for typing
            quizState.streak += 1;
            if (quizState.streak > quizState.highStreak) {
                quizState.highStreak = quizState.streak;
                localStorage.setItem('quiz_high_streak', quizState.highStreak);
            }
            if (!memorizedSymbols.has(quizState.currentSymbol.id)) {
                memorizedSymbols.add(quizState.currentSymbol.id);
                saveProgress();
            }
        } else {
            input.style.borderColor = '#ff1f44';
            input.style.backgroundColor = 'rgba(255, 31, 68, 0.1)';
            playSound('wrong');
            quizState.streak = 0;
            
            // Show answer text
            const answerReveal = document.createElement('div');
            answerReveal.style.marginTop = '1rem';
            answerReveal.style.color = '#00cc44';
            answerReveal.style.fontWeight = 'bold';
            answerReveal.textContent = `정답은: ${quizState.currentSymbol.name}`;
            container.appendChild(answerReveal);
        }
        updateQuizHeader();
        updateStatsWidget();
        
        setTimeout(nextQuizQuestion, 1800);
    };
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') evaluate();
    });
    submitBtn.addEventListener('click', evaluate);
    
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(submitBtn);
    container.appendChild(inputWrapper);
    
    // Auto focus
    setTimeout(() => input.focus(), 100);
}


// ================= DOBBLE TRAINER MODE (도블 트레이너) =================
function initDobbleGame() {
    stopDobbleGame();
    
    const container = document.getElementById('dobble-playfield-wrapper');
    if (!container) return;
    
    // Setup pre-game start UI
    container.innerHTML = `
        <div class="game-container-box" style="max-width: 500px; text-align: center;">
            <div class="game-over-title">실전 도블 트레이너</div>
            <p style="color: var(--text-muted); margin-bottom: 2rem; line-height: 1.6;">
                두 장의 카드에서 **단 하나만 존재하는 공통 그림**을 찾아 클릭하세요!<br>
                제한시간 60초 동안 많은 정답을 맞출수록 높은 점수를 얻습니다.
            </p>
            <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem;">
                🏆 최고 점수: ${dobbleState.highScore}점
            </div>
            <button class="primary-action-btn" id="start-dobble-btn">게임 시작</button>
        </div>
    `;
    
    document.getElementById('start-dobble-btn').addEventListener('click', startDobbleGame);
}

function startDobbleGame() {
    playSound('click');
    dobbleState.score = 0;
    dobbleState.timeLeft = 60;
    dobbleState.gameActive = true;
    
    // Redraw playfield structure
    const container = document.getElementById('dobble-playfield-wrapper');
    container.innerHTML = `
        <div class="dobble-top-bar">
            <div class="dobble-timer" id="dobble-time-val">⏱️ 60초</div>
            <div class="quiz-score-pill">🔥 <span id="dobble-score-val">0</span>점</div>
        </div>
        <div class="dobble-playfield" id="dobble-cards-area">
            <!-- Cards will be injected here -->
        </div>
    `;
    
    nextDobbleRound();
    
    // Start countdown timer
    dobbleState.timerInterval = setInterval(() => {
        dobbleState.timeLeft--;
        const timerVal = document.getElementById('dobble-time-val');
        if (timerVal) {
            timerVal.textContent = `⏱️ ${dobbleState.timeLeft}초`;
            if (dobbleState.timeLeft <= 10) {
                timerVal.style.color = '#ff1f44';
            }
        }
        
        if (dobbleState.timeLeft <= 0) {
            endDobbleGame();
        }
    }, 1000);
}

function stopDobbleGame() {
    dobbleState.gameActive = false;
    if (dobbleState.timerInterval) {
        clearInterval(dobbleState.timerInterval);
        dobbleState.timerInterval = null;
    }
}

function nextDobbleRound() {
    if (!dobbleState.gameActive) return;
    
    // Pick two cards from the generated deck of 57 cards
    let idx1 = Math.floor(Math.random() * dobbleDeck.length);
    let idx2 = Math.floor(Math.random() * dobbleDeck.length);
    while (idx1 === idx2) {
        idx2 = Math.floor(Math.random() * dobbleDeck.length);
    }
    
    const card1Symbols = dobbleDeck[idx1];
    const card2Symbols = dobbleDeck[idx2];
    
    // Find the unique intersection/overlap between these two cards
    let matchId = null;
    for (let s1 of card1Symbols) {
        if (card2Symbols.includes(s1)) {
            matchId = s1;
            break;
        }
    }
    dobbleState.matchingSymbolId = matchId;
    
    // Draw the two cards
    const cardsArea = document.getElementById('dobble-cards-area');
    if (!cardsArea) return;
    cardsArea.innerHTML = '';
    
    const c1El = createCircularCardElement(card1Symbols);
    const c2El = createCircularCardElement(card2Symbols);
    
    cardsArea.appendChild(c1El);
    cardsArea.appendChild(c2El);
}

// Helper to create a circular card element with 8 symbols randomized in position
function createCircularCardElement(symbolIds) {
    const card = document.createElement('div');
    card.className = 'dobble-card';
    
    // We place 8 symbols in the card: 1 at the center, 7 distributed around.
    // Coordinates are percentages relative to the card's 320x320 grid.
    // Center: (50%, 50%)
    // Outer circle radius: ~28%
    const positions = [
        { x: 50, y: 50 }, // Center
        { x: 50, y: 18 }, // Top
        { x: 78, y: 32 }, // Top-right
        { x: 78, y: 68 }, // Bottom-right
        { x: 50, y: 82 }, // Bottom
        { x: 22, y: 68 }, // Bottom-left
        { x: 22, y: 32 }, // Top-left
        { x: 30, y: 50 }  // Mid-left (adjusted slightly for distribution)
    ];
    
    // Shuffle the matching positions so they aren't in the same geometric spots on both cards
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
    
    symbolIds.forEach((sid, idx) => {
        const symbol = SYMBOLS.find(s => s.id === sid);
        const pos = shuffledPositions[idx];
        
        // Jitter to look natural
        const angleJitter = (Math.random() - 0.5) * 8; // degrees
        const xJitter = (Math.random() - 0.5) * 5; // %
        const yJitter = (Math.random() - 0.5) * 5; // %
        
        // Random scaling factor (0.7 to 1.3)
        const scale = 0.75 + Math.random() * 0.55;
        // Random rotation
        const rotate = Math.floor(Math.random() * 360);
        
        const symDiv = document.createElement('div');
        symDiv.className = 'dobble-symbol';
        
        // Calculate absolute position style. The width/height of the symbol is roughly 60px.
        const size = Math.floor(65 * scale);
        
        symDiv.style.width = `${size}px`;
        symDiv.style.height = `${size}px`;
        symDiv.style.left = `${pos.x + xJitter}%`;
        symDiv.style.top = `${pos.y + yJitter}%`;
        symDiv.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
        
        // Image or SVG content
        let imgHtml = '';
        if (symbol.pokeApiId) {
            const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${symbol.pokeApiId}.png`;
            imgHtml = `<img src="${imgUrl}" alt="${symbol.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div class="card-fallback-svg" style="display:none; width:100%; height:100%;">${getFallbackSvg(symbol.type, symbol.color)}</div>`;
        } else {
            imgHtml = symbol.svg;
        }
        symDiv.innerHTML = imgHtml;
        
        // Click event listener
        symDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            evaluateDobbleChoice(sid, card);
        });
        
        card.appendChild(symDiv);
    });
    
    return card;
}

function evaluateDobbleChoice(selectedId, cardElement) {
    if (!dobbleState.gameActive) return;
    
    if (selectedId === dobbleState.matchingSymbolId) {
        // Correct match!
        playSound('correct');
        dobbleState.score += 10;
        
        // Quick visual success flash
        cardElement.style.borderColor = '#00cc44';
        cardElement.style.boxShadow = '0 0 30px rgba(0, 204, 68, 0.4)';
        
        // Add to memorized list
        if (!memorizedSymbols.has(dobbleState.matchingSymbolId)) {
            memorizedSymbols.add(dobbleState.matchingSymbolId);
            saveProgress();
        }
        
        const scoreVal = document.getElementById('dobble-score-val');
        if (scoreVal) scoreVal.textContent = dobbleState.score;
        
        // Next round
        setTimeout(nextDobbleRound, 300);
    } else {
        // Incorrect match!
        playSound('wrong');
        dobbleState.score = Math.max(0, dobbleState.score - 5);
        
        // Negative animation shake
        cardElement.style.borderColor = '#ff1f44';
        cardElement.style.boxShadow = '0 0 30px rgba(255, 31, 68, 0.4)';
        cardElement.classList.add('shake');
        setTimeout(() => {
            cardElement.classList.remove('shake');
            cardElement.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            cardElement.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
        }, 500);
        
        const scoreVal = document.getElementById('dobble-score-val');
        if (scoreVal) scoreVal.textContent = dobbleState.score;
    }
}

function endDobbleGame() {
    stopDobbleGame();
    playSound('success');
    
    const container = document.getElementById('dobble-playfield-wrapper');
    if (!container) return;
    
    // Save high score
    let isNewHigh = false;
    if (dobbleState.score > dobbleState.highScore) {
        dobbleState.highScore = dobbleState.score;
        localStorage.setItem('dobble_high_score', dobbleState.highScore);
        isNewHigh = true;
    }
    
    updateStatsWidget();
    triggerConfetti();
    
    container.innerHTML = `
        <div class="game-container-box" style="max-width: 500px; text-align: center;">
            <div class="game-over-title">${isNewHigh ? '🎉 새로운 최고 기록!' : '게임 종료!'}</div>
            <div class="game-over-stats">
                <div class="game-over-stat">
                    <span class="game-over-label">최종 점수</span>
                    <span class="game-over-value" style="color:var(--accent);">${dobbleState.score}점</span>
                </div>
                <div class="game-over-stat">
                    <span class="game-over-label">최고 기록</span>
                    <span class="game-over-value">${dobbleState.highScore}점</span>
                </div>
            </div>
            <div style="display:flex; justify-content:center; gap:1rem;">
                <button class="nav-btn" id="exit-dobble-btn">도감으로 가기</button>
                <button class="primary-action-btn" id="retry-dobble-btn">다시 하기</button>
            </div>
        </div>
    `;
    
    document.getElementById('retry-dobble-btn').addEventListener('click', startDobbleGame);
    document.getElementById('exit-dobble-btn').addEventListener('click', () => switchView('study'));
}


// ================= CARD MATCHING MODE (카드 뒤집기) =================
function initMemoryGame() {
    stopMemoryGame();
    
    const container = document.getElementById('memory-playfield-wrapper');
    if (!container) return;
    
    // Settings configuration
    container.innerHTML = `
        <div class="game-container-box" style="max-width: 500px; text-align: center;">
            <div class="game-over-title">카드 뒤집기 기억력 게임</div>
            <p style="color: var(--text-muted); margin-bottom: 2rem; line-height: 1.6;">
                카드들을 하나씩 뒤집어서 **그림(이미지)**과 **이름(텍스트)**이 일치하는 한 쌍을 찾으세요.<br>
                연결력을 향상시키는 가장 좋은 학습 방식입니다!
            </p>
            <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem;">
                🏆 최고 기록: ${memoryState.bestTime ? memoryState.bestTime + '초' : '없음'}
            </div>
            
            <div style="margin-bottom: 2rem;">
                <div style="color:var(--text-muted); font-size:0.9rem; margin-bottom:0.5rem;">난이도 선택</div>
                <div style="display:flex; justify-content:center; gap:0.5rem;">
                    <button class="filter-tag active" id="diff-easy" data-pairs="8">쉬움 (4x4, 8쌍)</button>
                    <button class="filter-tag" id="diff-hard" data-pairs="12">어려움 (6x6, 12쌍, 일부 빈칸)</button>
                </div>
            </div>
            
            <button class="primary-action-btn" id="start-memory-btn">게임 시작</button>
        </div>
    `;
    
    // Bind difficulty toggles
    let pairsToPlay = 8;
    const diffEasy = document.getElementById('diff-easy');
    const diffHard = document.getElementById('diff-hard');
    
    diffEasy.addEventListener('click', () => {
        diffEasy.classList.add('active');
        diffHard.classList.remove('active');
        pairsToPlay = 8;
    });
    
    diffHard.addEventListener('click', () => {
        diffHard.classList.add('active');
        diffEasy.classList.remove('active');
        pairsToPlay = 12;
    });
    
    document.getElementById('start-memory-btn').addEventListener('click', () => startMemoryGame(pairsToPlay));
}

function startMemoryGame(numPairs) {
    playSound('click');
    memoryState.matchesFound = 0;
    memoryState.moves = 0;
    memoryState.secondsElapsed = 0;
    memoryState.gameActive = true;
    memoryState.flippedCards = [];
    
    const container = document.getElementById('memory-playfield-wrapper');
    container.innerHTML = `
        <div class="dobble-top-bar" style="max-width: 600px;">
            <div class="dobble-timer" id="memory-timer-val">⏱️ 0초</div>
            <div class="quiz-score-pill" id="memory-moves-val">움직임: 0회</div>
            <div class="quiz-score-pill">짝: <span id="memory-matches-val">0</span> / ${numPairs}</div>
        </div>
        <div class="memory-grid" id="memory-cards-grid">
            <!-- Cards will be injected here -->
        </div>
    `;
    
    // Configure columns based on grid size
    const gridEl = document.getElementById('memory-cards-grid');
    if (numPairs === 12) {
        gridEl.style.gridTemplateColumns = 'repeat(6, 1fr)';
        gridEl.style.maxWidth = '750px';
    } else {
        gridEl.style.gridTemplateColumns = 'repeat(4, 1fr)';
        gridEl.style.maxWidth = '550px';
    }
    
    // Pick unique random symbols for this play session
    const gameSymbols = [];
    const pool = [...SYMBOLS];
    while (gameSymbols.length < numPairs) {
        const randIdx = Math.floor(Math.random() * pool.length);
        gameSymbols.push(pool.splice(randIdx, 1)[0]);
    }
    
    // Create dual-card entries: 1 image card and 1 name card for each symbol
    const cardsList = [];
    gameSymbols.forEach(sym => {
        cardsList.push({
            symbolId: sym.id,
            type: 'image',
            symbol: sym
        });
        cardsList.push({
            symbolId: sym.id,
            type: 'text',
            symbol: sym
        });
    });
    
    // Shuffle the deck of matching cards
    cardsList.sort(() => Math.random() - 0.5);
    
    // Ingress elements to layout
    cardsList.forEach((cData, index) => {
        const cardNode = document.createElement('div');
        cardNode.className = 'memory-card';
        cardNode.dataset.index = index;
        cardNode.dataset.symbolId = cData.symbolId;
        cardNode.dataset.cardType = cData.type;
        
        let cardFrontHtml = '';
        if (cData.type === 'image') {
            let imgHtml = '';
            if (cData.symbol.pokeApiId) {
                const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${cData.symbol.pokeApiId}.png`;
                imgHtml = `<img src="${imgUrl}" alt="${cData.symbol.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                           <div class="card-fallback-svg" style="display:none; width:100%; height:100%;">${getFallbackSvg(cData.symbol.type, cData.symbol.color)}</div>`;
            } else {
                imgHtml = cData.symbol.svg;
            }
            cardFrontHtml = `<div class="memory-card-front">${imgHtml}</div>`;
        } else {
            cardFrontHtml = `<div class="memory-card-front text-only-card">${cData.symbol.name}</div>`;
        }
        
        cardNode.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-back"></div>
                ${cardFrontHtml}
            </div>
        `;
        
        cardNode.addEventListener('click', () => {
            handleMemoryCardFlip(cardNode, numPairs);
        });
        
        gridEl.appendChild(cardNode);
    });
    
    // Start stopwatch
    memoryState.timerInterval = setInterval(() => {
        memoryState.secondsElapsed++;
        const timerVal = document.getElementById('memory-timer-val');
        if (timerVal) timerVal.textContent = `⏱️ ${memoryState.secondsElapsed}초`;
    }, 1000);
}

function handleMemoryCardFlip(cardNode, targetPairs) {
    if (!memoryState.gameActive) return;
    if (cardNode.classList.contains('flipped') || cardNode.classList.contains('matched')) return;
    if (memoryState.flippedCards.length >= 2) return;
    
    // Flip card
    playSound('flip');
    cardNode.classList.add('flipped');
    memoryState.flippedCards.push(cardNode);
    
    if (memoryState.flippedCards.length === 2) {
        memoryState.moves++;
        const movesVal = document.getElementById('memory-moves-val');
        if (movesVal) movesVal.textContent = `움직임: ${memoryState.moves}회`;
        
        const card1 = memoryState.flippedCards[0];
        const card2 = memoryState.flippedCards[1];
        
        const id1 = card1.dataset.symbolId;
        const id2 = card2.dataset.symbolId;
        
        const type1 = card1.dataset.cardType;
        const type2 = card2.dataset.cardType;
        
        // A match requires same symbol ID, but different card types (one image, one name)
        if (id1 === id2 && type1 !== type2) {
            // Correct pair!
            playSound('correct');
            card1.classList.add('matched');
            card2.classList.add('matched');
            
            // Mark symbol as memorized
            const mid = parseInt(id1);
            if (!memorizedSymbols.has(mid)) {
                memorizedSymbols.add(mid);
                saveProgress();
            }
            
            memoryState.matchesFound++;
            const matchesVal = document.getElementById('memory-matches-val');
            if (matchesVal) matchesVal.textContent = memoryState.matchesFound;
            
            memoryState.flippedCards = [];
            
            // Check victory condition
            if (memoryState.matchesFound === targetPairs) {
                endMemoryGame();
            }
        } else {
            // Wrong pair!
            setTimeout(() => {
                playSound('wrong');
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                memoryState.flippedCards = [];
            }, 1000);
        }
        updateStatsWidget();
    }
}

function stopMemoryGame() {
    memoryState.gameActive = false;
    if (memoryState.timerInterval) {
        clearInterval(memoryState.timerInterval);
        memoryState.timerInterval = null;
    }
}

function endMemoryGame() {
    stopMemoryGame();
    playSound('success');
    
    const container = document.getElementById('memory-playfield-wrapper');
    if (!container) return;
    
    // Save high score
    let isNewHigh = false;
    if (!memoryState.bestTime || memoryState.secondsElapsed < memoryState.bestTime) {
        memoryState.bestTime = memoryState.secondsElapsed;
        localStorage.setItem('memory_best_time', memoryState.bestTime);
        isNewHigh = true;
    }
    
    triggerConfetti();
    
    container.innerHTML = `
        <div class="game-container-box" style="max-width: 500px; text-align: center;">
            <div class="game-over-title">${isNewHigh ? '🎉 새로운 최고 시간 기록!' : '성공적으로 완료했습니다!'}</div>
            <div class="game-over-stats">
                <div class="game-over-stat">
                    <span class="game-over-label">소요 시간</span>
                    <span class="game-over-value" style="color:var(--accent);">${memoryState.secondsElapsed}초</span>
                </div>
                <div class="game-over-stat">
                    <span class="game-over-label">움직임 횟수</span>
                    <span class="game-over-value">${memoryState.moves}회</span>
                </div>
                <div class="game-over-stat">
                    <span class="game-over-label">최고 기록</span>
                    <span class="game-over-value">${memoryState.bestTime}초</span>
                </div>
            </div>
            <div style="display:flex; justify-content:center; gap:1rem;">
                <button class="nav-btn" id="exit-memory-btn">도감으로 가기</button>
                <button class="primary-action-btn" id="retry-memory-btn">다시 하기</button>
            </div>
        </div>
    `;
    
    document.getElementById('retry-memory-btn').addEventListener('click', initMemoryGame);
    document.getElementById('exit-memory-btn').addEventListener('click', () => switchView('study'));
}


// ================= MISC/VISUAL EFFECTS =================
function triggerConfetti() {
    const colors = ['#8b5cf6', '#ffd13b', '#ff1f44', '#0099ff', '#00cc44'];
    for (let i = 0; i < 80; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = `${Math.random() * 100}vw`;
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.width = `${5 + Math.random() * 10}px`;
        conf.style.height = `${8 + Math.random() * 12}px`;
        conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Random falling speed & horizontal drift
        const duration = 2 + Math.random() * 2;
        conf.style.animationDuration = `${duration}s`;
        
        document.body.appendChild(conf);
        
        // Cleanup after animation completes
        setTimeout(() => {
            conf.remove();
        }, duration * 1000);
    }
}
