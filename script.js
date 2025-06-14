// --- Language and Translations ---
let currentLanguage = 'en';
const translations = {
    en: {
        'main-title': 'Football Competition Analysis Tool',
        'tab-btn-simulator': 'Group Simulator',
        'tab-btn-knockout': 'Knockout Stage',
        'tab-btn-odds': 'Simulated Group Odds',
        'model-select-label': 'Simulation Model:',
        'model-odds-btn': 'Odds Based',
        'model-elo-btn': 'Elo Based',
        'app-description': 'Enter match odds to simulate group outcomes and analyze probabilities. Lambdas are derived using an iterative xG calculation based on O/U and Home/Away odds.',
        'import-csv-label': 'Import CSV File',
        'no-file-selected': 'No file selected.',
        'csv-instructions': `CSV Delimiters: comma, semicolon, or tab. Each row a match.<br/>Style 1 (with 'vs'): GROUP,TEAM_A_FIELD(S),vs,TEAM_B_FIELD(S),ODD1,ODDX,ODD2,ODD_U2.5,ODD_O2.5<br/>Style 2 (without 'vs'): GROUP,TEAM_A_FIELD,TEAM_B_FIELD,ODD1,ODDX,ODD2,ODD_U2.5,ODD_O2.5 (TEAM_A/B are single fields)<br/>If team names contain the delimiter, quote them in the CSV (e.g., "Team, Inc.").`,
        'match-data-label': 'Match Data (Odds Input):',
        'elo-data-label': 'Team Elo Ratings:',
        'match-data-placeholder': `Paste match data here or import from CSV. Each line: GROUP TEAM_A vs TEAM_B ODDS_1 ODDS_X ODDS_2 ODDS_UNDER_2.5 ODDS_OVER_2.5\nExample: A Al Ahly vs Inter Miami 3.9 3.85 1.85 1.93 1.87`,
        'elo-data-placeholder': 'Enter one team and rating per line.\nFormat: GROUP Team Name Rating\nExample: A Germany 2000',
        'live-results-label': 'Live Results (Optional):',
        'live-results-placeholder': 'Enter one result per line.\nFormat: Team A X-Y Team B\nExample: Germany 5-1 Scotland',
        'num-sims-label': 'Number of Simulations:',
        'parse-btn': '1. Parse & Validate Data',
        'run-btn': '2. Run Simulation',
        'save-btn': 'Save Scenario',
        'load-label': 'Load Scenario',
        'clear-btn': 'Clear All',
        'sim-results-title': 'Simulation Results:',
        'results-placeholder': 'Results will appear here...',
        'sim-odds-title': 'Simulated Group Odds',
        'sim-odds-desc': 'View odds derived from the simulation results. Select a group and apply a margin.',
        'knockout-title': 'Knockout Stage Simulation',
        'knockout-desc': 'Define the knockout bracket matchups below. Use placeholders like "1A" for 1st place in Group A, or "W_M1" for the winner of Match 1. The simulation will use the group stage results to populate the bracket and simulate to find the ultimate tournament winner.',
        'knockout-bracket-label': 'Knockout Bracket Definition:',
        'knockout-run-btn': 'Run Full Tournament Simulation',
        'tournament-winner-title': 'Tournament Winner Probabilities',
        'tournament-results-placeholder': 'Run a full tournament simulation to see winner odds.',
        'tournament-sims-label': 'Number of Tournament Simulations:',
        'tournament-margin-label': 'Tournament Outright Margin (%):',
        'select-group-label': 'Select Group:',
        'run-sim-first-option': '-- Run Simulation First --',
        'select-group-option': '-- Select Group --',
        'bookie-margin-label': 'Main Bookmaker Margin (%):',
        'show-odds-btn': 'Show/Refresh Market Odds',
        'gen-group-csv-btn': 'Generate Group Odds CSV',
        'odds-results-placeholder': 'Select a group and click "Show/Refresh Market Odds" to see standard market results.',
        'ou-odds-title': 'Over/Under Line Odds',
        'ou-margin-label': 'Over/Under Specific Margin (%):',
        'ou-group-goals-title': 'Total Group Goals O/U',
        'ou-1st-pts-title': 'Points of 1st Placed Team O/U',
        'ou-last-pts-title': 'Points of Last Placed Team O/U',
        'ou-1st-gf-title': 'Goals For by 1st Placed Team O/U',
        'ou-last-gf-title': 'Goals For by Last Placed Team O/U',
        'ou-btts-title': 'Number of BTTS Matches O/U',
        'ou-over25-title': 'Number of Over 2.5 Matches O/U',
        'ou-zerozero-title': 'Number of 0-0 Matches O/U',
        'ou-wins-title': 'Total Wins O/U',
        'ou-draws-title': 'Total Draws O/U',
        'ou-losses-title': 'Total Losses O/U',
        'team-unbeaten-title': 'Team to Go Unbeaten in Group',
        'custom-props-title': 'Custom Team Prop Odds',
        'select-team-label': 'Select Team (from chosen group):',
        'select-group-first-option': '-- Select Group First --',
        'select-team-option': '-- Select Team --',
        'gen-team-csv-btn': 'Generate Team CSV',
        'calc-prob-prefix': 'Calculate P(',
        'calc-prop-odd-btn': 'Calc Prop Odd',
        'custom-odds-placeholder': 'Custom prop odds will appear here...',
        'team': 'Team',
        'e-pts': 'E(Pts)',
        'e-wins': 'E(Wins)',
        'e-gf': 'E(GF)',
        'e-ga': 'E(GA)',
        'p-most-gf': 'P(Most GF)',
        'p-most-ga': 'P(Most GA)',
        'total-group-goals': 'Expected Total Goals in Group',
        'all-sfs': 'All Straight Forecasts (1st-2nd):',
        'top-ads': 'Top Advancing Doubles (Top 2 Any Order):',
        'csv-date': 'Date', 'csv-time': 'Time', 'csv-market': 'Market', 'csv-odd1': 'Odd1', 'csv-odd2': 'Odd2', 'csv-odd3': 'Odd3',
        'csv-group-winner': 'Group Winner', 'csv-qualify': 'To Qualify', 'csv-2nd': '2nd Place', 'csv-3rd': '3rd Place', 'csv-4th': '4th Place',
        'csv-pts-in-group': 'points in group',
        'csv-pts-range-1-3': '1-3 points in group', 'csv-pts-range-2-4': '2-4 points in group', 'csv-pts-range-4-6': '4-6 points in group',
        'csv-total-pts': 'Total points in group',
        'csv-league-name': 'LEAGUE_NAME', 'csv-any-team': 'Any team', 'csv-9-pts': '9 points', 'csv-0-pts': '0 points',
        'csv-total-pts-h': 'Uk. bodova', 'csv-1st-place-team': 'First placed team', 'csv-last-place-team': 'Last placed team',
        'csv-s-forecast': 'Correct Score 1-2', 'csv-adv-doubles': 'First two in group'
    },
    sr: {
        'main-title': 'Alat za Analizu Takmičenja',
        'tab-btn-simulator': 'Simulator Grupa',
         'tab-btn-knockout': 'Nokaut Faza',
        'tab-btn-odds': 'Simulirane Kvote Grupe',
         'model-select-label': 'Model Simulacije:',
        'model-odds-btn': 'Na osnovu Kvota',
        'model-elo-btn': 'Na osnovu Elo',
        'app-description': 'Unesite kvote mečeva da simulirate ishode grupe i analizirate verovatnoće. Lambde se izvode pomoću iterativnog xG proračuna na osnovu kvota za Više/Manje i Domaćin/Gost.',
        'import-csv-label': 'Uvezi CSV Fajl',
        'no-file-selected': 'Nije izabran fajl.',
        'csv-instructions': `CSV Delimiteri: zarez, tačka-zarez ili tab. Svaki red jedan meč.<br/>Stil 1 (sa 'vs'): GRUPA,TIM_A,vs,TIM_B,KVOTA1,KVOTAX,KVOTA2,KVOTA_U2.5,KVOTA_O2.5<br/>Stil 2 (bez 'vs'): GRUPA,TIM_A,TIM_B,KVOTA1,KVOTAX,KVOTA2,KVOTA_U2.5,KVOTA_O2.5<br/>Ako imena timova sadrže delimiter, stavite ih pod navodnike (npr. "Tim, Inc.").`,
        'match-data-label': 'Podaci o Mečevima (Unos Kvota):',
        'elo-data-label': 'Elo Rejting Timova:',
        'match-data-placeholder': `Nalepite podatke o mečevima ovde ili ih uvezite iz CSV-a. Svaki red: GRUPA TIM_A vs TIM_B KVOTA_1 KVOTA_X KVOTA_2 KVOTA_ISPOD_2.5 KVOTA_PREKO_2.5\nPrimer: A Srbija vs Engleska 3.9 3.85 1.85 1.93 1.87`,
         'elo-data-placeholder': 'Unesite jedan tim i rejting po redu.\nFormat: GRUPA Ime Tima Rejting\nPrimer: A Nemačka 2000',
        'live-results-label': 'Uživo Rezultati (Opciono):',
        'live-results-placeholder': 'Unesite jedan rezultat po redu.\nFormat: Tim A X-Y Tim B\nPrimer: Nemačka 5-1 Škotska',
        'num-sims-label': 'Broj Simulacija:',
        'parse-btn': '1. Parsiraj i Validaraj Podatke',
        'run-btn': '2. Pokreni Simulaciju',
        'save-btn': 'Sačuvaj Scenario',
        'load-label': 'Učitaj Scenario',
        'clear-btn': 'Obriši Sve',
        'sim-results-title': 'Rezultati Simulacije:',
        'results-placeholder': 'Rezultati će se pojaviti ovde...',
        'sim-odds-title': 'Simulirane Kvote Grupe',
        'sim-odds-desc': 'Pogledajte kvote izvedene iz rezultata simulacije. Izaberite grupu i primenite maržu.',
        'knockout-title': 'Simulacija Nokaut Faze',
        'knockout-desc': 'Definišite parove nokaut faze. Koristite oznake kao "1A" za prvoplasiranog iz grupe A, ili "W_M1" za pobednika Meča 1. Simulacija će koristiti rezultate grupne faze da popuni kostur i simulira do krajnjeg pobednika.',
        'knockout-bracket-label': 'Definicija Nokaut Faze:',
        'knockout-run-btn': 'Pokreni Simulaciju Celog Turnira',
        'tournament-winner-title': 'Verovatnoće za Osvajanje Turnira',
        'tournament-sims-label': 'Broj Simulacija Turnira:',
        'tournament-margin-label': 'Marža za Pobednika Turnira (%):',
        'tournament-results-placeholder': 'Pokrenite simulaciju celog turnira da vidite kvote za pobednika.',
        'select-group-label': 'Izaberi Grupu:',
        'run-sim-first-option': '-- Prvo Pokreni Simulaciju --',
        'select-group-option': '-- Izaberi Grupu --',
        'bookie-margin-label': 'Glavna Marža Kladionice (%):',
        'show-odds-btn': 'Prikaži/Osveži Tržišne Kvote',
        'gen-group-csv-btn': 'Generiši CSV za Grupu',
        'odds-results-placeholder': 'Izaberite grupu i kliknite na "Prikaži/Osveži Tržišne Kvote" da vidite rezultate.',
        'ou-odds-title': 'Kvote na Više/Manje Golova',
        'ou-margin-label': 'Specifična Marža za Više/Manje (%):',
        'ou-group-goals-title': 'Ukupno Golova u Grupi V/M',
        'ou-1st-pts-title': 'Bodovi Prvoplasiranog Tima V/M',
        'ou-last-pts-title': 'Bodovi Poslednjeplasiranog Tima V/M',
        'ou-1st-gf-title': 'Datih Golova Prvoplasiranog Tima V/M',
        'ou-last-gf-title': 'Datih Golova Poslednjeplasiranog Tima V/M',
        'ou-btts-title': 'Broj GG Mečeva V/M',
        'ou-over25-title': 'Broj 3+ Mečeva V/M',
        'ou-zerozero-title': 'Broj 0-0 Mečeva V/M',
        'ou-wins-title': 'Ukupno Pobeda V/M',
        'ou-draws-title': 'Ukupno Nerešenih V/M',
        'ou-losses-title': 'Ukupno Poraza V/M',
        'team-unbeaten-title': 'Tim bez poraza u grupi',
        'custom-props-title': 'Prilagođene Kvote za Tim',
        'select-team-label': 'Izaberi Tim (iz izabrane grupe):',
        'select-group-first-option': '-- Prvo Izaberi Grupu --',
        'select-team-option': '-- Izaberi Tim --',
        'gen-team-csv-btn': 'Generiši CSV za Tim',
        'calc-prob-prefix': 'Izračunaj P(',
        'calc-prop-odd-btn': 'Izr. Kvotu',
        'custom-odds-placeholder': 'Prilagođene kvote će se pojaviti ovde...',
        'team': 'Tim',
        'e-pts': 'O(Bod)',
        'e-wins': 'O(Pob)',
        'e-gf': 'O(DG)',
        'e-ga': 'O(PG)',
        'p-most-gf': 'V(Najviše DG)',
        'p-most-ga': 'V(Najviše PG)',
        'total-group-goals': 'Očekivano Ukupno Golova u Grupi',
        'all-sfs': 'Svi Tačni Poredci (1.-2.):',
        'top-ads': 'Najbolji Parovi za Prolaz (Top 2 Bilo kojim Redosledom):',
        'csv-date': 'Datum', 'csv-time': 'Vreme', 'csv-market': 'Market', 'csv-odd1': 'Kvota1', 'csv-odd2': 'Kvota2', 'csv-odd3': 'Kvota3',
        'csv-group-winner': 'Pobednik grupe', 'csv-qualify': 'Prolazi grupu', 'csv-2nd': '2. mesto u grupi', 'csv-3rd': '3. mesto u grupi', 'csv-4th': '4. mesto u grupi',
        'csv-pts-in-group': 'bodova u grupi',
        'csv-pts-range-1-3': '1-3 boda u grupi', 'csv-pts-range-2-4': '2-4 boda u grupi', 'csv-pts-range-4-6': '4-6 bodova u grupi',
        'csv-total-pts': 'Osvojenih bodova u grupi',
        'csv-league-name': 'LIGA', 'csv-any-team': 'Bilo koji tim', 'csv-9-pts': '9 bodova', 'csv-0-pts': '0 bodova',
        'csv-total-pts-h': 'Uk. bodova', 'csv-1st-place-team': 'Prvoplasirani tim', 'csv-last-place-team': 'Poslednjeplasirani tim',
        'csv-s-forecast': 'Tacan poredak 1-2', 'csv-adv-doubles': 'Prva dva u grupi'
    }
};

