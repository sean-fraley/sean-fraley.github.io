//////////////////////
// GLOBAL VARIABLES //
//////////////////////
var FPS = 10;
var saving = 1;

var player= new function(){
    this.wood              = 0;
    this.woodGatherers     = 0;
    this.woodClickSpeed    = 1;
    this.woodSpeed         = 0;

    this.stone             = 0;
    this.stoneGatherers    = 0;
    this.stoneClickSpeed   = 1;
    this.stoneSpeed        = 0;

    this.iron              = 0;
    this.ironGatherers     = 0;
    this.ironSpeed         = 0;

    this.food              = 0;
    this.foodGatherers     = 0;
    this.huntClickSpeed    = 1;
    this.foodSpeed         = 0;
    this.foodCost		   = 0;

    this.fire              = 0;
    this.fireStarted       = 0;

    this.stoneAxe          = 0;
    this.stoneShovel       = 0;
    this.stoneSpear        = 0;

    this.population        = 0;
    this.populationMax     = 0;
    this.populationWorking = 0;
    this.populationIdle    = 0;

    this.huts              = 0;
    this.largeHuts         = 0;
    this.houses            = 0;
    this.longHouses        = 0;
    this.lodges			   = 0;
    this.lumberyards       = 0;
    this.quarries          = 0;
};


if($.cookie("player")){
	player = $.parseJSON($.cookie("player"));
}
else{
}


var game = new function(){
    this.frameNum = 0;
};

/////////////////////////
// ANIMATION FUNCTIONS //
/////////////////////////
function text_fadeIn(elementId,textToFade,delay,fadeSpeed,func){
    var section=document.getElementById(elementId);

    if (!fadeSpeed) {fadeSpeed=800;}
    if (!delay) {delay=0;}

    console.log("ANIMATION: fadeIn("+elementId+",'"+textToFade+"',\n           delay:"+delay+",fadeSpeed:"+fadeSpeed);

    $("<p>"+textToFade+"</p>").insertBefore("#"+elementId+"_placeHolder").delay(delay).fadeIn(fadeSpeed);
    setTimeout(function(){
        section.scrollTop = section.scrollHeight;
    },delay);

    if(func){
        waitAnimation(elementId+" p",function(){
            console.log("           Execute callback");
            func();
        });
    } 
}

function text_fadeInByChar(elementId,textToFade,delay,color,doBreak,printSpeed,fadeInSpeed,func){
    var section = document.getElementById(elementId);

    if (color       === null || !color)        {color       = "white";}
    if (doBreak     === null || !doBreak)      {doBreak     = 1;}
    if (delay       === null || !delay)        {delay       = 0;}
    if (fadeInSpeed === null || !fadeInSpeed)  {fadeInSpeed = 120;}
    if (printSpeed  === null || !printSpeed)   {printSpeed  = 30;}

    console.log("ANIMATION: fadeInByChar("+elementId+",'"+textToFade+"',\n           delay:"+delay+",color:"+color+",break:"+doBreak+",printSpeed:"+printSpeed+",fadeSpeed:"+fadeInSpeed+")");

    setTimeout(function(){
        for(var i=0, len=textToFade.length;i<len;i++){
            if(textToFade.charAt(i)==="|"){
                $("<a> </a>").insertBefore("#"+elementId+"_placeHolder").delay(printSpeed*i).fadeIn(0);
            }
            else if(textToFade.charAt(i)==="^"){
                $("<a><br></a>").insertBefore("#"+elementId+"_placeHolder").delay(printSpeed*i).fadeIn(0);
                section.scrollTop = section.scrollHeight;
            }
            else if(i===(len-1)){
                $("<a>"+textToFade.charAt(i)+"</a>").hide().css("color",color).insertBefore("#"+elementId+"_placeHolder").delay(printSpeed*i).fadeIn(fadeInSpeed,function(){
                    if(doBreak===1){
                        $("<p></p>").css("color",color).insertBefore("#"+elementId+"_placeHolder").delay(0).fadeIn(0,function(){
                            section.scrollTop = section.scrollHeight;
                        });
                    }
                    else if(doBreak===2){
                        $("<a><br></a>").css("color",color).insertBefore("#"+elementId+"_placeHolder").delay(0).fadeIn(0);
                        section.scrollTop = section.scrollHeight;
                    }
                    if(func){
                        console.log("           Execute callback "+func.name);
                        func();
                    }
                });
            }
            else{
                $("<a>"+textToFade.charAt(i)+"</a>").hide().css("color",color).insertBefore("#"+elementId+"_placeHolder").delay(printSpeed*i).fadeIn(fadeInSpeed);
            }
        }
    },delay);

    return;
}

