addLayer("um", {
    name: "Unspecialised Matter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "UM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#C638DB",
    requires: new Decimal(5000), // Can be a function that takes requirement increases into account
    resource: "Unspecialised matter", // Name of prestige currency
    baseResource: "Semi-Stable Matter", // Name of resource prestige is based on
    baseAmount() {return player.ss.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent
    branches: ["ss"],
    effect(){
        let eff = player.um.points.add(1)
        eff = eff.pow(1.01)
        if(hasUpgrade("ss", 42)) eff = eff.pow(1.2)
        return eff
    },
    effectDescription() {
        return "Which boosts Instabilities gain by "+format(this.effect())
    },
    upgrades: {
        rows: 2,
        cols: 3,
        11: {
            title: "Overclocked Stabiliser",
            description: "Unspecialised Matter boosts Semi Stable Matter gain",
            cost: new Decimal(1), 
            effect() { 
                let ret = player.um.points.add(1).sqrt(player.um.points).add(2)
                return ret;
            },  
                effectDisplay() { return format(this.effect())+"x" },
    
    },

        12: {
            title: "Double Expansion",
            description: "Square <b>Expansion<b>.",
            cost: new Decimal(3), 
            unlocked() { return (hasUpgrade(this.layer, 11))},
},
        13: {
            title: "Repeatable Instabilities",
            description: "Unlock 2 SS buyables.",
            cost: new Decimal(10), 
            unlocked() { return (hasUpgrade(this.layer, 12))},
},


        21: {
         title: "UnStable",
            description: "Instabilities VERY SLIGHTLY boost Unspecialised Matter",
         cost: new Decimal(1000000), 
         unlocked() { return (hasUpgrade("ss", 43))},
         effect() { 
             let ret = player.points.log10(player.points).log10(player.points)
             if(hasUpgrade("c", 11)) ret = ret.pow(3)
             if(hasUpgrade("c", 21)) ret = ret.pow(2)
             if(hasUpgrade("c", 22)) ret = ret.pow(2)
               return ret;
           },  
             effectDisplay() { return format(this.effect())+"x" },

},

        22: {
            title: "Self Booster Boost",
            description: "Squares <b>Unstable Instabilities<b>",
            cost: new Decimal(5000000), 
            unlocked() { return (hasUpgrade(this.layer, 21))},
},

        23: {
            title: "Key Condenser",
            description: "Allows you to condense various materials for a key to the next layer",
         cost: new Decimal(50000000), 
         unlocked() { return (hasUpgrade(this.layer, 22))},
},  
    
    },





    milestones: {

        0: {
            requirementDescription: "5 Unspecialised matter",
            effectDescription: "Keep all SS Matter Upgrades",
            done() { return player.um.points.gte(5) }
        },
        1: {
            requirementDescription: "20 Unspecialised matter",
            effectDescription: "100% of SS matter every second.",
            done() { return player.um.points.gte(20) }
        },
    },
    
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("um", 21)) mult = mult.mul(upgradeEffect("um", 21))
        if(hasUpgrade("c", 32)) mult = mult.mul(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
         

        exp = new Decimal(1)
        if(hasUpgrade("ss", 41)) exp = exp.add(1)

        return exp 
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)

    hotkeys: [
        {key: "u", description: "Press U to Reset For Unspecialised Matter", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],


    layerShown() {
        let shown = hasUpgrade("ss", 33)
        if(player.um.unlocked) shown = true
        return shown}

        
        
    
})

addLayer("c", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "FF0A0A",                       // The color for this layer, which affects many elements.
    resource: "Cubic Matter",            // The name of this layer's main prestige resource.
    row: 1,
    position: 1,                                 // The row this layer is on (0 is the first row).
    branches: ["ss"],
    baseResource: "Semi Stable Matter",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.ss.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e25),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.2,   

    tabFormat: {
        "Cubic": { content: ["main-display", "prestige-button", "milestones", "upgrades"] },
        "Square": { content: [["infobox", "Oops",]]  },
        "Triangle": { content: [["infobox", "Oops",]]  },
        "Scraps": { content: [["infobox", "Oops",]]  },
      },

      

    milestones: {

        0: {
            requirementDescription: "5 Cubic Matter",
            effectDescription: "Keep all SS Matter Upgrades",
            done() { return player.c.points.gte(5) }
        },
        1: {
            requirementDescription: "20 Cubic Matter",
            effectDescription: "Keep SS buyables on Reset",
            done() { return player.c.points.gte(20) }
        },
    },
    
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            title: "Cubic Booster",
            description: "Cube <b>UnStable<b> effect",
            cost: new Decimal(1),   
        },
        12: {
            title: "Cubes Everywhere",
            description: "Cube <b>Self Boosting Stability<b>",
            cost: new Decimal(2),  
            unlocked() { return (hasUpgrade(this.layer, 11))}, 
        },
        13: {
            title: "Cube Splitter",
            description: "Split a Cube unlocking 6 upgrades",
            cost: new Decimal(10),   
            unlocked() { return (hasUpgrade(this.layer, 12))},
        },
        21: {
            title: "A face of the Cube",
            description: "Square <b>UnStable<b>",
            cost: new Decimal(15),   
            unlocked() { return (hasUpgrade(this.layer, 13))},
        },
        22: {
            title: "How About A Little More",
            description: "Square <b> UnStable <b>",
            cost: new Decimal(20),   
            unlocked() { return (hasUpgrade(this.layer, 13))},
        },
        23: {
            title: "Unstable Squares",
            description: "Square <b>Unstable Infuser<b>",
            cost: new Decimal(200),   
            unlocked() { return (hasUpgrade(this.layer, 13))},
        },
        31: {
            title: "SS Reformer",
            description: "Multiply SS matter gain by 10",
            cost: new Decimal(300),   
            unlocked() { return (hasUpgrade(this.layer, 13))},
        },
        32: {
            title: "UM Reformer",
            description: "Multiply UM gain by 10",
            cost: new Decimal(350),  
            unlocked() { return (hasUpgrade(this.layer, 13))}, 
        },
        33: {
            title: "Cube Reformer",
            description: "Double Cube Gain",
            cost: new Decimal(500),
            unlocked() { return (hasUpgrade(this.layer, 13))},  
        },
},