function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[id]').forEach(el => {
        const key = el.id;
        const translation = translations[lang][key.replace(/-\d+$/, '')] || translations[lang][key];
         if (translation) {
            if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
                const placeholderKey = (key.replace('-label', '') || key) + '-placeholder';
                if (translations[lang][placeholderKey]) {
                    el.placeholder = translations[lang][placeholderKey];
                }
            } else if (el.tagName === 'SPAN' && el.parentElement.tagName === 'H5') {
                 el.textContent = translation;
            }
            else {
                el.innerHTML = translation;
            }
        }
    });

    document.getElementById('langEn').classList.toggle('active', lang === 'en');
    document.getElementById('langSr').classList.toggle('active', lang === 'sr');
    
    populateSimGroupSelect();
}

// --- Tab Switching Logic ---
function openTab(event, tabName) {
    let i, tabcontent, tabbuttons;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");
}

// --- Global Variables ---
let parsedMatches = [], allTeams = new Set(), groupedMatches = {}, groupTeamNames = {}, simulationAggStats = {}, currentNumSims = 0, liveResults = {}, teamEloRatings = {};
let currentModel = 'odds'; // 'odds' or 'elo'

// --- DOM Elements ---
const matchDataEl = document.getElementById('matchData'), liveResultsDataEl = document.getElementById('liveResultsData'), numSimulationsEl = document.getElementById('numSimulations'), eloDataEl = document.getElementById('eloData');
const parseButtonEl = document.getElementById('parseButton'), runButtonEl = document.getElementById('runButton'), clearButtonEl = document.getElementById('clearButton');
const saveButtonEl = document.getElementById('saveButton'), loadFileInputEl = document.getElementById('loadFileInput');
const statusAreaEl = document.getElementById('statusArea'), loaderEl = document.getElementById('loader'), resultsContentEl = document.getElementById('resultsContent');
const csvFileInputEl = document.getElementById('csvFileInput'), csvFileNameEl = document.getElementById('csvFileName');
const simGroupSelectEl = document.getElementById('simGroupSelect'), simBookieMarginEl = document.getElementById('simBookieMargin');
const showSimulatedOddsButtonEl = document.getElementById('showSimulatedOddsButton');
const calculatedOddsResultContentEl = document.getElementById('calculatedOddsResultContent'), simulatedOddsStatusEl = document.getElementById('simulatedOddsStatus');
const simTeamSelectEl = document.getElementById('simTeamSelect');
const customProbInputsContainerEl = document.getElementById('customProbInputsContainer');
const simCustomStatTypeEl = document.getElementById('simCustomStatType'), simCustomOperatorEl = document.getElementById('simCustomOperator');
const simCustomValue1El = document.getElementById('simCustomValue1'), simCustomValue2El = document.getElementById('simCustomValue2');
const calculateCustomProbAndOddButtonEl = document.getElementById('calculateCustomProbAndOddButton');
const customProbAndOddResultAreaEl = document.getElementById('customProbAndOddResultArea');
const generateTeamCsvButtonEl = document.getElementById('generateTeamCsvButton'); 
const generateGroupCsvButtonEl = document.getElementById('generateGroupCsvButton');
const modelOddsBtn = document.getElementById('modelOdds'), modelEloBtn = document.getElementById('modelElo');
const oddsBasedInputs = document.getElementById('oddsBasedInputs'), eloBasedInputs = document.getElementById('eloBasedInputs');
const knockoutBracketEl = document.getElementById('knockoutBracket');
const runFullTournamentButtonEl = document.getElementById('runFullTournamentButton');
const tournamentLoaderEl = document.getElementById('tournamentLoader');
const tournamentWinnerContentEl = document.getElementById('tournamentWinnerContent');
const tournamentFinalistsContentEl = document.getElementById('tournamentFinalistsContent');
const tournamentReachContentEl = document.getElementById('tournamentReachContent');
const tournamentEliminationContentEl = document.getElementById('tournamentEliminationContent');
const numTournamentSimulationsEl = document.getElementById('numTournamentSimulations');

// --- Model Switcher Logic ---
modelOddsBtn.addEventListener('click', () => switchModel('odds'));
modelEloBtn.addEventListener('click', () => switchModel('elo'));

function switchModel(model) {
    currentModel = model;
    modelOddsBtn.classList.toggle('active', model === 'odds');
    modelEloBtn.classList.toggle('active', model === 'elo');
    oddsBasedInputs.classList.toggle('hidden', model !== 'odds');
    eloBasedInputs.classList.toggle('hidden', model !== 'elo');
    
    // Clear parsed data when switching models to avoid confusion
    parsedMatches = [];
    teamEloRatings = {};
    runButtonEl.disabled = true;
    runFullTournamentButtonEl.disabled = true;
    statusAreaEl.innerHTML = `<p class="text-blue-500">Switched to ${model.toUpperCase()} model. Please parse data.</p>`;
}


// --- CSV File Input ---
csvFileInputEl.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        csvFileNameEl.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => { matchDataEl.value = e.target.result; statusAreaEl.innerHTML = `<p class="text-blue-500">CSV loaded. Click "Parse & Validate Data".</p>`; };
        reader.onerror = (e) => { statusAreaEl.innerHTML = `<p class="text-red-500">Error reading file: ${e.target.error.name}</p>`; csvFileNameEl.textContent = "No file selected."; };
        reader.readAsText(file);
    } else { csvFileNameEl.textContent = translations[currentLanguage]['no-file-selected']; }
});

// --- xG & Elo Calculation & Helpers ---
function factorialJs(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) { result *= i; }
    return result;
}

function poissonPMF(mu, k) { 
    if (mu < 0 || k < 0 || !Number.isInteger(k)) return 0;
    if (mu === 0 && k === 0) return 1;
    if (mu === 0 && k > 0) return 0;
    const factK = factorialJs(k);
    if (factK === Infinity || factK === 0) return 0; 
    return (Math.pow(mu, k) * Math.exp(-mu)) / factK;
}

function poissonRandom(lambda) { 
    if (lambda <= 0) return 0;
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}

