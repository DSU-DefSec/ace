(async () => {
console.log("Javascript Loaded.");
createMenu(document.querySelector("header > nav"));

const asciicast2plaintext = a => a
    .split('\n')
    .filter(l => l.length > 0)
    .map(l => JSON.parse(l))
    .filter(o => o[1] == "o")
    .map(o => o[2]).join('');

const createJobSelection = ([time, name]) => `<div data-name="${escHTML(time)}_${escHTML(name)}">
<h3>${escHTML(name)}</h3>
<p>${escHTML((new Date(time)).toLocaleString())}</p>
</div>`;

const createBoxSelection = name => `<div data-name="${escHTML(name)}">
<h3>${escHTML(name)}</h3>
</div>`;

const outResp = await fetch("/output");
const outData = await outResp.json();

const jobSection = document.getElementById("job");
const boxSection = document.getElementById("box");
const dlRaw = document.getElementById("dlRaw");
const dlCast = document.getElementById("dlCast");

jobSection.innerHTML = Object.keys(outData).map(s => createJobSelection(s.split(/_(.*)/s))).join('');
jobSection.onclick = event => {
    const name = getParentName(event.target, jobSection);
    for(const e of jobSection.childNodes)
        e.classList.toggle("selected", e.getAttribute("data-name") == name);
    if(!name) return;
    console.log(name);
    boxSection.innerHTML = outData[name].map(createBoxSelection).join('');
};

let player = null;
boxSection.onclick = event => {
    const name = getParentName(event.target, boxSection);
    for(const e of boxSection.childNodes)
        e.classList.toggle("selected", e.getAttribute("data-name") == name);
    if(!name) return;

    const job = jobSection.querySelector("div.selected").getAttribute("data-name");
    const box = boxSection.querySelector("div.selected").getAttribute("data-name");

    const url = `/output/${job}/${box}`;
    
    dlCast.href = url;
    dlCast.download = `${job}_${box}`;

    dlRaw.download = `${job}_${box.replace(/\.cast$/,".txt")}`;
    dlRaw.href = "about:blank"
    dlRaw.onclick = async event => {
        if(dlRaw.href != "about:blank") return;
        event.preventDefault();

        const res = await fetch(url);
        const data = await res.text();
        dlRaw.href = "data:text/plain," + encodeURIComponent(asciicast2plaintext(data));
        dlRaw.click();
    };

    if(player) player.dispose();
    player = AsciinemaPlayer.create(
        url,
        document.getElementById('player'),
        {
            terminalFontSize: "12px",
            cols: 160,
            rows: 48
        }
    );
};

})();