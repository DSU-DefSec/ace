(async () => {
console.log("Javascript Loaded");
createMenu(document.querySelector("header > nav"));

// Applying schema
const schemaResp = await fetch("/db", {
    method: "POST",
    body: `CREATE TABLE IF NOT EXISTS backups (
        "time" INTEGER,
        "box" TEXT,
        "id" INTEGER PRIMARY KEY,
        "data" BLOB
    )`
});
if(!schemaResp.ok) alert(await schemaResp.text());
const configData = await getConfig();

const createBoxSelection = ([name, box]) => `<div data-name="${escHTML(name)}">
<h3>${escHTML(name)}</h3>
<p>${escHTML(box.User)}@${escHTML(box.Host)}:${box.Port}</p>
</div>`;

const createBackupSelection = item => `<div data-name="${escHTML(item.box)}">
<div class="info">
    <h3>${escHTML(ip2box(item.box, configData))}</h3>
    <p>ID: ${escHTML(item.id)}</p>
    <p>${escHTML(item.size)} Bytes</p>
    <p>${escHTML((new Date(item.time * 1000)).toLocaleString())}</p>
</div>
<div class="controls">
    <a download="${escHTML(ip2box(item.box, configData))}_${item.time}.tar.gz" href="/db?format=delimited&q=${encodeURIComponent(`SELECT data FROM backups WHERE id = ${escSQL(item.id)} LIMIT 1`)}" ><button>Download</button></a>
    <a target="dummy" href="/db?q=${encodeURIComponent(`DELETE FROM backups WHERE id = ${escSQL(item.id)}`)}" ><button>Delete</button></a>
    <button class="restore" data-id="${escHTML(item.id)}">Restore</button>
</div></div>`;

// References to elements
const boxSection = document.getElementById("box");
const backupSection = document.getElementById("backup");
const runButton = document.getElementById("run");
const filesInput = document.getElementById("files");

// Create backup list
const backupData = await requestDB("SELECT box,time,id,LENGTH(data) as size FROM backups", "json");
backupSection.innerHTML = backupData.map(createBackupSelection).join('');
for(const e of backupSection.querySelectorAll("button.restore[data-id]")) {
    const id = e.getAttribute("data-id");
    const name = ip2box(getParentName(e, backupSection), configData);
    e.onclick = async event => {
        const body = {
            "Targets": [name],
            "Scripts": ["restore.sh"],
            "Env": {BACKUP_ID: id},
            "NoPassgen": false,
            "Interactive": false,
            "Echo": false
        };
        const res = await fetch("/ssh", {
            method: "POST",
            body: JSON.stringify(body)
        });
        alert(await res.text());
    };
}

// Create box list
boxSection.innerHTML = Object.entries(configData.Endpoints).map(createBoxSelection).join('');
boxSection.onclick = event => {
    const parent = getParentWithName(event.target, boxSection);
    if(!parent) return;
    parent.classList.toggle("selected");

    const selected = Array.from(boxSection.querySelectorAll("div[data-name].selected")).map(e => e.getAttribute("data-name"));
    backupSection.innerHTML = backupData.filter(i => selected.length == 0 || selected.includes(ip2box(i.box, configData))).map(createBackupSelection).join('');
};

// Run button handler
runButton.onclick = async event => {
    // Get an array of all the selected boxes (or all the boxes, if none are selected)
    let selected = Array.from(boxSection.querySelectorAll("div[data-name].selected")).map(e => ip2box(e.getAttribute("data-name"), configData));
    if(selected.length == 0)
        selected = Object.keys(configData.Endpoints);

    // Get FILES (I should really be loading this regex in from the script but oh well)
    const valid = filesInput.value.match(/^((\\\\)*\\[$\\;&|]|[^$\\;&|\n])+$/) && true;
    filesInput.classList.toggle("invalid", !valid);
    if(!valid) return;

    const body = {
        "Targets": selected,
        "Scripts": ["backup.sh"],
        "Env": {FILES: filesInput.value},
        "NoPassgen": false,
        "Interactive": false,
        "Echo": false
    };
    const res = await fetch("/ssh", {
        method: "POST",
        body: JSON.stringify(body)
    });
    alert(await res.text());
    window.location = window.location;
};

})();