function calculateExpectedScore(ratingA, ratingB) {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function updateElo(rating, actualScore, expectedScore) {
    const kFactor = 30; // K-factor can be adjusted
    return rating + kFactor * (actualScore - expectedScore);
}

function eloToGoalSupremacy(eloDiff) {
    return (eloDiff / 100) * 0.3;
}

function calculateModelProbsFromXG(homeXG, awayXG, goalLine = 2.5) {
    let probHomeWin = 0, probAwayWin = 0, probDraw = 0;
    let probUnder = 0, probOver = 0;
    const maxGoals = 15; 

    for (let i = 0; i <= maxGoals; i++) { 
        for (let j = 0; j <= maxGoals; j++) { 
            const probScore = poissonPMF(homeXG, i) * poissonPMF(awayXG, j);
            if (probScore === 0) continue; 

            if (i > j) probHomeWin += probScore;
            else if (j > i) probAwayWin += probScore;
            else probDraw += probScore;

            const totalMatchGoals = i + j;
            if (totalMatchGoals < goalLine) probUnder += probScore;
            else if (totalMatchGoals > goalLine) probOver += probScore;
        }
    }
    
    const modelProbHomeWinNoDraw = (probHomeWin + probAwayWin > 0) ? probHomeWin / (probHomeWin + probAwayWin) : 0.5; 
    const modelProbUnderNoExact = (probUnder + probOver > 0) ? probUnder / (probUnder + probOver) : 0.5; 
    
    return {
        modelProbHomeWinNoDraw: modelProbHomeWinNoDraw,
        modelProbUnderNoExact: modelProbUnderNoExact,
    };
}

function calculateExpectedGoalsFromOdds(overPrice, underPrice, homePrice, awayPrice) {
    const normalisedUnder = (1 / underPrice) / ((1 / overPrice) + (1 / underPrice));
    const normalisedHomeNoDraw = (1 / homePrice) / ((1 / awayPrice) + (1 / homePrice));

    let totalGoals = 2.5; 
    let supremacy = 0;    

    const tolerance = 0.001;
    const maxIterations = 100;

    // --- First loop: find totalGoals ---
    for (let i = 0; i < maxIterations; i++) {
        let homeExpectedGoals = Math.max(0.01, totalGoals / 2 + supremacy / 2);
        let awayExpectedGoals = Math.max(0.01, totalGoals / 2 - supremacy / 2);

        const output = calculateModelProbsFromXG(homeExpectedGoals, awayExpectedGoals, 2.5);
        const error = output.modelProbUnderNoExact - normalisedUnder;

        if (Math.abs(error) < tolerance) break;
        
        totalGoals += error * 5; // Proportional adjustment
        totalGoals = Math.max(0.02, totalGoals);
    }

    // --- Second loop: find supremacy ---
    for (let i = 0; i < maxIterations; i++) {
        supremacy = Math.max(-(totalGoals - 0.02), Math.min(totalGoals - 0.02, supremacy));
        let homeExpectedGoals = Math.max(0.01, totalGoals / 2 + supremacy / 2);
        let awayExpectedGoals = Math.max(0.01, totalGoals / 2 - supremacy / 2);

        const output = calculateModelProbsFromXG(homeExpectedGoals, awayExpectedGoals, 2.5);
        const error = output.modelProbHomeWinNoDraw - normalisedHomeNoDraw;

        if (Math.abs(error) < tolerance) break;

        supremacy -= error * 2; // Proportional adjustment
    }
    
    let homeExpectedGoals = Math.max(0.01, totalGoals / 2 + supremacy / 2);
    let awayExpectedGoals = Math.max(0.01, totalGoals / 2 - supremacy / 2);

    return { homeXG: homeExpectedGoals, awayXG: awayExpectedGoals };
}


// --- Live Results Parsing ---
function parseLiveResults() {
    liveResults = {};
    const data = liveResultsDataEl.value.trim();
    if (!data) return; // No results to parse

    const lines = data.split('\n');
    let errors = [];

    lines.forEach((line, index) => {
        line = line.trim();
        if (!line) return;
        
        const scoreRegex = /^(.*)\s+(\d+)\s*-\s*(\d+)\s+(.*)$/;
        const match = line.match(scoreRegex);

        if (match) {
            const team1Name = match[1].trim();
            const score1 = parseInt(match[2], 10);
            const score2 = parseInt(match[3], 10);
            const team2Name = match[4].trim();

            if (!team1Name || !team2Name || isNaN(score1) || isNaN(score2)) {
                errors.push(`Invalid result format on line ${index + 1}: "${line}"`);
                return;
            }
            
            const resultKey = [team1Name, team2Name].sort().join('-');
            liveResults[resultKey] = { team1: team1Name, g1: score1, g2: score2 };

        } else {
            errors.push(`Could not parse result on line ${index + 1}: "${line}"`);
        }
    });

    if (errors.length > 0) {
         statusAreaEl.innerHTML += `<p class="text-red-500 font-semibold mt-2">Live Result Parse Errors:</p><ul class="list-disc list-inside text-red-500">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
    } else {
         statusAreaEl.innerHTML += `<p class="text-green-500">Parsed ${Object.keys(liveResults).length} live results successfully.</p>`;
    }
}

function parseEloData() {
    teamEloRatings = {};
    const data = eloDataEl.value.trim();
    if (!data) return true;

    const lines = data.split('\n');
    let errors = [];
    lines.forEach((line, index) => {
        line = line.trim();
        if (!line) return;
        
        const parts = line.split(/\s+/);
        const rating = parseInt(parts.pop(), 10);
        const group = parts.shift();
        const teamName = parts.join(' ');
        
        if (!group || !teamName || isNaN(rating)) {
             errors.push(`Invalid Elo format on line ${index + 1}: "${line}"`);
             return;
        }
        teamEloRatings[teamName] = { rating, group };
        allTeams.add(teamName);
         if (!groupTeamNames[group]) {
            groupTeamNames[group] = new Set();
        }
        groupTeamNames[group].add(teamName);
    });

    if (errors.length > 0) {
         statusAreaEl.innerHTML += `<p class="text-red-500 font-semibold mt-2">Elo Parse Errors:</p><ul class="list-disc list-inside text-red-500">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
         return false;
    }
    statusAreaEl.innerHTML += `<p class="text-green-500">Parsed ${Object.keys(teamEloRatings).length} Elo ratings into ${Object.keys(groupTeamNames).length} groups.</p>`;
    return true;
}


// --- Parsing Logic (Simulator) ---
parseButtonEl.addEventListener('click', () => {
    statusAreaEl.innerHTML = '';
    runButtonEl.disabled = true;
    runFullTournamentButtonEl.disabled = true;
    parsedMatches = []; 
    allTeams.clear(); 
    groupedMatches = {}; 
    groupTeamNames = {};
    let warnings = [];
    
    if (currentModel === 'odds') {
         // The existing odds parsing logic
        const data = matchDataEl.value.trim(); 
        if (!data) { statusAreaEl.innerHTML = '<p class="text-red-500">Error: Match data empty.</p>'; return; }
        const lines = data.split('\n');
        let errors = [];
        lines.forEach((line, index) => {
            line = line.trim(); if (!line || line.startsWith('#')) return;
            let parts, isCsvLike = false;
            if (line.includes(',')) { parts = line.split(',').map(p => p.trim()); isCsvLike = true; }
            else if (line.includes(';')) { parts = line.split(';').map(p => p.trim()); isCsvLike = true; }
            else if (line.includes('\t')) { parts = line.split('\t').map(p => p.trim()); isCsvLike = true; }
            else { parts = line.split(/\s+/).map(p => p.trim()); }
            parts = parts.filter(p => p.length > 0);
            let group, team1Name, team2Name, oddsStrings;
            if (isCsvLike) {
                const vsIdx = parts.map(p => p.toLowerCase()).indexOf('vs');
                if (vsIdx !== -1) { 
                    if (vsIdx > 0 && vsIdx < parts.length - 5) { group = parts[0]; team1Name = parts.slice(1, vsIdx).join(" "); team2Name = parts.slice(vsIdx + 1, parts.length - 5).join(" "); oddsStrings = parts.slice(parts.length - 5); if (!team1Name || !team2Name) { errors.push(`L${index+1}(CSV 'vs'): Empty T names. L:"${line}"`); return; }}
                    else { errors.push(`L${index+1}(CSV 'vs'): 'vs' wrong pos/few odds. L:"${line}"`); return; }
                } else { 
                    if (parts.length >= 8) { group = parts[0]; team1Name = parts[1]; team2Name = parts[2]; oddsStrings = parts.slice(3, 8); if (!team1Name || !team2Name) { errors.push(`L${index+1}(CSV no 'vs'): Empty T names. L:"${line}"`); return; }}
                    else { errors.push(`L${index+1}(CSV no 'vs'): <8 cols. Exp G,T1,T2,O1,OX,O2,OU_U,OU_O. Got ${parts.length}. L:"${line}"`); return; }
                }
            } else { 
                const vsIdx = parts.map(p => p.toLowerCase()).indexOf('vs');
                if (vsIdx > 0 && vsIdx < parts.length - 5) { group = parts[0]; team1Name = parts.slice(1, vsIdx).join(" "); team2Name = parts.slice(vsIdx + 1, parts.length - 5).join(" "); oddsStrings = parts.slice(parts.length - 5); if (!team1Name || !team2Name) { errors.push(`L${index+1}(Space): Empty T names. L:"${line}"`); return; }}
                else { errors.push(`L${index+1}(Space): 'vs' issue/few odds. Exp G T1 vs T2 O1 OX O2 OU_U OU_O. L:"${line}"`); return; }
            }
            if (!oddsStrings || oddsStrings.length !== 5) { errors.push(`L${index+1}: Odds extract fail. Odds:${oddsStrings}. L:"${line}"`); return; }
            const odds = oddsStrings.map(parseFloat);
            if (odds.some(isNaN)) { errors.push(`L${index+1}: Invalid odds. Odds:"${oddsStrings.join(', ')}". L:"${line}"`); return; }
            if (odds.some(o => o <= 0)) { errors.push(`L${index+1}: Odds must be >0. Odds:"${oddsStrings.join(', ')}". L:"${line}"`); return; }
            
            const match = { lineNum:index+1, group, team1:team1Name, team2:team2Name, odds};
            parsedMatches.push(match); allTeams.add(team1Name); allTeams.add(team2Name);
            if (!groupedMatches[group]) { groupedMatches[group]=[]; groupTeamNames[group]=new Set(); }
            groupedMatches[group].push(match); groupTeamNames[group].add(team1Name); groupTeamNames[group].add(team2Name);
        });
         if (errors.length > 0) { statusAreaEl.innerHTML += `<p class="text-red-500 font-semibold">Parse Fail (${errors.length}):</p><ul class="list-disc list-inside text-red-500">${errors.map(e=>`<li>${e}</li>`).join('')}</ul>`; return; }
    } else { // Elo model
        if (!parseEloData()) return; 
        
        for (const group in groupTeamNames) {
            const teams = Array.from(groupTeamNames[group]);
            for (let i = 0; i < teams.length; i++) {
                for (let j = i + 1; j < teams.length; j++) {
                    const match = { group, team1: teams[i], team2: teams[j] };
                    parsedMatches.push(match);
                     if (!groupedMatches[group]) groupedMatches[group] = [];
                    groupedMatches[group].push(match);
                }
            }
        }
    }
    
    // Common finalization for both models
    for (const group in groupTeamNames) {
        const numTeams = groupTeamNames[group].size;
        const expectedMatches = numTeams * (numTeams - 1) / 2;
        if (groupedMatches[group] && groupedMatches[group].length !== expectedMatches) {
            warnings.push(`Gr ${group}: Found ${groupedMatches[group].length} matches, but expected ${expectedMatches} for a group of ${numTeams} teams.`);
        }
        groupTeamNames[group] = Array.from(groupTeamNames[group]);
    }

    parseLiveResults(); 
    
    if (statusAreaEl.querySelector('.text-red-500')) {
         runButtonEl.disabled = true;
    } else {
         statusAreaEl.innerHTML += `<p class="text-green-500">Parsed ${parsedMatches.length} matches, ${Object.keys(groupedMatches).length} gr, ${allTeams.size} teams.</p>`; 
         runButtonEl.disabled = false; 
         runFullTournamentButtonEl.disabled = false;
         resultsContentEl.innerHTML = "Parsed. Ready for sim.";
    }
});


// --- Tie-breaking Logic ---
function tieBreaker(a, b, allTeamsInGroup, matchResults) {
    if (a.pts !== b.pts) return b.pts - a.pts;

    const tiedTeamNames = allTeamsInGroup.filter(t => t.pts === a.pts).map(t => t.name);
    const h2hStats = {};
    tiedTeamNames.forEach(name => { h2hStats[name] = { name, pts: 0, gd: 0, gf: 0 }; });

    matchResults.forEach(match => {
        if (tiedTeamNames.includes(match.team1) && tiedTeamNames.includes(match.team2)) {
            const team1Stats = h2hStats[match.team1];
            const team2Stats = h2hStats[match.team2];
            team1Stats.gf += match.g1;
            team1Stats.gd += (match.g1 - match.g2);
            team2Stats.gf += match.g2;
            team2Stats.gd += (match.g2 - match.g1);
            if (match.g1 > match.g2) team1Stats.pts += 3;
            else if (match.g2 > match.g1) team2Stats.pts += 3;
            else { team1Stats.pts += 1; team2Stats.pts += 1; }
        }
    });

    const statsA = h2hStats[a.name];
    const statsB = h2hStats[b.name];

    if (statsA.pts !== statsB.pts) return statsB.pts - statsA.pts;
    if (statsA.gd !== statsB.gd) return statsB.gd - statsA.gd;
    if (statsA.gf !== statsB.gf) return statsB.gf - statsA.gf;
    if (a.gd !== b.gd) return b.gd - a.gd;
    if (a.gf !== b.gf) return b.gf - a.gf;
    return Math.random() - 0.5;
}

// --- Simulation Logic ---
runButtonEl.addEventListener('click', () => {
    if (parsedMatches.length === 0) { statusAreaEl.innerHTML = '<p class="text-red-500">No data.</p>'; return; }
    currentNumSims = parseInt(numSimulationsEl.value); if (isNaN(currentNumSims) || currentNumSims <= 0) { statusAreaEl.innerHTML = '<p class="text-red-500">Sims > 0.</p>'; return; }
    loaderEl.classList.remove('hidden'); statusAreaEl.innerHTML = `<p class="text-blue-500">Running ${currentNumSims} sims using ${currentModel.toUpperCase()} model...</p>`;
    resultsContentEl.innerHTML = ""; runButtonEl.disabled = true; parseButtonEl.disabled = true;
    
    setTimeout(() => {
        try {
            const { groupStats } = runSimulation(currentNumSims);
            simulationAggStats = groupStats;
            displayResults(simulationAggStats, currentNumSims);
            populateSimGroupSelect(); 
            statusAreaEl.innerHTML = `<p class="text-green-500">Sim complete! (${currentNumSims} runs)</p>`;
        } catch (simError) { 
            console.error("Sim Error:", simError);
            statusAreaEl.innerHTML = `<p class="text-red-500">Error during simulation: ${simError.message}</p>`;
            simulationAggStats = {}; 
            populateSimGroupSelect(); 
        } finally {
            loaderEl.classList.add('hidden');
            runButtonEl.disabled = false;
            parseButtonEl.disabled = false;
        }
    }, 50);
});

function runSimulation(numSims, isFullTournament = false) {
    const tournamentProgress = {};
    if(isFullTournament) {
        allTeams.forEach(team => {
            tournamentProgress[team] = {
                winner: 0,
                reached_F: 0,
                reached_SF: 0,
                reached_QF: 0,
                reached_R16: 0,
                eliminated_group: 0,
                eliminated_R16: 0,
                eliminated_QF: 0,
                eliminated_SF: 0,
                eliminated_F: 0,
            };
        });
        tournamentProgress.finalists = {};
    }

    const aggStats={}; 
    for(const gr in groupedMatches){ 
        const teamsInGroup = groupTeamNames[gr] || [];
        const numTeamsInGroup = teamsInGroup.length;
        aggStats[gr]={ groupTotalGoalsSims:[], straightForecasts:{}, advancingDoubles:{}, anyTeam9PtsCount:0, anyTeam0PtsCount:0, firstPlacePtsSims:[], firstPlaceGFSims:[], lastPlacePtsSims:[], lastPlaceGFSims:[], bttsCountSims: [], over25CountSims: [], zeroZeroCountSims: [] }; 
        (teamsInGroup).forEach(tN=>{ aggStats[gr][tN]={ posCounts: new Array(numTeamsInGroup).fill(0), ptsSims:[], gfSims:[], gaSims:[], winsSims: [], drawsSims: [], lossesSims: [], unbeatenCount: 0, mostGFCount:0, mostGACount:0 }; });
    }

    for(let i=0; i<numSims; i++){ 
         const simEloRatings = {};
         for(const teamName in teamEloRatings) {
             simEloRatings[teamName] = teamEloRatings[teamName].rating;
         }

        const groupResults = {};
        for(const gK in groupedMatches){ 
            const cGMs=groupedMatches[gK];
            const tIG=[...(groupTeamNames[gK]||[])]; 
            if(tIG.length===0) continue; 
            
            const sTS={}; 
            tIG.forEach(t=>sTS[t]={name:t,pts:0,gf:0,ga:0,gd:0, wins: 0, draws: 0, losses: 0}); 
            let cGTG=0;
            let bttsCount = 0, over25Count = 0, zeroZeroCount = 0;
            const currentSimMatchResults = [];

            cGMs.forEach(m=>{
                const resultKey = [m.team1, m.team2].sort().join('-');
                let g1, g2;

                if (liveResults[resultKey]) {
                    const liveResult = liveResults[resultKey];
                    g1 = (m.team1 === liveResult.team1) ? liveResult.g1 : liveResult.g2;
                    g2 = (m.team1 === liveResult.team1) ? liveResult.g2 : liveResult.g1;
                } else {
                    let lambda1, lambda2;
                    if (currentModel === 'odds') {
                        const [o1, ox, o2, oUnder25, oOver25] = m.odds;
                        const xGResult = calculateExpectedGoalsFromOdds(oOver25, oUnder25, o1, o2);
                        lambda1 = xGResult.homeXG;
                        lambda2 = xGResult.awayXG;
                    } else { // Elo model
                        const elo1 = simEloRatings[m.team1];
                        const elo2 = simEloRatings[m.team2];
                        const supremacy = eloToGoalSupremacy(elo1 - elo2);
                        const baseGoals = 2.5; // Assumed average goals per match
                        lambda1 = Math.max(0.05, baseGoals / 2 + supremacy / 2);
                        lambda2 = Math.max(0.05, baseGoals / 2 - supremacy / 2);
                    }
                    g1 = poissonRandom(lambda1); 
                    g2 = poissonRandom(lambda2);
                }

                if (g1 > 0 && g2 > 0) bttsCount++;
                if (g1 + g2 > 2.5) over25Count++;
                if (g1 === 0 && g2 === 0) zeroZeroCount++;

                currentSimMatchResults.push({ team1: m.team1, team2: m.team2, g1, g2 });
                if(sTS[m.team1]){sTS[m.team1].gf+=g1;sTS[m.team1].ga+=g2;} 
                if(sTS[m.team2]){sTS[m.team2].gf+=g2;sTS[m.team2].ga+=g1;} 
                cGTG+=(g1+g2); 
                let actualScore1, actualScore2;
                if(g1>g2){
                    if(sTS[m.team1]){sTS[m.team1].pts+=3; sTS[m.team1].wins+=1;}
                    if(sTS[m.team2]){sTS[m.team2].losses+=1;}
                    actualScore1 = 1; actualScore2 = 0;
                }
                else if(g2>g1){
                    if(sTS[m.team2]){sTS[m.team2].pts+=3; sTS[m.team2].wins+=1;}
                     if(sTS[m.team1]){sTS[m.team1].losses+=1;}
                     actualScore1 = 0; actualScore2 = 1;
                }
                else{
                    if(sTS[m.team1]){sTS[m.team1].pts+=1; sTS[m.team1].draws+=1;}
                    if(sTS[m.team2]){sTS[m.team2].pts+=1; sTS[m.team2].draws+=1;}
                    actualScore1 = 0.5; actualScore2 = 0.5;
                }
                
                 // Update Elo ratings within the simulation run
                if (currentModel === 'elo') {
                    const expected1 = calculateExpectedScore(simEloRatings[m.team1], simEloRatings[m.team2]);
                    const expected2 = 1 - expected1;
                    simEloRatings[m.team1] = updateElo(simEloRatings[m.team1], actualScore1, expected1);
                    simEloRatings[m.team2] = updateElo(simEloRatings[m.team2], actualScore2, expected2);
                }

            });
    
            if(aggStats[gK]) {
                aggStats[gK].groupTotalGoalsSims.push(cGTG);
                aggStats[gK].bttsCountSims.push(bttsCount);
                aggStats[gK].over25CountSims.push(over25Count);
                aggStats[gK].zeroZeroCountSims.push(zeroZeroCount);
            }
            
            const groupStandings = tIG.map(tN => {
                const s = sTS[tN] || { name: tN, pts: 0, gf: 0, ga: 0, gd: 0, wins: 0, draws: 0, losses: 0 };
                s.gd = s.gf - s.ga;
                return s;
            });
    
            const rTs = groupStandings.sort((a, b) => tieBreaker(a, b, groupStandings, currentSimMatchResults));
            groupResults[gK] = rTs;

            let mGF=-1,mGA=-1, groupHad9Pts=false, groupHad0Pts=false; 
            rTs.forEach(t=>{
                mGF=Math.max(mGF,t.gf); mGA=Math.max(mGA,t.ga); 
                if(t.pts===9)groupHad9Pts=true; if(t.pts===0)groupHad0Pts=true;
            }); 
            if(groupHad9Pts&&aggStats[gK])aggStats[gK].anyTeam9PtsCount++; 
            if(groupHad0Pts&&aggStats[gK])aggStats[gK].anyTeam0PtsCount++;
    
            if(rTs.length>0&&aggStats[gK]){ 
                aggStats[gK].firstPlacePtsSims.push(rTs[0].pts); 
                aggStats[gK].firstPlaceGFSims.push(rTs[0].gf); 
                const lastPlaceIndex = rTs.length - 1;
                aggStats[gK].lastPlacePtsSims.push(rTs[lastPlaceIndex].pts);
                aggStats[gK].lastPlaceGFSims.push(rTs[lastPlaceIndex].gf);
            } 
            
            rTs.forEach((t,rI)=>{
                const tA=aggStats[gK]?.[t.name]; 
                if(tA){
                    if(rI < tIG.length) tA.posCounts[rI]++; 
                    tA.ptsSims.push(t.pts); 
                    tA.winsSims.push(t.wins);
                    tA.drawsSims.push(t.draws);
                    tA.lossesSims.push(t.losses);
                    if (t.losses === 0) {
                        tA.unbeatenCount++;
                    }
                    tA.gfSims.push(t.gf); 
                    tA.gaSims.push(t.ga); 
                    if(t.gf===mGF&&mGF>0)tA.mostGFCount++; 
                    if(t.ga===mGA&&mGA>0)tA.mostGACount++;
                }
            });
    
            if(rTs.length>=2&&aggStats[gK]){
                const sFK=`${rTs[0].name}(1st)-${rTs[1].name}(2nd)`;
                aggStats[gK].straightForecasts[sFK]=(aggStats[gK].straightForecasts[sFK]||0)+1; 
                const aDP=[rTs[0].name,rTs[1].name].sort();
                const aDK=`${aDP[0]}&${aDP[1]}`;
                aggStats[gK].advancingDoubles[aDK]=(aggStats[gK].advancingDoubles[aDK]||0)+1;
            }
        }

        if (isFullTournament) {
            simulateKnockoutStage(groupResults, simEloRatings, tournamentProgress);
        }
    }
    if (isFullTournament) {
        return { groupStats: aggStats, tournamentProgress };
    }
    return { groupStats: aggStats };
}

function simulateKnockoutStage(groupResults, simEloRatings, progressStats) {
    const bracketText = knockoutBracketEl.value;
    const bracketLines = bracketText.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    if (bracketLines.length === 0) return null;

    const knockoutWinners = {};
    const knockoutLosers = {};
    const stageMatches = { R16: [], QF: [], SF: [], F: [] };
    const teamsInStage = { R16: new Set(), QF: new Set(), SF: new Set(), F: new Set() };
    
    // First, parse bracket to identify stages
    bracketLines.forEach(line => {
        const matchId = line.split(':')[0].trim().toUpperCase();
        if (matchId.startsWith('R16')) stageMatches.R16.push(line);
        else if (matchId.startsWith('QF')) stageMatches.QF.push(line);
        else if (matchId.startsWith('SF')) stageMatches.SF.push(line);
        else if (matchId.startsWith('F')) stageMatches.F.push(line);
    });


    const getTeam = (placeholder) => {
        placeholder = placeholder.trim().toUpperCase();
        const winnerMatch = placeholder.match(/^W_(\S+)/);
        if (winnerMatch) {
            const matchId = winnerMatch[1].toUpperCase();
            return knockoutWinners[matchId];
        }
        
        const groupMatch = placeholder.match(/^(\d+)([A-Z])$/);
        if (groupMatch) {
            const pos = parseInt(groupMatch[1], 10) - 1;
            const group = groupMatch[2];
            if (groupResults[group] && groupResults[group][pos]) {
                return groupResults[group][pos].name;
            }
        }
        return null;
    };

    const runStage = (stageName) => {
         for(const line of stageMatches[stageName]) {
            const parts = line.split(':');
            const matchId = parts[0].trim().toUpperCase();
            const teamsDef = parts[1].split(/vs/i);
            
            const team1Name = getTeam(teamsDef[0]);
            const team2Name = getTeam(teamsDef[1]);

            if (!team1Name || !team2Name) continue; 
            
            teamsInStage[stageName].add(team1Name);
            teamsInStage[stageName].add(team2Name);

            let g1, g2;
            do {
                let lambda1, lambda2;
                 if (currentModel === 'elo') {
                    const elo1 = simEloRatings[team1Name];
                    const elo2 = simEloRatings[team2Name];
                    const supremacy = eloToGoalSupremacy(elo1 - elo2);
                    const baseGoals = 2.5; 
                    lambda1 = Math.max(0.05, baseGoals / 2 + supremacy / 2);
                    lambda2 = Math.max(0.05, baseGoals / 2 - supremacy / 2);
                } else { // Fallback for odds model if knockout odds aren't provided
                    lambda1 = 1.25; 
                    lambda2 = 1.25;
                }
                g1 = poissonRandom(lambda1);
                g2 = poissonRandom(lambda2);
            } while (g1 === g2); 

            const winner = g1 > g2 ? team1Name : team2Name;
            const loser = g1 > g2 ? team2Name : team1Name;
            knockoutWinners[matchId] = winner;
            knockoutLosers[matchId] = loser;
        }
    };
    
    runStage('R16');
    runStage('QF');
    runStage('SF');
    runStage('F');
    
    // Update progress stats based on who made it to which stage
    allTeams.forEach(team => {
        const inR16 = teamsInStage.R16.has(team);
        const inQF = teamsInStage.QF.has(team);
        const inSF = teamsInStage.SF.has(team);
        const inF = teamsInStage.F.has(team);
        const finalMatchId = Object.keys(knockoutWinners).find(k => k.startsWith('F_'));
        const winner = finalMatchId && knockoutWinners[finalMatchId] === team;

        if (inR16) progressStats[team].reached_R16++;
        if (inQF) progressStats[team].reached_QF++;
        if (inSF) progressStats[team].reached_SF++;
        if (inF) progressStats[team].reached_F++;
        if (winner) progressStats[team].winner++;

        if (!inR16) progressStats[team].eliminated_group++;
        else if (!inQF) progressStats[team].eliminated_R16++;
        else if (!inSF) progressStats[team].eliminated_QF++;
        else if (!inF) progressStats[team].eliminated_SF++;
        else if (!winner) progressStats[team].eliminated_F++;
    });

    // Track finalists
    if (stageMatches.F.length > 0) {
         const finalMatchId = stageMatches.F[0].split(':')[0].trim().toUpperCase();
         const winner = knockoutWinners[finalMatchId];
         const loser = knockoutLosers[finalMatchId];
         if(winner && loser) {
            const finalistPair = [winner, loser].sort().join(' vs ');
            progressStats.finalists[finalistPair] = (progressStats.finalists[finalistPair] || 0) + 1;
         }
    }
}

runFullTournamentButtonEl.addEventListener('click', () => {
     if (parsedMatches.length === 0) { 
         tournamentWinnerContentEl.innerHTML = '<p class="text-red-500">Please parse data first.</p>';
         return;
     }
     if (knockoutBracketEl.value.trim() === '') {
         tournamentWinnerContentEl.innerHTML = '<p class="text-red-500">Please define the knockout bracket first.</p>';
         return;
     }
     const numSims = parseInt(numTournamentSimulationsEl.value, 10);
     if (isNaN(numSims) || numSims <= 0) {
         tournamentWinnerContentEl.innerHTML = '<p class="text-red-500">Please enter a valid number of simulations for the tournament.</p>';
         return;
     }
     
     tournamentLoaderEl.classList.remove('hidden');
     tournamentWinnerContentEl.innerHTML = '';
     tournamentFinalistsContentEl.innerHTML = '';
     tournamentReachContentEl.innerHTML = '';
     tournamentEliminationContentEl.innerHTML = '';
     runFullTournamentButtonEl.disabled = true;

     setTimeout(() => {
         const { tournamentProgress } = runSimulation(numSims, true);
         const margin = parseFloat(document.getElementById('tournamentMargin').value);
         
         const sortedTeams = Array.from(allTeams).sort();

         let winnerHtml = `<h3 class="text-lg font-semibold text-gray-700 mb-3">Tournament Winner</h3>
                           <table class="odds-table text-sm"><thead><tr><th>Team</th><th>Win Probability</th><th>Fair Odds</th><th>Bookie Odds</th></tr></thead><tbody>`;
         Object.entries(tournamentProgress).filter(([key])=> key !== 'finalists').sort(([,a],[,b]) => b.winner - a.winner).forEach(([team, stats]) => {
             const prob = stats.winner / numSims;
             if(prob > 0) {
                const fairOdd = (1 / prob).toFixed(2);
                const bookieOdd = calculateOddWithMargin(prob, margin);
                winnerHtml += `<tr><td class="font-medium">${team}</td><td>${(prob * 100).toFixed(2)}%</td><td>${fairOdd}</td><td>${bookieOdd}</td></tr>`;
             }
         });
         winnerHtml += `</tbody></table>`;
         tournamentWinnerContentEl.innerHTML = winnerHtml;
         
         let finalistsHtml = `<h3 class="text-lg font-semibold text-gray-700 mt-6 mb-3">Top 20 Final Matchups</h3>
                          <table class="odds-table text-sm"><thead><tr><th>Matchup</th><th>Probability</th><th>Fair Odds</th><th>Bookie Odds</th></tr></thead><tbody>`;
         Object.entries(tournamentProgress.finalists).sort(([,a],[,b]) => b-a).slice(0, 20).forEach(([pair, count]) => {
             const prob = count / numSims;
             finalistsHtml += `<tr><td class="font-medium">${pair}</td>
                            <td>${(prob*100).toFixed(2)}%</td>
                            <td>${(1/prob).toFixed(2)}</td>
                            <td>${calculateOddWithMargin(prob, margin)}</td></tr>`;
         });
         finalistsHtml += `</tbody></table>`;
         tournamentFinalistsContentEl.innerHTML = finalistsHtml;

         let reachHtml = `<h3 class="text-lg font-semibold text-gray-700 mt-6 mb-3">To Reach Stage</h3>
                          <table class="odds-table text-sm"><thead><tr><th>Team</th><th>Final</th><th>Semi-Final</th><th>Quarter-Final</th></tr></thead><tbody>`;
         sortedTeams.forEach(team => {
             const stats = tournamentProgress[team];
             const probF = stats.reached_F / numSims;
             const probSF = stats.reached_SF / numSims;
             const probQF = stats.reached_QF / numSims;
             reachHtml += `<tr><td class="font-medium">${team}</td>
                            <td>${calculateOddWithMargin(probF, margin)} (${(probF*100).toFixed(1)}%)</td>
                            <td>${calculateOddWithMargin(probSF, margin)} (${(probSF*100).toFixed(1)}%)</td>
                            <td>${calculateOddWithMargin(probQF, margin)} (${(probQF*100).toFixed(1)}%)</td></tr>`;
         });
         reachHtml += `</tbody></table>`;
         tournamentReachContentEl.innerHTML = reachHtml;

        let eliminationHtml = `<h3 class="text-lg font-semibold text-gray-700 mt-6 mb-3">Phase of Elimination</h3>
                          <table class="odds-table text-sm"><thead><tr><th>Team</th><th>Runner-up</th><th>Semi-Final</th><th>Quarter-Final</th><th>Round of 16</th><th>Group Stage</th></tr></thead><tbody>`;
         sortedTeams.forEach(team => {
             const stats = tournamentProgress[team];
             const probF = stats.eliminated_F / numSims;
             const probSF = stats.eliminated_SF / numSims;
             const probQF = stats.eliminated_QF / numSims;
             const probR16 = stats.eliminated_R16 / numSims;
             const probGroup = stats.eliminated_group / numSims;
             eliminationHtml += `<tr><td class="font-medium">${team}</td>
                            <td>${calculateOddWithMargin(probF, margin)} (${(probF*100).toFixed(1)}%)</td>
                            <td>${calculateOddWithMargin(probSF, margin)} (${(probSF*100).toFixed(1)}%)</td>
                            <td>${calculateOddWithMargin(probQF, margin)} (${(probQF*100).toFixed(1)}%)</td>
                            <td>${calculateOddWithMargin(probR16, margin)} (${(probR16*100).toFixed(1)}%)</td>
                            <td>${calculateOddWithMargin(probGroup, margin)} (${(probGroup*100).toFixed(1)}%)</td></tr>`;
         });
         eliminationHtml += `</tbody></table>`;
         tournamentEliminationContentEl.innerHTML = eliminationHtml;
         
         tournamentLoaderEl.classList.add('hidden');
         runFullTournamentButtonEl.disabled = false;
     }, 50);
});


// --- Display Logic (Simulator) ---
function displayResults(aggStats, numSims) {
    let html = ''; const sortedGroupKeys = Object.keys(aggStats).sort();
    const lang = currentLanguage;
    for (const groupKey of sortedGroupKeys) {
        const groupData = aggStats[groupKey]; if (!groupData) continue;
        html += `<div class="mb-8 p-4 bg-white border border-gray-200 rounded-lg shadow"><h3 class="text-lg font-semibold text-indigo-600 mb-3">Group ${groupKey}</h3>`;
        const headers = [translations[lang]['team'], translations[lang]['e-pts'], translations[lang]['e-wins'], translations[lang]['e-gf'], translations[lang]['e-ga'], translations[lang]['p-most-gf'], translations[lang]['p-most-ga']];
        html += `<h4 class="font-medium text-gray-700 mt-4 mb-1">${translations[lang]['sim-results-title']}</h4><table class="min-w-full divide-y divide-gray-200 mb-3 text-xs sm:text-sm"><thead class="bg-gray-50"><tr>${headers.map(h=>`<th class="px-2 py-2 text-left font-medium text-gray-500 tracking-wider">${h}</th>`).join('')}</tr></thead><tbody class="bg-white divide-y divide-gray-200">`;
        (groupTeamNames[groupKey]||[]).sort().forEach(teamName=>{const ts=groupData[teamName];if(!ts||!ts.ptsSims)return; const avgPts=(ts.ptsSims.length>0&&numSims>0)?ts.ptsSims.reduce((a,b)=>a+b,0)/numSims:0; const avgWins=(ts.winsSims&&ts.winsSims.length>0&&numSims>0)?ts.winsSims.reduce((a,b)=>a+b,0)/numSims:0; const avgGF=(ts.gfSims.length>0&&numSims>0)?ts.gfSims.reduce((a,b)=>a+b,0)/numSims:0; const avgGA=(ts.gaSims.length>0&&numSims>0)?ts.gaSims.reduce((a,b)=>a+b,0)/numSims:0; html+=`<tr><td class="px-2 py-2 whitespace-nowrap font-medium">${teamName}</td><td class="px-2 py-2">${avgPts.toFixed(2)}</td><td class="px-2 py-2">${avgWins.toFixed(2)}</td><td class="px-2 py-2">${avgGF.toFixed(2)}</td><td class="px-2 py-2">${avgGA.toFixed(2)}</td><td class="px-2 py-2">${(numSims>0?ts.mostGFCount/numSims*100:0).toFixed(1)}%</td><td class="px-2 py-2">${(numSims>0?ts.mostGACount/numSims*100:0).toFixed(1)}%</td></tr>`;});
        html += `</tbody></table>`;
        const avgGroupGoals = (groupData.groupTotalGoalsSims&&groupData.groupTotalGoalsSims.length>0&&numSims>0)?groupData.groupTotalGoalsSims.reduce((a,b)=>a+b,0)/numSims:0;
        html += `<p class="mt-2 text-sm"><strong>${translations[lang]['total-group-goals']} ${groupKey}:</strong> ${avgGroupGoals.toFixed(2)}</p>`;
        const allSF=Object.entries(groupData.straightForecasts||{}).sort(([,a],[,b])=>b-a); html+=`<h4 class="font-medium text-gray-700 mt-4 mb-1">${translations[lang]['all-sfs']}</h4><ul class="list-disc list-inside text-sm max-h-40 overflow-y-auto">${allSF.map(([k,c])=>`<li>${k}: ${(numSims>0?c/numSims*100:0).toFixed(1)}%</li>`).join('')||'N/A'}</ul>`;
        const topAD=Object.entries(groupData.advancingDoubles||{}).sort(([,a],[,b])=>b-a).slice(0,10); html+=`<h4 class="font-medium text-gray-700 mt-4 mb-1">${translations[lang]['top-ads']}</h4><ul class="list-disc list-inside text-sm">${topAD.map(([k,c])=>`<li>${k}: ${(numSims>0?c/numSims*100:0).toFixed(1)}%</li>`).join('')||'N/A'}</ul>`;
        html += `</div>`;
    }
    resultsContentEl.innerHTML = html || `<p>${translations[lang]['results-placeholder']}</p>`;
}

// --- Simulated Group Odds Tab Logic ---
function calculateOddWithMargin(trueProb, marginPercent) {
     if (trueProb <= 0) return "N/A";
     const marginDecimal = marginPercent / 100;
     const bookmakerProb = trueProb / (1 - marginDecimal);
     if (bookmakerProb > 1) { 
         // Cannot have probability > 1, so cap at fair odds.
         return (1 / trueProb).toFixed(2);
     }
     return (1 / bookmakerProb).toFixed(2);
}

function populateSimGroupSelect() {
    const currentGroup = simGroupSelectEl.value;
    const currentTeam = simTeamSelectEl.value;

    simGroupSelectEl.innerHTML = `<option value="">${translations[currentLanguage]['select-group-option']}</option>`; 
    
    if (Object.keys(simulationAggStats).length > 0) { 
        Object.keys(simulationAggStats).sort().forEach(groupKey => { 
            const option = document.createElement('option'); 
            option.value = groupKey; 
            option.textContent = `Group ${groupKey}`; 
            simGroupSelectEl.appendChild(option); 
        });
        simGroupSelectEl.value = currentGroup; // Preserve selection
    } else { 
         simGroupSelectEl.innerHTML = `<option value="">${translations[currentLanguage]['run-sim-first-option']}</option>`;
    }
    
    // Trigger change to repopulate team select if group is still valid
    const event = new Event('change');
    simGroupSelectEl.dispatchEvent(event);
    // Manually restore team selection after team dropdown is repopulated
    setTimeout(() => {
        simTeamSelectEl.value = currentTeam;
        simTeamSelectEl.dispatchEvent(event);
    }, 0);
}

simGroupSelectEl.addEventListener('change', () => {
    const selectedGroupKey = simGroupSelectEl.value;
    simTeamSelectEl.innerHTML = `<option value="">${translations[currentLanguage]['select-team-option']}</option>`;
    customProbInputsContainerEl.classList.add('hidden'); 
    document.getElementById('teamSpecificOddsContainer').classList.add('hidden');
    customProbAndOddResultAreaEl.innerHTML = translations[currentLanguage]['custom-odds-placeholder'];

    if (selectedGroupKey && groupTeamNames[selectedGroupKey]) {
        generateGroupCsvButtonEl.disabled = false;
        groupTeamNames[selectedGroupKey].sort().forEach(teamName => { 
            const option = document.createElement('option'); 
            option.value = teamName; 
            option.textContent = teamName; 
            simTeamSelectEl.appendChild(option); 
        });
        simTeamSelectEl.disabled = false;
    } else { 
        simTeamSelectEl.disabled = true;
        generateGroupCsvButtonEl.disabled = true;
    }
     ['ouTotalGroupGoalsResult', 'expectedTotalGroupGoals', 'ouFirstPlacePtsResult', 'expectedFirstPlacePts', 'ouLastPlacePtsResult', 'expectedLastPlacePts', 'ouFirstPlaceGFResult', 'expectedFirstPlaceGF', 'ouLastPlaceGFResult', 'expectedLastPlaceGF', 'ouBttsMatchesResult', 'expectedBttsMatches', 'ouOver25MatchesResult', 'expectedOver25Matches', 'ouZeroZeroMatchesResult', 'expectedZeroZeroMatches'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
     });
});

