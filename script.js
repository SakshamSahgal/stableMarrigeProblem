// let men = ["David", "John", "Paul"];
// let women = ["Emily", "Hannah", "Sarah"];
// let menPreferences = {
//     "David": ["Sarah", "Emily", "Hannah"],
//     "John": ["Emily", "Sarah", "Hannah"],
//     "Paul": ["Emily", "Hannah", "Sarah"]
// };
// let womenPreferences = {
//     "Emily": ["John", "David", "Paul"],
//     "Hannah": ["Paul", "John", "David"],
//     "Sarah": ["David", "John", "Paul"]
// };


/*
function that takes -
men array and 
engaged object - 

eg - 

{
  "David": "Sarah",
  "John": "Hannah"
}

*/

function findFreeMan(men, engagedMen) { //function that returns the name of the first man that is not engaged O(N)
    for (let man of men) { //iterating over all men
        if (!engagedMen.hasOwnProperty(man)) { //checking of this man is in the engaged object as a key [key-> man value-> women]
            return man;
        }
    }
}


/*

proposals object -> 

{
  "David": ["Sarah", "Emily"],
  "John": ["Hannah"]
}

*/

function findPreferredWoman(man, menPreferences, proposals) { //returns the most preferred women this man has not proposed to yet in O(N)

    let preferences = menPreferences[man]; //getting the prefrence array of this man

    if (!proposals.hasOwnProperty(man)) //if he has not proposed to any women yet then return the most preferred women.
        return preferences[0];

    for (let woman of preferences) { //iterating over all the womens of this man's prefrence in accending order
        if (proposals[man].indexOf(woman) === -1) {
            return woman;
        }
    }
}


function isMorePreferred(newMan, currentMan, womenPreferences, woman) { //returns whether newMan is more preferred that current man
    let preferences = womenPreferences[woman]; //getting the prefrence array of this women 
    return preferences.indexOf(newMan) < preferences.indexOf(currentMan); //true if newMan is morepreferred that current man
}



function stableMarriageProblem(men, menPreferences, womenPreferences) {

    let engagedMen = {}; //used to store which man(key) is engaged to which women(value)
    let engagedWomen = {}; //which women is engaged to which men
    let proposals = {}; //which man(key) has proposed to which womens (array of string)[value]

    while (Object.keys(engagedMen).length < men.length) { //while no of engaged mens are less than total no of mens (some mens are still unengaged)

        let freeMan = findFreeMan(men, engagedMen); //find the first man that is not engaged
        let preferredWoman = findPreferredWoman(freeMan, menPreferences, proposals); //get the most preferred women this man has not proposed to yet

        if (!engagedWomen.hasOwnProperty(preferredWoman)) { //if this preferred women is not yet engaged to anyone
            engagedMen[freeMan] = preferredWoman; //engaging this women to this free man 
            engagedWomen[preferredWoman] = freeMan; //engaging this man to this preferred women
        }
        else {//if this preferred women is engaged to anyone
            let currentMan = engagedWomen[preferredWoman]; //getting the current man to which she is engaged
            if (isMorePreferred(freeMan, currentMan, womenPreferences, preferredWoman)) { //if this free man is more preferred that the already engaged man
                engagedMen[freeMan] = preferredWoman; //engage this free man with the preferred women 
                delete engagedMen[currentMan]; //erase the previous man's engagement
                engagedWomen[preferredWoman] = freeMan; //updating the prefrerred women's engagement to this new man (freeMan)
            }
        }

        if (!proposals.hasOwnProperty(freeMan)) { //if the freeMan did not proposed to any women previously
            proposals[freeMan] = []; //add an empty array to the value
        }

        proposals[freeMan].push(preferredWoman); //pushing the preferred Women to the proposals array of this freeMan to mark her done (even if she is not engaged to this free man)

    }

    return engagedMen;
}

//function that generates a random input
function generateRandomInput(n) {
    const men = Array.from({ length: n }, (_, i) => `Man ${i+1}`); //creating an array of length n with man 1 to n
    const women = Array.from({ length: n }, (_, i) => `Woman ${i+1}`); //creaing an array of length n with women 1 to n
    // console.log(men);
    // console.log(women);
    // Generate random preference lists for men and women
    const menPreferences = {};
    const womenPreferences = {};
  
    for (let man of men) { //iterating over each man
      let preferences = Array.from(women); //getting women array
      shuffle(preferences); // shuffle the preferences array
      menPreferences[man] = preferences; //assigning the shufled women array to this man's prefrence list
    }
  
    for (let woman of women) {
      let preferences = Array.from(men);
      shuffle(preferences); // shuffle the preferences array
      womenPreferences[woman] = preferences; //assigning the shufled man array to this women's prefrence list
    }
  
    return {
      men,
      women,
      menPreferences,
      womenPreferences
    };
  }
  
  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }



