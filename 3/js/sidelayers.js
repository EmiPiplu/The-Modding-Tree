addLayer("L", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
    }},

    color: "#FFFF00",                       // The color for this layer, which affects many elements.
    resource: "Story",            // The name of this layer's main prestige resource.
    row: "side",  
     
    

    infoboxes: {
        story: {
          title: "Genas",
          body: `So you want to ascend and become a god? I'll teach you on one condition. the life i have created over eternity have grown quite stale and my inspiration is running low.
          create some kind of life for me. i don't care what it is just make something. You can't? Absolutely pathetic. What hope do you have of becoming a god if you can't even create 
          basic life. Go home. My time is worth more than some mortal. `
          },
    
        },
       tabFormat: [["infobox", "story",], ["infobox", "ss",]],
    
   


   
    
    
    
    layerShown() { return true },

})