simTeamSelectEl.addEventListener('change', () => {
     const groupKey = simGroupSelectEl.value;
     const teamName = simTeamSelectEl.value;
     const teamSpecificContainer = document.getElementById('teamSpecificOddsContainer');
     
    if (teamName && groupKey && simulationAggStats[groupKey]) {
        customProbInputsContainerEl.classList.remove('hidden');
        generateTeamCsvButtonEl.disabled = false;
        teamSpecificContainer.classList.remove('hidden');
        displayTeamSpecificOdds(groupKey, teamName);
        customProbAndOddResultAreaEl.innerHTML = "Define prop and click 'Calc Prop Odd'.";
    } else {
        customProbInputsContainerEl.classList.add('hidden');
        generateTeamCsvButtonEl.disabled = true;
        teamSpecificContainer.classList.add('hidden');
    }
});

function displayTeamSpecificOdds(groupKey, teamName) {
    const teamData = simulationAggStats[groupKey]?.[teamName];
    if (!teamData) return;

    const marginPercent = parseFloat(simBookieMarginEl.value);

    // Unbeaten market
    const probUnbeaten = (teamData.unbeatenCount || 0) / currentNumSims;
    const oddUnbeaten = calculateOddWithMargin(probUnbeaten, marginPercent);
    document.getElementById('teamUnbeatenMarket').innerHTML = `
         <h4 class="font-medium text-gray-700 mt-3 mb-1">${translations[currentLanguage]['team-unbeaten-title']}</h4>
         <table class="odds-table text-xs sm:text-sm">
            <thead><tr><th>Team</th><th>Prob</th><th>Odd</th></tr></thead>
            <tbody><tr><td>${teamName}</td><td>${(probUnbeaten * 100).toFixed(1)}%</td><td>${oddUnbeaten}</td></tr></tbody>
         </table>`;
    
    // W/D/L O/U Markets
    displayAvgAndOU(teamData.winsSims, 'expectedWins', 'ouWinsResult');
    displayAvgAndOU(teamData.drawsSims, 'expectedDraws', 'ouDrawsResult');
    displayAvgAndOU(teamData.lossesSims, 'expectedLosses', 'ouLossesResult');
}

