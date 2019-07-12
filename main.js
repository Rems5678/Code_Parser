

// const myCodeMirror = CodeMirror(document.body);

// const selectedFile = document.getElementById('upload').addEventListener('click',()=>{
// console.log('i clicked')
// });
// var myCodeMirror = CodeMirror.fromTextArea(document.querySelector('#console'));

let finished;
document.getElementById('upload').addEventListener('submit',()=>{
    // resetResults();
    finished = document.querySelector('#console').value.replace(/\n/g, '');
    // let matched = finished
    appendResults(finished)
    });

document.getElementById('upload').addEventListener('submit',function (e){
    e.preventDefault();
    // resetResults();
    let file = document.querySelectorAll('input[type = file]')[0].files[0]
    const reader = new FileReader();
    // let fileText;
    if (finished === undefined) {
    reader.addEventListener('load',(e)=>{
     
        finished = e.target.result.replace(/\n/g, '');
        appendResults(finished);


      // console.log(finished);
        // console.log(fileText);
        // parse(fileText);
    })
    // console.log(file);

    const reading = reader.readAsText(file);
  }

    // console.log(reading);

    // console.log(finished);
})
    

function parse(fileText){

  const parseData = {
      variableEnv:{instances:0,
                  uniqueVariables:[]},

      const:{instances:0,
             uniqueVariables:[]},

      let: {instances:0,
            uniqueVariables:[]},
      var: {instances:0,
              uniqueVariables:[]},
      parameterEnv:{instances:0,
                    uniqueNames:[]},

      functionEnv:{instances:0,
                  unqueNames:[],
                  anonymousFunctions:0}
                          }
  const variableSet = new Set()
  const functionSet = new Set()
  let insideOfVariableName = false
  let insideOfFunctionName = false;
  let insideOfQuotes = false;
  let insideOfSingleQuotes = false;
  let anonymousFuncTracker = 0;
  let variableName = '';
  let functionName = '';
  let variableQue = [];
  let quoteChars = { 

      '"': '"',
      "'": "'" 
  }
  let bracketStack = {
      '(': ')'
  }

  let paramsStack = [];
  let fullParams = ''

  for (let i = 0;i<fileText.length;i++){
      while(insideOfVariableName){
          if ((fileText[i] === ' ' && fileText[i-1] !== ' ') || fileText[i] === ';'){
              insideOfVariableName = !insideOfVariableName
              variableSet.add(variableName.trim())
              parseData[variableQue.pop()].uniqueVariables.push(variableName)
              variableName = ''
              break;
          }
          variableName += fileText[i]
          i++
      }

      
      while(insideOfFunctionName){ // at this location, we are either right about to name the function, or the function is anonymous
          if (fileText[i] !== '(') {
              functionName += fileText[i] // appending on to our function name 
              i++
              
          } else if (fileText[i] === '('){
              paramsStack.push('(')
                  while(paramsStack.length){
                      i++
                      if (fileText[i] === '('){
                          paramsStack.push('(')
                      }

                      if (fileText[i] === ')'){
                          paramsStack.pop();
                      }
                      fullParams += fileText[i];
                      // console.log(fullParams)
                  }
                  fullParams = fullParams.slice(0,fullParams.length-1) +', ' // removes last bracket from params
                  // console.log(fullParams)


              if (functionName === ''){ //  checks if our function has no name
                  anonymousFuncTracker++
                  // parseData['functionEnv']['anonymousFunctions']++
                  console.log('yo')
                  functionSet.add('anonymous function')
                  insideOfFunctionName = !insideOfFunctionName

                  break;
              } else {
                  functionSet.add(functionName.trim()) 
                  parseData['functionEnv']['instances']++
                  parseData['functionEnv']['unqueNames'].push(functionName.trim())
                  functionName = ''    // reinitializes our functionname
                  insideOfFunctionName = !insideOfFunctionName
                  break;
              }
          }

          
      
          
      }

      if (quoteChars[fileText[i]] && fileText[i-1] !== '\\'){ // checks escape characters
          if (fileText[i] === '"'){ // double quote 
              insideOfQuotes = !insideOfQuotes
          } else {
              insideOfSingleQuotes = !insideOfSingleQuotes // single quote case
          }
      
      }


      if (fileText[i] === 'c' && !insideOfQuotes && !insideOfSingleQuotes){ // const checker
          let possibleVariable = fileText.slice(i,i+6)
          if (checkVariable(possibleVariable)) {
              i = i + 5
              insideOfVariableName = !insideOfVariableName
              variableQue.unshift('const');
              
          }
          // check index in front of it
      }
      if (fileText[i] === 'l' && !insideOfQuotes && !insideOfSingleQuotes){ // let checker
          let possibleVariable = fileText.slice(i,i+4)
          if (checkVariable(possibleVariable)) {
              i = i + 3
              insideOfVariableName = !insideOfVariableName
              variableQue.unshift('let');
          }
          // check index in front of it
      }
      if (fileText[i] === 'v' && !insideOfQuotes && !insideOfSingleQuotes){ // var checker
          let possibleVariable = fileText.slice(i,i+4)
          if (checkVariable(possibleVariable)) {
              i = i + 3
              insideOfVariableName = !insideOfVariableName
              variableQue.unshift('var');
          }
          // check index in front of it
      }

      if (fileText[i] === 'f' && !insideOfQuotes && !insideOfSingleQuotes){ // function checker
          let possibleVariable = fileText.slice(i,i+9)
          if (checkFunction(possibleVariable)) {
              i = i + 8
              insideOfFunctionName = !insideOfFunctionName
              
              if (checkFunction(possibleVariable) === 'bracket'){  // if our function has brackets immediately -> function() ANONYMOUS FUNCTION!
                  paramsStack.push('(')
                  while(paramsStack.length){
                      i++
                      if (fileText[i] === '('){
                          paramsStack.push('(')
                      }

                      if (fileText[i] === ')'){
                          paramsStack.pop();
                      }
                      fullParams += fileText[i];
                  }
                  while(i !== ')'){ 
                      if (fileText[i] === ')'){
                          fullParams = fullParams.slice(0,fullParams.length-1) + ',' // removes last bracket from params
                          console.log(fullParams)
                          insideOfFunctionName = !insideOfFunctionName
                          console.log('anonymous func added')
                          functionSet.add('anonymous function')
                          anonymousFuncTracker++
                          break;
                      }
                      i++
                  }
              }


              if (checkFunction(possibleVariable) === 'declared'){
                  
              }
          }
      }
  }

  if (fullParams.replace(/[, ]+/g, " ").trim() !== '') { // checks if all parameters are empty after removing commas and spaces
      parseData['parameterEnv']['uniqueNames'] = processParameters(fullParams)

  };
  
  parseData['functionEnv']['anonymousFunctions'] = anonymousFuncTracker



  return parseData
  
}


