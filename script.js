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

document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables ---
    let parsedMatches = [], allTeams = new Set(), groupedMatches = {}, groupTeamNames = {}, teamRatings = {}, simulationAggStats = {}, currentNumSims = 0, parsedResults = {};
    let currentLang = 'en';
    let calculationMode = 'odds';
    let roundRobinType = 'double'; // New global variable for round robin type

    // --- DOM Elements ---
    const matchDataEl = document.getElementById('matchData');
    const numSimulationsEl = document.getElementById('numSimulations');
    const matchResultsEl = document.getElementById('matchResults');
    const parseButtonEl = document.getElementById('parseButton');
    const runButtonEl = document.getElementById('runButton');
    const clearButtonEl = document.getElementById('clearButton');
    const statusAreaEl = document.getElementById('statusArea');
    const resultsContentEl = document.getElementById('resultsContent');
    const csvFileInputEl = document.getElementById('csvFileInput');
    const csvFileNameEl = document.getElementById('csvFileName');
    const eloCsvFileInputEl = document.getElementById('eloCsvFileInput');
    const eloCsvFileNameEl = document.getElementById('eloCsvFileName');
    const eloDataEl = document.getElementById('eloData');
    const homeAdvantageEloEl = document.getElementById('homeAdvantageElo');
    const eloPerGoalEl = document.getElementById('eloPerGoal');
    const baselineTotalGoalsEl = document.getElementById('baselineTotalGoals');
    const simGroupSelectEl = document.getElementById('simGroupSelect');
    const simBookieMarginEl = document.getElementById('simBookieMargin');
    const showSimulatedOddsButtonEl = document.getElementById('showSimulatedOddsButton');
    const calculatedOddsResultContentEl = document.getElementById('calculatedOddsResultContent');
    const simulatedOddsStatusEl = document.getElementById('simulatedOddsStatus');
    const simTeamSelectEl = document.getElementById('simTeamSelect');
    const customProbInputsContainerEl = document.getElementById('customProbInputsContainer');
    const simCustomStatTypeEl = document.getElementById('simCustomStatType');
    const simCustomOperatorEl = document.getElementById('simCustomOperator');
    const simCustomValue1El = document.getElementById('simCustomValue1');
    const simCustomValue2El = document.getElementById('simCustomValue2');
    const calculateCustomProbAndOddButtonEl = document.getElementById('calculateCustomProbAndOddButton');
    const customProbAndOddResultAreaEl = document.getElementById('customProbAndOddResultArea');
    const generateTeamCsvButtonEl = document.getElementById('generateTeamCsvButton');
    const generateGroupCsvButtonEl = document.getElementById('generateGroupCsvButton');
    const progressContainerEl = document.getElementById('progressContainer');
    const progressBarEl = document.getElementById('progressBar');
    const saveToFileButtonEl = document.getElementById('saveToFileButton');
    const loadFromFileInputEl = document.getElementById('loadFromFileInput');
    const saveToBrowserButtonEl = document.getElementById('saveToBrowserButton');
    const loadFromBrowserButtonEl = document.getElementById('loadFromBrowserButton');
    const knockoutFormatEl = document.getElementById('knockoutFormat');
    const bracketStructureEl = document.getElementById('bracketStructure');
    
    // --- Knockout Stage Logic and Data ---
    const knockoutBrackets = {
        "8_TEAM_ABCD": {
            description: "Quarter-Finals:\n  QF1: A1 vs B2\n  QF2: C1 vs D2\n  QF3: B1 vs A2\n  QF4: D1 vs C2\n\nSemi-Finals:\n  SF1: Winner QF1 vs Winner QF2\n  SF2: Winner QF3 vs Winner QF4\n\nFinal:\n  Winner SF1 vs Winner SF2",
            type: 'standard',
            rounds: [
                { name: "QF", pairings: [["A1", "B2"], ["C1", "D2"], ["B1", "A2"], ["D1", "C2"]] },
                { name: "SF", pairings: [["W_QF_0", "W_QF_1"], ["W_QF_2", "W_QF_3"]] },
                { name: "F", pairings: [["W_SF_0", "W_SF_1"]] }
            ],
            stages: { "QF": "reachesQF", "SF": "reachesSF", "F": "reachesFinal" }
        },
        "16_TEAM_8_GROUP": {
            description: "Round of 16:\n R16-1: A1 vs B2\n R16-2: C1 vs D2\n R16-3: E1 vs F2\n R16-4: G1 vs H2\n R16-5: B1 vs A2\n R16-6: D1 vs C2\n R16-7: F1 vs E2\n R16-8: H1 vs G2\n\nQuarter-Finals:\n QF1: W R16-1 vs W R16-2\n QF2: W R16-3 vs W R16-4\n QF3: W R16-5 vs W R16-6\n QF4: W R16-7 vs W R16-8\n\nSemi-Finals & Final follow.",
            type: 'standard',
            rounds: [
                { name: "R16", pairings: [["A1","B2"], ["C1","D2"], ["E1","F2"], ["G1","H2"], ["B1","A2"], ["D1","C2"], ["F1","E2"], ["H1","G2"]] },
                { name: "QF", pairings: [["W_R16_0", "W_R16_1"], ["W_R16_2", "W_R16_3"], ["W_R16_4", "W_R16_5"], ["W_R16_6", "W_R16_7"]] },
                { name: "SF", pairings: [["W_QF_0", "W_QF_1"], ["W_QF_2", "W_QF_3"]] },
                { name: "F", pairings: [["W_SF_0", "W_SF_1"]] }
            ],
            stages: { "R16": "reachesR16", "QF": "reachesQF", "SF": "reachesSF", "F": "reachesFinal" }
        },
        "16_TEAM_EURO": {
            description: "16-Team knockout with 4 best 3rd-placed teams from 6 groups (A-F).\nRound of 16 pairings depend on which groups the 4 qualifying 3rd-placed teams come from.",
            type: '3rd_place',
            thirdPlacePairingTable: {
                "ABCD": { WB: "3A", WC: "3D", WE: "3B", WF: "3C" }, "ABCE": { WB: "3A", WC: "3E", WE: "3B", WF: "3C" },
                "ABCF": { WB: "3A", WC: "3F", WE: "3B", WF: "3C" }, "ABDE": { WB: "3D", WC: "3E", WE: "3A", WF: "3B" },
                "ABDF": { WB: "3D", WC: "3F", WE: "3A", WF: "3B" }, "ABEF": { WB: "3E", WC: "3F", WE: "3A", WF: "3B" },
                "ACDE": { WB: "3E", WC: "3D", WE: "3C", WF: "3A" }, "ACDF": { WB: "3F", WC: "3D", WE: "3C", WF: "3A" },
                "ACEF": { WB: "3E", WC: "3F", WE: "3C", WF: "3A" }, "ADEF": { WB: "3E", WC: "3F", WE: "3D", WF: "3A" },
                "BCDE": { WB: "3E", WC: "3D", WE: "3B", WF: "3C" }, "BCDF": { WB: "3F", WC: "3D", WE: "3B", WF: "3C" },
                "BCEF": { WB: "3F", WC: "3E", WE: "3B", WF: "3C" }, "BDEF": { WB: "3F", WC: "3E", WE: "3D", WF: "3B" },
                "CDEF": { WB: "3F", WC: "3E", WE: "3D", WF: "3C" }
            },
            rounds: [
                { name: "R16" }, // Pairings are dynamic
                { name: "QF", pairings: [["W_R16_0", "W_R16_1"], ["W_R16_2", "W_R16_3"], ["W_R16_4", "W_R16_5"], ["W_R16_6", "W_R16_7"]] },
                { name: "SF", pairings: [["W_QF_0", "W_QF_1"], ["W_QF_2", "W_QF_3"]] },
                { name: "F", pairings: [["W_SF_0", "W_SF_1"]] }
            ],
            stages: { "R16": "reachesR16", "QF": "reachesQF", "SF": "reachesSF", "F": "reachesFinal" }
        }
    };

    function updateBracketDisplay() {
        const selectedFormat = knockoutFormatEl.value;
        if (knockoutBrackets[selectedFormat]) {
            bracketStructureEl.textContent = knockoutBrackets[selectedFormat].description;
        } else {
            bracketStructureEl.textContent = "No knockout stage will be simulated.";
        }
    }
    knockoutFormatEl.addEventListener('change', updateBracketDisplay);
    
    document.querySelector('.tab-button').click(); // Activate first tab
    updateBracketDisplay(); // Initial display
    
    // --- Mode Switching ---
    document.querySelectorAll('input[name="calcMode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            calculationMode = e.target.value;
            document.getElementById('oddsModeInputs').classList.toggle('hidden', calculationMode !== 'odds');
            document.getElementById('eloModeInputs').classList.toggle('hidden', calculationMode !== 'elo');
            // Removed clearButtonEl.click() here to prevent clearing data on mode switch
        });
    });

    // --- Round Robin Type Switching ---
    document.querySelectorAll('input[name="roundRobinType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            roundRobinType = e.target.value;
            // Removed clearButtonEl.click() here to prevent clearing data on round robin type switch
        });
    });

    // --- Save/Load Logic ---
    function applyState(state) {
        // Clear current state before applying loaded state, but preserve roundRobinType from current selection first
        const currentRoundRobinType = document.querySelector('input[name="roundRobinType"]:checked')?.value || 'double';
        clearButtonEl.click(); 
        
        if (state.mode) {
            calculationMode = state.mode;
            document.querySelector(`input[name="calcMode"][value="${state.mode}"]`).checked = true;
            document.getElementById('oddsModeInputs').classList.toggle('hidden', calculationMode !== 'odds');
            document.getElementById('eloModeInputs').classList.toggle('hidden', calculationMode !== 'elo');
        }
        if (state.roundRobinType) { // Load round robin type
            roundRobinType = state.roundRobinType;
            document.querySelector(`input[name="roundRobinType"][value="${state.roundRobinType}"]`).checked = true;
        } else {
            // If state doesn't have roundRobinType, explicitly set it to the one that was active
            // when loading was initiated, or default to double if it was cleared.
            roundRobinType = currentRoundRobinType;
            document.querySelector(`input[name="roundRobinType"][value="${currentRoundRobinType}"]`).checked = true;
        }

        if(state.oddsData) matchDataEl.value = state.oddsData;
        if(state.eloData) eloDataEl.value = state.eloData;
        if(state.resultsData) matchResultsEl.value = state.resultsData;
        if(state.simulations) numSimulationsEl.value = state.simulations;
        if(state.tiebreaker) document.querySelector(`input[name="tiebreaker"][value="${state.tiebreaker}"]`).checked = true;
        
        if (state.eloModel) {
            homeAdvantageEloEl.value = state.eloModel.homeAdvantage || 80;
            eloPerGoalEl.value = state.eloModel.eloPerGoal || 200;
            baselineTotalGoalsEl.value = state.eloModel.baselineGoals || 2.7;
        }
        if (state.knockoutFormat) {
            knockoutFormatEl.value = state.knockoutFormat;
            updateBracketDisplay();
        }

        statusAreaEl.innerHTML = `<p class="text-blue-500">Scenario loaded successfully. Please parse the data.</p>`;
    }
    
    saveToBrowserButtonEl.addEventListener('click', () => {
        try {
            const state = {
                mode: calculationMode,
                roundRobinType: roundRobinType, // Save round robin type
                oddsData: matchDataEl.value,
                eloData: eloDataEl.value,
                resultsData: matchResultsEl.value,
                tiebreaker: document.querySelector('input[name="tiebreaker"]:checked').value,
                simulations: numSimulationsEl.value,
                knockoutFormat: knockoutFormatEl.value,
                eloModel: {
                    homeAdvantage: homeAdvantageEloEl.value,
                    eloPerGoal: eloPerGoalEl.value,
                    baselineGoals: baselineTotalGoalsEl.value
                }
            };
            localStorage.setItem('tournamentSimulatorState', JSON.stringify(state, null, 2));
            statusAreaEl.innerHTML = `<p class="text-green-500">Scenario saved to browser successfully.</p>`;
        } catch (e) {
            statusAreaEl.innerHTML = `<p class="text-red-500">Error saving to browser: ${e.message}</p>`;
        }
    });

    loadFromBrowserButtonEl.addEventListener('click', () => {
        try {
            const savedState = localStorage.getItem('tournamentSimulatorState');
            if (savedState) {
                applyState(JSON.parse(savedState));
            } else {
                statusAreaEl.innerHTML = `<p class="text-yellow-600">No scenario found in browser storage.</p>`;
            }
        } catch (e) {
            statusAreaEl.innerHTML = `<p class="text-red-500">Error loading from browser: ${e.message}</p>`;
        }
    });

    saveToFileButtonEl.addEventListener('click', () => {
        try {
            const state = {
                mode: calculationMode,
                roundRobinType: roundRobinType, // Save round robin type
                oddsData: matchDataEl.value,
                eloData: eloDataEl.value,
                resultsData: matchResultsEl.value,
                tiebreaker: document.querySelector('input[name="tiebreaker"]:checked').value,
                simulations: numSimulationsEl.value,
                knockoutFormat: knockoutFormatEl.value,
                eloModel: {
                    homeAdvantage: homeAdvantageEloEl.value,
                    eloPerGoal: eloPerGoalEl.value,
                    baselineGoals: baselineTotalGoalsEl.value
                }
            };
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `tournament_scenario_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            statusAreaEl.innerHTML = `<p class="text-green-500">Scenario saved to file.</p>`;
        } catch (e) {
             statusAreaEl.innerHTML = `<p class="text-red-500">Error saving to file: ${e.message}</p>`;
        }
    });
    
    loadFromFileInputEl.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const state = JSON.parse(e.target.result);
                applyState(state);
            } catch (err) {
                statusAreaEl.innerHTML = `<p class="text-red-500">Error parsing file. Make sure it's a valid scenario JSON file. ${err.message}</p>`;
            }
        };
        reader.onerror = () => {
            statusAreaEl.innerHTML = `<p class="text-red-500">Error reading file.</p>`;
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    });


    // --- CSV File Input ---
    csvFileInputEl.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            csvFileNameEl.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (e) => { matchDataEl.value = e.target.result; statusAreaEl.innerHTML = `<p class="text-blue-500">Odds CSV loaded. Click "Parse & Validate Data".</p>`; };
            reader.onerror = (e) => { statusAreaEl.innerHTML = `<p class="text-red-500">Error reading file: ${e.target.error.name}</p>`; csvFileNameEl.textContent = "No file selected."; };
            reader.readAsText(file);
        } else { csvFileNameEl.textContent = "No file selected."; }
    });

    eloCsvFileInputEl.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            eloCsvFileNameEl.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (e) => { eloDataEl.value = e.target.result; statusAreaEl.innerHTML = `<p class="text-blue-500">Elo CSV loaded. Click "Parse & Validate Data".</p>`; };
            reader.onerror = (e) => { statusAreaEl.innerHTML = `<p class="text-red-500">Error reading file: ${e.target.error.name}</p>`; eloCsvFileNameEl.textContent = "No file selected."; };
            reader.readAsText(file);
        } else { eloCsvFileNameEl.textContent = "No file selected."; }
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

    function calculateLambdasFromRating(rating1, rating2, eloParams, useHomeAdvantage = false) {
        const homeAdvantage = useHomeAdvantage ? (eloParams.homeAdvantage || 0) : 0;
        const eloDiff = (rating1 + homeAdvantage) - rating2;
        const goalAdvantage = eloDiff / eloParams.eloPerGoal;
        
        let lambda1 = (eloParams.baselineGoals + goalAdvantage) / 2;
        let lambda2 = (eloParams.baselineGoals - goalAdvantage) / 2;
        
        return {
            lambda1: Math.max(0.1, lambda1),
            lambda2: Math.max(0.1, lambda2)
        };
    }
    
    function getPowerRating(teamName) {
        if (calculationMode === 'elo') {
            return teamRatings[teamName] || 1500; // Default Elo
        }
        // If odds mode, calculate a power rating from avg goal potential
        const teamMatches = parsedMatches.filter(m => m.team1 === teamName || m.team2 === teamName);
        if (teamMatches.length === 0) return 1500; // Default if no matches found
        let totalXG = 0;
        teamMatches.forEach(m => {
            totalXG += (m.team1 === teamName) ? m.lambda1 : m.lambda2;
        });
        const avgXG = totalXG / teamMatches.length;
        
        const baselineGoals = parseFloat(baselineTotalGoalsEl.value) || 2.7;
        const eloPerGoal = parseFloat(eloPerGoalEl.value) || 200;
        // Convert avgXG to a pseudo-Elo rating
        return ((avgXG - (baselineGoals / 2)) * eloPerGoal * 2) + 1500;
    }

    function calculateModelProbsFromXG(homeXG, awayXG, goalLine = 2.5) {
        let probHomeWin = 0, probAwayWin = 0, probDraw = 0;
        let probUnder = 0, probOver = 0;
        const maxGoals = 20; // Max number of goals to consider for Poisson calculation

        for (let i = 0; i <= maxGoals; i++) { // Home goals
            for (let j = 0; j <= maxGoals; j++) { // Away goals
                const probScore = poissonPMF(homeXG, i) * poissonPMF(awayXG, j);
                if (probScore === 0 && !(homeXG === 0 && i === 0 && awayXG === 0 && j === 0)) continue;

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
            probHomeWinFull: probHomeWin, probDrawFull: probDraw, probAwayWinFull: probAwayWin,
            probUnderFull: probUnder, probOverFull: probOver
        };
    }

    function calculateExpectedGoalsFromOdds(overPrice, underPrice, homePrice, awayPrice) {
        // Normalize probabilities from odds (remove implied margin)
        const normalisedUnder = (1 / underPrice) / ((1 / overPrice) + (1 / underPrice));
        const normalisedHomeNoDraw = (1 / homePrice) / ((1 / awayPrice) + (1 / homePrice));

        let totalGoals = 2.5; // Initial guess for total goals
        let supremacy = 0;    // Initial guess for home team goal advantage

        const bisectionMaxIter = 50; // Iterations for bisection method

        // Iterate to find optimal totalGoals and supremacy
        for (let iter = 0; iter < 5; iter++) { // A few iterations to converge
            // Bisection for Total Goals
            let lowTG = 0.01, highTG = 8.0; // Search range for total goals
            for (let i = 0; i < bisectionMaxIter; i++) {
                let midTG = (lowTG + highTG) / 2;
                if (midTG <= 0) break;

                const tempHomeXG = Math.max(0.01, midTG / 2 + supremacy / 2);
                const tempAwayXG = Math.max(0.01, midTG / 2 - supremacy / 2);
                if (tempHomeXG <= 0 || tempAwayXG <= 0) { // Ensure XG values are positive
                    if (supremacy > 0) highTG = midTG; else lowTG = midTG;
                    continue;
                }

                const output = calculateModelProbsFromXG(tempHomeXG, tempAwayXG);

                if (output.modelProbUnderNoExact > normalisedUnder) {
                    lowTG = midTG;
                } else {
                    highTG = midTG;
                }

                if (Math.abs(lowTG - highTG) < 0.0001) break; // Convergence check
            }
            totalGoals = (lowTG + highTG) / 2;

            // Bisection for Supremacy
            let lowSup = -(totalGoals - 0.02); // Supremacy can be negative
            let highSup = totalGoals - 0.02;

            for (let i = 0; i < bisectionMaxIter; i++) {
                let midSup = (lowSup + highSup) / 2;

                const tempHomeXG = Math.max(0.01, totalGoals / 2 + midSup / 2);
                const tempAwayXG = Math.max(0.01, totalGoals / 2 - midSup / 2);
                if (tempHomeXG <= 0 || tempAwayXG <= 0) {
                    continue;
                }

                const output = calculateModelProbsFromXG(tempHomeXG, tempAwayXG);

                if (output.modelProbHomeWinNoDraw > normalisedHomeNoDraw) {
                    highSup = midSup;
                } else {
                    lowSup = midSup;
                }

                if (Math.abs(lowSup - highSup) < 0.0001) break; // Convergence check
            }
            supremacy = (lowSup + highSup) / 2;
        }

        const homeExpectedGoals = Math.max(0.01, totalGoals / 2 + supremacy / 2);
        const awayExpectedGoals = Math.max(0.01, totalGoals / 2 - supremacy / 2);

        return { homeXG: homeExpectedGoals, awayXG: awayExpectedGoals };
    }


    // --- Parsing Logic (Simulator) ---
    function parseOddsData(errors) {
        parsedMatches = []; // Clear parsedMatches to avoid duplicates on re-parse
        groupedMatches = {}; // Clear groupedMatches
        groupTeamNames = {}; // Clear groupTeamNames
        allTeams.clear(); // Clear allTeams
        
        const data = matchDataEl.value.trim();
        if (!data) {
            errors.push("Match data (Odds) is empty.");
            return;
        }
        const lines = data.split('\n');
        
        lines.forEach((line, index) => {
            line = line.trim();
            if (!line || line.startsWith('#')) return;

            let parts;
            let delimiter = ' ';
            if (line.includes(';')) {
                parts = line.split(';').map(p => p.trim());
                delimiter = ';';
            } else if (line.includes(',')) {
                parts = line.split(',').map(p => p.trim());
                delimiter = ',';
            } else if (line.includes('\t')) {
                parts = line.split('\t').map(p => p.trim());
                delimiter = '\t';
            } else {
                parts = line.split(/\s+/).map(p => p.trim());
            }
            parts = parts.filter(p => p.length > 0);

            let group, team1Name, team2Name, oddsStrings;
            const vsIdx = parts.indexOf('vs');

            if (vsIdx > 0) { // Handle "vs" format (e.g., A Team1 vs Team2 3.5 3.67 2 2.15 1.68)
                group = parts[0];
                team1Name = parts.slice(1, vsIdx).join(" ");
                team2Name = parts.slice(vsIdx + 1, parts.length - 5).join(" ");
                oddsStrings = parts.slice(parts.length - 5);
            } else if (delimiter !== ' ' && parts.length >= 8) { // Handle fixed-column format (e.g., A;Team1;Team2;3.5;3.67;2;2.15;1.68)
                group = parts[0];
                team1Name = parts[1];
                team2Name = parts[2];
                oddsStrings = parts.slice(3, 8);
            } else {
                errors.push(`L${index + 1}: Invalid format. Use 'Group Team1 vs Team2 ...' OR 'Group;Team1;Team2;...'. Line: "${line}"`);
                return;
            }

            if (!team1Name || !team2Name) { errors.push(`L${index + 1}: Could not parse team names. Line: "${line}"`); return; }
            if (!oddsStrings || oddsStrings.length !== 5) { errors.push(`L${index + 1}: Could not extract 5 odds. Line: "${line}"`); return; }

            const odds = oddsStrings.map(parseFloat);
            if (odds.some(isNaN)) { errors.push(`L${index + 1}: One or more odds are not a valid number. Odds found: ${oddsStrings.join(', ')}. Line: "${line}"`); return; }
            if (odds.some(o => o <= 0)) { errors.push(`L${index + 1}: Odds must be > 0. Line: "${line}"`); return; }

            const [o1, ox, o2, oUnder25, oOver25] = odds;
            const { homeXG, awayXG } = calculateExpectedGoalsFromOdds(oOver25, oUnder25, o1, o2);

            // Add the first leg match
            let match = { lineNum: index + 1, group, team1: team1Name, team2: team2Name, lambda1: homeXG, lambda2: awayXG, isHome: true };
            parsedMatches.push(match);
            allTeams.add(team1Name); allTeams.add(team2Name);
            if (!groupedMatches[group]) { groupedMatches[group] = []; groupTeamNames[group] = new Set(); }
            groupedMatches[group].push(match);
            groupTeamNames[group].add(team1Name);
            groupTeamNames[group].add(team2Name);
            
            // Add the return leg match for double round robin IF selected
            if (roundRobinType === 'double') {
                // We need to calculate lambdas for the reverse fixture (Team2 vs Team1)
                // The odds for the reverse fixture are o2 (for Team2 home win), ox (draw), o1 (Team1 away win)
                // The O/U odds remain the same
                const { homeXG: revHomeXG, awayXG: revAwayXG } = calculateExpectedGoalsFromOdds(oOver25, oUnder25, o2, o1);
                let returnMatch = { lineNum: index + 1, group, team1: team2Name, team2: team1Name, lambda1: revHomeXG, lambda2: revAwayXG, isHome: false };
                parsedMatches.push(returnMatch);
                groupedMatches[group].push(returnMatch);
            }
        });
    }

    function parseEloData(errors) {
        parsedMatches = []; // Clear parsedMatches to avoid duplicates on re-parse
        groupedMatches = {}; // Clear groupedMatches
        groupTeamNames = {}; // Clear groupTeamNames
        allTeams.clear(); // Clear allTeams
        teamRatings = {}; // Reset team ratings
        
        const data = eloDataEl.value.trim(); if (!data) { errors.push("Elo data is empty."); return; }
        let teamsByGroup = {};
        

        const lines = data.split('\n');

        lines.forEach((line, index) => {
            line = line.trim(); if (!line || line.startsWith('#')) return;
            const parts = line.split(/[,;\t]/).map(p => p.trim());
            if (parts.length < 3) { errors.push(`Elo L${index + 1}: Invalid format. Use 'Group, Team Name, Rating'. Line: "${line}"`); return; }
            
            const group = parts[0];
            const teamName = parts.slice(1, parts.length - 1).join(" ");
            const rating = parseInt(parts[parts.length - 1], 10);

            if (!group || !teamName) { errors.push(`Elo L${index + 1}: Group or Team Name is empty. Line: "${line}"`); return; }
            if (isNaN(rating)) { errors.push(`Elo L${index + 1}: Invalid rating. Line: "${line}"`); return; }
            
            if (!teamsByGroup[group]) { teamsByGroup[group] = []; }
            teamsByGroup[group].push({ name: teamName, rating: rating });
            teamRatings[teamName] = rating;
            allTeams.add(teamName);
        });

        const eloParams = {
            homeAdvantage: parseFloat(homeAdvantageEloEl.value),
            eloPerGoal: parseFloat(eloPerGoalEl.value),
            baselineGoals: parseFloat(baselineTotalGoalsEl.value)
        };

        // Generate matches from parsed Elo data based on roundRobinType
        for (const group in teamsByGroup) {
            const teams = teamsByGroup[group];
            if (!groupedMatches[group]) { groupedMatches[group] = []; groupTeamNames[group] = new Set(); }
            
            for (let i = 0; i < teams.length; i++) {
                groupTeamNames[group].add(teams[i].name);
                for (let j = i + 1; j < teams.length; j++) { // Only generate each pair once for initial setup
                    const team1 = teams[i];
                    const team2 = teams[j];

                    // First leg: team1 home vs team2 away
                    const { lambda1: l1_t1_h, lambda2: l2_t1_h } = calculateLambdasFromRating(team1.rating, team2.rating, eloParams, true);
                    let match1 = { group, team1: team1.name, team2: team2.name, lambda1: l1_t1_h, lambda2: l2_t1_h, isHome: true };
                    parsedMatches.push(match1);
                    groupedMatches[group].push(match1);

                    // If double round-robin, add the return leg
                    if (roundRobinType === 'double') {
                        const { lambda1: l1_t2_h, lambda2: l2_t2_h } = calculateLambdasFromRating(team2.rating, team1.rating, eloParams, true);
                        let match2 = { group, team1: team2.name, team2: team1.name, lambda1: l1_t2_h, lambda2: l2_t2_h, isHome: false };
                        parsedMatches.push(match2);
                        groupedMatches[group].push(match2);
                    }
                }
            }
        }
    }

    function parseResultsData(errors) {
        parsedResults = {}; // Clear parsedResults
        const resultsData = matchResultsEl.value.trim();
        if (!resultsData) return; // Not an error if it's empty

        const resultLines = resultsData.split('\n');
        resultLines.forEach((line, index) => {
            line = line.trim();
            if (!line || line.startsWith('#')) return;

            const parts = line.split(/\s+/).map(p => p.trim());
            const vsIdx = parts.indexOf('vs');

            if (vsIdx === -1 || vsIdx === 0 || vsIdx >= parts.length - 3) {
                errors.push(`Result L${index + 1}: Invalid format. Use 'Group Team1 vs Team2 Score1 Score2'. Line: "${line}"`);
                return;
            }

            const group = parts[0]; // Assuming group is the first part for results as well
            const team1Name = parts.slice(1, vsIdx).join(" ");
            const team2Name = parts.slice(vsIdx + 1, parts.length - 2).join(" ");
            const score1 = parseInt(parts[parts.length - 2], 10);
            const score2 = parseInt(parts[parts.length - 1], 10);

            if (!team1Name || !team2Name) { errors.push(`Result L${index + 1}: Could not parse team names. Line: "${line}"`); return; }
            if (isNaN(score1) || isNaN(score2)) { errors.push(`Result L${index + 1}: Invalid scores. Line: "${line}"`); return; }
            
            // Store results using a key that identifies the match uniquely, regardless of home/away status
            // The simulation logic will need to handle which team is home/away based on the match object
            const matchKey1 = `${group}-${team1Name}-${team2Name}`; // Home team first
            const matchKey2 = `${group}-${team2Name}-${team1Name}`; // Away team first (reversed for the return leg)
            
            parsedResults[matchKey1] = { g1: score1, g2: score2, team1: team1Name, team2: team2Name };
            parsedResults[matchKey2] = { g1: score2, g2: score1, team1: team2Name, team2: team1Name }; // Store reverse too
        });
    }

    parseButtonEl.addEventListener('click', () => {
        // Reset state
        parsedMatches = []; allTeams.clear(); groupedMatches = {}; groupTeamNames = {}; parsedResults = {}; teamRatings = {};
        let errors = [];
        
        // Step 1: Parse main data (Odds or Elo)
        if (calculationMode === 'odds') {
            parseOddsData(errors);
        } else {
            parseEloData(errors);
        }

        // Step 2: Parse played results (common to both modes)
        parseResultsData(errors);

        // Step 3: Final status update
        if (errors.length > 0) {
            statusAreaEl.innerHTML = `<p class="text-red-500 font-semibold">Parse Fail (${errors.length} errors):</p><ul class="list-disc list-inside text-red-500">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
            runButtonEl.disabled = true;
            return;
        }

        for (const group in groupTeamNames) {
            groupTeamNames[group] = Array.from(groupTeamNames[group]);
        }
        
        let successMsg = `<p class="text-green-500">Parsed ${allTeams.size} teams in ${Object.keys(groupedMatches).length} groups, generating ${parsedMatches.length} matches (${roundRobinType} round-robin).`;
        if (Object.keys(parsedResults).length > 0) {
            successMsg += ` Loaded ${Object.keys(parsedResults).length / 2} played results.`
        }
        successMsg += `</p>`;
        statusAreaEl.innerHTML = successMsg;

        runButtonEl.disabled = false;
        resultsContentEl.innerHTML = "Parsed. Ready for sim.";
    });


    // --- Simulation Logic ---
    runButtonEl.addEventListener('click', async () => {
        if (parsedMatches.length === 0) { statusAreaEl.innerHTML = '<p class="text-red-500">No data. Please parse data first.</p>'; return; }
        currentNumSims = parseInt(numSimulationsEl.value); if (isNaN(currentNumSims) || currentNumSims <= 0) { statusAreaEl.innerHTML = '<p class="text-red-500">Number of simulations must be greater than 0.</p>'; return; }

        progressContainerEl.classList.remove('hidden');
        progressBarEl.style.width = '0%';
        progressBarEl.textContent = '0%';
        statusAreaEl.innerHTML = `<p class="text-blue-500">Running ${currentNumSims} simulations...</p>`;
        resultsContentEl.innerHTML = "";
        runButtonEl.disabled = true;
        parseButtonEl.disabled = true;

        try {
            simulationAggStats = await runSimulation(currentNumSims);
            displayResults(simulationAggStats, currentNumSims);
            populateSimGroupSelect();
            statusAreaEl.innerHTML = `<p class="text-green-500">Simulation complete! (${currentNumSims} runs)</p>`;
        } catch (simError) {
            console.error("Simulation Error:", simError);
            statusAreaEl.innerHTML = `<p class="text-red-500">Error during simulation: ${simError.message}</p>`;
            simulationAggStats = {}; // Clear stats on error
            populateSimGroupSelect();
        } finally {
            progressContainerEl.classList.add('hidden');
            runButtonEl.disabled = false;
            parseButtonEl.disabled = false;
        }
    });

    function rankTeams(teamNames, fullStats, simMatchResults, rule) {
        const teamsToSort = teamNames.map(name => ({ ...fullStats[name] }));

        teamsToSort.sort((a, b) => {
            // Primary tie-breaker: Points
            if (a.pts !== b.pts) return b.pts - a.pts;

            // Secondary tie-breakers based on rule
            const tiedTeamsNames = teamNames.filter(name => fullStats[name].pts === a.pts);

            let h2hStats = {};
            if (tiedTeamsNames.length > 1 && rule !== 'simple') {
                h2hStats = calculateH2HStats(tiedTeamsNames, simMatchResults);
            }

            const a_h2h = h2hStats[a.name] || { pts: 0, gd: 0, gf: 0 };
            const b_h2h = h2hStats[b.name] || { pts: 0, gd: 0, gf: 0 };

            if (rule === 'h2h') { // Head-to-Head priority
                if (a_h2h.pts !== b_h2h.pts) return b_h2h.pts - a_h2h.pts; // Fix: Changed b.h2h.pts to b_h2h.pts
                if (a_h2h.gd !== b_h2h.gd) return b_h2h.gd - a_h2h.gd; // Fix: Changed b.h2h.gd to b_h2h.gd
                if (a_h2h.gf !== b_h2h.gf) return b_h2h.gf - a_h2h.gf; // Fix: Changed b.h2h.gf to b_h2h.gf
            }

            // Overall Goal Difference
            if (a.gd !== b.gd) return b.gd - a.gd;
            // Overall Goals For
            if (a.gf !== b.gf) return b.gf - a.gf;

            if (rule === 'standard') { // Standard rule: Overall GD/GF, then H2H
                if (a_h2h.pts !== b_h2h.pts) return b_h2h.pts - a_h2h.pts; // Fix: Changed b.h2h.pts to b_h2h.pts
                if (a_h2h.gd !== b_h2h.gd) return b_h2h.gd - a_h2h.gd; // Fix: Changed b.h2h.gd to b_h2h.gd
                if (a_h2h.gf !== b_h2h.gf) return b_h2h.gf - a_h2h.gf; // Fix: Changed b.h2h.gf to b_h2h.gf
            }

            // Final tie-breaker: Random (for identical stats)
            return Math.random() - 0.5;
        });

        return teamsToSort;
    }

    function calculateH2HStats(tiedTeamsNames, simMatchResults) {
        const h2hStats = {};
        tiedTeamsNames.forEach(name => {
            h2hStats[name] = { name: name, pts: 0, gf: 0, ga: 0, gd: 0 };
        });

        // Filter for matches played exclusively among the tied teams
        const h2hMatches = simMatchResults.filter(m =>
            tiedTeamsNames.includes(m.team1) && tiedTeamsNames.includes(m.team2)
        );

        h2hMatches.forEach(m => {
            const stats1 = h2hStats[m.team1];
            const stats2 = h2hStats[m.team2];

            stats1.gf += m.g1;
            stats1.ga += m.g2;
            stats2.gf += m.g2;
            stats2.ga += m.g1;

            if (m.g1 > m.g2) {
                stats1.pts += 3;
            } else if (m.g2 > m.g1) {
                stats2.pts += 3;
            } else {
                stats1.pts += 1;
                stats2.pts += 1;
            }
        });

        for (const name in h2hStats) {
            h2hStats[name].gd = h2hStats[name].gf - h2hStats[name].ga;
        }

        return h2hStats;
    }

    function simulateKnockoutStage(knockoutFormat, rankedTables, eloParams) {
        if (!knockoutFormat || knockoutFormatEl.value === 'NONE') return {};
        
        let winners = {}; // Stores winners of each match slot (e.g., W_QF_0)
        let stageParticipants = {}; // Tracks all teams that reached a specific stage
        let finalWinner = null;

        const firstRound = knockoutFormat.rounds[0];
        let currentPairings = [];

        // Determine initial pairings for the first knockout round
        if (knockoutFormat.type === 'standard') {
            currentPairings = firstRound.pairings;
        } else if (knockoutFormat.type === '3rd_place') {
            let thirdPlacedTeams = [];
            // Collect all 3rd placed teams from each group with their stats
            Object.keys(rankedTables).forEach(groupKey => {
                // Ensure the group has at least 3 teams to have a 3rd place
                if(rankedTables[groupKey].length >= 3) {
                    const thirdTeam = { ...rankedTables[groupKey][2] }; // Clone object to avoid modifying original
                    thirdTeam.group = groupKey; // Add group info for identification
                    thirdPlacedTeams.push(thirdTeam);
                }
            });
            
            // Rank 3rd placed teams (e.g., based on points, GD, GF)
            thirdPlacedTeams.sort((a,b) => {
                if (a.pts !== b.pts) return b.pts - a.pts;
                if (a.gd !== b.gd) return b.gd - a.gd;
                if (a.gf !== b.gf) return b.gf - a.gf;
                return 0; // Fallback for identical stats, could add more criteria
            });

            const qualifyingThirds = thirdPlacedTeams.slice(0, 4); // Select the best 4
            // Create a sorted string of group names for lookup in the pairing table
            const qualifyingGroups = qualifyingThirds.map(t => t.group).sort().join('');
            
            const pairings3rd = knockoutFormat.thirdPlacePairingTable[qualifyingGroups];
            if (!pairings3rd) {
                // This combination of qualifying 3rd-placed groups does not have a predefined pairing.
                // This might happen if the table is incomplete or if an unexpected combination occurs.
                // In a real tournament, this would be determined by specific rules.
                return {}; 
            }

            const thirdPlaceMap = {}; // Map group name to the actual 3rd place team name
            qualifyingThirds.forEach(t => {
                thirdPlaceMap[t.group] = t.name;
            });
            
            // Define the fixed pairings for group winners/runners-up
            let r16pairings = [
                ["A2", "B2"], // Example: Group A Runner-up vs Group B Runner-up
                ["C1", "D2"],
                ["E1", "F2"],
                ["G1", "H2"] 
            ]; 
            
            // Add pairings involving 3rd place teams dynamically based on the lookup table
            // The keys in pairings3rd (WB, WC, WE, WF) correspond to the positions in the R16 bracket
            // and their values (e.g., "3A") indicate which 3rd place team fills that spot.
            r16pairings.push(["B1", thirdPlaceMap[pairings3rd.WB.slice(1)]]); // B1 vs 3rd A
            r16pairings.push(["A1", thirdPlaceMap[pairings3rd.WC.slice(1)]]); // A1 vs 3rd C
            r16pairings.push(["F1", thirdPlaceMap[pairings3rd.WE.slice(1)]]); // F1 vs 3rd E
            r16pairings.push(["E1", thirdPlaceMap[pairings3rd.WF.slice(1)]]); // E1 vs 3rd F

            currentPairings = r16pairings;
        }

        // --- Simulate All Rounds ---
        knockoutFormat.rounds.forEach(roundInfo => {
            const roundName = roundInfo.name;
            stageParticipants[roundName] = new Set();
            
            // For subsequent rounds (QF, SF, F), use their predefined pairings if available
            if (roundInfo.pairings) {
                currentPairings = roundInfo.pairings;
            }
            
            let nextRoundPairings = []; // Not explicitly used but good for structure if we passed winners to next round

            for(let i = 0; i < currentPairings.length; i++) {
                const pairing = currentPairings[i];
                const team1Slot = pairing[0]; // e.g., "A1", "W_QF_0"
                const team2Slot = pairing[1]; // e.g., "B2", "W_QF_1"

                // Resolve team names from slots
                // If slot starts with "W_", it's a winner from a previous round
                // Otherwise, it's a group stage qualifier (e.g., A1 = Group A, 1st place)
                const team1Name = team1Slot.startsWith("W_") ? winners[team1Slot] : rankedTables[team1Slot[0]]?.[parseInt(team1Slot.substring(1)) - 1]?.name;
                const team2Name = team2Slot.startsWith("W_") ? winners[team2Slot] : rankedTables[team2Slot[0]]?.[parseInt(team2Slot.substring(1)) - 1]?.name;

                if (team1Name && team2Name) { // Ensure both teams exist for the match
                    stageParticipants[roundName].add(team1Name);
                    stageParticipants[roundName].add(team2Name);

                    const rating1 = getPowerRating(team1Name);
                    const rating2 = getPowerRating(team2Name);
                    
                    // Simulate knockout match (no home advantage in neutral venue knockouts)
                    const { lambda1, lambda2 } = calculateLambdasFromRating(rating1, rating2, eloParams, false);
                    const g1 = poissonRandom(lambda1);
                    const g2 = poissonRandom(lambda2);

                    // Determine winner; coin flip for draws
                    let winnerName = (g1 > g2) ? team1Name : (g2 > g1) ? team2Name : (Math.random() < 0.5 ? team1Name : team2Name);
                    winners[`W_${roundName}_${i}`] = winnerName; // Store winner for next round
                    finalWinner = winnerName; // The last winner determined is the tournament winner
                }
            }
        });

        return { winner: finalWinner, stageParticipants };
    }


    async function runSimulation(numSims) {
        const aggStats = {};
        // Initialize global stats for all teams first
        allTeams.forEach(tN => {
            aggStats[tN] = {
                reachesR16: 0,
                reachesQF: 0,
                reachesSF: 0,
                reachesFinal: 0,
                winner: 0
            };
        });

        // Initialize group-specific stats for each team within their group
        for (const gr in groupedMatches) {
            const teamsInGroup = groupTeamNames[gr] || [];
            aggStats[gr] = { // Aggregate group stats
                groupTotalGoalsSims: [],
                straightForecasts: {},
                advancingDoubles: {},
                anyTeam9PtsCount: 0, 
                anyTeam0PtsCount: 0,
                firstPlacePtsSims: [],
                firstPlaceGFSims: [],
                lastPlacePtsSims: [],
                lastPlaceGFSims: [],
                mostGroupGFTeam: {}, // To track who had most goals in group
                mostGroupGATeam: {}  // To track who conceded most goals in group
            };
            teamsInGroup.forEach(tN => {
                 // Each team object in aggStats will hold both global and group-specific counters
                 aggStats[gr][tN] = {
                    ...aggStats[tN], // Inherit global counters (e.g., reachesQF, winner)
                    posCounts: Array(teamsInGroup.length).fill(0), // Position counts within the group
                    ptsSims: [],
                    gfSims: [],
                    gaSims: [],
                    winsSims: [],
                    drawsSims: [],
                    lossesSims: [],
                    mostGFCount: 0, // This is for team having most GF in group
                    mostGACount: 0,  // This is for team having most GA in group
                    unbeatenCount: 0 // New stat: count of times team finished unbeaten
                 };
                 // Ensure the global team object reference points to this extended object
                 aggStats[tN] = aggStats[gr][tN]; 
            });
        }
        
        const knockoutFormat = knockoutBrackets[knockoutFormatEl.value];
        const eloParams = {
            homeAdvantage: parseFloat(homeAdvantageEloEl.value),
            eloPerGoal: parseFloat(eloPerGoalEl.value),
            baselineGoals: parseFloat(baselineTotalGoalsEl.value)
        };

        const updateInterval = Math.max(1, Math.floor(numSims / 100)); // Update progress bar approx. 100 times
        const tiebreakerRule = document.querySelector('input[name="tiebreaker"]:checked').value;

        for (let i = 0; i < numSims; i++) {
            const rankedTables = {}; // Stores ranked teams for each group in this simulation run

            for (const gK in groupedMatches) { // Iterate through each group
                const currentGroupMatches = groupedMatches[gK];
                const teamsInGroup = [...(groupTeamNames[gK] || [])];
                if (teamsInGroup.length === 0) continue;

                // Initialize stats for teams in the current group for this specific simulation run
                const simTeamStats = {};
                const simulatedMatchResults = []; // To store results for H2H tie-breaking
                teamsInGroup.forEach(t => simTeamStats[t] = { name: t, pts: 0, gf: 0, ga: 0, wins: 0, draws: 0, losses: 0 });
                let currentGroupTotalGoals = 0;

                currentGroupMatches.forEach(m => { // Simulate each match in the group
                    // Create a consistent match key for looking up played results: Group-TeamA-TeamB
                    const matchKey = `${m.group}-${m.team1}-${m.team2}`; 
                    const playedResult = parsedResults[matchKey];
                    let g1, g2; // Goals for team1 (home) and team2 (away) in this match instance

                    if (playedResult) {
                        // If a real result is provided, use it
                        g1 = playedResult.g1;
                        g2 = playedResult.g2;
                    } else {
                        // Otherwise, simulate using Poisson distribution
                        g1 = poissonRandom(m.lambda1);
                        g2 = poissonRandom(m.lambda2);
                    }

                    simulatedMatchResults.push({ team1: m.team1, team2: m.team2, g1, g2 }); // Store for H2H

                    // Update team statistics
                    simTeamStats[m.team1].gf += g1;
                    simTeamStats[m.team1].ga += g2;
                    simTeamStats[m.team2].gf += g2;
                    simTeamStats[m.team2].ga += g1;
                    currentGroupTotalGoals += (g1 + g2);

                    if (g1 > g2) { // Team1 wins
                        simTeamStats[m.team1].pts += 3;
                        simTeamStats[m.team1].wins++;
                        simTeamStats[m.team2].losses++;
                    } else if (g2 > g1) { // Team2 wins
                        simTeamStats[m.team2].pts += 3;
                        simTeamStats[m.team2].wins++;
                        simTeamStats[m.team1].losses++;
                    } else { // Draw
                        simTeamStats[m.team1].pts++;
                        simTeamStats[m.team1].draws++;
                        simTeamStats[m.team2].pts++;
                        simTeamStats[m.team2].draws++;
                    }
                });

                // Calculate Goal Difference for all teams in the group
                teamsInGroup.forEach(t => { simTeamStats[t].gd = simTeamStats[t].gf - simTeamStats[t].ga; });
                
                // Rank teams based on the selected tie-breaking rule
                const rankedTeamsInGroup = rankTeams(teamsInGroup, simTeamStats, simulatedMatchResults, tiebreakerRule);
                rankedTables[gK] = rankedTeamsInGroup; // Store the ranked table for this group

                // Aggregate stats for later display
                aggStats[gK].groupTotalGoalsSims.push(currentGroupTotalGoals);
                let maxGFinGroup = -1, maxGAinGroup = -1;
                let groupHadMaxPts = false, groupHad0Pts = false;
                
                // Track which team had max GF/GA in this specific simulation run
                let currentMostGFTeam = { name: '', gf: -1 };
                let currentMostGATeam = { name: '', ga: -1 };

                // Calculate max GF/GA and check for max/min points achieved in this group
                teamsInGroup.forEach(tName => {
                    const teamStats = simTeamStats[tName];
                    if (teamStats.gf > currentMostGFTeam.gf) {
                        currentMostGFTeam = { name: tName, gf: teamStats.gf };
                    }
                     if (teamStats.ga > currentMostGATeam.ga) {
                        currentMostGATeam = { name: tName, ga: teamStats.ga };
                    }

                    let maxPossiblePts;
                    // Calculate maximum possible points based on round robin type
                    if (roundRobinType === 'double') {
                        maxPossiblePts = (teamsInGroup.length - 1) * 2 * 3; 
                    } else {
                        maxPossiblePts = (teamsInGroup.length - 1) * 3; 
                    }

                    if (teamStats.pts === maxPossiblePts && teamsInGroup.length > 1) groupHadMaxPts = true; 
                    if (teamStats.pts === 0) groupHad0Pts = true;
                });

                // Increment group-level counts for Most GF/GA
                if (currentMostGFTeam.name) {
                    aggStats[gK].mostGroupGFTeam[currentMostGFTeam.name] = (aggStats[gK].mostGroupGFTeam[currentMostGFTeam.name] || 0) + 1;
                }
                if (currentMostGATeam.name) {
                    aggStats[gK].mostGroupGATeam[currentMostGATeam.name] = (aggStats[gK].mostGroupGATeam[currentMostGATeam.name] || 0) + 1;
                }


                if (groupHadMaxPts) aggStats[gK].anyTeam9PtsCount++;
                if (groupHad0Pts) aggStats[gK].anyTeam0PtsCount++;

                // Record stats for 1st and last placed teams in this group
                if (rankedTeamsInGroup.length > 0) {
                    aggStats[gK].firstPlacePtsSims.push(rankedTeamsInGroup[0].pts);
                    aggStats[gK].firstPlaceGFSims.push(rankedTeamsInGroup[0].gf);
                    aggStats[gK].lastPlacePtsSims.push(rankedTeamsInGroup[rankedTeamsInGroup.length - 1].pts);
                    aggStats[gK].lastPlaceGFSims.push(rankedTeamsInGroup[rankedTeamsInGroup.length - 1].gf);
                }

                // Update aggregate stats for each team within the group
                rankedTeamsInGroup.forEach((t, rankIndex) => {
                    const teamAggStats = aggStats[gK][t.name];
                    const currentTeamSimStats = simTeamStats[t.name]; // Use simTeamStats for this specific run's results

                    if (teamAggStats) { // Check if the team exists in aggStats (should always if allTeams is correct)
                        if (rankIndex < teamAggStats.posCounts.length) teamAggStats.posCounts[rankIndex]++;
                        teamAggStats.ptsSims.push(currentTeamSimStats.pts);
                        teamAggStats.winsSims.push(currentTeamSimStats.wins);
                        teamAggStats.drawsSims.push(currentTeamSimStats.draws);
                        teamAggStats.lossesSims.push(currentTeamSimStats.losses);
                        teamAggStats.gfSims.push(currentTeamSimStats.gf);
                        teamAggStats.gaSims.push(currentTeamSimStats.ga);
                        // These team-specific most GF/GA counts were conceptually for a team *having* max GF/GA in *their* simulation.
                        // The group-level tracking (`mostGroupGFTeam`) is more appropriate for "P(Most GF in Group)"
                        // So removing these from here to avoid confusion or double counting, if they are not needed for a specific prop.
                        // if (currentTeamSimStats.gf === maxGFinGroup && maxGFinGroup > 0) teamAggStats.mostGFCount++;
                        // if (currentTeamSimStats.ga === maxGAinGroup && maxGAinGroup > 0) teamAggStats.mostGACount++;
                        if (currentTeamSimStats.losses === 0) teamAggStats.unbeatenCount++; // Increment unbeaten count
                    }
                });

                // Record Straight Forecasts (1st-2nd) and Advancing Doubles (Top 2 any order)
                if (rankedTeamsInGroup.length >= 2) {
                    const straightForecastKey = `${rankedTeamsInGroup[0].name}(1st)-${rankedTeamsInGroup[1].name}(2nd)`;
                    aggStats[gK].straightForecasts[straightForecastKey] = (aggStats[gK].straightForecasts[straightForecastKey] || 0) + 1;
                    
                    const advancingDoublesPair = [rankedTeamsInGroup[0].name, rankedTeamsInGroup[1].name].sort(); // Sort for consistent key
                    const advancingDoublesKey = `${advancingDoublesPair[0]}&${advancingDoublesPair[1]}`;
                    aggStats[gK].advancingDoubles[advancingDoublesKey] = (aggStats[gK].advancingDoubles[advancingDoublesKey] || 0) + 1;
                }
            }
            
            // --- Knockout Stage Simulation (if defined) ---
            const knockoutResult = simulateKnockoutStage(knockoutFormat, rankedTables, eloParams);

            if (knockoutResult.stageParticipants) {
                Object.entries(knockoutResult.stageParticipants).forEach(([roundName, participants]) => {
                    const stageKey = knockoutFormat.stages[roundName];
                    if (stageKey) {
                        participants.forEach(pName => {
                            if (aggStats[pName]) { // Increment global stage participation count
                                aggStats[pName][stageKey]++;
                            }
                        });
                    }
                });
            }
            if (knockoutResult.winner && aggStats[knockoutResult.winner]) {
                aggStats[knockoutResult.winner].winner++; // Increment overall winner count
            }
            
            // Update progress bar
            if (i % updateInterval === 0 || i === numSims - 1) {
                const percentComplete = Math.round(((i + 1) / numSims) * 100);
                progressBarEl.style.width = `${percentComplete}%`;
                progressBarEl.textContent = `${percentComplete}%`;
                // Yield to allow UI to update (non-blocking)
                await new Promise(resolve => setTimeout(resolve, 0)); 
            }
        }
        return aggStats;
    }

    // --- Display Logic (Simulator) ---
    function displayResults(aggStats, numSims) {
        let html = '';
        // Sort group keys alphabetically for consistent display
        const sortedGroupKeys = Object.keys(groupedMatches).sort();

        // Display Group Stage Results
        for (const groupKey of sortedGroupKeys) {
            const groupData = aggStats[groupKey];
            if (!groupData) continue; // Skip if no data for the group
            html += `<div class="mb-8 p-4 bg-white border border-gray-200 rounded-lg shadow"><h3 class="text-lg font-semibold text-indigo-600 mb-3">Group ${groupKey}</h3>`;
            
            // Expected Team Stats Table
            html += `<h4 class="font-medium text-gray-700 mt-4 mb-1">Expected Team Stats:</h4>
            <table class="min-w-full divide-y divide-gray-200 mb-3 text-xs sm:text-sm">
                <thead class="bg-gray-50">
                    <tr>
                        ${['Team', 'E(Pts)', 'E(W)', 'E(D)', 'E(L)', 'E(GF)', 'E(GA)', 'P(Unbeaten)', 'P(Most GF)', 'P(Most GA)'].map(h => `<th class="px-2 py-2 text-left font-medium text-gray-500 tracking-wider">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">`;
            
            // Sort teams by their expected points for better readability
            const teamsInGroupSorted = [...(groupTeamNames[groupKey] || [])].sort((a, b) => {
                const avgPtsA = (groupData[a]?.ptsSims.length > 0 && numSims > 0) ? groupData[a].ptsSims.reduce((sum, val) => sum + val, 0) / numSims : 0;
                const avgPtsB = (groupData[b]?.ptsSims.length > 0 && numSims > 0) ? groupData[b].ptsSims.reduce((sum, val) => sum + val, 0) / numSims : 0;
                return avgPtsB - avgPtsA;
            });

            teamsInGroupSorted.forEach(teamName => {
                const ts = groupData[teamName]; // Team specific aggregated stats
                if (!ts || !ts.ptsSims) return; // Skip if no simulation data for team

                // Calculate averages
                const avgPts = (ts.ptsSims.length > 0 && numSims > 0) ? ts.ptsSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgWins = (ts.winsSims && ts.winsSims.length > 0 && numSims > 0) ? ts.winsSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgDraws = (ts.drawsSims && ts.drawsSims.length > 0 && numSims > 0) ? ts.drawsSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgLosses = (ts.lossesSims && ts.lossesSims.length > 0 && numSims > 0) ? ts.lossesSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgGF = (ts.gfSims.length > 0 && numSims > 0) ? ts.gfSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgGA = (ts.gaSims.length > 0 && numSims > 0) ? ts.gaSims.reduce((a, b) => a + b, 0) / numSims : 0;
                
                // Get probability of team having most GF/GA in the group
                const probMostGF = (groupData.mostGroupGFTeam[teamName] || 0) / numSims;
                const probMostGA = (groupData.mostGroupGATeam[teamName] || 0) / numSims;

                html += `<tr>
                            <td class="px-2 py-2 whitespace-nowrap font-medium">${teamName}</td>
                            <td class="px-2 py-2">${avgPts.toFixed(2)}</td>
                            <td class="px-2 py-2">${avgWins.toFixed(2)}</td>
                            <td class="px-2 py-2">${avgDraws.toFixed(2)}</td>
                            <td class="px-2 py-2">${avgLosses.toFixed(2)}</td>
                            <td class="px-2 py-2">${avgGF.toFixed(2)}</td>
                            <td class="px-2 py-2">${avgGA.toFixed(2)}</td>
                            <td class="px-2 py-2">${(numSims > 0 ? ts.unbeatenCount / numSims * 100 : 0).toFixed(1)}%</td>
                            <td class="px-2 py-2">${(probMostGF * 100).toFixed(1)}%</td>
                            <td class="px-2 py-2">${(probMostGA * 100).toFixed(1)}%</td>
                        </tr>`;
            });
            html += `</tbody></table>`;

            // Group Total Goals
            const avgGroupGoals = (groupData.groupTotalGoalsSims && groupData.groupTotalGoalsSims.length > 0 && numSims > 0) ? groupData.groupTotalGoalsSims.reduce((a, b) => a + b, 0) / numSims : 0;
            html += `<p class="mt-2 text-sm"><strong>Expected Total Goals in Group ${groupKey}:</strong> ${avgGroupGoals.toFixed(2)}</p>`;
            
            // Straight Forecasts
            const allSF = Object.entries(groupData.straightForecasts || {}).sort(([, a], [, b]) => b - a);
            html += `<h4 class="font-medium text-gray-700 mt-4 mb-1">All Straight Forecasts (1st-2nd):</h4>
                     <ul class="list-disc list-inside text-sm max-h-40 overflow-y-auto">
                        ${allSF.map(([k, c]) => `<li>${k}: ${(numSims > 0 ? c / numSims * 100 : 0).toFixed(1)}%</li>`).join('') || 'N/A'}
                     </ul>`;
            
            // Top Advancing Doubles
            const topAD = Object.entries(groupData.advancingDoubles || {}).sort(([, a], [, b]) => b - a).slice(0, 10); // Top 10
            html += `<h4 class="font-medium text-gray-700 mt-4 mb-1">Top Advancing Doubles (Top 2 Any Order):</h4>
                     <ul class="list-disc list-inside text-sm">
                        ${topAD.map(([k, c]) => `<li>${k}: ${(numSims > 0 ? c / numSims * 100 : 0).toFixed(1)}%</li>`).join('') || 'N/A'}
                     </ul>`;
            html += `</div>`;
        }
        resultsContentEl.innerHTML = html || "<p>No results to display. Please parse data and run simulation.</p>";
    }

    // Function to calculate odds with a bookmaker's margin
    function calculateOddWithMargin(trueProb, marginDec) {
        if (trueProb <= 0 || !isFinite(trueProb)) return "N/A"; // Handle invalid probabilities
        const oddNoMargin = 1 / trueProb; // True odds
        // Apply margin: (1 / (prob + (1-prob)/oddNoMargin * margin))
        // Simplified: (1 / (trueProb * (1 + marginDec))) if margin is directly on probability
        // The current formula seems to distribute the margin over the implied probability
        return (1 / (trueProb * (1 + marginDec))).toFixed(2); // This is a more standard way to apply margin
    }
    
    // Function to calculate odds for a two-way market (e.g., Over/Under)
    function calculateTwoWayMarketOdds(prob1, prob2, marginDecimal) {
        if (prob1 <= 0 && prob2 <= 0) return { odd1: "N/A", odd2: "N/A" };

        const totalProb = prob1 + prob2;
        if (totalProb === 0) return { odd1: "N/A", odd2: "N/A" };

        const overround = 1 + marginDecimal; // The total implied probability the bookmaker wants (e.g., 1.05 for 5% margin)

        // Adjust probabilities to sum to 'overround' instead of 1
        const newProb1 = prob1 * overround / totalProb;
        const newProb2 = prob2 * overround / totalProb;

        // Calculate odds from adjusted probabilities
        const odd1 = newProb1 > 0 ? (1 / newProb1).toFixed(2) : "N/A";
        const odd2 = newProb2 > 0 ? (1 / newProb2).toFixed(2) : "N/A";

        return { odd1, odd2 };
    }

    // Populates the group selection dropdown for the "Simulated Odds" tab
    function populateSimGroupSelect() {
        const lang = currentLang;
        const selectGroupText = lang === 'sr' ? "-- Izaberi Grupu --" : "-- Select Group --";
        const runSimFirstText = lang === 'sr' ? "-- Prvo pokreni simulaciju --" : "-- Run Sim First --";

        simGroupSelectEl.innerHTML = `<option value="">${Object.keys(simulationAggStats).length > 0 ? selectGroupText : runSimFirstText}</option>`;

        if (Object.keys(simulationAggStats).length > 0) {
            Object.keys(groupedMatches).sort().forEach(groupKey => {
                const option = document.createElement('option');
                option.value = groupKey;
                option.textContent = `Group ${groupKey}`;
                simGroupSelectEl.appendChild(option);
            });
        }
    }

    // Event listener for when a group is selected in the "Simulated Odds" tab
    simGroupSelectEl.addEventListener('change', () => {
        const selectedGroupKey = simGroupSelectEl.value;
        const lang = currentLang;
        const selectTeamText = lang === 'sr' ? "-- Izaberi Tim --" : "-- Select Team --";
        simTeamSelectEl.innerHTML = `<option value="">${selectTeamText}</option>`;

        // Hide custom prop inputs and clear results when group changes
        customProbInputsContainerEl.classList.add('hidden');
        customProbAndOddResultAreaEl.innerHTML = "";
        document.getElementById('teamStatDistributionContainer').classList.add('hidden');

        if (selectedGroupKey && groupTeamNames[selectedGroupKey]) {
            generateGroupCsvButtonEl.disabled = false; // Enable group CSV button
            groupTeamNames[selectedGroupKey].forEach(teamName => {
                const option = document.createElement('option');
                option.value = teamName;
                option.textContent = teamName;
                simTeamSelectEl.appendChild(option);
            });
            simTeamSelectEl.disabled = false; // Enable team select dropdown
        } else {
            simTeamSelectEl.disabled = true;
            generateGroupCsvButtonEl.disabled = true;
        }
        // Clear O/U sections when group selection changes
        document.getElementById('ouTotalGroupGoalsResult').innerHTML = '';
        document.getElementById('expectedTotalGroupGoals').textContent = '';
        document.getElementById('ouFirstPlacePtsResult').innerHTML = '';
        document.getElementById('expectedFirstPlacePts').textContent = '';
        document.getElementById('ouLastPlacePtsResult').innerHTML = '';
        document.getElementById('expectedLastPlacePts').textContent = '';
        document.getElementById('ouFirstPlaceGFResult').innerHTML = '';
        document.getElementById('expectedFirstPlaceGF').textContent = '';
        document.getElementById('ouLastPlaceGFResult').innerHTML = '';
        document.getElementById('expectedLastPlaceGF').textContent = '';
    });

    // Displays the distribution of a selected team's stats
    function displayTeamStatDistribution(teamData, marginDecimal, numSims) {
        const container = document.getElementById('teamStatDistributionContainer');
        const content = document.getElementById('teamStatDistributionContent');

        if (!teamData || numSims === 0) {
            container.classList.add('hidden');
            return;
        }

        let html = '';
        // Define which stats to display distributions for
        const statTypes = [
            { key: 'ptsSims', title: 'Points' },
            { key: 'gfSims', title: 'Goals For' },
            { key: 'winsSims', title: 'Wins' },
            { key: 'drawsSims', title: 'Draws' },
            { key: 'lossesSims', title: 'Losses' },
            { key: 'unbeatenCount', title: 'Unbeaten (Prob)'} // Include unbeaten in distribution
        ];

        statTypes.forEach(stat => {
            const simValues = teamData[stat.key];
            if (!simValues && stat.key !== 'unbeatenCount') return; // For array types, check for values

            let tableHtml = `<div><h4 class="font-medium text-gray-700 mt-4 mb-1">${stat.title} Distribution:</h4>`;
            tableHtml += `<table class="odds-table text-xs sm:text-sm"><thead><tr><th>Outcome</th><th>Prob.</th><th>Odd</th></tr></thead><tbody>`;

            const valueCounts = {};
            // Special handling for 'unbeatenCount' as it's a direct count, not an array of values
            if (stat.key === 'unbeatenCount') {
                const prob = simValues / numSims;
                const odd = calculateOddWithMargin(prob, marginDecimal);
                tableHtml += `<tr><td>Yes</td><td>${(prob * 100).toFixed(1)}%</td><td>${odd}</td></tr>`;
                tableHtml += `<tr><td>No</td><td>${((1 - prob) * 100).toFixed(1)}%</td><td>${calculateOddWithMargin(1 - prob, marginDecimal)}</td></tr>`;
            } else {
                simValues.forEach(val => {
                    valueCounts[val] = (valueCounts[val] || 0) + 1;
                });

                const sortedKeys = Object.keys(valueCounts).map(Number).sort((a, b) => a - b);

                if (sortedKeys.length === 0) {
                    tableHtml += `<tr><td colspan="3" class="text-center text-gray-500">No data</td></tr>`;
                } else {
                    for (const value of sortedKeys) {
                        const count = valueCounts[value];
                        const prob = count / numSims;
                        // Only show outcomes with at least 0.1% probability
                        if (prob < 0.001) continue; 
                        const odd = calculateOddWithMargin(prob, marginDecimal);
                        tableHtml += `<tr>
                                    <td>${value}</td>
                                    <td>${(prob * 100).toFixed(1)}%</td>
                                    <td>${odd}</td>
                                 </tr>`;
                    }
                }
            }
            tableHtml += `</tbody></table></div>`;
            html += tableHtml;
        });

        content.innerHTML = html;
        container.classList.remove('hidden'); // Show the container
    }

    // Event listener for when a team is selected in the "Simulated Odds" tab
    simTeamSelectEl.addEventListener('change', () => {
        const teamName = simTeamSelectEl.value;
        const groupKey = simGroupSelectEl.value;
        const marginPercent = parseFloat(simBookieMarginEl.value);
        const marginDecimal = isNaN(marginPercent) ? 0.05 : marginPercent / 100; // Default margin 5%

        if (teamName) {
            customProbInputsContainerEl.classList.remove('hidden'); // Show custom prop inputs
            generateTeamCsvButtonEl.disabled = false; // Enable team CSV button
            customProbAndOddResultAreaEl.innerHTML = ""; // Clear previous custom prop results

            const teamData = simulationAggStats[groupKey]?.[teamName];
            displayTeamStatDistribution(teamData, marginDecimal, currentNumSims); // Show stat distributions
        } else {
            customProbInputsContainerEl.classList.add('hidden');
            generateTeamCsvButtonEl.disabled = true;
            document.getElementById('teamStatDistributionContainer').classList.add('hidden');
        }
    });

    // Event listener for the "Show/Refresh Market Odds" button
    showSimulatedOddsButtonEl.addEventListener('click', () => {
        const selectedGroupKey = simGroupSelectEl.value;
        const mainMarginPercent = parseFloat(simBookieMarginEl.value);

        simulatedOddsStatusEl.textContent = ""; // Clear status messages
        calculatedOddsResultContentEl.innerHTML = ""; // Clear previous results

        if (isNaN(mainMarginPercent) || mainMarginPercent < 0) {
            simulatedOddsStatusEl.textContent = "Please enter a valid non-negative margin for Main Bookmaker Margin.";
            return;
        }
        if (Object.keys(simulationAggStats).length === 0 || currentNumSims === 0) { 
            simulatedOddsStatusEl.textContent = "No simulation data available. Please run a simulation first."; 
            return; 
        }
        
        const mainMarginDecimal = mainMarginPercent / 100;
        let html = '';

        // --- Knockout Odds Display ---
        const knockoutFormat = knockoutBrackets[knockoutFormatEl.value];
        if (knockoutFormat && knockoutFormat.stages) {
            const stages = knockoutFormat.stages;
            html += `<h3 class="text-lg font-semibold text-purple-600 mb-2">Tournament Winner & Stage Odds</h3>`;

            // Dynamic headers based on defined stages in the selected knockout format
            let headers = `<th>Team</th><th>Win Tourn.</th>`;
            if (stages.reachesFinal) headers += `<th>Reach Final</th>`;
            if (stages.reachesSF) headers += `<th>Reach SF</th>`;
            if (stages.reachesQF) headers += `<th>Reach QF</th>`;
            if (stages.reachesR16) headers += `<th>Reach R16</th>`;

            html += `<table class="odds-table text-xs sm:text-sm"><thead><tr>${headers}</tr></thead><tbody>`;
            
            // Sort teams by their probability of winning the tournament
            const sortedTeams = Array.from(allTeams).sort((a,b) => (simulationAggStats[b]?.winner || 0) - (simulationAggStats[a]?.winner || 0));

            sortedTeams.forEach(teamName => {
                const teamStats = simulationAggStats[teamName];
                if (!teamStats) return;

                // Calculate probabilities for each stage
                const pWin = (teamStats.winner || 0) / currentNumSims;
                const pFinal = (teamStats.reachesFinal || 0) / currentNumSims;
                const pSF = (teamStats.reachesSF || 0) / currentNumSims;
                const pQF = (teamStats.reachesQF || 0) / currentNumSims;
                const pR16 = (teamStats.reachesR16 || 0) / currentNumSims;

                let rowHtml = `<tr><td class="font-medium">${teamName}</td>`;
                rowHtml += `<td>${calculateOddWithMargin(pWin, mainMarginDecimal)} <span class="text-gray-400">(${(pWin * 100).toFixed(1)}%)</span></td>`;
                if (stages.reachesFinal) rowHtml += `<td>${calculateOddWithMargin(pFinal, mainMarginDecimal)} <span class="text-gray-400">(${(pFinal * 100).toFixed(1)}%)</span></td>`;
                if (stages.reachesSF) rowHtml += `<td>${calculateOddWithMargin(pSF, mainMarginDecimal)} <span class="text-gray-400">(${(pSF * 100).toFixed(1)}%)</span></td>`;
                if (stages.reachesQF) rowHtml += `<td>${calculateOddWithMargin(pQF, mainMarginDecimal)} <span class="text-gray-400">(${(pQF * 100).toFixed(1)}%)</span></td>`;
                if (stages.reachesR16) rowHtml += `<td>${calculateOddWithMargin(pR16, mainMarginDecimal)} <span class="text-gray-400">(${(pR16 * 100).toFixed(1)}%)</span></td>`;
                rowHtml += '</tr>';
                html += rowHtml;
            });
            html += `</tbody></table>`;
        }
        
        // --- Group Odds Display ---
        if (selectedGroupKey) {
            const groupData = simulationAggStats[selectedGroupKey];
            const teams = groupTeamNames[selectedGroupKey] || [];
            if (!groupData || teams.length === 0) { 
                simulatedOddsStatusEl.textContent = "Group data incomplete or no teams found in the selected group.";
            } else {
                html += `<h3 class="text-lg font-semibold text-purple-600 mb-2 mt-6">Market Odds for Group ${selectedGroupKey}</h3>`;

                const numTeams = teams.length;
                let standingHeaders = '<th>Team</th>';
                const getOrdinal = (n) => { // Helper to get ordinal suffix (1st, 2nd, 3rd, etc.)
                    const s = ["th", "st", "nd", "rd"], v = n % 100;
                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                }
                for (let i = 1; i <= numTeams; i++) {
                    standingHeaders += `<th>${getOrdinal(i)} Place</th>`;
                }

                html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Team Standings Odds:</h4>
                         <table class="odds-table text-xs sm:text-sm">
                            <thead><tr>${standingHeaders}</tr></thead>
                            <tbody>`;
                
                // Sort teams by their probability of finishing 1st for better order
                teams.sort((a,b) => (groupData[b]?.posCounts[0] || 0) - (groupData[a]?.posCounts[0] || 0)).forEach(tN => {
                    html += `<tr><td class="font-medium">${tN}</td>`;
                    for (let i = 0; i < numTeams; i++) {
                        const teamStats = groupData[tN];
                        const teamProb = (teamStats && teamStats.posCounts && currentNumSims > 0) ? (teamStats.posCounts[i] || 0) / currentNumSims : 0;
                        const odd = calculateOddWithMargin(teamProb, mainMarginDecimal);
                        html += `<td>${odd} <span class="text-gray-400">(${(teamProb * 100).toFixed(1)}%)</span></td>`;
                    }
                    html += `</tr>`;
                });
                html += `</tbody></table>`;

                html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">To Qualify (Top 2):</h4>
                         <table class="odds-table text-xs sm:text-sm">
                            <thead><tr><th>Team</th><th>P(Qualify)</th><th>Odd</th></tr></thead>
                            <tbody>`;
                teams.forEach(tN => { 
                    const teamStats = groupData[tN];
                    // Probability to qualify is sum of P(1st) and P(2nd)
                    const teamProbQualify = (teamStats && teamStats.posCounts && currentNumSims > 0) ? ((teamStats.posCounts[0] || 0) + (teamStats.posCounts[1] || 0)) / currentNumSims : 0; 
                    const oddQualify = calculateOddWithMargin(teamProbQualify, mainMarginDecimal); 
                    html += `<tr><td>${tN}</td><td>${(teamProbQualify * 100).toFixed(1)}%</td><td>${oddQualify}</td></tr>`; 
                }); 
                html += `</tbody></table>`;

                // Display Most Scored / Most Conceded Odds
                html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Most Goals Scored in Group:</h4>
                         <table class="odds-table text-xs sm:text-sm">
                            <thead><tr><th>Team</th><th>P(Most GF)</th><th>Odd</th></tr></thead>
                            <tbody>`;
                teams.forEach(tN => {
                    const probMostGF = (groupData.mostGroupGFTeam[tN] || 0) / currentNumSims;
                    const oddMostGF = calculateOddWithMargin(probMostGF, mainMarginDecimal);
                    if (probMostGF > 0) { // Only display if there's a non-zero chance
                        html += `<tr><td>${tN}</td><td>${(probMostGF * 100).toFixed(1)}%</td><td>${oddMostGF}</td></tr>`;
                    }
                });
                html += `</tbody></table>`;

                html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Most Goals Conceded in Group:</h4>
                         <table class="odds-table text-xs sm:text-sm">
                            <thead><tr><th>Team</th><th>P(Most GA)</th><th>Odd</th></tr></thead>
                            <tbody>`;
                teams.forEach(tN => {
                    const probMostGA = (groupData.mostGroupGATeam[tN] || 0) / currentNumSims;
                    const oddMostGA = calculateOddWithMargin(probMostGA, mainMarginDecimal);
                    if (probMostGA > 0) { // Only display if there's a non-zero chance
                        html += `<tr><td>${tN}</td><td>${(probMostGA * 100).toFixed(1)}%</td><td>${oddMostGA}</td></tr>`;
                    }
                });
                html += `</tbody></table>`;

                // Display Straight Forecasts Odds
                const allSF = Object.entries(groupData.straightForecasts || {}).sort(([, a], [, b]) => b - a);
                if (allSF.length > 0) {
                    html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Straight Forecasts (1st-2nd) Odds:</h4>
                             <table class="odds-table text-xs sm:text-sm">
                                <thead><tr><th>Forecast</th><th>Prob.</th><th>Odd</th></tr></thead>
                                <tbody>`;
                    allSF.forEach(([forecast, count]) => {
                        const prob = count / currentNumSims;
                        if (prob >= 0.001) { // Only display if significant
                            const odd = calculateOddWithMargin(prob, mainMarginDecimal);
                            html += `<tr><td>${forecast}</td><td>${(prob * 100).toFixed(1)}%</td><td>${odd}</td></tr>`;
                        }
                    });
                    html += `</tbody></table>`;
                }

                // Display Advancing Doubles Odds
                const allAD = Object.entries(groupData.advancingDoubles || {}).sort(([, a], [, b]) => b - a);
                if (allAD.length > 0) {
                    html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Advancing Doubles (Top 2 Any Order) Odds:</h4>
                             <table class="odds-table text-xs sm:text-sm">
                                <thead><tr><th>Pair</th><th>Prob.</th><th>Odd</th></tr></thead>
                                <tbody>`;
                    allAD.forEach(([pair, count]) => {
                        const prob = count / currentNumSims;
                        if (prob >= 0.001) { // Only display if significant
                            const odd = calculateOddWithMargin(prob, mainMarginDecimal);
                            html += `<tr><td>${pair}</td><td>${(prob * 100).toFixed(1)}%</td><td>${odd}</td></tr>`;
                        }
                    });
                    html += `</tbody></table>`;
                }
            }
        }
        
        calculatedOddsResultContentEl.innerHTML = html || '<p>Select a group to see group-specific odds or ensure simulations have been run to see tournament odds.</p>';
        
        // --- Over/Under Markets ---
        const groupDataForOU = selectedGroupKey ? simulationAggStats[selectedGroupKey] : null;

        // Helper function to display Average and Over/Under odds for various group stats
        const displayAvgAndOU = (dataKey, expectedElId, resultElId) => {
            const resultElement = document.getElementById(resultElId);
            const expectedElement = document.getElementById(expectedElId);
            const ouBookieMarginEl = document.getElementById('ouBookieMargin');
            const ouMarginDecimal = parseFloat(ouBookieMarginEl.value) / 100;

            if (isNaN(ouMarginDecimal) || ouMarginDecimal < 0 || !groupDataForOU) {
                if (expectedElement) expectedElement.textContent = '';
                if (resultElement) resultElement.innerHTML = '';
                return;
            };

            if (groupDataForOU[dataKey] && groupDataForOU[dataKey].length > 0 && currentNumSims > 0) {
                const avg = groupDataForOU[dataKey].reduce((a, b) => a + b, 0) / currentNumSims;
                expectedElement.textContent = `(Avg: ${avg.toFixed(2)})`;

                // Determine relevant O/U lines around the average
                const centerLine = Math.round(avg) + 0.5; // Typical O/U lines are .5
                const lines = [centerLine - 1, centerLine, centerLine + 1].filter(l => l > 0.5); // Ensure lines are positive
                
                let ouHtml = `<table class="w-full text-center"><thead><tr class="text-gray-500"><th class="w-1/3">Line</th><th class="w-1/3">Over</th><th class="w-1/3">Under</th></tr></thead><tbody>`;

                lines.forEach(line => {
                    const overCount = groupDataForOU[dataKey].filter(val => val > line).length;
                    const underCount = groupDataForOU[dataKey].filter(val => val < line).length;
                    const probOver = overCount / currentNumSims;
                    const probUnder = underCount / currentNumSims;
                    
                    // Only include if probabilities are significant for the line
                    if (probOver >= 0.001 || probUnder >= 0.001) {
                        const { odd1: oddOver, odd2: oddUnder } = calculateTwoWayMarketOdds(probOver, probUnder, ouMarginDecimal);
                        ouHtml += `<tr><td>${line.toFixed(1)}</td><td>${oddOver}</td><td>${oddUnder}</td></tr>`;
                    }
                });
                ouHtml += `</tbody></table>`;
                resultElement.innerHTML = ouHtml; // Assign generated HTML to the element

            } else {
                 expectedElement.textContent = '';
                 resultElement.innerHTML = '';
            }
        };

        // Call the helper for each O/U market
        displayAvgAndOU('groupTotalGoalsSims', 'expectedTotalGroupGoals', 'ouTotalGroupGoalsResult');
        displayAvgAndOU('firstPlacePtsSims', 'expectedFirstPlacePts', 'ouFirstPlacePtsResult');
        displayAvgAndOU('lastPlacePtsSims', 'expectedLastPlacePts', 'ouLastPlacePtsResult');
        displayAvgAndOU('firstPlaceGFSims', 'expectedFirstPlaceGF', 'ouFirstPlaceGFResult');
        displayAvgAndOU('lastPlaceGFSims', 'expectedLastPlaceGF', 'ouLastPlaceGFResult');
    });

    // Event listener for "Calculate Custom Prop Odd" button
    calculateCustomProbAndOddButtonEl.addEventListener('click', () => {
        const groupKey = simGroupSelectEl.value;
        const teamName = simTeamSelectEl.value;
        const marginPercent = parseFloat(simBookieMarginEl.value);
        const statType = simCustomStatTypeEl.value;
        const operator = simCustomOperatorEl.value;
        const value1 = parseFloat(simCustomValue1El.value);
        let value2 = null;
        if (operator === 'between') value2 = parseFloat(simCustomValue2El.value);

        customProbAndOddResultAreaEl.innerHTML = ""; // Clear previous result

        // Input validation
        if (!groupKey || !teamName) { customProbAndOddResultAreaEl.innerHTML = '<p class="text-red-500">Please select a group and a team.</p>'; return; }
        if (isNaN(marginPercent) || marginPercent < 0) { customProbAndOddResultAreaEl.innerHTML = '<p class="text-red-500">Please enter a valid non-negative margin.</p>'; return; }
        if (isNaN(value1) || (operator === 'between' && isNaN(value2))) { customProbAndOddResultAreaEl.innerHTML = '<p class="text-red-500">Please enter valid numeric value(s) for the prop.</p>'; return; }
        if (operator === 'between' && value1 >= value2) { customProbAndOddResultAreaEl.innerHTML = '<p class="text-red-500">For "Between" operator, Value 1 must be less than Value 2.</p>'; return; }

        const teamData = simulationAggStats[groupKey]?.[teamName];
        // Check if simulation data exists for the selected team and stat type
        if (!teamData || (statType !== 'unbeatenCount' && (!teamData[statType] || !teamData[statType].length)) || (statType === 'unbeatenCount' && typeof teamData[statType] === 'undefined') || currentNumSims === 0) {
             customProbAndOddResultAreaEl.innerHTML = '<p class="text-gray-500">No simulation data available for this specific team and stat type.</p>';
             return;
        }

        let trueProbability;
        if (statType === 'unbeatenCount') {
            trueProbability = teamData.unbeatenCount / currentNumSims;
        } else {
            const simValues = teamData[statType];
            let metConditionCount = 0; // Counter for simulations meeting the condition

            // Evaluate the condition for each simulated value
            simValues.forEach(simVal => {
                let conditionMet = false;
                switch (operator) {
                    case '>': conditionMet = simVal > value1; break;
                    case '>=': conditionMet = simVal >= value1; break;
                    case '<': conditionMet = simVal < value1; break;
                    case '<=': conditionMet = simVal <= value1; break;
                    case '==': conditionMet = Math.abs(simVal - value1) < 0.001; break; // Use a small epsilon for float comparison
                    case 'between': conditionMet = simVal >= value1 && simVal <= value2; break;
                }
                if (conditionMet) metConditionCount++;
            });
            trueProbability = metConditionCount / currentNumSims;
        }

        const marginDecimal = marginPercent / 100;
        const odd = calculateOddWithMargin(trueProbability, marginDecimal);

        // Construct a readable description of the prop
        let propDescription;
        if (statType === 'unbeatenCount') {
            propDescription = `${teamName} is Unbeaten`;
        } else {
            propDescription = `${teamName} ${simCustomStatTypeEl.options[simCustomStatTypeEl.selectedIndex].text} ${operator} ${value1}`;
            if (operator === 'between') propDescription += ` and ${value2}`;
        }

        // Display results
        customProbAndOddResultAreaEl.innerHTML = `
            <p><strong>Prop:</strong> ${propDescription}</p>
            <p><strong>Simulated Probability:</strong> ${(trueProbability * 100).toFixed(1)}%</p>
            <p><strong>Calculated Odd (with ${marginPercent}% margin):</strong> ${odd}</p>`;
    });

    // --- Clear Button ---
    clearButtonEl.addEventListener('click', () => {
        // Get the currently selected round robin type before clearing
        const currentRoundRobinType = document.querySelector('input[name="roundRobinType"]:checked')?.value || 'double';

        // Reset all input fields
        matchDataEl.value = "";
        eloDataEl.value = "";
        matchResultsEl.value = "";
        numSimulationsEl.value = "10000"; // Default value
        
        // Clear status and results areas
        statusAreaEl.innerHTML = "";
        resultsContentEl.innerHTML = "";
        
        // Reset internal data structures
        parsedMatches = [];
        parsedResults = {};
        allTeams.clear();
        groupedMatches = {};
        groupTeamNames = {};
        simulationAggStats = {};
        currentNumSims = 0;
        
        // Disable/enable buttons as appropriate
        runButtonEl.disabled = true;
        parseButtonEl.disabled = false;
        
        // Hide progress bar
        progressContainerEl.classList.add('hidden');
        
        // Clear file input displays
        csvFileInputEl.value = null; csvFileNameEl.textContent = "No file selected.";
        eloCsvFileInputEl.value = null; eloCsvFileNameEl.textContent = "No file selected.";
        
        // Reset Elo model parameters to default values
        homeAdvantageEloEl.value = 80;
        eloPerGoalEl.value = 200;
        baselineTotalGoalsEl.value = 2.7;

        // Restore the round robin type selection after clearing
        document.querySelector(`input[name="roundRobinType"][value="${currentRoundRobinType}"]`).checked = true;
        roundRobinType = currentRoundRobinType; // Ensure the global variable is consistent

        // Reset and clear elements in the "Simulated Group Odds" tab
        populateSimGroupSelect(); // Resets group dropdown
        calculatedOddsResultContentEl.innerHTML = '';
        simulatedOddsStatusEl.textContent = "";
        customProbInputsContainerEl.classList.add('hidden');
        customProbAndOddResultAreaEl.innerHTML = "";
        document.getElementById('teamStatDistributionContainer').classList.add('hidden');
        
        // Clear O/U sections
        document.getElementById('ouTotalGroupGoalsResult').innerHTML = '';
        document.getElementById('expectedTotalGroupGoals').textContent = '';
        document.getElementById('ouFirstPlacePtsResult').innerHTML = '';
        document.getElementById('expectedFirstPlacePts').textContent = '';
        document.getElementById('ouLastPlacePtsResult').innerHTML = '';
        document.getElementById('expectedLastPlacePts').textContent = '';
        document.getElementById('ouFirstPlaceGFResult').innerHTML = '';
        document.getElementById('expectedFirstPlaceGF').textContent = '';
        document.getElementById('ouLastPlaceGFResult').innerHTML = '';
        document.getElementById('expectedLastPlaceGF').textContent = '';
    });

    // --- Initial Sample Data ---
    // Pre-fill the odds input with sample double round-robin data
    matchDataEl.value = `A;Al Ahly;Inter Miami;3.5;3.67;2;2.15;1.68
A;Palmeiras;Porto;2.4;3.25;3.15;1.72;2.15
A;Palmeiras;Al Ahly;1.65;3.65;5.5;1.8;2
A;Porto;Inter Miami;2.1;3.35;3.6;1.9;1.9
A;Al Ahly;Porto;3.2;3.2;2.1;1.7;2.1
A;Inter Miami;Palmeiras;4.5;4;1.7;2.05;1.75
`;
    // Add sample Elo data
    eloDataEl.value = `A, Germany, 2100
A, Scotland, 1850
A, Hungary, 1750
A, Switzerland, 1900
B, France, 2200
B, Spain, 2150
`;


    window.openTab = openTab; // Make openTab globally accessible (for onclick in HTML)

    // Event listener for custom operator dropdown (show/hide Value 2 input for 'Between')
    simCustomOperatorEl.addEventListener('change', () => {
        if (simCustomOperatorEl.value === 'between') simCustomValue2El.classList.remove('hidden');
        else simCustomValue2El.classList.add('hidden');
    });

    // --- CSV Generation for Team Stats ---
    generateTeamCsvButtonEl.addEventListener('click', () => {
        const groupKey = simGroupSelectEl.value;
        const teamName = simTeamSelectEl.value;
        const marginPercent = parseFloat(simBookieMarginEl.value);
        const marginDecimal = isNaN(marginPercent) ? 0 : marginPercent / 100;
        
        if (!groupKey || !teamName || isNaN(marginDecimal) || marginDecimal < 0) {
            statusAreaEl.innerHTML = `<p class="text-red-500">Please select a group and team and ensure a valid margin is set.</p>`;
            return;
        }

        const teamData = simulationAggStats[groupKey]?.[teamName];
        if (!teamData) {
            statusAreaEl.innerHTML = `<p class="text-red-500">No simulation data for the selected team.</p>`;
            return;
        }

        let csvContent = `Date,Time,Market,Odd1,Odd2,Odd3\n`;
        const toCsvRow = (market, odd1 = '', odd2 = '', odd3 = '') => `"15.6.2025","02:00","${market}",${odd1},${odd2},${odd3}\n`;

        // Add Group Winner and To Qualify odds
        csvContent += toCsvRow("Group Winner", calculateOddWithMargin((teamData.posCounts[0] || 0) / currentNumSims, marginDecimal));
        csvContent += toCsvRow("To Qualify", calculateOddWithMargin(((teamData.posCounts[0] || 0) + (teamData.posCounts[1] || 0)) / currentNumSims, marginDecimal));
        // Add Unbeaten odd
        csvContent += toCsvRow("Unbeaten in Group", teamName, calculateOddWithMargin(teamData.unbeatenCount / currentNumSims, marginDecimal));


        // Add distribution odds for various stats
        const statTypes = [
            { key: 'ptsSims', title: 'Points' },
            { key: 'gfSims', title: 'Goals For' },
            { key: 'winsSims', title: 'Wins' },
            { key: 'drawsSims', title: 'Draws' },
            { key: 'lossesSims', title: 'Losses' },
            { key: 'gaSims', title: 'Goals Against' } 
        ];

        statTypes.forEach(stat => {
            const simValues = teamData[stat.key];
            if (!simValues && stat.key !== 'unbeatenCount') return; // Ensure simValues is not empty or undefined

            if (stat.key === 'unbeatenCount') { // Special handling for unbeatenCount for CSV
                const prob = simValues / currentNumSims;
                if (prob >= 0.001) {
                    csvContent += toCsvRow(`${stat.title} - Yes`, calculateOddWithMargin(prob, marginDecimal));
                }
            } else {
                const valueCounts = {};
                simValues.forEach(val => { valueCounts[val] = (valueCounts[val] || 0) + 1; });
                const sortedKeys = Object.keys(valueCounts).map(Number).sort((a, b) => a - b);

                sortedKeys.forEach(value => {
                    const count = valueCounts[value];
                    const prob = count / currentNumSims;
                    if (prob >= 0.001) { 
                        csvContent += toCsvRow(`${stat.title} - Exactly ${value}`, calculateOddWithMargin(prob, marginDecimal));
                    }
                });
            }
        });

        // Add Most GF/GA for the specific team (if it's the team with most GF/GA in group)
        const probTeamMostGF = (simulationAggStats[groupKey].mostGroupGFTeam[teamName] || 0) / currentNumSims;
        if (probTeamMostGF >= 0.001) {
            csvContent += toCsvRow("Most GF in Group", teamName, calculateOddWithMargin(probTeamMostGF, marginDecimal));
        }
        const probTeamMostGA = (simulationAggStats[groupKey].mostGroupGATeam[teamName] || 0) / currentNumSims;
        if (probTeamMostGA >= 0.001) {
            csvContent += toCsvRow("Most GA in Group", teamName, calculateOddWithMargin(probTeamMostGA, marginDecimal));
        }


        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `odds_${teamName.replace(/\s+/g, '_')}_${groupKey}_stats.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        statusAreaEl.innerHTML = `<p class="text-green-500">CSV for ${teamName} generated successfully.</p>`;
    });

    // --- CSV Generation for Group Odds ---
    generateGroupCsvButtonEl.addEventListener('click', () => {
        const groupKey = simGroupSelectEl.value;
        const marginPercent = parseFloat(simBookieMarginEl.value);
        const marginDecimal = isNaN(marginPercent) ? 0 : marginPercent / 100;
        
        if (!groupKey || isNaN(marginDecimal) || marginDecimal < 0) {
            statusAreaEl.innerHTML = `<p class="text-red-500">Please select a group and ensure a valid margin is set.</p>`;
            return;
        }

        const groupData = simulationAggStats[groupKey];
        const teams = groupTeamNames[groupKey] || [];
        if (!groupData || teams.length === 0) {
            statusAreaEl.innerHTML = `<p class="text-red-500">No simulation data for the selected group.</p>`;
            return;
        }

        let csvContent = `LEAGUE_NAME: Group ${groupKey}\n`;
        const toCsvRow = (market, submarket, odd1 = '', odd2 = '', odd3 = '') => `"15.6.2025","02:00","${market}","${submarket}",${odd1},${odd2},${odd3}\n`;

        // Group Winner Odds
        teams.forEach(tN => {
            const teamStats = groupData[tN];
            const prob1st = (teamStats && teamStats.posCounts && currentNumSims > 0) ? (teamStats.posCounts[0] || 0) / currentNumSims : 0;
            if (prob1st >= 0.001) {
                csvContent += toCsvRow("Group Winner", tN, calculateOddWithMargin(prob1st, marginDecimal));
            }
        });

        // To Qualify Odds (Top 2)
        teams.forEach(tN => {
            const teamStats = groupData[tN];
            const probQualify = (teamStats && teamStats.posCounts && currentNumSims > 0) ? ((teamStats.posCounts[0] || 0) + (teamStats.posCounts[1] || 0)) / currentNumSims : 0;
            if (probQualify >= 0.001) {
                csvContent += toCsvRow("To Qualify", tN, calculateOddWithMargin(probQualify, marginDecimal));
            }
        });

        // Over/Under Total Group Goals
        const groupTotalGoals = groupData.groupTotalGoalsSims;
        if (groupTotalGoals && groupTotalGoals.length > 0) {
            const avgGoals = groupTotalGoals.reduce((a, b) => a + b, 0) / currentNumSims;
            const centerLine = Math.round(avgGoals) + 0.5;
            const lines = [centerLine - 1, centerLine, centerLine + 1].filter(l => l > 0.5);

            lines.forEach(line => {
                const overCount = groupTotalGoals.filter(val => val > line).length;
                const underCount = groupTotalGoals.filter(val => val < line).length;
                const probOver = overCount / currentNumSims;
                const probUnder = underCount / currentNumSims;
                
                // Only include if probabilities are significant for the line
                if (probOver >= 0.001 || probUnder >= 0.001) {
                    const { odd1: oddOver, odd2: oddUnder } = calculateTwoWayMarketOdds(probOver, probUnder, marginDecimal);
                    if (oddOver !== "N/A") csvContent += toCsvRow("Total Group Goals", `O ${line.toFixed(1)}`, oddOver);
                    if (oddUnder !== "N/A") csvContent += toCsvRow("Total Group Goals", `U ${line.toFixed(1)}`, oddUnder);
                }
            });
        }
        
        // Most Goals Scored in Group
        teams.forEach(tN => {
            const probMostGF = (groupData.mostGroupGFTeam[tN] || 0) / currentNumSims;
            if (probMostGF >= 0.001) {
                csvContent += toCsvRow("Most GF in Group", tN, calculateOddWithMargin(probMostGF, marginDecimal));
            }
        });

        // Most Goals Conceded in Group
        teams.forEach(tN => {
            const probMostGA = (groupData.mostGroupGATeam[tN] || 0) / currentNumSims;
            if (probMostGA >= 0.001) {
                csvContent += toCsvRow("Most GA in Group", tN, calculateOddWithMargin(probMostGA, marginDecimal));
            }
        });

        // Straight Forecasts (1st-2nd)
        const allSF = Object.entries(groupData.straightForecasts || {}).sort(([, a], [, b]) => b - a);
        allSF.forEach(([forecast, count]) => {
            const prob = count / currentNumSims;
            if (prob >= 0.001) {
                csvContent += toCsvRow("Straight Forecast", forecast, calculateOddWithMargin(prob, marginDecimal));
            }
        });

        // Advancing Doubles (Top 2 Any Order)
        const allAD = Object.entries(groupData.advancingDoubles || {}).sort(([, a], [, b]) => b - a);
        allAD.forEach(([pair, count]) => {
            const prob = count / currentNumSims;
            if (prob >= 0.001) {
                csvContent += toCsvRow("Advancing Double", pair, calculateOddWithMargin(prob, marginDecimal));
            }
        });


        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `group_odds_${groupKey}_full.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        statusAreaEl.innerHTML = `<p class="text-green-500">CSV for Group ${groupKey} generated successfully.</p>`;
    });
});