showSimulatedOddsButtonEl.addEventListener('click', () => { 
    const selectedGroupKey = simGroupSelectEl.value;
    const mainMarginPercent = parseFloat(simBookieMarginEl.value);
    
    simulatedOddsStatusEl.textContent = ""; 
    calculatedOddsResultContentEl.innerHTML = "";

    if (!selectedGroupKey) { simulatedOddsStatusEl.textContent = "Select group."; return; }
    if (isNaN(mainMarginPercent) || mainMarginPercent < 0 ) { simulatedOddsStatusEl.textContent = "Please enter a valid non-negative margin."; return; }
    if (Object.keys(simulationAggStats).length === 0 || !simulationAggStats[selectedGroupKey] || currentNumSims === 0) { simulatedOddsStatusEl.textContent = "No sim data. Run sim."; return; }
    
    const groupData = simulationAggStats[selectedGroupKey], teams = groupTeamNames[selectedGroupKey] || [];
    if (!groupData || teams.length === 0) { simulatedOddsStatusEl.textContent = "Group data incomplete."; return; }
    
    let html = `<h3 class="text-lg font-semibold text-purple-600 mb-2">Market Odds for Group ${selectedGroupKey} (Margin: ${mainMarginPercent}%)</h3>`;
    
    const numTeams = teams.length;
    let standingsHeader = `<th>Team</th>`;
    const posSuffix = (i) => {
        if (i === 11 || i === 12 || i === 13) return 'th';
        const lastDigit = i % 10;
        if (lastDigit === 1) return 'st';
        if (lastDigit === 2) return 'nd';
        if (lastDigit === 3) return 'rd';
        return 'th';
    };
    for (let i = 1; i <= numTeams; i++) {
        standingsHeader += `<th>${i}${posSuffix(i)} Place</th>`;
    }

    html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Team Standings Odds:</h4><table class="odds-table text-xs sm:text-sm"><thead><tr>${standingsHeader}</tr></thead><tbody>`;
    teams.sort().forEach(tN=>{
        html += `<tr><td class="font-medium">${tN}</td>`;
        for(let i = 0; i < numTeams; i++) { // Loop to dynamic size
            const tS=groupData[tN],tP=(tS&&tS.posCounts&&currentNumSims>0)?(tS.posCounts[i]||0)/currentNumSims:0,o=calculateOddWithMargin(tP,mainMarginPercent);
            html += `<td>${o} <span class="text-gray-400">(${(tP*100).toFixed(1)}%)</span></td>`;
        }
        html += `</tr>`;
    });
    html+=`</tbody></table>`;
    
    html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">To Qualify (Top 2):</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Team</th><th>P(Qualify)</th><th>Odd</th></tr></thead><tbody>`;
    teams.sort().forEach(tN=>{const tS=groupData[tN],tP=(tS&&tS.posCounts&&currentNumSims>0)?((tS.posCounts[0]||0)+(tS.posCounts[1]||0))/currentNumSims:0,o=calculateOddWithMargin(tP,mainMarginPercent);html+=`<tr><td>${tN}</td><td>${(tP*100).toFixed(1)}%</td><td>${o}</td></tr>`;});html+=`</tbody></table>`;

    html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Team to Score Most Goals:</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Team</th><th>P(Most GF)</th><th>Odd</th></tr></thead><tbody>`;
    teams.sort().forEach(tN=>{const tS=groupData[tN],tP=(tS&&currentNumSims>0)?(tS.mostGFCount||0)/currentNumSims:0,o=calculateOddWithMargin(tP,mainMarginPercent);html+=`<tr><td>${tN}</td><td>${(tP*100).toFixed(1)}%</td><td>${o}</td></tr>`;});html+=`</tbody></table>`;
    
    html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Team to Concede Most Goals:</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Team</th><th>P(Most GA)</th><th>Odd</th></tr></thead><tbody>`;
    teams.sort().forEach(tN=>{const tS=groupData[tN],tP=(tS&&currentNumSims>0)?(tS.mostGACount||0)/currentNumSims:0,o=calculateOddWithMargin(tP,mainMarginPercent);html+=`<tr><td>${tN}</td><td>${(tP*100).toFixed(1)}%</td><td>${o}</td></tr>`;});html+=`</tbody></table>`;

    const allSF = Object.entries(groupData.straightForecasts || {}).sort(([, a], [, b]) => b - a);
    html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">All Straight Forecasts (1st-2nd):</h4>`;
    if (allSF.length > 0) {
        html += `<table class="odds-table text-xs sm:text-sm max-h-60 overflow-y-auto block"><thead><tr><th>Forecast</th><th>Prob</th><th>Odd</th></tr></thead><tbody>`;
        allSF.forEach(([k, c]) => { const tP = currentNumSims > 0 ? c / currentNumSims : 0, o = calculateOddWithMargin(tP, mainMarginPercent); html += `<tr><td>${k}</td><td>${(tP * 100).toFixed(1)}%</td><td>${o}</td></tr>`; });
        html += `</tbody></table>`;
    } else { html += `<p class="text-xs text-gray-500">No SF data.</p>`; }

    const topAD=Object.entries(groupData.advancingDoubles||{}).sort(([,a],[,b])=>b-a).slice(0,10); html+=`<h4 class="font-medium text-gray-700 mt-3 mb-1">Top Advancing Doubles (Top 2 Any Order):</h4>`; if(topAD.length>0){html+=`<table class="odds-table text-xs sm:text-sm"><thead><tr><th>Pair</th><th>Prob</th><th>Odd</th></tr></thead><tbody>`;topAD.forEach(([k,c])=>{const tP=currentNumSims>0?c/currentNumSims:0,o=calculateOddWithMargin(tP,mainMarginPercent);html+=`<tr><td>${k}</td><td>${(tP*100).toFixed(1)}%</td><td>${o}</td></tr>`;});html+=`</tbody></table>`;}else{html+=`<p class="text-xs text-gray-500">No AD data.</p>`;}
    
    const probAny9Pts = currentNumSims > 0 ? (groupData.anyTeam9PtsCount || 0) / currentNumSims : 0; const oddAny9Pts = calculateOddWithMargin(probAny9Pts, mainMarginPercent);
    html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Group Specials:</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Event</th><th>Prob</th><th>Odd</th></tr></thead><tbody>`;
    html += `<tr><td>Any Team scores 9 Pts</td><td>${(probAny9Pts * 100).toFixed(1)}%</td><td>${oddAny9Pts}</td></tr>`;
    const probAny0Pts = currentNumSims > 0 ? (groupData.anyTeam0PtsCount || 0) / currentNumSims : 0; const oddAny0Pts = calculateOddWithMargin(probAny0Pts, mainMarginPercent);
    html += `<tr><td>Any Team scores 0 Pts</td><td>${(probAny0Pts * 100).toFixed(1)}%</td><td>${oddAny0Pts}</td></tr></tbody></table>`;

    calculatedOddsResultContentEl.innerHTML = html;

    displayAvgAndOU(groupData.groupTotalGoalsSims, 'expectedTotalGroupGoals', 'ouTotalGroupGoalsResult');
    displayAvgAndOU(groupData.firstPlacePtsSims, 'expectedFirstPlacePts', 'ouFirstPlacePtsResult');
    displayAvgAndOU(groupData.lastPlacePtsSims, 'expectedLastPlacePts', 'ouLastPlacePtsResult');
    displayAvgAndOU(groupData.firstPlaceGFSims, 'expectedFirstPlaceGF', 'ouFirstPlaceGFResult');
    displayAvgAndOU(groupData.lastPlaceGFSims, 'expectedLastPlaceGF', 'ouLastPlaceGFResult');
    displayAvgAndOU(groupData.bttsCountSims, 'expectedBttsMatches', 'ouBttsMatchesResult');
    displayAvgAndOU(groupData.over25CountSims, 'expectedOver25Matches', 'ouOver25MatchesResult');
    displayAvgAndOU(groupData.zeroZeroCountSims, 'expectedZeroZeroMatches', 'ouZeroZeroMatchesResult');
});

calculateCustomProbAndOddButtonEl.addEventListener('click', () => {
    const groupKey = simGroupSelectEl.value;
    const teamName = simTeamSelectEl.value;
    const marginPercent = parseFloat(simBookieMarginEl.value);
    const statType = simCustomStatTypeEl.value;
    const operator = simCustomOperatorEl.value;
    const value1 = parseFloat(simCustomValue1El.value);
    let value2 = null;
    if (operator === 'between') value2 = parseFloat(simCustomValue2El.value);

    customProbAndOddResultAreaEl.innerHTML = ""; 

    if (!groupKey || !teamName) { customProbAndOddResultAreaEl.innerHTML = '<p class="text-red-500">Select group and team.</p>'; return; }
    if (isNaN(marginPercent) || marginPercent < 0) { customProbAndOddResultAreaEl.innerHTML = '<p class="text-red-500">Valid margin needed.</p>'; return; }
    if (isNaN(value1) || (operator === 'between' && isNaN(value2))) { customProbAndOddResultAreaEl.innerHTML = '<p class="text-red-500">Invalid Value(s) for prop.</p>'; return; }
    if (operator === 'between' && value1 >= value2) { customProbAndOddResultAreaEl.innerHTML = '<p class="text-red-500">For "Between", Value 1 must be < Value 2.</p>'; return; }
    
    const teamData = simulationAggStats[groupKey]?.[teamName];
    if (!teamData || !teamData[statType] || !teamData[statType].length || currentNumSims === 0) { customProbAndOddResultAreaEl.innerHTML = '<p class="text-gray-500">No simulation data for this specific prop.</p>'; return; }

    const simValues = teamData[statType];
    let metConditionCount = 0;
    simValues.forEach(simVal => {
        let conditionMet = false;
        switch (operator) {
            case '>': conditionMet = simVal > value1; break;
            case '>=': conditionMet = simVal >= value1; break;
            case '<': conditionMet = simVal < value1; break;
            case '<=': conditionMet = simVal <= value1; break;
            case '==': conditionMet = Math.abs(simVal - value1) < 0.001; break;
            case 'between': conditionMet = simVal >= value1 && simVal <= value2; break;
        }
        if (conditionMet) metConditionCount++;
    });
    
    const trueProbability = metConditionCount / currentNumSims;
    const odd = calculateOddWithMargin(trueProbability, marginPercent);

    let propDescription = `${teamName} ${statType.replace('Sims','')} ${operator} ${value1}`;
    if (operator === 'between') propDescription += ` and ${value2}`;

    customProbAndOddResultAreaEl.innerHTML = `
        <p><strong>Prop:</strong> ${propDescription}</p>
        <p><strong>Simulated Probability:</strong> ${(trueProbability * 100).toFixed(1)}%</p>
        <p><strong>Calculated Odd (with ${marginPercent}% margin):</strong> ${odd}</p>`;
});

// --- Clear Button ---
clearButtonEl.addEventListener('click', () => {
    matchDataEl.value = ""; 
    liveResultsDataEl.value = "";
    eloDataEl.value = "";
    numSimulationsEl.value = "10000"; 
    statusAreaEl.innerHTML = ""; 
    resultsContentEl.innerHTML = "Results will appear here...";
    parsedMatches=[]; allTeams.clear(); groupedMatches={}; groupTeamNames={}; simulationAggStats={}; currentNumSims=0; liveResults = {}; teamEloRatings = {};
    runButtonEl.disabled=true; 
    runFullTournamentButtonEl.disabled = true;
    loaderEl.classList.add('hidden'); 
    parseButtonEl.disabled=false;
    csvFileInputEl.value=null; 
    csvFileNameEl.textContent=translations[currentLanguage]['no-file-selected'];
    populateSimGroupSelect(); 
    calculatedOddsResultContentEl.innerHTML = translations[currentLanguage]['odds-results-placeholder'];
    simulatedOddsStatusEl.textContent = "";
    customProbInputsContainerEl.classList.add('hidden');
    document.getElementById('teamSpecificOddsContainer').classList.add('hidden');
    customProbAndOddResultAreaEl.innerHTML = translations[currentLanguage]['custom-odds-placeholder'];
     ['ouTotalGroupGoalsResult', 'expectedTotalGroupGoals', 'ouFirstPlacePtsResult', 'expectedFirstPlacePts', 'ouLastPlacePtsResult', 'expectedLastPlacePts', 'ouFirstPlaceGFResult', 'expectedFirstPlaceGF', 'ouLastPlaceGFResult', 'expectedLastPlaceGF', 'ouBttsMatchesResult', 'expectedBttsMatches', 'ouOver25MatchesResult', 'expectedOver25Matches', 'ouZeroZeroMatchesResult', 'expectedZeroZeroMatches'].forEach(id => {
         const el = document.getElementById(id);
         if (el) el.innerHTML = '';
     });
});

// --- Save/Load Logic ---
saveButtonEl.addEventListener('click', () => {
    const scenario = {
        model: currentModel,
        matchData: matchDataEl.value,
        eloData: eloDataEl.value,
        liveResultsData: liveResultsDataEl.value,
        numSimulations: numSimulationsEl.value,
        numTournamentSimulations: numTournamentSimulationsEl.value,
        knockoutBracket: knockoutBracketEl.value
    };
    const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: 'application/json' });
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.download = `scenario_${date}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    statusAreaEl.innerHTML = `<p class="text-green-500">Scenario saved successfully!</p>`;
});

