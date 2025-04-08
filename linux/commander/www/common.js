const escSQL = text => text.replace(/\\/g, "\\\\").replace(/\x00/g, "\\0").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/'/g, "\\'").replace(/"/g, "\\\"").replace(/\x1A/g, "\\z");

// Adapted from https://stackoverflow.com/a/6234804
const escHTML = text => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, "<br>");

const getParentWithName = (cur, maxParent) => {
    while(cur.getAttribute("data-name") == null && cur != maxParent)
        cur = cur.parentElement;
    if(cur == maxParent) return null;
    else                 return cur;
};

const getParentName = (cur, maxParent) => getParentWithName(cur, maxParent)?.getAttribute("data-name");

const getConfig = async () => await (await fetch("/config")).json();

const ip2box = (ip, config)  => Object.entries(config.Endpoints).filter(([name, data]) => data.Host == ip)[0][0];
const box2ip = (box, config) => config.Endpoints[box].host;

const requestDB = async (body, format) => {
    const res = await fetch(
        `/db?format=${encodeURIComponent(format || "")}`,
        {
            method: "POST",
            body: body
        }
    );
    if(format == "json" && res.ok)
        return await res.json();
    else
        return await res.text();
};

// This should really be a wasm module
const GeneratePasswordsJS = async secrets => {
    const res = await fetch("/passgen/", {
        method: "POST",
        body: JSON.stringify(Array.from(secrets).map(o => o.toString()))
    });
    
    if(!res.ok)
        return await res.text();
    else
        return await res.json();
};