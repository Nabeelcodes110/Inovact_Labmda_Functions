//Environment set up for Evironment variables
const env = require('dotenv');
env.config();

//User Input -- > Function Name to call
const prompt = require('prompt-sync')();
const functionName = prompt('Enter the function Name: ');

//Getting the reder function from the user's input
const render = require(`./Inovact_${functionName}/index.js`);

//Input required for function
let argument = JSON.parse(prompt('Enter the Arguments: '));

//Calling the render function with proper parametes and printing the response
const response = render.handler(argument, null, (a, b) => {
  console.log(b);
});
