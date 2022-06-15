//function to swap classified words with XXXX
function wordSwapper(textToClassify, wordsToReplace, ignoreCase) {

    for (let wordToReplace of wordsToReplace) {

        //new regex for classified word, set to case sensitive
        let regEx = new RegExp(wordToReplace, "g");
        if (ignoreCase === true) {
            //sets the regex to be case insensitive
            regEx = new RegExp(wordToReplace, "ig");
        }

        //replace every instance of the word based on the regex passed to it with XXXX
        textToClassify = textToClassify.replaceAll(regEx, 'XXXX');
    }

    return textToClassify;
}

//get a string of the match from the match object
function getMatch(match) {
    let returnVal = '';
    
    //determine which index contains the string
    if (match[0]) {
        returnVal = match[0];
    } else if (match[1]) {
        returnVal = match[1];
    } else if (match[2]) {
        returnVal = match[2];
    }

    let regEx = new RegExp(/('|")/, "g");
    return returnVal.replaceAll(regEx, '');
}

//splits the input strings into an array of classified words
function getSplitWords(textToProcess) {
    let result = []; 

    //regex to find whole words and phrases encased with "" or ''
    let regex = new RegExp(/"([^"]*)"|'([^']*)'|[^, ]+/g); 
    let match = regex.exec(textToProcess); 

    //for each match process the returned object and add it to the result array
    while(match) { 

        //extract the string from the match object
        let matchedWord = getMatch(match);
        
        //if it doesn't exist in the array already, add it
        if (!result.includes(matchedWord)) {
            result.push(matchedWord); 
        }

        //next match
        match = regex.exec(textToProcess); 
    }

    return result;
}

//combine the two different word sources into one array
function combineWordSrcs(wordsToReplace, secretText) {
    let wordsFromDoc = getSplitWords(wordsToReplace);
    let textFromBox = getSplitWords(secretText);

    //determine the difference between the two and save the different items
    let filteredArr = textFromBox.filter(item => !wordsFromDoc.includes(item));

    //combine and return the items from each source
    return [...wordsFromDoc, ...filteredArr];
}

//triggers the process to classify the given word sets
export function redactFile(currentWords, wordsToReplace, secretText, ignoreCase) {
    let replaceArr = combineWordSrcs(wordsToReplace, secretText);
    console.log(`Classifying: ${replaceArr}`);

    let data = wordSwapper(currentWords, replaceArr, ignoreCase);

    return data;
}