function text_fadeInColor(elementId,textToFade,color,delay,fadeSpeed,func){
    var section = document.getElementById(elementId);
    if(fadeSpeed===null) {fadeSpeed=800;}
    if(delay===null) {delay=0;}
    $("<p>"+textToFade+"</p>").insertBefore("#"+elementId+"_placeHolder").css("color",color).delay(delay).fadeIn(fadeSpeed);
    setTimeout(function()
    {
        section.scrollTop = section.scrollHeight;
    },delay);
    if(func) waitAnimation(elementId,func);
}

function clearDiv(elementId,fadeOutSpeed,fadeInSpeed,func){
    console.log("ANIMATION: clearDiv("+elementId+", fadeOutSpeed:"+fadeOutSpeed+", fadeInSpeed:"+fadeInSpeed);
    $("#"+elementId).fadeOut(fadeOutSpeed,function()
    {
        $("#"+elementId+" p").html("");
        $("#"+elementId+" a").html("");
        $("#"+elementId).fadeIn(fadeInSpeed);
        if(func){
            waitAnimation(elementId,function(){
                console.log("           Execute callback");
                func();
            });
        }
    });
}

function waitAnimation(ref,func){
    $(ref).promise().done(func);
}

function appendToMain(textToAppend, delay, fadeInSpeed, callBack){
    if(delay === null || !delay) {delay = 0;}
    if(fadeInSpeed === null || !fadeInSpeed) {fadeInSpeed = 1000;}
    //$("<div></div>").appendTo("#main").delay(delay).append(textToAppend).show(0,function(){
    $("<div></div>").insertBefore("#mainPlaceholder").delay(delay).append(textToAppend).show(0,function(){
        $("#main")[0].scrollTop=$("#main")[0].scrollHeight;
    }).hide(0).fadeIn(fadeInSpeed);

    if(callBack){
        waitAnimation("#main div",function(){
            console.log("           Execute callback");
            callBack();
        });
    }
}

///////////
// MUSIC //
///////////
function listenCanPlay(){
    console.log("MUSIC: "+musicCurrent.id+".play()");
    musicCurrent.play();
    return;
}

function listenEnded(){
    console.log("MUSIC: removeEventListener: "+musicCurrent.id+"->canplaythrough, listenCanPlay()");
    musicCurrent.removeEventListener("canplaythrough", listenCanPlay);
    console.log("MUSIC: removeEventListener: "+musicCurrent.id+"->ended, listenEnded()");
    musicCurrent.removeEventListener("ended", listenEnded);
    console.log("MUSIC: musicLoop()");
    musicLoop();
    return;
}

function musicLoop(){
    iMusicCurrent++;
    if(iMusicCurrent>3){
        iMusicCurrent=1;
    }

    switch(iMusicCurrent){
        case 1:
            musicCurrent=document.getElementById("ominous_threat");
            console.log("MUSIC: musicCurrent = "+musicCurrent.id);
            console.log("MUSIC: "+musicCurrent.id+".load()");
            musicCurrent.load();
            console.log("MUSIC: addEventListener: "+musicCurrent.id+"->canplaythrough, listenCanPlay()");
            musicCurrent.addEventListener("canplaythrough",listenCanPlay,false);
            break;
        case 2:
            musicCurrent=document.getElementById("for_hire");
            console.log("MUSIC: musicCurrent = "+musicCurrent.id);
            console.log("MUSIC: "+musicCurrent.id+".load()");
            musicCurrent.load();
            console.log("MUSIC: addEventListener: "+musicCurrent.id+"->canplaythrough, listenCanPlay()");
            musicCurrent.addEventListener("canplaythrough",listenCanPlay,false);
            break;
        case 3:
            musicCurrent=document.getElementById("a_distant_future");
            console.log("MUSIC: musicCurrent = "+musicCurrent.id);
            console.log("MUSIC: "+musicCurrent.id+".load()");
            musicCurrent.load();
            console.log("MUSIC: addEventListener: "+musicCurrent.id+"->canplaythrough, listenCanPlay()");
            musicCurrent.addEventListener("canplaythrough",listenCanPlay,false);
            break;
        default:
            break;
    }

    console.log("MUSIC: addEventListener: "+musicCurrent.id+"->ended, listenEnded()");
    musicCurrent.addEventListener("ended",listenEnded,false);
    return;
}