loadFileInputEl.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const scenario = JSON.parse(e.target.result);
            switchModel(scenario.model || 'odds');
            matchDataEl.value = scenario.matchData || '';
            eloDataEl.value = scenario.eloData || '';
            liveResultsDataEl.value = scenario.liveResultsData || '';
            numSimulationsEl.value = scenario.numSimulations || '10000';
            numTournamentSimulationsEl.value = scenario.numTournamentSimulations || '10000';
            knockoutBracketEl.value = scenario.knockoutBracket || '';
            statusAreaEl.innerHTML = '<p class="text-blue-500">Scenario loaded successfully. Please parse the new data.</p>';
        } catch (err) {
             statusAreaEl.innerHTML = `<p class="text-red-500">Error reading scenario file. Make sure it's a valid JSON file from this app. Error: ${err.message}</p>`;
        }
    };
    reader.onerror = () => {
         statusAreaEl.innerHTML = `<p class="text-red-500">Error reading file.</p>`;
    };
    reader.readAsText(file);
    loadFileInputEl.value = ''; // Reset file input
});

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tab-button').click();
    document.getElementById('langEn').addEventListener('click', () => setLanguage('en'));
    document.getElementById('langSr').addEventListener('click', () => setLanguage('sr'));
    setLanguage('en'); 
});

