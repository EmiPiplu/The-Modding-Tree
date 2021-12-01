let modInfo = {
	name: "The Ascension Tree",
	id: "pleasekillmeihavenothingtodowithmylife.",
	author: "Emi",
	pointsName: "Divinity",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.5",
	name: "Pantheon Expansion",
}

let changelog = `<h1>Changelog:</h1><br>
	h3>v0.5</h3><br>
	- More upgrades<br>
	- A new challenge <br>
	- 50 corners cut because i have no idea what im doing<br>
	<h3>v0.4.1</h3><br>
	- A single upgrade.<br>
	- Slapped the developer back into TMT development <br>
	- Cleaned out some nuclear waste.<br>
	<h3>v0.4</h3><br>
	- 2 New layers.<br>
	- Retrieved Challenges from the shark pits. was hell to patch them up from being eaten.<br>
	- Removed the shark pool as there is nothing to feed them.<br>
	<h3>v0.3</h3><br>
	- More Upgrades.<br>
	- There is actually something to do now.<br>
	- Threw challenges to the shark pits for being annoying<br>
	<h3>v0.2</h3><br>
	- More Upgrades.<br>
	- Banished infinity to another dimension for breaking the game.<br>
	<h3>v0.1</h3><br>
		- Implemented story and first 2 upgrades.<br>
		- Removed more nukes.<br> 
	<h3>v0.0</h3><br>
		- Basic Mod setup<br>
		- Removed hidden nuclear bombs from the code.<br>
	`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(1)
	
	if (hasUpgrade("f", 11)) gain = gain.plus(1)
	if (hasChallenge("p", 11)) gain = gain.plus(1)
	if (hasUpgrade("f", 12)) gain = gain.mul(upgradeEffect("f", 12))
	if (hasUpgrade("f", 14)) gain = gain.mul(upgradeEffect("f", 14))
	gain = gain.mul(buyableEffect("f", 12))
	if (hasUpgrade("d", 13)) gain = gain.mul(upgradeEffect("d", 13))

	if (inChallenge("p", 11)) gain = gain.sqrt()

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
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}