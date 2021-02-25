let modInfo = {
	name: "The Not So Random Tree",
	id: "RandomnessTree12984",
	author: "EmiPiplu",
	pointsName: "Instabilities",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3",
	name: `Cubism`,
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade("ss", 11)) gain = gain.mul(2)
	if(hasUpgrade("ss", 21)) gain = gain.mul(2)
	if(hasUpgrade("ss", 12)) gain = gain.mul(upgradeEffect("ss",12))
	if(hasUpgrade("ss", 23)) gain = gain.mul(upgradeEffect("ss",23))
	if(hasUpgrade("ss", 22)) gain = gain.pow(1.2)
	gain = gain.mul(layers.um.effect())
	if(hasUpgrade("ss", 33)) gain = gain.mul(2)
	gain = gain.mul(buyableEffect("ss", 11)).add(1)
	
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {

	
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000) // Default is 1 hour which is just arbitrarily large
}