function checkVariable(string){
  
  if (string === 'const '){
      return true
  }
  
  if (string === 'let '){
  return true
  }
  
  if (string === 'var '){
  return true
  }
  }

function checkFunction(string){
  if (string === 'function '){
      return 'declared'
  }

  if (string === 'function('){
      return 'bracket'
  }

  return false
  
}

function processParameters(paramString){

  let paramsStack = [];
  let bracketStack = []
  let insideQuotes = false;
  let param = ''

  for (let i = 0;i<paramString.length;i++){
    if (paramString[i] === '(' && !insideQuotes){
        bracketStack.push('(')
    }
    while(bracketStack.length){
        if (paramString[i] === ')'){
            bracketStack.pop();
        }
        param += paramString[i]
        i++
    }
    if (paramString[i] === ',' && !insideQuotes){
        paramsStack.push(param)
        param = ''
        continue;
    }
    if (!insideQuotes){
        param += paramString[i]
    }
  }
  return paramsStack
}




// console.log(parse(" function bye(god, yo, l)let insideOfVariableName = falselet insideOfFunctionName = false function add(hello, lol, function(callback,function(){lol}) ) function(){}"))
// console.log(parse("function abc(){ function bca(){}} let me = 5; andrew const five = 2"))

// console.log(processParameters('god, yo, l, hello, lol, function(callback,testing){} ,' ))




function checkVariable(string){
  if (string === 'const '){
      return true
  }
  
  if (string === 'let '){
  return true
  }
  
  if (string === 'var '){
  return true
  }
  }

function checkFunction(string){
  if (string === 'function '){
      return true
  }

  if (string === 'function('){
      return 'bracket'
  }

  return false
  
}

const variablesEl = document.querySelector('.variableNames');
const functionsEl = document.querySelector('.functionNames');
const variableCountEl = document.querySelector('.variableCount');
const functionCountEl = document.querySelector('.functionCount');

function resetResults () {
  variablesEl.textContent = '';
  functionsEl.textContent = '';
  variableCountEl.textContent = '';
  functionCountEl.textContent = '';
}
function appendResults (string) {
  const parsedResult = parse(string);
  console.log(parsedResult);
  // for (let i in parsedResult) {

  // }
  const functionCount = parsedResult.functionEnv.instances + parsedResult.functionEnv.anonymousFunctions;
  const variableCount = parsedResult.const.instances + parsedResult.let.instances + parsedResult.var.instances;
  const functions = parsedResult.functionEnv.uniqueNames ;
  const variables = parsedResult.variableEnv.uniqueVariables;

  variableCountEl.append(variableCount)
  functionCountEl.append(functionCount)
  console.log(variables);
  if (variables !== undefined) {
    variables.forEach(vari => {
      variablesEl.append('' + vari);
    })
    

  }
  if (functions !== undefined) {
    functions.forEach(func => {
      functionsEl.append('' + func);
    })
    
  }
  
}