//////////
// MATH //
//////////
function mathRandom(min,max){
    return Math.floor(Math.random() * (max-min+1)) + min;
}

////////////
// GATHER //
////////////
function woodClick(){
    var buf;
    var increase = mathRandom(1,4)*player.woodClickSpeed;
    if(player.stoneAxe>0){
        buf = "You chop down some <green>saplings</green> and gather the wood. <i><gray>+"+increase+" wood</gray></i>";
        appendToMain(buf);
    } else{
        buf = "You gather some <green>sticks</green> and <green>branches</green> off the ground. <i><gray>+"+increase+" wood</gray></i>";
        appendToMain(buf);
    }
    player.wood += increase;
    document.getElementById('woodClick_button').onclick = "";
    $("#woodClick_button .progress").animate({ width: "100%" }, 1000, function(){
        $("#woodClick_button .progress").css("width","0px");
        document.getElementById('woodClick_button').onclick = woodClick;
    });
    return;
}
function woodAddGatherers(gathererAmount){
    player.woodGatherers += gathererAmount;
    return;
}

function stoneClick(){
    var buf;
    var increase = mathRandom(1,4)*player.stoneClickSpeed;
    if(player.stoneShovel>0){
        buf = "You dig up small <gray>stones</gray> from the earth. <i><gray>+"+increase+" stone</gray></i>";
        appendToMain(buf);
    } else{
        buf = "You gather some small <gray>rocks</gray> from the ground. <i><gray>+"+increase+" stone</gray></i>";
        appendToMain(buf);
    }
    player.stone += increase;
    document.getElementById('stoneClick_button').onclick = "";
    $("#stoneClick_button .progress").animate({ width: "100%" }, 1000, function(){
        $("#stoneClick_button .progress").css("width","0px");
        document.getElementById('stoneClick_button').onclick = stoneClick;
    });
    return;
}
function stoneAddGatherers(gathererAmount){
    player.stoneGatherers += gathererAmount;
    return;
}

function hunt(){
    var increase = mathRandom(1,4)*player.huntClickSpeed;
    if(player.stoneSpear<1){
        buf = "You need a <red>spear</red> to hunt anything.";
        return;
    } else if(player.stoneSpear === 1){
        buf = "A few hours of stalking small animals yields a bit of meat. <i><gray>+"+increase+" food</gray></i>";
    }
    appendToMain(buf);
    player.food += increase;
    document.getElementById('hunt_button').onclick = "";
    $("#hunt_button .progress").animate({width:"100%"}, 2000, function(){
        $("#hunt_button .progress").css("width","0px");
        document.getElementById('hunt_button').onclick = hunt;
    });
    return;
}

function fireStart(){
    if(player.wood>=10){
        appendToMain("You spend a few hours rubbing sticks together and start a <orange>roaring</orange> <red>fire</red>. <i><gray>-10 wood</gray></i>");
        player.fire  = 1200;
        player.wood -= 10;
        player.fireStarted = 1;
        document.getElementById("fireStart_button").onclick = "";
    } else{
        appendToMain("You don't have enough wood to start a fire.");
    }
    return;
}
function fireStoke(){
    if(player.wood>=6){
        appendToMain("You refuel the <red>fire</red> using some wood. <i><gray>-6 wood</gray></i>");
        player.fire = 1200;
        player.wood -= 6;
        document.getElementById("fireStoke_button").onclick = "";
        $("#fireStoke_button .progress").animate({width:"100%"}, 2000, function(){
            $("#fireStoke_button .progress").css("width","0px");
            document.getElementById("fireStoke_button").onclick = fireStoke;
        });
    } else{
        appendToMain("You don't have enough wood to stoke the fire.");
    }
    return;
}

