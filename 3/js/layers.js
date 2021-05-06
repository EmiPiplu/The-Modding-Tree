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
        if (hasUpgrade("f", 13)) mult = mult.mul(upgradeEffect("f", 13))
        if (hasUpgrade("f", 15)) mult = mult.mul(upgradeEffect("f", 15))
        mult = mult.mul(buyableEffect("f", 11))
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
        rows: 5,
        cols: 5,
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
            cost: new ExpantaNum(3),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.f.points.sqrt().add(1)
                if(ret < 1) ret = 1
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, 
        },
        13: {
            title: "Bruris's Blessing",
            description: "Gain the approval and blessing of Bruris increasing faith gain based off of faith",
            cost: new ExpantaNum(10),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.f.points.sqrt().div(3).add(1)
                if(ret < 1) ret = 1
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, 
        },
        14: {
            title: "Divinity Generator",
            description: "Build a divinity generator to generate more divinity. duh.",
            cost: new ExpantaNum(40),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.points.log10().add(1)
                if(ret < 1) ret = 1
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, 
        },
        15: {
            title: "Emnirs Gift",
            description: 'Emnir is willing to give you a small amount of power. "But i will come back and you better make it worth my time" (Boosts Faith production)',
            cost: new ExpantaNum(100),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.points.log10().div(2).add(1)
                if(ret < 1) ret = 1
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, 
        },
        21: {
            title: "Sun Altar",
            description: 'Construct a sun altar to increase light research effect base by .01 per buyable(caps at +1)',
            cost: new ExpantaNum(1e20),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            unlocked() {
                return hasUpgrade("f", 15)
            },
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = getBuyableAmount("f", 11).div(100)
                if (ret > 1) ret = 1
                return ret;
            },
            effectDisplay() { return "+"+ format(this.effect()) }, 
        },
        22: {
            title: "Moon Altar",
            description: 'Construct a moon altar to increase dark research effect base by .01 per buyable (caps at +1)',
            cost: new ExpantaNum(1e50),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            unlocked() {
                return hasUpgrade("f", 15)
            },
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = getBuyableAmount("f", 12).div(100)
                if (ret > 1) ret = 1
                return ret;
            },
            effectDisplay() { return "+"+ format(this.effect()) }, 
        },
    },

    buyables: {
        rows: 1,
        cols: 2,
        11: {
            title: "Light Research",
            cost() {
                let base = new ExpantaNum(10)
                let cost = new ExpantaNum(base).pow(getBuyableAmount(this.layer, this.id).add(1))
                if (buyableEffect("f", 11) > 1e20) cost = cost.pow(3)
                return cost
            },
            display() {
                return `Research the light gods to increase faith by 1.5x + ${upgradeEffect("f", 21)} each upgrade
                Currently: ${format(this.effect().toFixed(3))}x
                Cost: ${format(this.cost().toFixed(3))} Faith
                Amount: ${getBuyableAmount("f", 11)}`
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player.points = hasUpgrade(this.layer, 14) ? player.points : player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade("f", 15)
            },
            effect() {
                let base = new ExpantaNum(1.5)
                if (hasUpgrade("f", 21)) base = base.add(upgradeEffect("f", 21))
                let eff = base.pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
        },
        12: {
            title: "Dark Research",
            cost() {
                let base = new ExpantaNum(20)
                let cost = new ExpantaNum(base).pow(getBuyableAmount(this.layer, this.id).add(1))
                if (buyableEffect("f", 12) > 1e20) cost = cost.pow(3)
                return cost
            },
            display() {
                return `Research the dark gods to increase divinity by 2x + ${upgradeEffect("f", 22)} each upgrade
                Currently: ${format(this.effect().toFixed(3))}x
                Cost: ${format(this.cost().toFixed(3))} Faith
                Amount: ${getBuyableAmount("f", 12)}`
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player.points = hasUpgrade(this.layer, 14) ? player.points : player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade("f", 15)
            },
            effect() {
                let base = new ExpantaNum(2)
                if (hasUpgrade("f", 22)) base = base.add(upgradeEffect("f", 22))
                let eff = base.pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
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
        "Faith": { content: ["main-display", "prestige-button", ["infobox", "Begin",], "milestones", "upgrades", "buyables", "challenges"] },
    },

    
    layerShown(){return true}
})
