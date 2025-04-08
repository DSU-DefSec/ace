window.createMenu = async container => {
console.log("Cooking hamburger...");

const menuResp = await fetch('/www/menu.json');
const menuData = await menuResp.json();

const createMenuItem = item => `<a href="${escHTML(item.url)}">${escHTML(item.name)}</a>`;

container.innerHTML = `<img alt="MENU" src="hamburger.png"><div>${menuData.map(createMenuItem).join('')}</div>`;

const doneness = Math.random();
     if(doneness < 0.2) console.log("It's raw!");
else if(doneness < 0.4) console.log("It's medium-rare!");
else if(doneness < 0.6) console.log("It's medium!");
else if(doneness < 0.8) console.log("It's medium-well!");
else                    console.log("It's well done!");
};