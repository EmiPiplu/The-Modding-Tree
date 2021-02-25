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