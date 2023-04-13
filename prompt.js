const prompt = require('prompt-sync')();

console.log('Welcome to movie rater!');
let title = prompt('Please enter a movie Title: ');
let rating = prompt('Please enter a rating (1-13 stars): ');

while(/\d/.test(rating) === false || rating > 13) { 
  rating = prompt('Not a valid number! Please enter a rating (1-13 stars): ');
}

console.log(`Title: ${title}   -   Rating: ${rating}`);


// Add login
// Constant running terminal
// on Create: get rating & title
// return to proper route to log in db