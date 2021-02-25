addLayer("ss", {
    name: "SS Matter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SS", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Semi-Stable Matter", // Name of prestige currency
    baseResource: "Instabilities", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    update(diff) {
        if (hasMilestone("um", 1)) generatePoints("ss", diff);


    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("um", 0) && resettingLayer=="um") keep.push("upgrades")
        if (hasMilestone("c", 0) && resettingLayer=="c") keep.push("upgrades")
        if (hasMilestone("c", 1) && resettingLayer=="um") keep.push("buyables")
        if (hasMilestone("c", 1) && resettingLayer=="c") keep.push("buyables")
       
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },

    buyables: {
        rows: 3,
        cols: 3,
        11: {
            title: "Repeated expansion",
            cost() { return new Decimal(10).mul(getBuyableAmount("ss", 11)).pow(5).mul(15).add(1)  
            

    
        
        
        },
            canAfford() {
              return player.ss.points.gte(this.cost())
            }, 
            unlocked() { return (hasUpgrade("um", 13)) && getBuyableAmount("ss",11).lte(100)},
            display() { 

             let start = "<b><h2>Amount</h2>: " + getBuyableAmount("ss", 11) + "</b><br>"
             let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Instabilities</b><br>"
             let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Semi Stable Matter</b><br>"   
             return "<br>" + start + eff + cost
             },
            
            buy() {
              player.ss.points = player.ss.points.sub(this.cost())
              setBuyableAmount("ss", 11, getBuyableAmount("ss", 11).add(1))
            },
            effect() {
              let effect = new Decimal(1.2).mul(getBuyableAmount("ss", 11).pow(2).add(1))
              return effect
            },
          },

          12: {
            title: "Extra Stable",
            cost() { return new Decimal(getBuyableAmount("ss", 12)).pow(7).mul(15).add(1)  },
            canAfford() {
              return player.ss.points.gte(this.cost())
            }, 
            unlocked() { return (hasUpgrade("um", 13)) && getBuyableAmount("ss",12).lte(100)},
            display() { 

             let start = "<b><h2>Amount</h2>: " + getBuyableAmount("ss", 12) + "</b><br>"
             let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Semi Stable Matter</b><br>"
             let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Semi Stable Matter</b><br>"   
             return "<br>" + start + eff + cost
             },
            
            buy() {
              player.ss.points = player.ss.points.sub(this.cost())
              setBuyableAmount("ss", 12, getBuyableAmount("ss", 12).add(1))
            },
            effect() {
              let effect = new Decimal(1).mul(getBuyableAmount("ss", 12).pow(2).add(1))
              return effect
            },
          },




        },



    upgrades: {
        rows: 4,
        cols: 3,
        11: {
            title: "Rift Tearer",
            description: "Multiply Instability Gain by 2",
            cost: new Decimal(1),
            unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
        },

        12: {
            title: "Expansion",
            description: "Instability Generation Boosted by Semi Stable Matter",
            cost: new Decimal(1),
            unlocked() { return (hasUpgrade(this.layer, 11))},
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.ss.points.add(1).log10(player.ss.points).add(1).mul(2)
                if(hasUpgrade("um", 12)) ret = ret.pow(2)
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, 
        
        },

        13: {
                title: "Better Condensers",
                description: "Gain Twice as much Semi-Stable Matter",
                cost: new Decimal(5),
                unlocked() { return (hasUpgrade(this.layer, 12))},    
        },

        21: {
            title: "Bigger Gatherers",
            description: "Gain Twice as many instabilities. Again",
            cost: new Decimal(10),
            unlocked() { return (hasUpgrade(this.layer, 12))},    
    },
        22: {
             title: "Yet another instability Upgrade",
             description: "Raise Instability gain to the power of 1.2",
            cost: new Decimal(20),
            unlocked() { return (hasUpgrade(this.layer, 13))},    
},
        23: {
            title: "Unstable Instabilities",
            description: "Instabilities boost themselves",
            cost: new Decimal(50),
            unlocked() { return (hasUpgrade(this.layer, 22))},  
            effect() { 
                let ret = player.points.add(1).log10(player.points).add(1)
                if(hasUpgrade("um", 22)) ret = ret.pow(2)
                return ret;
            },  
             effectDisplay() { return format(this.effect())+"x" },
},

        31: {
            title: "Unstable Infuser",
            description: "Instabilities boost Semi Stable Matter Gain.",
            cost: new Decimal(75),
            unlocked() { return (hasUpgrade(this.layer, 23))},  
            effect() { 
                let ret = player.points.add(1).log10(player.points).add(1).div(3).add(1)
                if(hasUpgrade("c", 23)) ret = ret.pow(2)
                return ret;
         },  
             effectDisplay() { return format(this.effect())+"x" },
        
},
      
        32: {
        title: "Self Boosting Stability",
        description: "Semi Stable matter boosts itself",
        cost: new Decimal(75),
        unlocked() { return (hasUpgrade(this.layer, 31))},  
        effect() { 
            let ret = player.ss.points.add(1).log10(player.ss.points).add(1).div(2).add(1)
            if(hasUpgrade("c", 12)) ret = ret.pow(3)
            return ret;
        },  
            effectDisplay() { return format(this.effect())+"x" },

},


        33: {
         title: "Stabilisation",
         description: "Finally Unlock a new layer (also 2x instabilities. again)",
            cost: new Decimal(5000),
            unlocked() { return (hasUpgrade(this.layer, 32))},    
},
        41: {
         title: "Reset Booster",
         description: "Square Unspecialised matter. It's about time it got given a boost",
             cost: new Decimal(1e10),
             unlocked() { return (hasUpgrade("um", 13))},    
},
        42: {
            title: "UMbelievable",
            description: "Raise Unspecialised matter effect to the power of 1.2",
             cost: new Decimal(1e15),
              unlocked() { return (hasUpgrade("ss", 41))},    
},  
        43: {
            title: "Never liked SS matter anyway",
            description: "Unlock 3 new Unspecialised Matter upgrades",
             cost: new Decimal(5e17),
             unlocked() { return (hasUpgrade("ss", 42))},    
},  










    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("ss", 13)) mult = mult.mul(2)
        if(hasUpgrade("ss", 31)) mult = mult.mul(upgradeEffect("ss",31))
        if(hasUpgrade("ss", 32)) mult = mult.mul(upgradeEffect("ss",32))
        if(hasUpgrade("um", 11)) mult = mult.mul(upgradeEffect("um",11))
        if(hasUpgrade("c", 31)) mult = mult.mul(10)
        mult = mult.mul(buyableEffect("ss", 12)).add(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    
    

    hotkeys: [
        {key: "s", description: "Press S to Reset For Semi Stable Matter", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}

    
})