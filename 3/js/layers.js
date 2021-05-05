addLayer("f", {
    name: "Faith", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "f", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "Faith Points", // Name of prestige currency
    baseResource: "Divinity", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    upgrades: {
        rows: 2,
        cols: 4,
        11: {
            title: "Pray harder",
            description: "Add 1 to Divinity production",
            cost: new ExpantaNum(1),
            onPurchase() {
                player.points = player.f.points.sub(this.cost)
            }
        },
        12: {
            title: "Monotheism",
            description: "Focus on one god/goddess at a time increasing divinity production ",
            cost: new ExpantaNum(10),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.f.points.sqrt().add(1)
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, 
        },
    },
    
    
    infoboxes: {
        Begin: {
          title: "Faith",
          body: `Well that was frickin rude... Only one thing to do when a god shoots you down. pray to literally any other god and hope a god more willing to help will hear. Maybe even
          tick off the god that ticked you off. `
          },
    
        },

    tabFormat: {
        "Faith": { content: ["prestige-button", ["infobox", "Begin",], "main-display", "milestones", "upgrades", "buyables"] },
    },

    layerShown(){return true}
})
