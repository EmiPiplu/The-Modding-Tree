addLayer("I", {
    name: "Interest", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Interest ", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("I", 14)) mult = mult.mul(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
  
   upgrades: {
        rows: 6,
        cols: 6,
        11: {
            title: "Welcome To Idol Hell",
            description: "Begin producing points",
            cost: new Decimal(1),
            unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
        },
        12: {
            title: "Phone a Friend",
            description: "Double the people double the fun. double the fun double the points",
            cost: new Decimal(2),
            unlocked() { return (hasUpgrade(this.layer, 11)) }, // The upgrade is only visible when this is true
        },
        13: {
            title: "Playlist",
            description: "Put together a playlist with all the best idol songs. Boost points based on interest",
            cost: new Decimal(4),
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.I.points.add(1).log10(player.I.points).add(1).mul(2)
              
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" },
            unlocked() { return (hasUpgrade(this.layer, 12)) }, // The upgrade is only visible when this is true
        },
        14: {
            title: "Embrace Reality",
            description: "An idol isn't just an anime concept they exist in real life. Lets look into that Doubles Interest Gain",
            cost: new Decimal(7),
            unlocked() { return (hasUpgrade(this.layer, 13)) }, // The upgrade is only visible when this is true
        },
        15: {
            title: "Placeholder",
            description: "Placeholder text",
            cost: new Decimal("1.79e308"),
            unlocked() { return (hasUpgrade(this.layer, 14)) }, // The upgrade is only visible when this is true
        },
        16: {
            title: "Placeholder",
            description: "Placeholder text",
            cost: new Decimal("1.79e308"),
            unlocked() { return (hasUpgrade(this.layer, 14)) }, // The upgrade is only visible when this is true
        },
        21: {
            title: "Placeholder",
            description: "Placeholder text",
            cost: new Decimal("1.79e308"),
            unlocked() { return (hasUpgrade(this.layer, 14)) }, // The upgrade is only visible when this is true
        },
        22: {
            title: "Placeholder",
            description: "Placeholder text",
            cost: new Decimal("1.79e308"),
            unlocked() { return (hasUpgrade(this.layer, 14)) }, // The upgrade is only visible when this is true
        },
        23: {
            title: "Placeholder",
            description: "Placeholder text",
            cost: new Decimal("1.79e308"),
            unlocked() { return (hasUpgrade(this.layer, 14)) }, // The upgrade is only visible when this is true
        },
        24: {
            title: "Placeholder",
            description: "Placeholder text",
            cost: new Decimal("1.79e308"),
            unlocked() { return (hasUpgrade(this.layer, 14)) }, // The upgrade is only visible when this is true
        },
        25: {
            title: "Placeholder",
            description: "Placeholder text",
            cost: new Decimal("1.79e308"),
            unlocked() { return (hasUpgrade(this.layer, 14)) }, // The upgrade is only visible when this is true
        },
        26: {
            title: "Placeholder",
            description: "Placeholder text",
            cost: new Decimal("1.79e308"),
            unlocked() { return (hasUpgrade(this.layer, 14)) }, // The upgrade is only visible when this is true
        },
   },
  
    tabFormat: {
        "Interest": { content: [ ["infobox", "Hereweare",], "prestige-button", "main-display", "milestones", "upgrades", "buyables"] },
    },

    infoboxes: {
        Hereweare: {
            title: "Welcome to Idol hell",
            body: `What the hell were you thinking? you have been warned so many times. once you dive into the world of idol anime you can never go back.. well you know how this kind of game goes. collect points. buy upgrades. see numbers inflate. and spiral down into the abyss of idol hell`
            },
    },
  
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
