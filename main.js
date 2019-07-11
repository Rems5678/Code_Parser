

// const myCodeMirror = CodeMirror(document.body);

// const selectedFile = document.getElementById('upload').addEventListener('click',()=>{
// console.log('i clicked')
// });
// var myCodeMirror = CodeMirror.fromTextArea(document.querySelector('#console'));


document.getElementById('upload').addEventListener('submit',()=>{
    let code = document.querySelector('#console').value
    console.log(code)
    });

document.getElementById('upload').addEventListener('submit',function (e){
    e.preventDefault();
    let file = document.querySelectorAll('input[type = file]')[0].files[0]
    

    const reader = new FileReader();
    let fileText;
    reader.addEventListener('load',(e)=>{
        fileText = (e.target.result);
        console.log(fileText);
        parse(fileText);
    })

    let finished = (reader.readAsText(file));
})
    

function parse(fileText){
    const variableSet = new Set()
    const functionSet = new Set()
    let insideOfVariableName = false
    let insideOfFunctionName = false;
    let insideOfQuotes = false;
    let insideOfSingleQuotes = false;
    let anonymousFuncTracker = 0;
    let variableName = '';
    let functionName = '';
    let quoteChars = { 
        '"': '"',
        "'": "'" 
    }


    for (let i = 0;i<fileText.length;i++){
        while(insideOfVariableName){
            if ((fileText[i] === ' ' && fileText[i-1] !== ' ') || fileText[i] === ';'){
                insideOfVariableName = !insideOfVariableName
                variableSet.add(variableName.trim())
                variableName = ''
                break;
            }
            variableName += fileText[i]
            i++
        }

        while(insideOfFunctionName){
            if ((fileText[i] === ' ' && fileText[i-1] !== ' ') || fileText[i] === '('){
                insideOfFunctionName = !insideOfFunctionName
                if (functionName.trim() === ''){
                    functionSet.add('anonymous function')
                    anonymousFuncTracker++
                    break;
                } 
                functionSet.add(functionName.trim())
                functionName = ''
                break;
            }
            functionName += fileText[i]
            i++
        }

        if (quoteChars[fileText[i]] && fileText[i-1] !== '\\'){
            if (fileText[i] === '"'){
                insideOfQuotes = !insideOfQuotes
            } else {
                insideOfSingleQuotes = !insideOfSingleQuotes
            }
           
        }


        if (fileText[i] === 'c' && !insideOfQuotes && !insideOfSingleQuotes){
            let possibleVariable = fileText.slice(i,i+6)
            if (checkVariable(possibleVariable)) {
                i = i + 5
                insideOfVariableName = !insideOfVariableName
            }
            // check index in front of it
        }
        if (fileText[i] === 'l' && !insideOfQuotes && !insideOfSingleQuotes){
            let possibleVariable = fileText.slice(i,i+4)
            if (checkVariable(possibleVariable)) {
                i = i + 3
                insideOfVariableName = !insideOfVariableName
            }
            // check index in front of it
        }
        if (fileText[i] === 'v' && !insideOfQuotes && !insideOfSingleQuotes){
            let possibleVariable = fileText.slice(i,i+4)
            if (checkVariable(possibleVariable)) {
                i = i + 3
                insideOfVariableName = !insideOfVariableName
            }
            // check index in front of it
        }

        if (fileText[i] === 'f' && !insideOfQuotes && !insideOfSingleQuotes){
            
            let possibleVariable = fileText.slice(i,i+9)
            if (checkFunction(possibleVariable)) {
                i = i + 8
                insideOfFunctionName = !insideOfFunctionName
            }
        }
    }

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
    if (string === 'function'){
        return true
    }
}