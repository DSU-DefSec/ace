(async () => {
console.log("Javascript loaded.");
createMenu(document.querySelector("header > nav"));

const outputPre = document.getElementById("output");

const secretInput = document.getElementById("secret");
const commonInput = document.getElementById("common");
const userInput = document.getElementById("user");
const generateButton = document.getElementById("generate");

generateButton.onclick = async event => {
    outputPre.innerText = (await GeneratePasswordsJS(
        userInput.value
            .split("\n")
            .filter(l => l.length > 0)
            .map(l => secretInput.value + commonInput.value + l)
        )).join('\n');
};


})();
    