///////////
// CRAFT //
///////////
function craftAxe(){
    if(player.wood < 30){
        appendToMain("You don't have enough wood to craft an <gray>axe</gray>.");
        return;
    }
    if(player.stone < 30){
        appendToMain("You don't have enough stone to craft an <gray>axe</gray>.");
        return;
    }
    if(player.fire < 1){
        appendToMain("You need to have a <red>fire</red> to craft an <gray>axe</gray>.");
        return;
    }
    if(player.wood >= 30 && player.stone >= 30 && player.fire > 0){
        appendToMain("You manage to craft a <gray>crude stone axe</gray> after several tries. <i><gray>-30 wood -30 stone</gray></i>");
        player.wood -= 30;
        player.woodClickSpeed++;
        player.stone -= 30;
        player.stoneAxe = 1;
        $("#woodClick_button").html("<div class='progress' style='width: 0px;'></div>Chop Trees");
        document.getElementById("craftAxe_button").onclick = "";
        $("#craftAxe_button").fadeOut(1000, function(){
            document.getElementById("craftAxe_button").onclick = craftAxe;
        });
    }
    return;
}
function craftShovel(){
    if(player.wood < 30){
        appendToMain("You don't have enough wood to craft an <gray>shovel</gray>.");
        return;
    }
    if(player.stone < 30){
        appendToMain("You don't have enough stone to craft an <gray>shovel</gray>.");
        return;
    }
    if(player.fire < 1){
        appendToMain("You need to have a <red>fire</red> to craft an <gray>shovel</gray>.");
        return;
    }
    if(player.wood >= 30 && player.stone >= 30 && player.fire > 0){
        appendToMain("You finally make a simple <gray>stone shovel</gray> after several failed attempts. <i><gray>-30 wood -30 stone.</gray></i>");
        player.wood -= 30;
        player.stone -= 30;
        player.stoneClickSpeed++;
        player.stoneShovel = 1;
        $("#stoneClick_button").html("<div class='progress' style='width: 0px;'></div>Dig Stone");
        document.getElementById("craftShovel_button").onclick = "";
        $("#craftShovel_button").fadeOut(1000,function(){
            document.getElementById("craftShovel_button").onclick = craftShovel;
        });
    }
    return;
}
function craftSpear(){
    if(player.wood < 50){
        appendToMain("You don't have enough wood to craft a <gray>stone</gray> <red>spear</red>.");
        return;
    }
    if(player.stone < 50){
        appendToMain("You don't have enough stone to craft a <gray>stone</gray> <red>spear</red>.");
        return;
    }
    if(player.fire < 1){
        appendToMain("You need a <red>fire</red> to craft a <gray>stone</gray> <red>spear</red>.");
        return;
    }
    if(player.wood >= 50 && player.stone >= 50 && player.fire > 0){
        appendToMain("You lash a <green>pole</green> and a <gray>crude spearhead</gray> together into a primitive <red>spear</red> <i><gray>-50 wood -50 stone</gray></i>.");
        player.wood -= 50;
        player.stone -= 50;
        player.huntClickSpeed++;
        player.stoneSpear = 1;
        document.getElementById("craftSpear_button").onclick = "";
        $("#craftSpear_button").fadeOut(1000,function(){
            document.getElementById("craftSpear_button").onclick = craftSpear;
        });
        return;
    }
}

