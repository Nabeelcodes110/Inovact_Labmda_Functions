//User Input -- > Function Name to call
const prompt = require("prompt-sync")();    
const functionName = prompt('Enter the function Name: ');

//Getting the reder function from the user's input
const render = require(`./Inovact_${functionName}/index.js`);

//Environment set up for Evironment variables
const env = require('dotenv');
env.config();

//Calling the render function with proper parametes and printing the response
const response = render.handler({
    prefix: "a"
  }, null, (a, b) => {
    console.log(b);
  })