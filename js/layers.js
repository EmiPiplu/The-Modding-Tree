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



addLayer("K", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
    }},

    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "Keys",            // The name of this layer's main prestige resource.
    row: "side",                                 // The row this layer is on (0 is the first row).

    buyables: {
        rows: 3,
        cols: 3,
        11: {
            title: "SS Key",
            cost() { return new Decimal(1e22)
            

    
        
        
        },
            canAfford() {
              return player.ss.points.gte(this.cost())
            }, 
            unlocked() { return (hasUpgrade("um", 23)) && getBuyableAmount("K",11).lte(0)},
            display() { 

            
             let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Semi Stable Matter</b><br>"   
             return "<br>" + cost
             },
            
            buy() {
              player.ss.points = player.ss.points.sub(this.cost())
              setBuyableAmount("K", 11, getBuyableAmount("K", 11).add(1))
            },
            
          },

          12: {
            title: "UM Key",
            cost() { return new Decimal(1e9)  },
            canAfford() {
              return player.um.points.gte(this.cost())
            }, 
            unlocked() { return (hasUpgrade("um", 23)) && getBuyableAmount("K",12).lte(0)},
            display() { 

            
             let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Unspecialised Matter</b><br>"   
             return "<br>" + cost
             },
            
            buy() {
              player.um.points = player.um.points.sub(this.cost())
              setBuyableAmount("K", 12, getBuyableAmount("K", 12).add(1))
            },

        },
           
            21: {
                title: "Click Key",
                cost() { return new Decimal(1)  },
                canAfford() {
                  return player.ss.points.gte(this.cost())
                }, 
                unlocked() { return (hasUpgrade("um", 23)) && getBuyableAmount("K",21).lte(99)},
                display() { 
    
                
                    let start = "<b><h2>Amount</h2>: " + getBuyableAmount("K", 21) + "</b><br>"  
                 return "<br>" + start 
                 },
                
                buy() {
                  player.ss.points = player.ss.points.sub(this.cost())
                  setBuyableAmount("K", 21, getBuyableAmount("K", 21).add(1))
                },

      
          },
      
          22: {
            title: "Open The Gates",
            cost() { return new Decimal(0)  },
            canAfford() {
              return player.ss.points.gte(this.cost())
            }, 
            unlocked() { return getBuyableAmount("K",11).equals(1) && getBuyableAmount("K",12).equals(1) && getBuyableAmount("K",21).equals(100) && getBuyableAmount("K",22).lte(0)},
            display() { 

            
                let start = "Open the gates to a new layer. Requires the 3 keys and for Emi to have released V0.3"  
             return "<br>" + start 
             },
            
            buy() {
              player.ss.points = player.ss.points.sub(this.cost())
              setBuyableAmount("K", 22, getBuyableAmount("K", 22).add(1))
            },

  
      },



    },

    layerShown() { return true }            // Returns a bool for if this layer's node should be visible in the tree.
    })


    addLayer("L", {
        startData() { return {                  // startData is a function that returns default data for a layer. 
            unlocked: true,                     // You can add more variables here to add them to your layer.
        }},
    
        color: "#4BDC13",                       // The color for this layer, which affects many elements.
        resource: "Lore",            // The name of this layer's main prestige resource.
        row: "side",  
         
        

        infoboxes: {
            story: {
              title: "The Beginning",
              body: `Everything is in Darkness the world as humanity knew it destroyed. While Drifting through the endless void you feel a disturbance. a hole
              in existance itself where the universe seems to be destabilising. you feel the hole and the emerging void gathering around you. you decide to call
              this void energy "instabilities"`
              },
            ss: {
                title: "Semi Stable Matter",
                unlocked() { return player.ss.points.gte(1)}, 
                body: `You continue gathering instabilities around you while thinking "Damn this stuff is useless" in which you were right because instabilities do absolutely
                nothing. you sit for days on end thinking until one day the instabilities grew so concentrated around you that with a tiny bit of "encouragement" all your 
                instabilities collapsed into a small sphere you couldnt see it. but you felt it there. quivering slowly. keeping this in mind you call this new discovery
                "Semi Stable Matter".  `
                
                },
                ssu: {
                    title: "SS Upgrades",
                    unlocked() { return hasUpgrade("ss", 13)},
                    body: `as this new matter gravitates around you a realisation dawns on you. the Matter floats to the void and is consumed. you begin to feel the instabilities
                    flow out faster and faster. using this you continue to gather more SS matter until you discover another breakthrough. surrounding yourself in this matter and
                    compressing it makes the instability concentration higher allowing for gaining more SS Matter for less. While you did this you fashioned yourself a rudimentary
                    eye from the matter since you got a little bored of the darkness.`
                    }, 
                    acclimitisation: {
                        title: "Adjusting to life",
                        unlocked() { return hasUpgrade("ss", 23)},
                        body: `Your rudimentary eye didnt work of course. so you kept producing and using the SS matter to boost production. pouring more of the matter into the
                        eye until eventually you adjusted. you could finally see the black energy of instability and the bright green glow of SS matter. you still couldnt move
                        or do anything else though since a floating eye isnt good for much else other than seeing`
                        },    
                     UM: {
                        title: "Unspecialised Matter",
                        unlocked() { return player.um.points.gte(1)}, 
                        body: `you continue your work improving your production. you get an idea to try and compress the SS matter together like you did with the instabilities to
                        see if that will do anything. in a flash of light all of the SS matter vanishes into a small purple sphere. looking at the void you had grown it had shrunk 
                        back to a tiny scale. as you release the sphere it circles the void and then the void grows larger. You go around repeating the steps trying to reach back to
                        the point in where you had a lot of SS matter to play around with. you called this new point "unspecialised matter" since you saw potential in it.  `
                            
                         },    
                        UMilestones: {
                        title: "Milestones?",
                        unlocked() { return player.um.points.gte(20)}, 
                        body: `just as you had regained what you lost the same flash of light collapsed everything. restarting from scratch with a small boost really is annoying
                        your research efforts go towards maintaining the void whenever your SS matter collapses. after many months of research you found a method of bracing the 
                        edge of the void with Unspecialised Matter. this allowed it to retain upgrades made to it using SS matter. it had still shrunk due to the collapse of all
                        instabilities and SS matter though but not to as much of an extreme degree. after another few months you also manage to fit the void with a mechanism that 
                        will automatically collapse instabilities into SS matter while leaving enough instabilities for other projects.`
                                
                             }, 
                         Keys: {
                             title: "Keys",
                             unlocked() { return hasUpgrade("um", 23)},
                             body: `Using the Unspecialised matter that has been built up you constructed a shell around yourself that allowed for movement. being able to stay in that
                             one spot was limiting anyway. floating around your workspace you only just realise how much stuff you have amassed. a sparkle in the distance catches your eye.
                             floating towards it you see 4 orbs. one of which reacts with SS matter. one with UM and the other with general touch and the final one was unreactive. 
                              you had plenty of these types of matter so you feed the orbs until they float towards the unreactive one and merge with it. with every touch the 3rd orb glows
                              brighter until it merged with the other orb. it remains unreactive but a small number appears on the orb. "0.3"`
                                        
                                     }, 
                         ZeroThree: {
                            title: "0.3",
                            unlocked() { return player.c.points.gte(1)},
                            body: `You Pondered for weeks and weeks wondering just what this "0.3" could mean. in the distance you saw a structure forming. With this discovery the 
                            orb began to glow the more this mysterious structure was built. after months of waiting the orb had disappeared and in its place was an arrow pointing to the
                            building. it was glowing with the power of the 3 other keys. on tapping the orb it disappeared. the gates of this building opening revealing a small altar. that altar
                            glowed when exposed to the semi stable matter. you put some matter onto the altar but nothing happened. you kept producing more and more until eventually it too collapsed
                            into a cube. Its a cube so "Cubic Matter" makes sense. After this though all your Semi Stable Upgrades had disappeared. looks like the Void could do with a little more reinforcing.`
                                                   
                                                }, 
                        Re: {
                             title: "Re-Reinforcement",
                             unlocked() { return hasMilestone("c", 0)},
                             body: `After building up some Cubic matter you could finally use this to reinforce the void in the same way unspecialised matter did. With this you were 
                             finally ready to continue building up your supplies. Splitting a cube into smaller squares should do the trick. 
                             
                             5 days Later.
                             
                             Using enough squares i managed to split a cube but the squares did not appear. all that happened was squares were imprinted onto several previous enhancements.
                             maybe some cubic matter will enhance them a bit. Its worth a try
                             `
                                                                           
                                 }, 
                        Time: {
                            title: "Time",
                            unlocked() { return hasUpgrade("c", 33)},
                            body: `as you reconstruct the cube you notice a strange feeling you havent felt in a while. as if time was actually passing again. with every passing second
                            Time was manifesting itself as Time points. as of right now though. You have no purpose for them. Great. No sign of the world you used to know of too.`
                             },
      
            },
           tabFormat: [["infobox", "story",], ["infobox", "ss",], ["infobox", "ssu",], ["infobox", "acclimitisation",], ["infobox", "UM",], ["infobox", "UMilestones",], ["infobox", "Keys",], ["infobox", "ZeroThree",], ["infobox", "Re",], ["infobox", "Time",]],
        
       
    
    
       
        
        
        
        layerShown() { return true },

    })