///////////
// BUILD //
///////////
function buildHut(){
    if(player.wood < 100){
        appendToMain("You don't have enough wood to build a hut.");
        return;
    }
    else if(player.stone < 100){
        appendToMain("You don't have enough stone to build a hut.");
        return;
    }
    else{
        appendToMain("You construct a hut. The primitive shelter will house a couple people. <i><gray>+2 max population</gray></i>");
        player.wood -= 100;
        player.stone -= 100;
        player.huts += 1;
        document.getElementById("buildHut_button").onclick = "";
        $("#buildHut_button .progress").animate({width:"100%"}, 5000, function(){
            $("#buildHut_button .progress").css("width","0px");
            document.getElementById("buildHut_button").onclick = buildHut;
        });
    }
    return;
}
function buildLargeHut(){
    if(player.wood < 190){
        appendToMain("You don't have enough wood to build a large hut.");
        return;
    }
    else if(player.stone < 190){
        appendToMain("You don't have enough stone to build a large hut.");
        return;
    }
    else{
        appendToMain("You construct a large hut. It will house a few people. <i><gray>+4 max population</gray></i>");
        player.wood -= 190;
        player.stone -= 190;
        player.largeHuts += 1;
        document.getElementById("buildLargeHut_button").onclick = "";
        $("#buildLargeHut_button .progress").animate({width:"100%"}, 10000, function(){
            $("#buildLargeHut_button .progress").css("width","0px");
            document.getElementById("buildLargeHut_button").onclick = buildLargeHut;
        });
    }
    return;
}
function buildHouse(){
    if(player.wood < 380){
        appendToMain("You don't have enough wood to build a house.");
        return;
    }
    else if(player.stone < 380){
        appendToMain("You don't have enough stone to build a house.");
        return;
    }
    else{
        appendToMain("You construct a house. It will be a comfortable home to a larger family. <i><gray>+8 max population</gray></i>");
        player.wood -= 380;
        player.stone -= 380;
        player.houses += 1;
        document.getElementById("buildHouse_button").onclick = "";
        $("#buildHouse_button .progress").animate({width:"100%"}, 20000, function(){
            $("#buildHouse_button .progress").css("width","0px");
            document.getElementById("buildHouse_button").onclick = buildHouse;
        });
    }
    return;
}
function buildLongHouse(){
    if(player.wood < 760){
        appendToMain("You don't have enough wood to build a long house.");
        return;
    }
    else if(player.stone < 760){
        appendToMain("You don't have enough stone to build a long house.");
        return;
    }
    else{
        appendToMain("You construct a long house. A small village could live in here! <i><gray>+16 max population</gray></i>");
        player.wood -= 760;
        player.stone -= 760;
        player.longHouses += 1;
        document.getElementById("buildLongHouse_button").onclick = "";
        $("#buildLongHouse_button .progress").animate({width:"100%"}, 40000, function(){
            $("#buildLongHouse_button .progress").css("width","0px");
            document.getElementById("buildLongHouse_button").onclick = buildLongHouse;
        });
    }
    return;
}
function buildLodge(){
	if(player.wood < 100){
		appendToMain("You don't have enough wood to build a <yellow>hunting lodge</yellow>.");
		return;
	}
	else if(player.stone < 100){
		appendToMain("You don't have enough stone to build a <yellow>hunting lodge</yellow>.");
		return;
	}
	else if(player.populationIdle < 4){
		appendToMain("You need 4 workers to man the <yellow>hunting lodge</yellow>.");
		return;
	}
	else{
		appendToMain("You select an area frequented by small game and construct a <yellow>hunting lodge</yellow>.");
		player.wood -= 100;
		player.stone -= 100;
		player.lodges += 1;
		player.populationWorking += 4;
		document.getElementById("buildLodge_button").onclick = "";
		$("#buildLodge_button .progress").animate({width:"100%"}, 5000, function(){
			$("#buildLodge_button .progress").css("width","0px");
			document.getElementById("buildLodge_button").onclick = buildLodge;
		});
	}
}
function buildLumberyard(){
    if(player.wood < 150){
        appendToMain("You don't have enough wood to build a <green>lumberyard</green>.");
        return;
    }
    if(player.stone < 100){
        appendToMain("You don't have enough stone to build a <green>lumberyard</green>.");
        return;
    }
    if(player.populationIdle < 4){
        appendToMain("You need 4 workers to man the <green>lumberyard</green>.");
        return;
    }
    if(player.wood >= 150 && player.stone >= 100 && player.populationIdle >= 4){
        appendToMain("After selecting a heavily wooded location you build a <green>lumberyard</green> for gathering timber.");
        player.wood -= 150;
        player.stone -= 100;
        player.lumberyards += 1;
        player.populationWorking += 4;
        document.getElementById("buildLumberyard_button").onclick = "";
        $("#buildLumberyard_button .progress").animate({width:"100%"}, 5000, function(){
            $("#buildLumberyard_button .progress").css("width","0px");
            document.getElementById("buildLumberyard_button").onclick = buildLumberyard;
        });
        return;
    }
}
function buildQuarry(){
    if(player.wood < 100){
        appendToMain("You don't have enough wood to build a <gray>quarry</gray>.");
        return;
    }
    if(player.stone < 150){
        appendToMain("You don't have enough stone to build a <gray>quarry</gray>.");
        return;
    }
    if(player.populationIdle < 4){
        appendToMain("You need 4 workers to man the <gray>quarry</gray>.");
        return;
    }
    if(player.wood >= 100 && player.stone >= 150 && player.populationIdle >= 4){
        appendToMain("You select a large rocky area and construct the <gray>stone quarry</gray>.");
        if(player.quarries < 1){
        	setInterval(findIron,30000); //EVERY 30 SECONDS RANDOM CHANCE FOR QUARRIES TO FIND IRON
        }
        player.wood -= 100;
        player.stone -= 150;
        player.quarries += 1;
        player.populationWorking += 4;
        document.getElementById("buildQuarry_button").onclick = "";
        $("#buildQuarry_button .progress").animate({width:"100%"}, 5000, function(){
            $("#buildQuarry_button .progress").css("width","0px");
            document.getElementById("buildQuarry_button").onclick = buildQuarry;
        });
        return;
    }
}

////////////////
// DELETE SAVE//
////////////////
function deleteSave(){
    $.removeCookie("player");
    saving = 0;
    return;
}

