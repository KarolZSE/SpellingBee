// Create a grid background
const svg = document.getElementById('back');
for (let a = 0; a < 20; a++) {
    const backline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    backline.setAttribute("y1", a * 200);
    backline.setAttribute("x1", 0);
    backline.setAttribute("y2", 0);
    backline.setAttribute("x2", a * 200);
    svg.appendChild(backline);
}

let utterance;
let wordJson;
const finishedElement = document.getElementById("finished");
let definitionElement = document.getElementById("definition");
let wordElement = document.getElementById("word");
async function GetWord() {
    try {
        let wordResponse = await fetch("https://random-word-api.herokuapp.com/word?number=1");
        wordJson = await wordResponse.json();
        wordElement.innerHTML = wrapWordInSpans(wordJson[0]);
        
        let dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordJson[0]}`);
        let dictionaryJson = await dictionaryResponse.json();

        let definitions = dictionaryJson[0].meanings[0].definitions.map(def => def.definition);
        definitions.sort((a, b) => b.length - a.length);
        definitionElement.innerHTML = definitions.join('<br>');
        speakWord();
    } catch (error) {
        if (error.message.includes("Cannot read properties of undefined")) {
            GetWord();
        }
    }
}

function wrapWordInSpans(word) {
    return word.split('').map(letter => `<span>${letter}</span>`).join('');
}

const synth = window.speechSynthesis;
function speakWord() {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(wordJson[0]);
    utterance.lang = "en-US"; // Set language
    utterance.pitch = 1;      // Set pitch (0 to 2)
    utterance.rate = 1;       // Set rate (0.1 to 10)
    synth.speak(utterance);
}

const restart = document.getElementById("restart");
restart.addEventListener("mousedown", async () => {
    i = 0;
    time = 0;
    small_mistakes = 0;
    definitionElement.innerHTML = "Please wait a second, the game is loading...";
    SaveScore.style.display = "none";
    GetWord();
});

let time = 0;
let clicked = 0;
let small_mistakes = 0;
let i = 0;
let mistakes = 0;
let finished = 0;
window.addEventListener("keydown", function(event) {
        if (time === 0) {
            time = Date.now();
        }
        const timenew = Date.now();
        clicked++
        lps.textContent = `${(clicked / ((timenew - time) / 1000)).toFixed(2)}`;
        const spans = wordElement.querySelectorAll('span');
        if (event.key.toLowerCase() === spans[i].textContent) {
            spans[i].style.opacity = 1;
            small_mistakes = 0;
            i++;
        } else {
            small_mistakes++;
            mistakes++;
            document.getElementById("mistakes").textContent = `${mistakes}`;
            if (small_mistakes > 2) {
                small_mistakes = 0;
                spans[i].style.opacity = 1;
                spans[i].style.color = "red";
                i++;
            }
        }
        if (spans[i]?.textContent === undefined) {
            wordElement.innerHTML = `<h2>You have correctly spelled ${wordJson[0]}!</h2>`;
            finished++;
            finishedElement.textContent = `${finished}`;
            SaveScore.style.display = null;
        }
    });

const start = document.getElementById("start");
start.addEventListener("mousedown", () => {
    document.getElementById("starting-menu-content").style.display = "none";
    document.getElementById("menu-content").style.display = "flex";
    SaveScore.style.display = "none";
    GetWord();
});

const NameElement = document.getElementById("name")
const SaveScore = document.getElementById("SaveScore");
SaveScore.addEventListener("mousedown", async () => {
    if (NameElement.value == "") {
        NameElement.value = "User";
    }       
    await DatabaseCall(1, NameElement, mistakes, finished);
});
