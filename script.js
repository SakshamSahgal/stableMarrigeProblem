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
    
    if(!proposals.hasOwnProperty(man)) //if he has not proposed to any women yet then return the most preferred women.
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



function stableMarriageProblem(men, women, menPreferences, womenPreferences) {

    let engagedMen = {}; //used to store which man(key) is engaged to which women(value)
    let engagedWomen = {}; //which women is engaged to which men
    let proposals = {};
  
    while (Object.keys(engagedMen).length < men.length) {
      let freeMan = findFreeMan(men, engagedMen);
      let preferredWoman = findPreferredWoman(freeMan, women, menPreferences, proposals);
  
      if (!engagedWomen.hasOwnProperty(preferredWoman)) {
        engagedMen[freeMan] = preferredWoman;
        engagedWomen[preferredWoman] = freeMan;
      } else {
        let currentMan = engagedWomen[preferredWoman];
  
        if (isMorePreferred(freeMan, currentMan, womenPreferences, preferredWoman)) {
          engagedMen[freeMan] = preferredWoman;
          delete engagedMen[currentMan];
          engagedWomen[preferredWoman] = freeMan;
        }
      }
  
      if (!proposals.hasOwnProperty(freeMan)) {
        proposals[freeMan] = [];
      }
  
      proposals[freeMan].push(preferredWoman);
    }
  
    return engagedMen;
  }