////////////////
// POPULATION //
////////////////
function travelers(){
    var chance = mathRandom(1,100);
    if(player.fire < 1 || player.food < 1){
        chance = 0;
        return;
    }
    //Number of travelers that appear
    var numTravelers = Math.floor(mathRandom(1,(player.populationMax)));
    if(numTravelers > player.populationMax-player.population){
        numTravelers = player.populationMax-player.population;
    }

    var buf;
    if(numTravelers>1){
        buf = "<b>A group of "+numTravelers+" travelers happens upon your settlement.</b>";
    } else{
        buf = "<b>1 traveler happens uppon your settlement.</b>";
    }

        if (chance > 57){
            appendToMain(buf,0,1000,function(){
                if(player.population < player.populationMax){
                    buf = "<b>Seeing that you have space available they decide to join you. </b><i><gray>+"+numTravelers+" population</i></gray>";
                    appendToMain(buf);
                    player.population += numTravelers;
                    if(player.population > player.populationMax){
                        player.population = player.populationMax;
                    }
                    return;
                }
                if(player.population >= player.populationMax){
                    appendToMain("<b>When they see that you have no room for them they continue on their way.</b>");
                    return;
                }
            });
        }
    return;
}

function findIron(){
	//THIS RUNS BY DEFAULT EVERY 30 SECONDS
	//EACH STONE GATHERER (4 PER QUARRY) HAS A 3% CHANCE TO FIND 1 IRON
	if(player.quarries > 0){
    	foundIron = 0
    	for(i = 0; i < player.stoneGatherers; i++){
        	if(mathRandom(1,100)>97){
    	    	foundIron += 1;
            };
    	}
        if(foundIron > 0){
        	appendToMain("Your quarry workers have found some <gray><b>iron</b></gray>! <i><gray>+"+foundIron+" iron</gray></i>",0,1000);
        	player.iron += foundIron;
        }
    }
    return;
}

$(document).keydown(function (eventObject) {
    return;
});

$(document).ready(function(){
    game.frameNum = 0;
    console.log("PAGE: document.ready()");
    setInterval(gameUpdate,1000/FPS); //MAIN GAME UPDATE & DRAW LOOP
    setInterval(travelers,30000); //RANDOM POPULATION INCREASE, EVERY 30 SECONDS POSSIBLE TRAVELERS APPEAR
    $("#gatherButtons").show();
    $("#woodClick_button").show();
    $("#stoneClick_button").show();
    appendToMain("<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>",0,0);
    appendToMain("<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>",0,0);
	if(!$.cookie("player")){
		appendToMain("You wake up alone in a <green>forest</green>.",0,0);
	}
    else{
        appendToMain("<yellow>Welcome back.</yellow>",0,0);
        if(player.stoneAxe > 0){
    		$("#woodClick_button").html("<div class='progress' style='width: 0px;'></div>Chop Trees");
    	}
    	if(player.stoneShovel > 0){
    		$("#stoneClick_button").html("<div class='progress' style='width: 0px;'></div>Dig Stone")
	    }
    }
    $("#contentWrapper").fadeIn(1000);
    return;
});

function gameUpdate(){
    //RECALCULATES ALL GAME VALUES ONCE EVERY FRAME
    //PLACE AUTO INCREMENTERS OF STUFF HERE
    //IE: AUTO +1 PER GATHERER FOR WOOD, INCREASE WOOD ACCORDINGLY
    //DONT SET .HTML() HERE THOUGH< THAT GOS IN GAMEDRAW

    //WOOD UPDATE
    player.woodGatherers = player.lumberyards * 2;
    player.woodSpeed = player.woodGatherers;
    player.wood += player.woodSpeed/FPS;

    //stone UPDATE
    player.stoneGatherers = player.quarries * 2;
    player.stoneSpeed = player.stoneGatherers;
    player.stone += player.stoneSpeed/FPS;

    //FOOD Update
    player.foodGatherers = player.lodges * 3;
    player.foodSpeed = player.foodGatherers;
    player.food += player.foodSpeed/FPS;
    //hunting lodge will gen +3/s for 4 workers
    //12 workers consume 2 food per second
    //So each worker consumes 1/6 food per second (.1666)
    player.foodCost = player.population/12*2
    if(player.food - player.foodCost/FPS < 0){
    	//calculate difference
    	foodDifference = player.foodCost - player.foodSpeed;
    	foodDifference = foodDifference/2*12;
    	player.population -= foodDifference;
    	appendToMain(foodDifference+" people have <red>starved to death</red>!",0,1000)
    }
    else{
    	player.food -= player.foodCost/FPS
    }

    //IRON UPDATE
    player.ironSpeed = player.ironGatherers;
    player.iron += player.ironSpeed/FPS;

    //FIRE UPDATE --1 per frame, 2 minutes to die out
    if(player.fire>0){
        player.fire--;
    }

    //POPULATION UPDATE
    player.populationMax = player.huts*2 + player.largeHuts*4 + player.houses*8 + player.longHouses*16;
    player.populationIdle = player.population - player.populationWorking;

    game.frameNum++;
    //console.log("Update Frame: "+game.frameNum);
    
    //SAVE PLAYER OBJECT AS COOKIE
    if(saving === 1){
        $.cookie("player", JSON.stringify(player), {expires: 30});
    }

    gameDraw();
    return;
}