window.openTab = openTab; 
simCustomOperatorEl.addEventListener('change', () => { 
    if (simCustomOperatorEl.value === 'between') simCustomValue2El.classList.remove('hidden');
    else simCustomValue2El.classList.add('hidden');
});

function downloadCSV(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { 
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

generateTeamCsvButtonEl.addEventListener('click', () => {
    const groupKey = simGroupSelectEl.value;
    const teamName = simTeamSelectEl.value;
    const marginPercent = parseFloat(simBookieMarginEl.value);
    const lang = currentLanguage;
    
    if (!groupKey || !teamName) { alert("Please select a group and a team first."); return; }
    if (isNaN(marginPercent) || marginPercent < 0) { alert("Please enter a valid non-negative margin."); return; }

    const teamData = simulationAggStats[groupKey]?.[teamName];
    if (!teamData) { alert("No simulation data found for the selected team."); return; }

    let csvContent = `${translations[lang]['csv-date']},${translations[lang]['csv-time']},${translations[lang]['csv-market']},${translations[lang]['csv-odd1']},${translations[lang]['csv-odd2']},${translations[lang]['csv-odd3']}\n`;
    const date = "15.6.2025"; const time = "02:00";
    const toCsvRow = (market, odd1 = '', odd2 = '', odd3 = '') => `${date},${time},"${market}",${odd1},${odd2},${odd3}\n`;

    csvContent += toCsvRow(translations[lang]['csv-group-winner'], calculateOddWithMargin((teamData.posCounts[0] || 0) / currentNumSims, marginPercent));
    csvContent += toCsvRow(translations[lang]['csv-qualify'], calculateOddWithMargin(((teamData.posCounts[0] || 0) + (teamData.posCounts[1] || 0)) / currentNumSims, marginPercent));
    [1, 2, 3].forEach(i => {
        csvContent += toCsvRow(`${i+1}. ${translations[lang]['csv-2nd'].split(' ')[1]} u grupi`, calculateOddWithMargin((teamData.posCounts[i] || 0) / currentNumSims, marginPercent));
    });

    const ptsSims = teamData.ptsSims;
    [0,1,2,3,4,5,6,7,9].forEach(pts => {
        const probPts = ptsSims.filter(p => p === pts).length / currentNumSims;
        csvContent += toCsvRow(`${pts} ${translations[lang]['csv-pts-in-group']}`, calculateOddWithMargin(probPts, marginPercent));
    });

    [
        {label: 'csv-pts-range-1-3', filter: p => p >= 1 && p <= 3},
        {label: 'csv-pts-range-2-4', filter: p => p >= 2 && p <= 4},
        {label: 'csv-pts-range-4-6', filter: p => p >= 4 && p <= 6}
    ].forEach(range => {
        const prob = ptsSims.filter(range.filter).length / currentNumSims;
        csvContent += toCsvRow(translations[lang][range.label], calculateOddWithMargin(prob, marginPercent));
    });
    
    [5.5, 6.5, 7.5].forEach(line => {
        const overProb = ptsSims.filter(p => p > line).length / currentNumSims;
        const underProb = ptsSims.filter(p => p < line).length / currentNumSims;
        csvContent += toCsvRow(translations[lang]['csv-total-pts'], line, calculateOddWithMargin(overProb, marginPercent), calculateOddWithMargin(underProb, marginPercent));
    });
    downloadCSV(csvContent, `odds_${teamName.replace(/\s+/g, '_')}_${lang}.csv`);
});

generateGroupCsvButtonEl.addEventListener('click', () => {
    const groupKey = simGroupSelectEl.value;
    const marginPercent = parseFloat(simBookieMarginEl.value);
    const lang = currentLanguage;
    
    if (!groupKey) { alert("Please select a group first."); return; }
    if (isNaN(marginPercent) || marginPercent < 0) { alert("Please enter a valid non-negative margin."); return; }

    const groupData = simulationAggStats[groupKey];
    const teams = groupTeamNames[groupKey] || [];
    if (!groupData || teams.length === 0) { alert("No simulation data found for the selected group."); return; }

    let csvContent = `${translations[lang]['csv-league-name']}: Grupa ${groupKey}\n`;
    const date = "15.6.2025"; const time = "02:00";
    const toCsvRow = (market, submarket, odd1 = '', odd2 = '', odd3 = '') => `${date},${time},"${market}","${submarket}",${odd1},${odd2},${odd3}\n`;
    
    const addSpecial = (market, submarket, prob) => csvContent += toCsvRow(market, submarket, calculateOddWithMargin(prob, marginPercent));
    addSpecial(translations[lang]['csv-any-team'], translations[lang]['csv-9-pts'], (groupData.anyTeam9PtsCount || 0) / currentNumSims);
    addSpecial(translations[lang]['csv-any-team'], translations[lang]['csv-0-pts'], (groupData.anyTeam0PtsCount || 0) / currentNumSims);

    const addOUCsv = (sims, submarketKey, lines) => {
        if(sims && sims.length > 0) {
            lines.forEach(line => {
                const overProb = sims.filter(p => p > line).length / currentNumSims;
                const underProb = sims.filter(p => p < line).length / currentNumSims;
                csvContent += toCsvRow(translations[lang]['csv-total-pts-h'], translations[lang][submarketKey], line, calculateOddWithMargin(overProb, marginPercent), calculateOddWithMargin(underProb, marginPercent));
            });
        }
    };
    addOUCsv(groupData.firstPlacePtsSims, 'csv-1st-place-team', [4.5, 6.5, 7.5]);
    addOUCsv(groupData.lastPlacePtsSims, 'csv-last-place-team', [0.5, 1.5, 2.5]);

    const processEntries = (entries, marketFn, submarketKey) => {
         entries.sort(([,a],[,b])=>b-a).forEach(([key, count]) => {
            const prob = count / currentNumSims;
            csvContent += toCsvRow(marketFn(key), translations[lang][submarketKey], calculateOddWithMargin(prob, marginPercent));
        });
    };
    processEntries(Object.entries(groupData.straightForecasts || {}), k => k.replace('(1st)', '').replace('(2nd)', '').replace('-', '/'), 'csv-s-forecast');
    processEntries(Object.entries(groupData.advancingDoubles || {}), k => k.replace(' & ', '/'), 'csv-adv-doubles');

    teams.forEach(team => {
        const prob = (groupData[team].posCounts[0] || 0) / currentNumSims;
        csvContent += toCsvRow(team, translations[lang]['csv-group-winner'], calculateOddWithMargin(prob, marginPercent));
    });
    downloadCSV(csvContent, `group_odds_${groupKey}_${lang}.csv`);
});

// --- Initial Sample Data ---
matchDataEl.value = `A Germany vs Scotland 1.30 5.50 11.00 2.10 1.70
A Hungary vs Switzerland 3.50 3.20 2.25 1.60 2.30
A Germany vs Hungary 1.30 5.00 10.00 2.30 1.60
A Scotland vs Switzerland 4.50 3.60 1.85 1.70 2.15
A Switzerland vs Germany 5.00 4.00 1.70 2.00 1.80
A Scotland vs Hungary 2.80 3.40 2.50 1.90 1.90
B Spain vs Croatia 1.90 3.40 4.50 1.75 2.10
B Italy vs Albania 1.40 4.50 9.00 1.90 1.90
B Croatia vs Albania 1.50 4.00 7.50 1.80 2.00
B Spain vs Italy 2.20 3.20 3.60 1.65 2.20
B Albania vs Spain 10.00 5.50 1.30 2.00 1.80
B Croatia vs Italy 3.00 3.10 2.60 1.55 2.40`;

</script>
