(async () => {
console.log("Javascript loaded");

createMenu(document.querySelector("header > nav"));

const createScriptSelection = script => `<div data-name="${escHTML(script.Name)}">
<h3>${escHTML(script.Name)}</h3>
<p>${escHTML(script.Desc.split('\n')[0])}</p>
</div>`;

const createBoxSelection = ([name, box]) => `<div data-name="${escHTML(name)}">
<h3>${escHTML(name)}</h3>
<p>${escHTML(box.User)}@${escHTML(box.Host)}:${box.Port}</p>
</div>`;

const getParentWithName = (cur, maxParent) => {
    while(cur.getAttribute("data-name") == null && cur != maxParent)
        cur = cur.parentElement;
    if(cur == maxParent) return null;
    else                 return cur;
};

const getParentName = (cur, maxParent) => getParentWithName(cur, maxParent)?.getAttribute("data-name");

const createParameter = scriptData => `<h2>${escHTML(scriptData.Name)}</h2>
<p>${escHTML(scriptData.Desc)}</p>
<table>
${Object.entries(scriptData.Params).map(
    ([param, validator]) => `<tr data-name="${escHTML(param)}">
        <td>${escHTML(param)}<td>
        <td><input class="form-input" data-validator="${escHTML(validator)}"><td>
    </tr>`
).join('')}
</table>`;


// References to elements
const scriptSection = document.getElementById("script");
const parameterSection = document.getElementById("parameter");
const boxSection = document.getElementById("box");
const runBtn = document.getElementById("run");

runBtn.onclick = async event => {
    // Get name
    const scriptName = parameterSection.querySelector("h2").textContent

    // Collect parameters
    const paramElements = parameterSection.querySelectorAll("tr[data-name]");
    let allValid = true;
    const params = {};
    for(const row of paramElements) {
        console.log(row);
        const name = row.getAttribute("data-name");
        const input = row.querySelector("input[data-validator]");
        if(!input) return;
        const validator = input.getAttribute("data-validator");
        const valid = input.value.match("^" + validator + "$") && true;
        input.classList.toggle("invalid", !valid);
        allValid = allValid && valid;
        params[name] = input.value;
    }
    if(!allValid) return;

    // Get targets
    const targets = Array.from(boxSection.querySelectorAll("div[data-name].selected")).map(e => e.getAttribute("data-name"));

    // Make API call
    const body = {
        "Targets": targets,
        "Scripts": [scriptName],
        "Env": params,
        "NoPassgen": false,
        "Interactive": false,
        "Echo": false
    };
    const jobResp = await fetch("/ssh", {method: "POST", body: JSON.stringify(body)});
    const jobData = await jobResp.text();
    alert(jobData);
};

// Create script list
const scriptResp = await fetch("/scripts/");
const scriptData = await scriptResp.json();
scriptSection.innerHTML = scriptData.map(createScriptSelection).join('');
const scriptLookup = Object.fromEntries(scriptData.map(s => [s.Name, s]));
scriptSection.onclick = event => {
    const name = getParentName(event.target, scriptSection);
    for(const e of scriptSection.childNodes) e.classList.toggle("selected", e.getAttribute("data-name") == name);
    if(!name) return;
    console.log(name);
    parameterSection.innerHTML = createParameter(scriptLookup[name]);
};

// Create boxes list
const configData = await getConfig();
boxSection.innerHTML = Object.entries(configData.Endpoints).map(createBoxSelection).join('');
boxSection.onclick = event => {
    const parent = getParentWithName(event.target, boxSection);
    if(!parent) return;
    parent.classList.toggle("selected");
    console.log(parent.getAttribute("data-name"));
};

})();