function gameDraw(){
    //REDRAWS SCREEN EVERY FRAME
    //SET ALL .HTML() VALUES HERE TO REDRAW SCREEN
    //console.log("Redraw Frame: "+game.frameNum);

    //WOOD DRAW
    if(player.wood % 1 != 0){
        $("#status #wood").html(player.wood.toFixed(1));
    } else{
        $("#status #wood").html(player.wood);
    }
    if(player.woodSpeed > 0){
        if(player.woodSpeed % 1 != 0){
            $("#status #woodSpeed").html("<i><gray>  +"+player.woodSpeed.toFixed(1)+"/s</gray></i>");
        } else{
            $("#status #woodSpeed").html("<i><gray>  +"+player.woodSpeed+"/s</gray></i>");
        }
    }

    //STONE DRAW
    if(player.stone % 1 != 0){
        $("#status #stone").html(player.stone.toFixed(1));
    } 
    else{
        $("#status #stone").html(player.stone);
    }
    if(player.stoneSpeed > 0 ){
        if(player.stoneSpeed % 1 != 0){
            $("#status #stoneSpeed").html("<i><gray> +"+player.stoneSpeed.toFixed(1)+"/s</gray></i>");
        } 
        else{
            $("#status #stoneSpeed").html("<i><gray> +"+player.stoneSpeed+"/s</gray></i>");
        }
    }

    //FOOD DRAW
    if(player.food % 1 != 0){
        $("#status #food").html(player.food.toFixed(1));
    } 
    else{
        $("#status #food").html(player.food);
    }
	foodTotal = player.foodSpeed - player.foodCost;
	if(foodTotal != 0){
    	if(foodTotal % 1 != 0){
        	if(foodTotal < 0){
    			$("#status #foodSpeed").html("<i><gray> "+foodTotal.toFixed(1)+"/s</gray></i>");
    		}
    		else{
            	$("#status #foodSpeed").html("<i><gray> +"+foodTotal.toFixed(1)+"/s</gray></i>");
    		}
    	} 
    	else{
        	if(foodTotal < 0){
        		$("#status #foodSpeed").html("<i><gray> "+foodTotal+"/s</gray></i>");
    		}
    		else{
        		$("#status #foodSpeed").html("<i><gray> +"+foodTotal+"/s</gray></i>");
    		}
    	}
    }
    else{
    	$("#status #foodSpeed").html("");
    }

    //HUNT DRAW
    if(player.stoneSpear > 0){
        $("#hunt_button").fadeIn(1000);
    }

    //IRON DRAW
    if(player.iron > 0){
        $("#statusIron").fadeIn(1000);
    }
    if(player.iron % 1 != 0){
        $("#status #iron").html(player.iron.toFixed(1));
    } else{
        $("#status #iron").html(player.iron);
    }
    if(player.ironSpeed > 0){
        if(player.ironSpeed % 1 != 0){
            $("#status #ironSpeed").html("<i><gray> +"+player.ironSpeed.toFixed(1)+"/s</gray></i>");
        } else{
            $("#status #ironSpeed").html("<i><gray> +"+player.ironSpeed+"/s</gray></i>");
        }
    }

    //POPULATION DRAW
    $("#status #population").html(player.population);
    $("#status #populationMax").html(player.populationMax);
    $("#status #populationIdle").html(player.populationIdle);
    if(player.populationMax > 0){
        $("#statusPopulation").fadeIn(1000);
        $("#statusPopulationIdle").fadeIn(1000);
    }

    //TECH DRAW
    if(player.stoneAxe > 0 || player.stoneShovel > 0){
        $("#statusTechnologies").fadeIn(1000);
    }
    if(player.stoneAxe > 0){
        $("#statusTechnologies_stoneAxe").fadeIn(1000);
    }
    if(player.stoneShovel > 0){
        $("#statusTechnologies_stoneShovel").fadeIn(1000);
    }
    if(player.stoneSpear > 0){
        $("#statusTechnologies_stoneSpear").fadeIn(1000);
    }

    //FIRE
    if(player.wood >= 10 && player.fire === 0 && player.fireStarted === 0){
        $("#fireStart_button").fadeIn(1000);
        $("#fireStoke_button").fadeOut(1000);
    }
    if(player.fireStarted === 1 && player.fire > 0){
        $("#fireStart_button").fadeOut(1000,function(){
            document.getElementById("fireStart_button").onclick = fireStart;
        });
        $("#fireStoke_button").fadeIn(1000);
    }
    if(player.fire === 0 && player.fireStarted === 1){
        appendToMain("<b>The <red>fire</red> dies</b>.",0,1000,function(){
            $("#fireStoke_button").fadeOut(1000);
        });
        player.fireStarted = 0;
    }
    if(player.fire === 1100){
        appendToMain("The <red>fire</red> burns <orange>brightly</orange>.");
    } if(player.fire === 900){
        appendToMain("The <red>fire</red> dies down a bit.");
    } if(player.fire === 700){
        appendToMain("The <red>fire</red> is beginning to dim.");
    } if(player.fire === 600){
        appendToMain("The <red>fire</red> will die in a minute or so.");
    } if(player.fire === 400){
        appendToMain("The <red>fire</red> begins to wane.");
    } if(player.fire === 200){
        appendToMain("The <red>fire</red> will die any moment now.");
    }

    //CRAFT BUTTONS
    //if(player.wood >= 30 && player.stone >= 30 && (player.stoneAxe < 1 || player.stoneShovel < 1) && player.fire > 0){
        $("#craftButtons").fadeIn(1000);
    if(player.wood >= 30 && player.stone >= 30 && player.stoneAxe < 1 && player.fire > 0){
        $("#craftAxe_button").fadeIn(1000);
    }
    else{
        $("#craftAxe_button").fadeOut(1000);
    }
    if(player.wood >= 30 && player.stone >= 30 && player.stoneShovel < 1 && player.fire > 0){
        $("#craftShovel_button").fadeIn(1000);
    }
    else{
        $("#craftShovel_button").fadeOut(1000);
    }
    if(player.wood >= 50 && player.stone >= 50 && player.stoneAxe > 0 && player.stoneSpear < 1 && player.fire > 0){
        $("#craftSpear_button").fadeIn(1000);
    }
    else{
        $("#craftSpear_button").fadeOut(1000);
    }

    //BUILD BUTTONS
    $("#buildButtons").fadeIn(1000);
    if(player.wood >= 100 && player.stone >= 100 && player.stoneAxe > 0){
    	$("#buildHut_button").fadeIn(1000);
    }
    else{
    	$("#buildHut_button").fadeOut(1000);
    }
    if(player.wood >= 190 && player.stone >= 190 && player.huts >= 1){
        $("#buildLargeHut_button").fadeIn(1000);
    }
    else{
        $("#buildLargeHut_button").fadeOut(1000);
    }
    if(player.wood >= 380 && player.stone >= 380 && player.largeHuts >= 1){
        $("#buildHouse_button").fadeIn(1000);
    }
    else{
        $("#buildHouse_button").fadeOut(1000);
    }
    if(player.wood >= 760 && player.stone >= 760 && player.houses >= 1){
        $("#buildLongHouse_button").fadeIn(1000);
    }
    else{
        $("#buildLongHouse_button").fadeOut(1000);
    }
    if(player.stone >= 100 && player.wood >= 100 && player.stoneSpear > 0 && player.populationMax > 0){
    	$("#buildLodge_button").fadeIn(1000);
    }
    else{
    	$("#buildLodge_button").fadeOut(1000);
    }
    if(player.wood >= 150 && player.stone >= 100 && player.stoneAxe > 0 && player.populationMax > 0){
        $("#buildLumberyard_button").fadeIn(1000);
    }
    else{
        $("#buildLumberyard_button").fadeOut(1000);
    }
    if(player.wood >= 100 && player.stone >= 150 && player.stoneShovel > 0 && player.populationMax > 0){
        $("#buildQuarry_button").fadeIn(1000);
    }
    else{
        $("#buildQuarry_button").fadeOut(1000);
    }

    //DELETE SAVE BUTTON
    $("#deleteSaveButton").fadeIn(1000)
    return;
}