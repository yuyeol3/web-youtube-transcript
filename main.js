import { getYoutubeTranscript, getVidTitle, decodeHTMLEntities, getAPIKey } from "./utils.js";
import { getsummary } from "./gptSummarize.js";

// query buttons
const btnSubmit = document.querySelector("#btn-submit");
const btnCopyScript = document.querySelector("#btn-copy");
const btnActivateModal = document.querySelector("#activate-modal");
const btnCloseModal = document.querySelector("#modal-close");
const btnSaveAPIKey = document.querySelector("#btn-saveapi");
const btnSummary    = document.querySelector("#btn-summary");

// query input & textarea
const inputURL = document.querySelector("#input-URL");
const txtareaScript = document.querySelector("#txtarea-script");
const inputAPIKey = document.querySelector("#input-apikey");

const txtareaControl = document.querySelector("#txtarea-control");

let fetchedTranscript = "";
let generatedSummary = "";

async function submitURL() {


    btnSummary.innerText = "Summary";

    let url = inputURL.value;

    if (url === "")
        return;

    inputURL.value = ""
    txtareaScript.innerText = ""

    let scriptText = ""
    try {
        txtareaControl.classList.add("is-loading");
        let title = await getVidTitle(url);
        let script = await getYoutubeTranscript(url);

        scriptText += `title: ${title}\ncontent:\n`
        for (const element of script)
        {
            scriptText += decodeHTMLEntities(element.text) + '\n';
        }
    }
    catch (err)
    {
        alert("error:\n", err.message);
        return;
    }
    finally {
        txtareaControl.classList.remove("is-loading");
    }
    
    txtareaScript.innerHTML = scriptText;

    // transcript 저장, 요약본 초기화
    fetchedTranscript = scriptText;
    generatedSummary = "";


}

async function copyTranscript()
{
    navigator.clipboard.writeText(txtareaScript.value)
    .then(() => {
        btnCopyScript.innerHTML = "Copied!";
        setTimeout(()=>{btnCopyScript.innerHTML = "Copy"}, 1500);
    })
    .catch(err => {
    });
}

async function summary() {
    if (fetchedTranscript === "")
        return;

    if (btnSummary.innerText == "Transcript") {
        txtareaScript.innerHTML = fetchedTranscript;
        btnSummary.innerText = "Summary";
        return;
    }
    else {
        btnSummary.innerText = "Transcript";
        if (generatedSummary == "") {
            try {
                txtareaControl.classList.add("is-loading");
                generatedSummary = await getsummary(fetchedTranscript, getAPIKey());

            }
            catch (err) {
                alert("error:\n", err.message);
            }
            finally {
                txtareaControl.classList.remove("is-loading");
            }
        }
        txtareaScript.innerHTML = generatedSummary;
    }
}

function saveAPIKey(key) {
    if (key == "")
        return;

    window.localStorage.setItem("openAIkey", key);
}



function setEvents() {
    btnSubmit.onclick = submitURL;
    
    btnCopyScript.onclick = copyTranscript;
    
    btnSummary.onclick = summary;

    inputURL.addEventListener('keydown', (event) => {
        if (event.key === "Enter")
            submitURL();
    });
    
    btnActivateModal.onclick = ()=> {
        document.querySelector("#setting-modal").classList.add("is-active");
        inputAPIKey.value = getAPIKey();
    }
    
    btnCloseModal.onclick = () => {
        document.querySelector("#setting-modal").classList.remove("is-active");
    }

    btnSaveAPIKey.onclick = () => {
        saveAPIKey(inputAPIKey.value);
    }

    window.addEventListener("resize", async(event) => {
        if (window.outerHeight === 620)
            txtareaScript.rows = 10;
        else if (window.innerHeight <= 600)
            txtareaScript.rows = Math.floor((window.innerHeight) / 70);
        else if (window.innerHeight <= 800)
            txtareaScript.rows = Math.floor((window.innerHeight) / 47);
        else
            txtareaScript.rows = Math.floor((window.innerHeight) / 40);
    
    })
}


setEvents();