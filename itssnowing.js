const body = document.querySelector('body');
let keycodesToCheck = [];
const keycodes = [73, 84, 83, 32, 83, 67, 72, 78, 79, 73, 78, 71];
let counter = 0;
document.addEventListener('keydown', function(e) {
    
    if (e.keyCode === keycodes[counter]) {
      // console.log(e.keyCode);
      counter++;
      keycodesToCheck.push(e.keyCode);
    }
    else {
      // console.log('combo broke');
      counter = 0;
      keycodesToCheck = [];
    }
  if (keycodesToCheck.length === keycodes.length) {
    let randomMs; 
    let translateY = 10;
    for (let i = 0; i < 1000; i++) {
      console.log(i);
      randomMs= Math.random() * 10000;
      
      setTimeout(() => {
        const snow = document.createElement('img');
        snow.setAttribute('src', "https://m.media-amazon.com/images/M/MV5BMjQxMjE5NTUzNl5BMl5BanBnXkFtZTgwMTE0NjgzOTE@._V1_UY317_CR85,0,214,317_AL_.jpg")
        console.log(snow);
        const randomLeft = Math.floor(Math.random() * window.outerWidth);
        console.log(randomLeft);
        body.append(snow);
        snow.innerHTML = "hello";
        snow.setAttribute('style', `position: absolute; top: 0; left: ${randomLeft}px; height: 50px; width: 50px; transform: translateY(${ translateY += 1}px); transition: translateY .3s`);
      }, randomMs)
    }
    
    
  }
  
});