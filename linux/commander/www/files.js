(async ()=>{
console.log("Javascript Loaded.");

createMenu(document.querySelector("header > nav"));

// Applying schema
const schemaResp = await fetch("/db", {
    method: "POST",
    body: `CREATE TABLE IF NOT EXISTS files (
        "name" TEXT,
        "type" TEXT,
        "modified" INTEGER,
        "data" BLOB,
        "id" INTEGER PRIMARY KEY
    )`
});
if(!schemaResp.ok) alert(await schemaResp.text());

const getFileList = async () => {
    const listResp = await fetch("/db?format=json", {
        'method': "POST",
        'body': "SELECT name,type,modified,id,LENGTH(data) as size FROM files"
    });
    return await listResp.json();
}

const createFileItem = file => `<div>
<div class="info">
    <h3>${escHTML(file.name)}</h3>
    <div>${new Date(parseInt(file.modified) * 1000).toLocaleString()}</div>
    <div>${file.type}</div>
    <div>${file.size} bytes</div>
</div>
<div class="controls">
    <a href="/db?q=${escHTML(`DELETE FROM files WHERE id = "${escSQL(file.id)}"`)}" target="dummy"><button>Delete</button><a>
    <a download="${escHTML(file.name)}" href="${escHTML(`/db?format=delimited&q=${encodeURIComponent(`SELECT data FROM files WHERE name = "${escSQL(file.name)}"`)} LIMIT 1`)}"><button>Download</button></a>
</div>
</div>`;

const filesSection = document.getElementById("files");
const uploadButton = document.getElementById("upload");
const fileInput = document.getElementById("file");
uploadButton.onclick = async event => {
    const file = fileInput.files[0];
    const hex = Array.from(await file.bytes()).map((b) => b.toString(16).padStart(2, "0")).join("")
    const res = await fetch("/db", {
        "method": "POST",
        "body": `INSERT INTO files (name, modified, type, data) VALUES ("${escSQL(file.name)}",${Math.floor(file.lastModified / 1000)},"${escSQL(file.type)}",x'${hex}')`
    });
    alert(await res.text());
    window.location = window.location;
};

const listData = await getFileList();
filesSection.innerHTML = listData.map(createFileItem).join('');

})();