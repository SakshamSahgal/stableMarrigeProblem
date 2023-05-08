let men = ["David", "John", "Paul"];
let women = ["Emily", "Hannah", "Sarah"];
let menPreferences = {
    "David": ["Sarah", "Emily", "Hannah"],
    "John": ["Emily", "Sarah", "Hannah"],
    "Paul": ["Emily", "Hannah", "Sarah"]
};
let womenPreferences = {
    "Emily": ["John", "David", "Paul"],
    "Hannah": ["Paul", "John", "David"],
    "Sarah": ["David", "John", "Paul"]
};


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


function visualizeGraph(edgeList) {
    const container = document.getElementById('graph-container');
    
    // Convert edge list to nodes and edges
    const nodes = Array.from(new Set(edgeList.flat()));
    const edges = edgeList.map(([source, target]) => ({ from: source, to: target }));
    
    const graph = {
      nodes: nodes.map(node => ({ id: node, label: node.toString() })),
      edges: edges,
    };
    
    const options = {
      edges: {
        smooth: {
          enabled: true,
          type: 'cubicBezier',
        },
      },
    };
  
    const network = new vis.Network(container, graph, options);
  }

  visualizeGraph([
    ["abc", "def"],
    ["abc", "dde"]
  ]);
console.log(stableMarriageProblem(men, menPreferences, womenPreferences));