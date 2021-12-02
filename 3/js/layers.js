addLayer("f", {
    name: "Faith", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
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
        mult = mult.mul(tmp.d.effect)
        if (inChallenge("p", 12) || hasChallenge("p", 12)) mult.pow(upgradeEffect("f", 21).add(upgradeEffect("f", 22).add(1)))
    
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1)
        if (inChallenge("p", 12) || hasChallenge("p", 12)) exp = exp.add(upgradeEffect("f", 22).div(70))
        if (inChallenge("p", 12) || hasChallenge("p", 12)) exp = exp.add(upgradeEffect("f", 21).div(70))
        return exp
        
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    passiveGeneration(){
        if (hasMilestone("p", 1)) return 0.01
    },
    
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("p", 0) && resettingLayer=="p") keep.push("upgrades")

       
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },

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
                let cap = new ExpantaNum("1e2000")
                if(hasUpgrade("d", 21)) cap = new ExpantaNum("1e2100")
                let ret = player.f.points.sqrt().div(3).add(1)
                if (inChallenge("p", 11) || hasChallenge("p", 11)) ret = ret.pow(1.5)
                if (ret.gte(cap)) ret = cap 
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
                let cap = new ExpantaNum(1)
                if (hasUpgrade("d", 15)) cap = cap.add(2)
                let ret = getBuyableAmount("f", 11).div(100)
                if (ret > cap) ret = cap
                
                if (!hasUpgrade("f", 21)) ret = 0
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
                let cap = new ExpantaNum(1)
                if (hasUpgrade("d", 15)) cap = cap.add(2)
                let ret = getBuyableAmount("f", 12).div(100)
                if (ret > cap) ret = cap
                if (!hasUpgrade("f", 22)) ret = 0
                return ret;
            },
            effectDisplay() { return "+"+ format(this.effect()) }, 
        },
        23: {
            title: "Recruitment",
            description: 'Unlock a new Layer',
            cost: new ExpantaNum(1e130),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            unlocked() {
                return hasUpgrade("f", 22)
            },
           
        },
        24: {
            title: "Reflection of Tuena",
            description: 'Decrease the dark research cost base by 2',
            cost: new ExpantaNum("1e2800"),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            unlocked() {
                return hasUpgrade("d", 15)
            },
           
        },
        25: {
            title: "Shine of Rudon",
            description: 'Decrease the light research cost base by 2',
            cost: new ExpantaNum("1e2985"),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            unlocked() {
                return hasUpgrade("d", 15)
            },
           
        },
    },

    buyables: {
        rows: 1,
        cols: 2,
        11: {
            title: "Light Research",
            cost() {
                let base = new ExpantaNum(10)
                if (buyableEffect("f", 11) > 1e100) base = base.add(5)
                if (hasUpgrade("f", 25)) base = base.sub(2)
                let cost = new ExpantaNum(base).pow(getBuyableAmount(this.layer, this.id).add(1))
                if (buyableEffect("f", 11) > 1e20) cost = cost.pow(3)
                if (buyableEffect("f", 11) > 1e60) cost = cost.pow(3)
                
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
                if(inChallenge("p", 12)) eff = 1
                return eff
            },
        },
        12: {
            title: "Dark Research",
            cost() {
                let base = new ExpantaNum(20)
                if (buyableEffect("f", 12) > 1e100) base = base.add(5)
                if (hasUpgrade("f", 24)) base = base.sub(2)
                let cost = new ExpantaNum(base).pow(getBuyableAmount(this.layer, this.id).add(1))
                if (buyableEffect("f", 12) > 1e20) cost = cost.pow(3)
                if (buyableEffect("f", 12) > 1e60) cost = cost.pow(3)
                
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
                if(inChallenge("p", 12)) eff = 1
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

addLayer("d", {
    name: "Devotees", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        DevoteeGains: new ExpantaNum(11),
        Influence: new ExpantaNum(0),
    }},
    color: "#FFFF00",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "Devotees", // Name of prestige currency
    baseResource: "DevoteeGains", // Name of resource prestige is based on
    baseAmount() {return player.d.DevoteeGains}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if(hasUpgrade("d", 12)) mult = mult.mul(upgradeEffect("d", 12))
        if(hasUpgrade("d", 12)) mult = mult.mul(2)
        if(hasUpgrade("d", 13)) mult = mult.mul(2)
        if(hasUpgrade("d", 14)) mult = mult.mul(3)
        if(hasUpgrade("d", 15)) mult = mult.mul(2)
        if(hasUpgrade("d", 21)) mult = mult.mul(2)
        
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    effect(){
        let eff = player.d.points.sqrt().add(1)

        return eff
    },
    effectDescription() {
        let desc = "which boost Faith gain by "+ format(this.effect())
        
        return desc
    },

    update(diff) {
        if (hasUpgrade("d", 11)) generatePoints("d", diff);
        if (player.d.points.gte(5000000)) player.d.points = new ExpantaNum(5000000)

    },
    

    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "Fresh Meat",
            description: "Begin Recruiting Devotees Every upgrade doubles devotee gain unless stated with a (NB).",
            cost: new ExpantaNum(0),
            onPurchase() {
                player.points = player.d.points.sub(this.cost)
            }
        },
        12: {
            title: "Multi Level Marketing",
            description: "Pseople go out and find more people who in turn find more people. Result:Profit ",
            cost: new ExpantaNum(15),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.d.points.sqrt().add(1)
                if(ret < 1) ret = 1
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, 
        },
        13: {
            title: "Divine Training",
            description: "Instruct Devotees on the nature of each god increasing divinity.",
            cost: new ExpantaNum(50),
            onPurchase() {
                player.points = player.points.sub(this.cost)
            },
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.d.points.add(1)
                if(ret < 1) ret = 1
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, 
            unlocked() {
                return hasUpgrade("d", 12)
            }, 
        },
        14: {
            title: "Pantheon",
            description: "Devotees build a pantheon to pray and communicate with the gods. triples devotee gain and unlocks the pantheon layer (NB)",
            cost: new ExpantaNum(500),
            onPurchase() {
                player.points = player.points.sub(this.cost)
                
            },
            unlocked() {
                return hasUpgrade("d", 13)
            }, 
        },
        15: {
            title: "Duality Shrines",
            description: "Build shrines around the sun and moon altars increasing the cap of both by 2",
            cost: new ExpantaNum(100000),
            onPurchase() {
                player.points = player.points.sub(this.cost)
                
            },
            unlocked() {
                return hasChallenge("p", 11)
            }, 
        },
        21: {
            title: "Bruris's Sacrifice",
            description: "For every pantheon challenge increase bruris's blessing cap by 1e50",
            cost: new ExpantaNum(1000000),
            onPurchase() {
                player.points = player.points.sub(this.cost)
                
            },
            unlocked() {
                return hasChallenge("p", 12)
            }, 
        },
    },



    milestones: {
        0: {
            requirementDescription: "5,000,000 Devotees",
            effectDescription: "Unlock influence",
            done() { return player.d.points.gte(5000000) }
        },
        1: {
            requirementDescription: "Convert the world.",
            effectDescription: "Unlock ???",
            done() { return player.d.points.gte(7.9e9) }
        },

        
    },
    

    
    infoboxes: {
        Devotion: {
          title: "Recruitment",
          body: `If one person praying alone can make the gods hear you like this. who knows the power they would be willing to lend us if there are lots of people doing it. Also gives a headstart
          when you finally ascend to godhood yourself`
          },
    
        },

    tabFormat: {
        "Faith": { content: ["main-display", ["infobox", "Devotion",], "milestones", "upgrades", "challenges"] },
    },

    
    layerShown(){return hasUpgrade("f", 23)}
})

