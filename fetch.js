const github = require('octonode');
const fs = require('fs');
// Use your credentials here if you want to be able to send 30 requests at a time! Change the SEARCH_LIMIT afterwards.
let credentials = {username: '', password: ''};
const SEARCH_LIMIT = 10;
const client = github.client(credentials);
const search = client.search();

// Sets an input file to the read stream.
const lineReader = require('readline').createInterface({
  input: fs.createReadStream('./libraries.txt')
});
// Sets an output file to be created
const output = fs.createWriteStream("output.txt");
// Read through each line of the input file

// Keep track of line count in order to know how much of a delay to apply. Starts at 1.
const line_counter = ((i = 0) => () => ++i)();

lineReader.on('line', (line, lineno = line_counter()) => {
  let breakPoint = line.indexOf('=');
  let library = line.slice(0, breakPoint);
  // The delay is being set to a minute and a half to give a chance for all the requests to go through, since sending a new request resets the timer.
  // This delay is necessary since github has a request limit.
  setTimeout(() => { getData(library, line); }, 90000 * (Math.floor(lineno / SEARCH_LIMIT)));
});

function getData(library, line) {
  // Note: This is largely inefficient due to github returning a lot of search responses. I would like to limit to only 1, since I'm only taking the top result... but the API doesn't have a way to limit the query.
  search.repos({q: `${library}`}, (err, data, headers) => {
    if(err){
      console.log(err);
    }
    repo = data.items[0];
    output.write(line);
    // Sometimes you don't get anything back... Either due to the search returning nothing, or an error elsewhere. You don't want the entire script to crash when that happens. 
    if(repo){
      output.write(`\t${repo.html_url}`);
      output.write(`\t${repo.description}\n`);
    }
    output.write('\n');
  })
}


// What to do when finished
lineReader.on('end', () => {
  // Close output a minute and a half after last request should be getting sent.
  setTimeout( () => { output.end(); }, 90000 * (Math.floor((line_counter() / SEARCH_LIMIT)) + 1))
});
