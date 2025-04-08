(async () => {

console.log("Loaded index.js");

if (!WebAssembly.instantiateStreaming) { // polyfill
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
    };
}

const go = new Go();
const result = await WebAssembly.instantiateStreaming(fetch("passgen.wasm"), go.importObject);
let mod = result.module;
let inst = result.instance;

const prepare_for_execution = async () => {
    let prefix = document.getElementById("prefix")?.value;

    go.argv = ["passgen-cli"];
    if(prefix) go.argv.push("-p", prefix);

    go.argv.push("/users.txt");
    
    fs.writeFileSync('/users.txt', document.getElementById("users")?.value || "");
}

document.getElementById("runButton").onclick = async () => {
    console.clear();
    await prepare_for_execution();
    await go.run(inst);
    inst = await WebAssembly.instantiate(mod, go.importObject); // reset instance
}

})();