//function used to visualise the graph
function visualizeGraph(containerID , nodes,edgeList,noOfNodes) {
    const container = document.getElementById(containerID);
    
    // Convert edge list to nodes and edges

    const graph = {
      nodes: nodes,
      edges: edgeList,
    };
    
    

    const options = {
        width: (window.width) + "px",
        height: "600",
        edges: {
          arrows: {
            to: { enabled: true, scaleFactor: 1 }
          }
        },
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 40*noOfNodes,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
          },
          maxVelocity: 50,
          minVelocity: 0.1,
          solver: 'barnesHut',
          timestep: 0.5,
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 25
          }
        }
      };
  
    const network = new vis.Network(container, graph, options);
    network.fit();
  }


//function that generates adjacency list from the random data
function generateGraphData(men,women,menPreferences,womenPreferences)
{
    let edgeList = [];
    let nodes = []

    for(let man of men)
        nodes.push({id : man , label : man , color : "lightgreen"});
    
    for(let woman of women)
        nodes.push({id : woman , label : woman , color : "pink"});

    for(let [man,prefrencelist] of Object.entries(menPreferences)) //iterating over each man prefrence list
    {
        console.log(man,prefrencelist)

        for(let thisWomen of prefrencelist) //iterating over the preferred womens of each man
        edgeList.push({from : man, to : thisWomen , arrow : "to"}) //pushing them to adjacency list
    }

    for(let [woman,prefrencelist] of Object.entries(womenPreferences)) //iterating over each women's prefrence list
    {
        console.log(woman,prefrencelist)

        for(let thisMan of prefrencelist) //iterating over the preferred womens of each man
        edgeList.push({ from : woman, to : thisMan , arrow : "to" }) //pushing them to adjacency list
    }



    // console.log(adjacencyList)
    return {edgeList,nodes};
}

let randomGeneratedInput = null;

function makeRandomInput(){
    let noOfMenAndWomen = document.getElementById("noOfMenAndWomen").value;
    randomGeneratedInput = generateRandomInput(noOfMenAndWomen); //generating random input data for stable marrige problem
    let generatedGraphData = generateGraphData(randomGeneratedInput.men,randomGeneratedInput.women,randomGeneratedInput.menPreferences,randomGeneratedInput.womenPreferences)
    visualizeGraph('graph-container',generatedGraphData.nodes,generatedGraphData.edgeList,noOfMenAndWomen);
    
}


function generateAnswerGraphData(men,women,answer){
  let edgeList = [];
  let nodes = []

    for(let man of men)
        nodes.push({id : man , label : man , color : "lightgreen"});
    
    for(let woman of women)
        nodes.push({id : woman , label : woman , color : "pink"});

  for([man,women] of Object.entries(answer)){
    edgeList.push({from : man, to : women , arrow : "to"}) //pushing them to adjacency list
  }
  return {edgeList,nodes};
}

function solveStableMarrigeProblem()
{  
  if(randomGeneratedInput!=null)
  {
    let noOfMenAndWomen = document.getElementById("noOfMenAndWomen").value;
    let answer = stableMarriageProblem(randomGeneratedInput.men, randomGeneratedInput.menPreferences, randomGeneratedInput.womenPreferences);
    let answerGraphData = generateAnswerGraphData(randomGeneratedInput.men,randomGeneratedInput.women,answer);
    console.log(answerGraphData)
    document.getElementById("output").hidden = false;
    visualizeGraph("output",answerGraphData.nodes,answerGraphData.edgeList,noOfMenAndWomen)
  }
  else
    alert("null input");
  
}

makeRandomInput(); //calling the function to generate random input on page loading

function closePallet(id)
{
  document.getElementById(id).hidden = true;
}

function viewGeneratedInput(){ //function displays the generated input data on HTML page

  document.getElementById("inputdataoverlay").hidden = false;
  
  let menDataContainer = document.getElementById("mensPrefrence");
  let mensHTML = '';
  
  for(let [man,prefrencelist] of Object.entries(randomGeneratedInput.menPreferences)) //iterating over each man prefrence list
    {
        mensHTML += `<tr class="bg-light text-center"><th> ${man} </th>`

        for(let thisWomen of prefrencelist) //iterating over the preferred womens of each man
          mensHTML += `<td> ${thisWomen} </td>` 
        
          mensHTML += `</tr>`
    }
  
  menDataContainer.innerHTML = mensHTML;

  let womenDataContainer = document.getElementById("womensPrefrence");
  let womensHTML = '';
  
  for(let [woman,prefrencelist] of Object.entries(randomGeneratedInput.womenPreferences)) //iterating over each women's prefrence list
    {
      womensHTML += `<tr class="bg-light text-center"><th> ${woman} </th>`

        for(let thisMan of prefrencelist) //iterating over the preferred womens of each man
          womensHTML +=  `<td> ${thisMan} </td>` 

          womensHTML += `</tr>`
    }

  womenDataContainer.innerHTML = womensHTML;
}