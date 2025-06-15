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
    let parsedMatches = [], allTeams = new Set(), groupedMatches = {}, groupTeamNames = {}, simulationAggStats = {}, currentNumSims = 0, parsedResults = {};
    let currentLang = 'en';

    // --- DOM Elements ---
    const matchDataEl = document.getElementById('matchData'), numSimulationsEl = document.getElementById('numSimulations'), matchResultsEl = document.getElementById('matchResults');
    const parseButtonEl = document.getElementById('parseButton'), runButtonEl = document.getElementById('runButton'), clearButtonEl = document.getElementById('clearButton');
    const statusAreaEl = document.getElementById('statusArea'), resultsContentEl = document.getElementById('resultsContent');
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
    const progressContainerEl = document.getElementById('progressContainer');
    const progressBarEl = document.getElementById('progressBar');

    document.querySelector('.tab-button').click();

    // --- CSV File Input ---
    csvFileInputEl.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            csvFileNameEl.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (e) => { matchDataEl.value = e.target.result; statusAreaEl.innerHTML = `<p class="text-blue-500">CSV loaded. Click "Parse & Validate Data".</p>`; };
            reader.onerror = (e) => { statusAreaEl.innerHTML = `<p class="text-red-500">Error reading file: ${e.target.error.name}</p>`; csvFileNameEl.textContent = "No file selected."; };
            reader.readAsText(file);
        } else { csvFileNameEl.textContent = "No file selected."; }
    });

    // --- xG Calculation & Helpers ---
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

    function calculateModelProbsFromXG(homeXG, awayXG, goalLine = 2.5) {
        let probHomeWin = 0, probAwayWin = 0, probDraw = 0;
        let probUnder = 0, probOver = 0;
        const maxGoals = 20;

        for (let i = 0; i <= maxGoals; i++) {
            for (let j = 0; j <= maxGoals; j++) {
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
        const normalisedUnder = (1 / underPrice) / ((1 / overPrice) + (1 / underPrice));
        const normalisedHomeNoDraw = (1 / homePrice) / ((1 / awayPrice) + (1 / homePrice));

        let totalGoals = 2.5;
        let supremacy = 0;

        const bisectionMaxIter = 50;

        for (let iter = 0; iter < 5; iter++) {

            let lowTG = 0.5, highTG = 8.0;
            for (let i = 0; i < bisectionMaxIter; i++) {
                let midTG = (lowTG + highTG) / 2;
                if (midTG <= 0) break;

                const tempHomeXG = Math.max(0.01, midTG / 2 + supremacy / 2);
                const tempAwayXG = Math.max(0.01, midTG / 2 - supremacy / 2);
                if (tempHomeXG <= 0 || tempAwayXG <= 0) {
                    if (supremacy > 0) highTG = midTG; else lowTG = midTG;
                    continue;
                }

                const output = calculateModelProbsFromXG(tempHomeXG, tempAwayXG);

                if (output.modelProbUnderNoExact > normalisedUnder) {
                    lowTG = midTG;
                } else {
                    highTG = midTG;
                }

                if (Math.abs(lowTG - highTG) < 0.0001) break;
            }
            totalGoals = (lowTG + highTG) / 2;

            let lowSup = -(totalGoals - 0.02);
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

                if (Math.abs(lowSup - highSup) < 0.0001) break;
            }
            supremacy = (lowSup + highSup) / 2;
        }

        const homeExpectedGoals = Math.max(0.01, totalGoals / 2 + supremacy / 2);
        const awayExpectedGoals = Math.max(0.01, totalGoals / 2 - supremacy / 2);

        return { homeXG: homeExpectedGoals, awayXG: awayExpectedGoals };
    }


    // --- Parsing Logic (Simulator) ---
    parseButtonEl.addEventListener('click', () => {
        const data = matchDataEl.value.trim(); if (!data) { statusAreaEl.innerHTML = '<p class="text-red-500">Error: Match data empty.</p>'; return; }
        const lines = data.split('\n'); parsedMatches = []; allTeams.clear(); groupedMatches = {}; groupTeamNames = {};
        let errors = [], warnings = [];
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
                const vsIdx = parts.indexOf('vs');
                if (vsIdx !== -1) {
                    if (vsIdx > 0 && vsIdx < parts.length - 5) { group = parts[0]; team1Name = parts.slice(1, vsIdx).join(" "); team2Name = parts.slice(vsIdx + 1, parts.length - 5).join(" "); oddsStrings = parts.slice(parts.length - 5); if (!team1Name || !team2Name) { errors.push(`L${index + 1}(CSV 'vs'): Empty T names. L:"${line}"`); return; } }
                    else { errors.push(`L${index + 1}(CSV 'vs'): 'vs' wrong pos/few odds. L:"${line}"`); return; }
                } else {
                    if (parts.length >= 8) { group = parts[0]; team1Name = parts[1]; team2Name = parts[2]; oddsStrings = parts.slice(3, 8); if (!team1Name || !team2Name) { errors.push(`L${index + 1}(CSV no 'vs'): Empty T names. L:"${line}"`); return; } }
                    else { errors.push(`L${index + 1}(CSV no 'vs'): <8 cols. Exp G,T1,T2,O1,OX,O2,OU_U,OU_O. Got ${parts.length}. L:"${line}"`); return; }
                }
            } else {
                const vsIdx = parts.indexOf('vs');
                if (vsIdx > 0 && vsIdx < parts.length - 5) { group = parts[0]; team1Name = parts.slice(1, vsIdx).join(" "); team2Name = parts.slice(vsIdx + 1, parts.length - 5).join(" "); oddsStrings = parts.slice(parts.length - 5); if (!team1Name || !team2Name) { errors.push(`L${index + 1}(Space): Empty T names. L:"${line}"`); return; } }
                else { errors.push(`L${index + 1}(Space): 'vs' issue/few odds. Exp G T1 vs T2 O1 OX O2 OU_U OU_O. L:"${line}"`); return; }
            }
            if (!oddsStrings || oddsStrings.length !== 5) { errors.push(`L${index + 1}: Odds extract fail. Odds:${oddsStrings}. L:"${line}"`); return; }
            const odds = oddsStrings.map(parseFloat);
            if (odds.some(isNaN)) { errors.push(`L${index + 1}: Invalid odds. Odds:"${oddsStrings.join(', ')}". L:"${line}"`); return; }
            if (odds.some(o => o <= 0)) { errors.push(`L${index + 1}: Odds must be >0. Odds:"${oddsStrings.join(', ')}". L:"${line}"`); return; }

            const [o1, ox, o2, oUnder25, oOver25] = odds;

            const sumInv1X2 = (1 / o1) + (1 / ox) + (1 / o2); if (sumInv1X2 === 0) { errors.push(`L${index + 1}: Sum inv 1X2 odds 0. L:"${line}"`); return; }
            const p1_market = (1 / o1) / sumInv1X2, px_market = (1 / ox) / sumInv1X2, p2_market = (1 / o2) / sumInv1X2;

            const xGResult = calculateExpectedGoalsFromOdds(oOver25, oUnder25, o1, o2);
            let lambda1 = xGResult.homeXG;
            let lambda2 = xGResult.awayXG;

            if (isNaN(lambda1) || isNaN(lambda2) || lambda1 <= 0 || lambda2 <= 0) {
                warnings.push(`L${index + 1}: xG calc fail/non-positive for ${team1Name}v${team2Name}. Defaulting. H=${lambda1?.toFixed(2)},A=${lambda2?.toFixed(2)}`);
                const p_under_fb = (1 / oUnder25) / ((1 / oOver25) + (1 / oUnder25));
                const lt_fb_simple_approx = 2.5;
                const s1_fb = p1_market + 0.5 * px_market;
                const s2_fb = p2_market + 0.5 * px_market;
                if (s1_fb + s2_fb > 0) {
                    lambda1 = lt_fb_simple_approx * s1_fb / (s1_fb + s2_fb);
                    lambda2 = lt_fb_simple_approx * s2_fb / (s1_fb + s2_fb);
                } else {
                    lambda1 = lt_fb_simple_approx / 2; lambda2 = lt_fb_simple_approx / 2;
                }
                lambda1 = Math.max(0.05, lambda1); lambda2 = Math.max(0.05, lambda2);
            }

            const match = {
                lineNum: index + 1, group, team1: team1Name, team2: team2Name,
                p1: p1_market, px: px_market, p2: p2_market,
                lambda1, lambda2
            };
            parsedMatches.push(match); allTeams.add(team1Name); allTeams.add(team2Name);
            if (!groupedMatches[group]) { groupedMatches[group] = []; groupTeamNames[group] = new Set(); }
            groupedMatches[group].push(match); groupTeamNames[group].add(team1Name); groupTeamNames[group].add(team2Name);
        });

        const resultsData = matchResultsEl.value.trim();
        parsedResults = {};
        let resultErrors = [];
        if (resultsData) {
            const resultLines = resultsData.split('\n');
            resultLines.forEach((line, index) => {
                line = line.trim();
                if (!line || line.startsWith('#')) return;

                const parts = line.split(/\s+/).map(p => p.trim());
                const vsIdx = parts.indexOf('vs');

                if (vsIdx === -1 || vsIdx === 0 || vsIdx >= parts.length - 3) {
                    resultErrors.push(`L${index + 1}: Invalid result format. Use 'Group Team1 vs Team2 Score1 Score2'. Line: "${line}"`);
                    return;
                }

                const team1Name = parts.slice(1, vsIdx).join(" ");
                const team2Name = parts.slice(vsIdx + 1, parts.length - 2).join(" ");
                const score1 = parseInt(parts[parts.length - 2], 10);
                const score2 = parseInt(parts[parts.length - 1], 10);

                if (!team1Name || !team2Name) {
                    resultErrors.push(`L${index + 1}: Could not parse team names. Line: "${line}"`);
                    return;
                }
                if (isNaN(score1) || isNaN(score2)) {
                    resultErrors.push(`L${index + 1}: Invalid scores. Line: "${line}"`);
                    return;
                }
                const matchKey = [team1Name, team2Name].sort().join('-');
                parsedResults[matchKey] = { g1: score1, g2: score2, team1: team1Name, team2: team2Name };
            });
        }

        for (const group in groupTeamNames) {
            if (groupTeamNames[group].size !== 4) warnings.push(`Gr ${group}: ${groupTeamNames[group].size} teams (exp 4).`);
            if (groupedMatches[group] && groupedMatches[group].length !== 6 && groupTeamNames[group].size === 4) warnings.push(`Gr ${group}: ${groupedMatches[group].length} matches (exp 6).`);
            groupTeamNames[group] = Array.from(groupTeamNames[group]);
        }
        if (errors.length > 0 || resultErrors.length > 0) {
            let fullErrorMsg = '';
            if (errors.length > 0) {
                fullErrorMsg += `<p class="text-red-500 font-semibold">Odds Parse Fail (${errors.length}):</p><ul class="list-disc list-inside text-red-500">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
            }
            if (resultErrors.length > 0) {
                fullErrorMsg += `<p class="text-red-500 font-semibold mt-2">Results Parse Fail (${resultErrors.length}):</p><ul class="list-disc list-inside text-red-500">${resultErrors.map(e => `<li>${e}</li>`).join('')}</ul>`;
            }
            if (warnings.length > 0) {
                fullErrorMsg += `<p class="text-yellow-600 font-semibold mt-2">Warn (${warnings.length}):</p><ul class="list-disc list-inside text-yellow-600">${warnings.map(w => `<li>${w}</li>`).join('')}</ul>`;
            }
            statusAreaEl.innerHTML = fullErrorMsg;
            runButtonEl.disabled = true;
        } else {
            let successMsg = `<p class="text-green-500">Parsed ${parsedMatches.length} matches, ${Object.keys(groupedMatches).length} gr, ${allTeams.size} teams.`;
            if (Object.keys(parsedResults).length > 0) {
                successMsg += ` Parsed ${Object.keys(parsedResults).length} played results.`
            }
            successMsg += `</p>`;
            if (warnings.length > 0) {
                successMsg += `<p class="text-yellow-600 font-semibold mt-2">Warn (${warnings.length}):</p><ul class="list-disc list-inside text-yellow-600">${warnings.map(w => `<li>${w}</li>`).join('')}</ul>`;
            }
            statusAreaEl.innerHTML = successMsg;
            runButtonEl.disabled = false;
            resultsContentEl.innerHTML = "Parsed. Ready for sim.";
        }
    });


    // --- Simulation Logic ---
    runButtonEl.addEventListener('click', async () => {
        if (parsedMatches.length === 0) { statusAreaEl.innerHTML = '<p class="text-red-500">No data.</p>'; return; }
        currentNumSims = parseInt(numSimulationsEl.value); if (isNaN(currentNumSims) || currentNumSims <= 0) { statusAreaEl.innerHTML = '<p class="text-red-500">Sims > 0.</p>'; return; }

        progressContainerEl.classList.remove('hidden');
        progressBarEl.style.width = '0%';
        progressBarEl.textContent = '0%';
        statusAreaEl.innerHTML = `<p class="text-blue-500">Running ${currentNumSims} sims...</p>`;
        resultsContentEl.innerHTML = "";
        runButtonEl.disabled = true;
        parseButtonEl.disabled = true;

        try {
            simulationAggStats = await runSimulation(currentNumSims);
            displayResults(simulationAggStats, currentNumSims);
            populateSimGroupSelect();
            statusAreaEl.innerHTML = `<p class="text-green-500">Sim complete! (${currentNumSims} runs)</p>`;
        } catch (simError) {
            console.error("Sim Error:", simError);
            statusAreaEl.innerHTML = `<p class="text-red-500">Error during simulation: ${simError.message}</p>`;
            simulationAggStats = {};
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
            if (a.pts !== b.pts) return b.pts - a.pts;

            const tiedTeamsNames = teamNames.filter(name => fullStats[name].pts === a.pts);

            let h2hStats = {};
            if (tiedTeamsNames.length > 1 && rule !== 'simple') {
                h2hStats = calculateH2HStats(tiedTeamsNames, simMatchResults);
            }

            const a_h2h = h2hStats[a.name] || { pts: 0, gd: 0, gf: 0 };
            const b_h2h = h2hStats[b.name] || { pts: 0, gd: 0, gf: 0 };

            if (rule === 'h2h') {
                if (a_h2h.pts !== b_h2h.pts) return b_h2h.pts - a_h2h.pts;
                if (a_h2h.gd !== b_h2h.gd) return b_h2h.gd - a_h2h.gd;
                if (a_h2h.gf !== b_h2h.gf) return b_h2h.gf - a_h2h.gf;
            }

            if (a.gd !== b.gd) return b.gd - a.gd;
            if (a.gf !== b.gf) return b.gf - a.gf;

            if (rule === 'standard') {
                if (a_h2h.pts !== b_h2h.pts) return b_h2h.pts - a_h2h.pts;
                if (a_h2h.gd !== b_h2h.gd) return b_h2h.gd - a_h2h.gd;
                if (a_h2h.gf !== b_h2h.gf) return b_h2h.gf - a_h2h.gf;
            }

            return Math.random() - 0.5;
        });

        return teamsToSort;
    }

    function calculateH2HStats(tiedTeamsNames, simMatchResults) {
        const h2hStats = {};
        tiedTeamsNames.forEach(name => {
            h2hStats[name] = { name: name, pts: 0, gf: 0, ga: 0, gd: 0 };
        });

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

    async function runSimulation(numSims) {
        const aggStats = {};
        for (const gr in groupedMatches) {
            aggStats[gr] = {
                groupTotalGoalsSims: [],
                straightForecasts: {},
                advancingDoubles: {},
                anyTeam9PtsCount: 0,
                anyTeam0PtsCount: 0,
                firstPlacePtsSims: [],
                firstPlaceGFSims: [],
                fourthPlacePtsSims: [],
                fourthPlaceGFSims: []
            };
            (groupTeamNames[gr] || []).forEach(tN => {
                aggStats[gr][tN] = {
                    posCounts: [0, 0, 0, 0],
                    ptsSims: [],
                    gfSims: [],
                    gaSims: [],
                    winsSims: [],
                    drawsSims: [],
                    lossesSims: [],
                    mostGFCount: 0,
                    mostGACount: 0
                };
            });
        }

        const updateInterval = Math.max(1, Math.floor(numSims / 100));
        const tiebreakerRule = document.querySelector('input[name="tiebreaker"]:checked').value;

        for (let i = 0; i < numSims; i++) {
            for (const gK in groupedMatches) {
                const cGMs = groupedMatches[gK];
                const tIG = [...(groupTeamNames[gK] || [])];
                if (tIG.length === 0) continue;

                const sTS = {};
                const simMatchResults = [];
                tIG.forEach(t => sTS[t] = { name: t, pts: 0, gf: 0, ga: 0, wins: 0, draws: 0, losses: 0 });
                let cGTG = 0;

                cGMs.forEach(m => {
                    const matchKey = [m.team1, m.team2].sort().join('-');
                    const playedResult = parsedResults[matchKey];
                    let g1, g2;

                    if (playedResult) {
                        if (m.team1 === playedResult.team1) {
                            g1 = playedResult.g1;
                            g2 = playedResult.g2;
                        } else {
                            g1 = playedResult.g2;
                            g2 = playedResult.g1;
                        }
                    } else {
                        g1 = poissonRandom(m.lambda1);
                        g2 = poissonRandom(m.lambda2);
                    }

                    simMatchResults.push({ team1: m.team1, team2: m.team2, g1, g2 });

                    sTS[m.team1].gf += g1; sTS[m.team1].ga += g2;
                    sTS[m.team2].gf += g2; sTS[m.team2].ga += g1;
                    cGTG += (g1 + g2);

                    if (g1 > g2) {
                        sTS[m.team1].pts += 3; sTS[m.team1].wins += 1;
                        sTS[m.team2].losses += 1;
                    } else if (g2 > g1) {
                        sTS[m.team2].pts += 3; sTS[m.team2].wins += 1;
                        sTS[m.team1].losses += 1;
                    } else {
                        sTS[m.team1].pts += 1; sTS[m.team1].draws += 1;
                        sTS[m.team2].pts += 1; sTS[m.team2].draws += 1;
                    }
                });

                tIG.forEach(t => { sTS[t].gd = sTS[t].gf - sTS[t].ga; });

                const rTs = rankTeams(tIG, sTS, simMatchResults, tiebreakerRule);

                aggStats[gK].groupTotalGoalsSims.push(cGTG);

                let mGF = -1, mGA = -1;
                let groupHad9Pts = false, groupHad0Pts = false;
                tIG.forEach(tName => {
                    const tStats = sTS[tName];
                    mGF = Math.max(mGF, tStats.gf);
                    mGA = Math.max(mGA, tStats.ga);
                    if (tStats.pts === 9) groupHad9Pts = true;
                    if (tStats.pts === 0) groupHad0Pts = true;
                });
                if (groupHad9Pts) aggStats[gK].anyTeam9PtsCount++;
                if (groupHad0Pts) aggStats[gK].anyTeam0PtsCount++;

                if (rTs.length > 0) {
                    aggStats[gK].firstPlacePtsSims.push(rTs[0].pts);
                    aggStats[gK].firstPlaceGFSims.push(rTs[0].gf);
                }
                if (rTs.length >= 4) {
                    aggStats[gK].fourthPlacePtsSims.push(rTs[3].pts);
                    aggStats[gK].fourthPlaceGFSims.push(rTs[3].gf);
                }

                rTs.forEach((t, rI) => {
                    const tA = aggStats[gK][t.name];
                    const tStats = sTS[t.name];
                    if (tA) {
                        if (rI < 4) tA.posCounts[rI]++;
                        tA.ptsSims.push(tStats.pts);
                        tA.winsSims.push(tStats.wins);
                        tA.drawsSims.push(tStats.draws);
                        tA.lossesSims.push(tStats.losses);
                        tA.gfSims.push(tStats.gf);
                        tA.gaSims.push(tStats.ga);
                        if (tStats.gf === mGF && mGF > 0) tA.mostGFCount++;
                        if (tStats.ga === mGA && mGA > 0) tA.mostGACount++;
                    }
                });

                if (rTs.length >= 2) {
                    const sFK = `${rTs[0].name}(1st)-${rTs[1].name}(2nd)`;
                    aggStats[gK].straightForecasts[sFK] = (aggStats[gK].straightForecasts[sFK] || 0) + 1;
                    const aDP = [rTs[0].name, rTs[1].name].sort();
                    const aDK = `${aDP[0]}&${aDP[1]}`;
                    aggStats[gK].advancingDoubles[aDK] = (aggStats[gK].advancingDoubles[aDK] || 0) + 1;
                }
            }

            if (i % updateInterval === 0 || i === numSims - 1) {
                const percentComplete = Math.round(((i + 1) / numSims) * 100);
                progressBarEl.style.width = `${percentComplete}%`;
                progressBarEl.textContent = `${percentComplete}%`;
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        return aggStats;
    }

    // --- Display Logic (Simulator) ---
    function displayResults(aggStats, numSims) {
        let html = '';
        const sortedGroupKeys = Object.keys(aggStats).sort();
        for (const groupKey of sortedGroupKeys) {
            const groupData = aggStats[groupKey];
            if (!groupData) continue;
            html += `<div class="mb-8 p-4 bg-white border border-gray-200 rounded-lg shadow"><h3 class="text-lg font-semibold text-indigo-600 mb-3">Group ${groupKey}</h3>`;
            html += `<h4 class="font-medium text-gray-700 mt-4 mb-1">Expected Team Stats:</h4><table class="min-w-full divide-y divide-gray-200 mb-3 text-xs sm:text-sm"><thead class="bg-gray-50"><tr>${['Team', 'E(Pts)', 'E(W)', 'E(D)', 'E(L)', 'E(GF)', 'E(GA)', 'P(Most GF)', 'P(Most GA)'].map(h => `<th class="px-2 py-2 text-left font-medium text-gray-500 tracking-wider">${h}</th>`).join('')}</tr></thead><tbody class="bg-white divide-y divide-gray-200">`;
            (groupTeamNames[groupKey] || []).forEach(teamName => {
                const ts = groupData[teamName];
                if (!ts || !ts.ptsSims) return;
                const avgPts = (ts.ptsSims.length > 0 && numSims > 0) ? ts.ptsSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgWins = (ts.winsSims && ts.winsSims.length > 0 && numSims > 0) ? ts.winsSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgDraws = (ts.drawsSims && ts.drawsSims.length > 0 && numSims > 0) ? ts.drawsSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgLosses = (ts.lossesSims && ts.lossesSims.length > 0 && numSims > 0) ? ts.lossesSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgGF = (ts.gfSims.length > 0 && numSims > 0) ? ts.gfSims.reduce((a, b) => a + b, 0) / numSims : 0;
                const avgGA = (ts.gaSims.length > 0 && numSims > 0) ? ts.gaSims.reduce((a, b) => a + b, 0) / numSims : 0;
                html += `<tr><td class="px-2 py-2 whitespace-nowrap font-medium">${teamName}</td><td class="px-2 py-2">${avgPts.toFixed(2)}</td><td class="px-2 py-2">${avgWins.toFixed(2)}</td><td class="px-2 py-2">${avgDraws.toFixed(2)}</td><td class="px-2 py-2">${avgLosses.toFixed(2)}</td><td class="px-2 py-2">${avgGF.toFixed(2)}</td><td class="px-2 py-2">${avgGA.toFixed(2)}</td><td class="px-2 py-2">${(numSims > 0 ? ts.mostGFCount / numSims * 100 : 0).toFixed(1)}%</td><td class="px-2 py-2">${(numSims > 0 ? ts.mostGACount / numSims * 100 : 0).toFixed(1)}%</td></tr>`;
            });
            html += `</tbody></table>`;
            const avgGroupGoals = (groupData.groupTotalGoalsSims && groupData.groupTotalGoalsSims.length > 0 && numSims > 0) ? groupData.groupTotalGoalsSims.reduce((a, b) => a + b, 0) / numSims : 0;
            html += `<p class="mt-2 text-sm"><strong>Expected Total Goals in Group ${groupKey}:</strong> ${avgGroupGoals.toFixed(2)}</p>`;
            const allSF = Object.entries(groupData.straightForecasts || {}).sort(([, a], [, b]) => b - a);
            html += `<h4 class="font-medium text-gray-700 mt-4 mb-1">All Straight Forecasts (1st-2nd):</h4><ul class="list-disc list-inside text-sm max-h-40 overflow-y-auto">${allSF.map(([k, c]) => `<li>${k}: ${(numSims > 0 ? c / numSims * 100 : 0).toFixed(1)}%</li>`).join('') || 'N/A'}</ul>`;
            const topAD = Object.entries(groupData.advancingDoubles || {}).sort(([, a], [, b]) => b - a).slice(0, 10);
            html += `<h4 class="font-medium text-gray-700 mt-4 mb-1">Top Advancing Doubles (Top 2 Any Order):</h4><ul class="list-disc list-inside text-sm">${topAD.map(([k, c]) => `<li>${k}: ${(numSims > 0 ? c / numSims * 100 : 0).toFixed(1)}%</li>`).join('') || 'N/A'}</ul>`;
            html += `</div>`;
        }
        resultsContentEl.innerHTML = html || "<p>No results. Parse & run sim.</p>";
    }

    // --- Simulated Group Odds Tab Logic ---
    function calculateOddWithMargin(trueProb, marginDec) {
        if (trueProb <= 0) return "N/A";
        const oddNoMargin = 1 / trueProb;
        return (1 / (trueProb + ((1 - trueProb) / oddNoMargin * marginDec))).toFixed(2);
    }

    function calculateTwoWayMarketOdds(prob1, prob2, marginDecimal) {
        if (prob1 <= 0 && prob2 <= 0) return { odd1: "N/A", odd2: "N/A" };

        const totalProb = prob1 + prob2;
        if (totalProb === 0) return { odd1: "N/A", odd2: "N/A" };

        const overround = 1 + marginDecimal;

        const newProb1 = prob1 * overround / totalProb;
        const newProb2 = prob2 * overround / totalProb;

        const odd1 = newProb1 > 0 ? (1 / newProb1).toFixed(2) : "N/A";
        const odd2 = newProb2 > 0 ? (1 / newProb2).toFixed(2) : "N/A";

        return { odd1, odd2 };
    }

    function populateSimGroupSelect() {
        const lang = currentLang;
        const selectGroupText = lang === 'sr' ? "-- Izaberi Grupu --" : "-- Select Group --";
        const runSimFirstText = lang === 'sr' ? "-- Prvo pokreni simulaciju --" : "-- Run Sim First --";

        simGroupSelectEl.innerHTML = `<option value="">${Object.keys(simulationAggStats).length > 0 ? selectGroupText : runSimFirstText}</option>`;

        if (Object.keys(simulationAggStats).length > 0) {
            Object.keys(simulationAggStats).sort().forEach(groupKey => {
                const option = document.createElement('option');
                option.value = groupKey;
                option.textContent = `Group ${groupKey}`;
                simGroupSelectEl.appendChild(option);
            });
        }
    }

    simGroupSelectEl.addEventListener('change', () => {
        const selectedGroupKey = simGroupSelectEl.value;
        const lang = currentLang;
        const selectTeamText = lang === 'sr' ? "-- Izaberi Tim --" : "-- Select Team --";
        simTeamSelectEl.innerHTML = `<option value="">${selectTeamText}</option>`;

        customProbInputsContainerEl.classList.add('hidden');
        customProbAndOddResultAreaEl.innerHTML = "";
        document.getElementById('teamStatDistributionContainer').classList.add('hidden');

        if (selectedGroupKey && groupTeamNames[selectedGroupKey]) {
            generateGroupCsvButtonEl.disabled = false;
            groupTeamNames[selectedGroupKey].forEach(teamName => {
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
        document.getElementById('ouTotalGroupGoalsResult').innerHTML = '';
        document.getElementById('expectedTotalGroupGoals').textContent = '';
        document.getElementById('ouFirstPlacePtsResult').innerHTML = '';
        document.getElementById('expectedFirstPlacePts').textContent = '';
        document.getElementById('ouFourthPlacePtsResult').innerHTML = '';
        document.getElementById('expectedFourthPlacePts').textContent = '';
        document.getElementById('ouFirstPlaceGFResult').innerHTML = '';
        document.getElementById('expectedFirstPlaceGF').textContent = '';
        document.getElementById('ouFourthPlaceGFResult').innerHTML = '';
        document.getElementById('expectedFourthPlaceGF').textContent = '';
    });

    function displayTeamStatDistribution(teamData, marginDecimal, numSims) {
        const container = document.getElementById('teamStatDistributionContainer');
        const content = document.getElementById('teamStatDistributionContent');

        if (!teamData || numSims === 0) {
            container.classList.add('hidden');
            return;
        }

        let html = '';
        const statTypes = [
            { key: 'ptsSims', title: 'Points' },
            { key: 'gfSims', title: 'Goals For' },
            { key: 'winsSims', title: 'Wins' },
            { key: 'drawsSims', title: 'Draws' },
            { key: 'lossesSims', title: 'Losses' },
        ];

        statTypes.forEach(stat => {
            const simValues = teamData[stat.key];
            if (!simValues) return;

            let tableHtml = `<div><h4 class="font-medium text-gray-700 mt-4 mb-1">${stat.title} Distribution:</h4>`;
            tableHtml += `<table class="odds-table text-xs sm:text-sm"><thead><tr><th>Outcome</th><th>Prob.</th><th>Odd</th></tr></thead><tbody>`;

            const valueCounts = {};
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
                    if (prob < 0.0001) continue;
                    const odd = calculateOddWithMargin(prob, marginDecimal);
                    tableHtml += `<tr>
                                <td>${value}</td>
                                <td>${(prob * 100).toFixed(1)}%</td>
                                <td>${odd}</td>
                             </tr>`;
                }
            }
            tableHtml += `</tbody></table></div>`;
            html += tableHtml;
        });

        content.innerHTML = html;
        container.classList.remove('hidden');
    }

    simTeamSelectEl.addEventListener('change', () => {
        const teamName = simTeamSelectEl.value;
        const groupKey = simGroupSelectEl.value;
        const marginPercent = parseFloat(simBookieMarginEl.value);
        const marginDecimal = isNaN(marginPercent) ? 0.05 : marginPercent / 100;

        if (teamName) {
            customProbInputsContainerEl.classList.remove('hidden');
            generateTeamCsvButtonEl.disabled = false;
            customProbAndOddResultAreaEl.innerHTML = "";

            const teamData = simulationAggStats[groupKey]?.[teamName];
            displayTeamStatDistribution(teamData, marginDecimal, currentNumSims);
        } else {
            customProbInputsContainerEl.classList.add('hidden');
            generateTeamCsvButtonEl.disabled = true;
            document.getElementById('teamStatDistributionContainer').classList.add('hidden');
        }
    });

    showSimulatedOddsButtonEl.addEventListener('click', () => {
        const selectedGroupKey = simGroupSelectEl.value;
        const mainMarginPercent = parseFloat(simBookieMarginEl.value);

        simulatedOddsStatusEl.textContent = "";
        calculatedOddsResultContentEl.innerHTML = "";

        if (!selectedGroupKey) { simulatedOddsStatusEl.textContent = "Select group."; return; }
        if (isNaN(mainMarginPercent) || mainMarginPercent < 0) {
            simulatedOddsStatusEl.textContent = "Please enter a valid non-negative margin.";
            return;
        }
        if (Object.keys(simulationAggStats).length === 0 || !simulationAggStats[selectedGroupKey] || currentNumSims === 0) { simulatedOddsStatusEl.textContent = "No sim data. Run sim."; return; }

        const groupData = simulationAggStats[selectedGroupKey];
        const teams = groupTeamNames[selectedGroupKey] || [];
        if (!groupData || teams.length === 0) { simulatedOddsStatusEl.textContent = "Group data incomplete."; return; }

        const mainMarginDecimal = mainMarginPercent / 100;
        let html = `<h3 class="text-lg font-semibold text-purple-600 mb-2">Market Odds for Group ${selectedGroupKey} (Margin: ${mainMarginPercent}%)</h3>`;

        html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Team Standings Odds (1st/2nd/3rd/4th):</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Team</th><th>1st Place</th><th>2nd Place</th><th>3rd Place</th><th>4th Place</th></tr></thead><tbody>`;
        teams.forEach(tN => {
            html += `<tr><td class="font-medium">${tN}</td>`;
            for (let i = 0; i < 4; i++) {
                const tS = groupData[tN], tP = (tS && tS.posCounts && currentNumSims > 0) ? (tS.posCounts[i] || 0) / currentNumSims : 0, o = calculateOddWithMargin(tP, mainMarginDecimal);
                html += `<td>${o} <span class="text-gray-400">(${(tP * 100).toFixed(1)}%)</span></td>`;
            }
            html += `</tr>`;
        });
        html += `</tbody></table>`;

        html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">To Qualify (Top 2):</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Team</th><th>P(Qualify)</th><th>Odd</th></tr></thead><tbody>`;
        teams.forEach(tN => { const tS = groupData[tN], tP = (tS && tS.posCounts && currentNumSims > 0) ? ((tS.posCounts[0] || 0) + (tS.posCounts[1] || 0)) / currentNumSims : 0, o = calculateOddWithMargin(tP, mainMarginDecimal); html += `<tr><td>${tN}</td><td>${(tP * 100).toFixed(1)}%</td><td>${o}</td></tr>`; }); html += `</tbody></table>`;

        html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Team Specials:</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Team</th><th>To Go Unbeaten (P)</th><th>To Go Unbeaten (Odd)</th></tr></thead><tbody>`;
        teams.forEach(tN => {
            const tS = groupData[tN];
            let probUnbeaten = 0;
            if (tS && tS.lossesSims && currentNumSims > 0) {
                probUnbeaten = tS.lossesSims.filter(l => l === 0).length / currentNumSims;
            }
            const oddUnbeaten = calculateOddWithMargin(probUnbeaten, mainMarginDecimal);
            html += `<tr><td>${tN}</td><td>${(probUnbeaten * 100).toFixed(1)}%</td><td>${oddUnbeaten}</td></tr>`;
        });
        html += `</tbody></table>`;

        html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Team to Score Most Goals:</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Team</th><th>P(Most GF)</th><th>Odd</th></tr></thead><tbody>`;
        teams.forEach(tN => { const tS = groupData[tN], tP = (tS && currentNumSims > 0) ? (tS.mostGFCount || 0) / currentNumSims : 0, o = calculateOddWithMargin(tP, mainMarginDecimal); html += `<tr><td>${tN}</td><td>${(tP * 100).toFixed(1)}%</td><td>${o}</td></tr>`; }); html += `</tbody></table>`;

        html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Team to Concede Most Goals:</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Team</th><th>P(Most GA)</th><th>Odd</th></tr></thead><tbody>`;
        teams.forEach(tN => { const tS = groupData[tN], tP = (tS && currentNumSims > 0) ? (tS.mostGACount || 0) / currentNumSims : 0, o = calculateOddWithMargin(tP, mainMarginDecimal); html += `<tr><td>${tN}</td><td>${(tP * 100).toFixed(1)}%</td><td>${o}</td></tr>`; }); html += `</tbody></table>`;

        const allSF = Object.entries(groupData.straightForecasts || {}).sort(([, a], [, b]) => b - a);
        html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">All Straight Forecasts (1st-2nd):</h4>`;
        if (allSF.length > 0) {
            html += `<table class="odds-table text-xs sm:text-sm max-h-60 overflow-y-auto block"><thead><tr><th>Forecast</th><th>Prob</th><th>Odd</th></tr></thead><tbody>`;
            allSF.forEach(([k, c]) => { const tP = currentNumSims > 0 ? c / currentNumSims : 0, o = calculateOddWithMargin(tP, mainMarginDecimal); html += `<tr><td>${k}</td><td>${(tP * 100).toFixed(1)}%</td><td>${o}</td></tr>`; });
            html += `</tbody></table>`;
        } else { html += `<p class="text-xs text-gray-500">No SF data.</p>`; }

        const topAD = Object.entries(groupData.advancingDoubles || {}).sort(([, a], [, b]) => b - a).slice(0, 10); html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Top Advancing Doubles (Top 2 Any Order):</h4>`; if (topAD.length > 0) { html += `<table class="odds-table text-xs sm:text-sm"><thead><tr><th>Pair</th><th>Prob</th><th>Odd</th></tr></thead><tbody>`; topAD.forEach(([k, c]) => { const tP = currentNumSims > 0 ? c / currentNumSims : 0, o = calculateOddWithMargin(tP, mainMarginDecimal); html += `<tr><td>${k}</td><td>${(tP * 100).toFixed(1)}%</td><td>${o}</td></tr>`; }); html += `</tbody></table>`; } else { html += `<p class="text-xs text-gray-500">No AD data.</p>`; }

        const probAny9Pts = currentNumSims > 0 ? (groupData.anyTeam9PtsCount || 0) / currentNumSims : 0; const oddAny9Pts = calculateOddWithMargin(probAny9Pts, mainMarginDecimal);
        html += `<h4 class="font-medium text-gray-700 mt-3 mb-1">Group Specials:</h4><table class="odds-table text-xs sm:text-sm"><thead><tr><th>Event</th><th>Prob</th><th>Odd</th></tr></thead><tbody>`;
        html += `<tr><td>Any Team scores 9 Pts</td><td>${(probAny9Pts * 100).toFixed(1)}%</td><td>${oddAny9Pts}</td></tr>`;
        const probAny0Pts = currentNumSims > 0 ? (groupData.anyTeam0PtsCount || 0) / currentNumSims : 0; const oddAny0Pts = calculateOddWithMargin(probAny0Pts, mainMarginDecimal);
        html += `<tr><td>Any Team scores 0 Pts</td><td>${(probAny0Pts * 100).toFixed(1)}%</td><td>${oddAny0Pts}</td></tr></tbody></table>`;

        calculatedOddsResultContentEl.innerHTML = html;

        const displayAvgAndOU = (dataKey, expectedElId, resultElId) => {
            const resultElement = document.getElementById(resultElId);
            const expectedElement = document.getElementById(expectedElId);
            const ouBookieMarginEl = document.getElementById('ouBookieMargin');
            const ouMarginDecimal = parseFloat(ouBookieMarginEl.value) / 100;
            if (isNaN(ouMarginDecimal) || ouMarginDecimal < 0) return;

            if (groupData[dataKey] && groupData[dataKey].length > 0 && currentNumSims > 0) {
                const avg = groupData[dataKey].reduce((a, b) => a + b, 0) / currentNumSims;
                expectedElement.textContent = `(Avg: ${avg.toFixed(2)})`;

                const centerLine = Math.round(avg) + 0.5;
                const lines = [centerLine - 1, centerLine, centerLine + 1].filter(l => l > 0.5);
                let ouHtml = `<table class="w-full text-center"><thead><tr class="text-gray-500"><th class="w-1/3">Line</th><th class="w-1/3">Over</th><th class="w-1/3">Under</th></tr></thead><tbody>`;

                lines.forEach(line => {
                    const overCount = groupData[dataKey].filter(val => val > line).length;
                    const underCount = groupData[dataKey].filter(val => val < line).length;
                    const probOver = overCount / currentNumSims;
                    const probUnder = underCount / currentNumSims;

                    const { odd1: oddOver, odd2: oddUnder } = calculateTwoWayMarketOdds(probOver, probUnder, ouMarginDecimal);

                    ouHtml += `<tr><td>${line.toFixed(1)}</td><td>${oddOver}</td><td>${oddUnder}</td></tr>`;
                });
                ouHtml += `</tbody></table>`;
                resultElement.innerHTML = ouHtml;

            } else {
                expectedElement.textContent = '';
                resultElement.innerHTML = '';
            }
        };

        displayAvgAndOU('groupTotalGoalsSims', 'expectedTotalGroupGoals', 'ouTotalGroupGoalsResult');
        displayAvgAndOU('firstPlacePtsSims', 'expectedFirstPlacePts', 'ouFirstPlacePtsResult');
        displayAvgAndOU('fourthPlacePtsSims', 'expectedFourthPlacePts', 'ouFourthPlacePtsResult');
        displayAvgAndOU('firstPlaceGFSims', 'expectedFirstPlaceGF', 'ouFirstPlaceGFResult');
        displayAvgAndOU('fourthPlaceGFSims', 'expectedFourthPlaceGF', 'ouFourthPlaceGFResult');
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
        const marginDecimal = marginPercent / 100;
        const odd = calculateOddWithMargin(trueProbability, marginDecimal);

        let propDescription = `${teamName} ${statType.replace('Sims', '')} ${operator} ${value1}`;
        if (operator === 'between') propDescription += ` and ${value2}`;

        customProbAndOddResultAreaEl.innerHTML = `
            <p><strong>Prop:</strong> ${propDescription}</p>
            <p><strong>Simulated Probability:</strong> ${(trueProbability * 100).toFixed(1)}%</p>
            <p><strong>Calculated Odd (with ${marginPercent}% margin):</strong> ${odd}</p>`;
    });

    // --- Clear Button ---
    clearButtonEl.addEventListener('click', () => {
        matchDataEl.value = "";
        matchResultsEl.value = "";
        numSimulationsEl.value = "10000";
        statusAreaEl.innerHTML = "";
        resultsContentEl.innerHTML = "";
        parsedMatches = [];
        parsedResults = {};
        allTeams.clear();
        groupedMatches = {};
        groupTeamNames = {};
        simulationAggStats = {};
        currentNumSims = 0;
        runButtonEl.disabled = true;
        progressContainerEl.classList.add('hidden');
        parseButtonEl.disabled = false;
        csvFileInputEl.value = null; csvFileNameEl.textContent = "No file selected.";
        populateSimGroupSelect();
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
        document.getElementById('ouFourthPlacePtsResult').innerHTML = '';
        document.getElementById('expectedFourthPlacePts').textContent = '';
        document.getElementById('ouFirstPlaceGFResult').innerHTML = '';
        document.getElementById('expectedFirstPlaceGF').textContent = '';
        document.getElementById('ouFourthPlaceGFResult').innerHTML = '';
        document.getElementById('expectedFourthPlaceGF').textContent = '';
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

    window.openTab = openTab;
    simCustomOperatorEl.addEventListener('change', () => {
        if (simCustomOperatorEl.value === 'between') simCustomValue2El.classList.remove('hidden');
        else simCustomValue2El.classList.add('hidden');
    });

    generateTeamCsvButtonEl.addEventListener('click', () => {
        const groupKey = simGroupSelectEl.value;
        const teamName = simTeamSelectEl.value;
        const marginPercent = parseFloat(simBookieMarginEl.value);
        const marginDecimal = marginPercent / 100;

        if (!groupKey || !teamName) {
            simulatedOddsStatusEl.textContent = "Please select a group and a team first.";
            return;
        }
        if (isNaN(marginPercent) || marginPercent < 0) {
            simulatedOddsStatusEl.textContent = "Please enter a valid non-negative margin.";
            return;
        }

        const teamData = simulationAggStats[groupKey]?.[teamName];
        if (!teamData) {
            simulatedOddsStatusEl.textContent = "No simulation data found for the selected team.";
            return;
        }

        let csvContent = `Date,Time,Market,Odd1,Odd2,Odd3\n`;
        const date = "15.6.2025";
        const time = "02:00";

        const toCsvRow = (market, odd1 = '', odd2 = '', odd3 = '') => `${date},${time},"${market}",${odd1},${odd2},${odd3}\n`;

        const prob1st = (teamData.posCounts[0] || 0) / currentNumSims;
        const odd1st = calculateOddWithMargin(prob1st, marginDecimal);
        csvContent += toCsvRow("Group Winner", odd1st);

        const probQualify = ((teamData.posCounts[0] || 0) + (teamData.posCounts[1] || 0)) / currentNumSims;
        const oddQualify = calculateOddWithMargin(probQualify, marginDecimal);
        csvContent += toCsvRow("To Qualify", oddQualify);

        const probUnbeaten = (teamData.lossesSims.filter(l => l === 0).length) / currentNumSims;
        csvContent += toCsvRow("Unbeaten in group", calculateOddWithMargin(probUnbeaten, marginDecimal));

        const prob2nd = (teamData.posCounts[1] || 0) / currentNumSims;
        const odd2nd = calculateOddWithMargin(prob2nd, marginDecimal);
        csvContent += toCsvRow("2nd in group", odd2nd);

        const prob3rd = (teamData.posCounts[2] || 0) / currentNumSims;
        const odd3rd = calculateOddWithMargin(prob3rd, marginDecimal);
        csvContent += toCsvRow("3rd in group", odd3rd);

        const prob4th = (teamData.posCounts[3] || 0) / currentNumSims;
        const odd4th = calculateOddWithMargin(prob4th, marginDecimal);
        csvContent += toCsvRow("4th in group", odd4th);

        const ptsSims = teamData.ptsSims;
        [0, 1, 2, 3, 4, 5, 6, 7, 9].forEach(pts => {
            const probPts = ptsSims.filter(p => p === pts).length / currentNumSims;
            const oddPts = calculateOddWithMargin(probPts, marginDecimal);
            if (oddPts !== "N/A") csvContent += toCsvRow(`${pts} points in group`, oddPts);
        });

        [0, 1, 2, 3].forEach(w => {
            const prob = teamData.winsSims.filter(s => s === w).length / currentNumSims;
            if (prob > 0) csvContent += toCsvRow(`${w} wins in group`, calculateOddWithMargin(prob, marginDecimal));
        });

        [0, 1, 2, 3].forEach(d => {
            const prob = teamData.drawsSims.filter(s => s === d).length / currentNumSims;
            if (prob > 0) csvContent += toCsvRow(`${d} draws in group`, calculateOddWithMargin(prob, marginDecimal));
        });

        [0, 1, 2, 3].forEach(l => {
            const prob = teamData.lossesSims.filter(s => s === l).length / currentNumSims;
            if (prob > 0) csvContent += toCsvRow(`${l} losses in group`, calculateOddWithMargin(prob, marginDecimal));
        });

        const range1_3 = ptsSims.filter(p => p >= 1 && p <= 3).length / currentNumSims;
        csvContent += toCsvRow("1-3 points in group", calculateOddWithMargin(range1_3, marginDecimal));
        const range2_4 = ptsSims.filter(p => p >= 2 && p <= 4).length / currentNumSims;
        csvContent += toCsvRow("2-4 points in group", calculateOddWithMargin(range2_4, marginDecimal));
        const range4_6 = ptsSims.filter(p => p >= 4 && p <= 6).length / currentNumSims;
        csvContent += toCsvRow("4-6 points in group", calculateOddWithMargin(range4_6, marginDecimal));

        [5.5, 6.5, 7.5].forEach(line => {
            const overProb = ptsSims.filter(p => p > line).length / currentNumSims;
            const underProb = ptsSims.filter(p => p < line).length / currentNumSims;
            const { odd1: overOdd, odd2: underOdd } = calculateTwoWayMarketOdds(overProb, underProb, marginDecimal);
            csvContent += toCsvRow(`Total points in group`, line, overOdd, underOdd);
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `odds_${teamName.replace(/\s+/g, '_')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    generateGroupCsvButtonEl.addEventListener('click', () => {
        const groupKey = simGroupSelectEl.value;
        const marginPercent = parseFloat(simBookieMarginEl.value);
        const marginDecimal = marginPercent / 100;

        if (!groupKey) {
            simulatedOddsStatusEl.textContent = "Please select a group first.";
            return;
        }
        if (isNaN(marginPercent) || marginPercent < 0) {
            simulatedOddsStatusEl.textContent = "Please enter a valid non-negative margin.";
            return;
        }
        const groupData = simulationAggStats[groupKey];
        const teams = groupTeamNames[groupKey] || [];
        if (!groupData || teams.length === 0) {
            simulatedOddsStatusEl.textContent = "No simulation data found for the selected group.";
            return;
        }

        const lang = currentLang;
        let csvContent = `LEAGUE_NAME: Group ${groupKey}\n`;
        const toCsvRow = (market, submarket, odd1 = '', odd2 = '', odd3 = '') => `${"15.6.2025"},${"02:00"},"${market}","${submarket}",${odd1},${odd2},${odd3}\n`;

        const prob9pts = (groupData.anyTeam9PtsCount || 0) / currentNumSims;
        csvContent += toCsvRow("Any team", "9 points", calculateOddWithMargin(prob9pts, marginDecimal));
        const prob0pts = (groupData.anyTeam0PtsCount || 0) / currentNumSims;
        csvContent += toCsvRow("Any team", "0 points", calculateOddWithMargin(prob0pts, marginDecimal));

        const totalGoalsSims = groupData.groupTotalGoalsSims || [];
        if (totalGoalsSims.length > 0) {
            const avgGoals = totalGoalsSims.reduce((a, b) => a + b, 0) / currentNumSims;
            const centerLine = Math.round(avgGoals) + 0.5;
            const lines = [centerLine - 2, centerLine - 1, centerLine, centerLine + 1, centerLine + 2].filter(l => l > 0.5);
            lines.forEach(line => {
                const overProb = totalGoalsSims.filter(g => g > line).length / currentNumSims;
                const underProb = totalGoalsSims.filter(g => g < line).length / currentNumSims;
                const { odd1: overOdd, odd2: underOdd } = calculateTwoWayMarketOdds(overProb, underProb, marginDecimal);
                csvContent += toCsvRow("Total goals", "In group", line.toFixed(1), overOdd, underOdd);
            });
        }

        const firstPtsSims = groupData.firstPlacePtsSims || [];
        if (firstPtsSims.length > 0) {
            [4.5, 6.5, 7.5].forEach(line => {
                const overProb = firstPtsSims.filter(p => p > line).length / currentNumSims;
                const underProb = firstPtsSims.filter(p => p < line).length / currentNumSims;
                const { odd1: overOdd, odd2: underOdd } = calculateTwoWayMarketOdds(overProb, underProb, marginDecimal);
                csvContent += toCsvRow("Total points", "1st placed team", line, overOdd, underOdd);
            });
        }
        const fourthPtsSims = groupData.fourthPlacePtsSims || [];
        if (fourthPtsSims.length > 0) {
            [0.5, 1.5, 2.5].forEach(line => {
                const overProb = fourthPtsSims.filter(p => p > line).length / currentNumSims;
                const underProb = fourthPtsSims.filter(p => p < line).length / currentNumSims;
                const { odd1: overOdd, odd2: underOdd } = calculateTwoWayMarketOdds(overProb, underProb, marginDecimal);
                csvContent += toCsvRow("Total points", "4th placed team", line, overOdd, underOdd);
            });
        }

        const allSF = Object.entries(groupData.straightForecasts || {}).sort(([, a], [, b]) => b - a);
        allSF.forEach(([key, count]) => {
            const prob = count / currentNumSims;
            const marketName = key.replace(' (1st) - ', '/').replace(' (2nd)', '');
            csvContent += toCsvRow(marketName, "Exact Forecast 1-2", calculateOddWithMargin(prob, marginDecimal));
        });

        const allAD = Object.entries(groupData.advancingDoubles || {}).sort(([, a], [, b]) => b - a);
        allAD.forEach(([key, count]) => {
            const prob = count / currentNumSims;
            const marketName = key.replace(' & ', '/');
            csvContent += toCsvRow(marketName, "Top 2 in group", calculateOddWithMargin(prob, marginDecimal));
        });

        teams.forEach(team => {
            const prob = (groupData[team].posCounts[0] || 0) / currentNumSims;
            csvContent += toCsvRow(team, "Group Winner", calculateOddWithMargin(prob, marginDecimal));
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `group_odds_${groupKey}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
});