infoboxes: {
    Oops: {
      title: "Under Construction",
      body: `The Feature you are looking for is unavailable. it may still be under construction or the creator may just not know how to implement these features correctly.
      expect these features in a later release`
      },
    },



    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("c", 33)) mult = mult.mul(2)
        return mult
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return getBuyableAmount("K",22).equals(1) }            // Returns a bool for if this layer's node should be visible in the tree.
})



addLayer("tp", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),  
        Base: new Decimal(10),           // "points" is the internal name for the main resource of the layer.
    }},

    color: "#F5FF0A",                       // The color for this layer, which affects many elements.
    resource: "Time Points",            // The name of this layer's main prestige resource.
    row: 1, 
    position: 0,  
    branches: ["c", "ss"],                              // The row this layer is on (0 is the first row).

    baseResource: "Seconds",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.tp.Base },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",
    exponent: "0.5",                         // Determines the formula used for calculating prestige currency.
    
    update(diff) {
     generatePoints("tp", diff);
    },
 
    buyables: {
        rows: 3,
        cols: 3,
        11: {
            title: "Time Dilation",
            cost() { return new Decimal(10).pow(new Decimal(1).add(getBuyableAmount("tp", 11)))  
            

    
        
        
        },
            canAfford() {
              return player.tp.points.gte(this.cost())
            }, 
            unlocked() { return true},
            display() { 

             let start = "<b><h2>Amount</h2>: " + getBuyableAmount("tp", 11) + "</b><br>"
             let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Time Speed</b><br>"
             let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Time Points</b><br>"   
             return "<br>" + start + eff + cost
             },
            
            buy() {
              player.tp.points = player.tp.points.sub(this.cost())
              setBuyableAmount("tp", 11, getBuyableAmount("tp", 11).add(1))
            },
            effect() {
              let effect = new Decimal(2).pow(getBuyableAmount("tp", 11))
              return effect
            },
            Timespeed(){
               

                player.devSpeed = new Decimal(1)
                player.devSpeed = new Decimal(2).sub(1).mul(buyableEffect("tp", 11)) 

            },
  
        },
        },
   

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    tabFormat: {
        "Time": { content: [["infobox", "Hereweare",], "main-display", "milestones", "upgrades", "buyables"] },
    },

    infoboxes: {
        Hereweare: {
            title: "Time",
            body: `For Some reason Cubic matter allows time to pass now. 1 time point per second for now. But you guessed it. UPGRADES`
            },


    },

    

    layerShown() { return  (hasUpgrade("c", 33)) },            // Returns a bool for if this layer's node should be visible in the tree.
})