addLayer("p", {
    name: "Pantheon", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new ExpantaNum(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#FF0000",                       // The color for this layer, which affects many elements.
    resource: "Completions",            // The name of this layer's main prestige resource.
    row: 2,
    position: 1,                                 // The row this layer is on (0 is the first row).

    baseAmount() { return player.points },  // A function to return the current amount of baseResource.



    type: "custom",                         // Determines the formula used for calculating prestige currency.

    getResetGain() {
        return new ExpantaNum(0)
},
    getNextAt(){
        return new ExpantaNum(0)
},
    canReset(){
        return false
    },

    challenges: {
        11: {
            name: "Bruris I",
            challengeDescription: `"After all this time you have grown quite influential. Show me your skill and i will lend you more of my power to achieve your goals." Divinity gain is square rooted
            but during the challenge bruris's blessing is raised to the 1.5th power`,
            goal: new ExpantaNum("1e200"),
            rewardDescription: "Bruris's blessing buff remains outside the challenge",
            onComplete(){
                player.p.points = player.p.points.add(1)

            },
        },
        12: {milestones: {
        0: {
            requirementDescription: "1 challenge completion (1)",
            effectDescription: "Keep faith upgrades on entering pantheon challenges.",
            done() { return player.p.points.gte(1) }
        },
        1: {
            requirementDescription: "2 challenge completions (2)",
            effectDescription: "Gain 1% of faith gain per second",
            done() { return player.p.points.gte(2) }
        },
        
    },
            name: "Brola I",
            challengeDescription: `"It seems that your research is powerful but it goes against our ways. Show me your power without it and i can grant you my power." Both research buyables
            are disabled but upgrades affecting them also affect faith exponent`,
            goal: new ExpantaNum("1e1500"),
            rewardDescription: "Faith exponent boost is kept outside of the challenge.",
            onComplete(){
                player.p.points = player.p.points.add(1)

            },
        },
    },

    

    infoboxes: {
        Pantheon: {
          title: "Pantheon",
          body: `With the pantheon in place the gods can interact with mortals even more by creating dreamscapes to test the abilities of those that seek their aid. During and after these challanges
          all progress will be reset until later on`
          },
    
        },

    tabFormat: {
        "Pantheon": { content: [["infobox", "Pantheon",], "milestones", "challenges"] },
    },



    layerShown(){if (hasUpgrade("d", 14) || player.p.unlocked) return true}            // Returns a bool for if this layer's node should be visible in the tree.
})


