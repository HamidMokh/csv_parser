const { parse } = require('csv-parse');
const fs = require('fs');

//const results = [];
// i created a stream instead of a callback
// because the stream uses the disk and cpu
// to read the csv data with less ram, but the callback will load
// the huge csv file into the memory buffer (ram) and uses the cpu to prcess it which can slow down the 
// server and, also the excution will be very slow. 
const habitablePlanets = [];
function isHabitablePlanet (planet){
    return planet['koi_disposition'] ==='CONFIRMED' && 
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad']  < 1.6;
}

fs.createReadStream('kepler_data.csv')
.pipe(parse({
    // the data of the file are streaming --> the output is a binary file
    // in order to parse it using csv parser we have to put the stream in
    // a pipe then put it into a parse stream --> output will be java script objects s
    comment: '#',
    columns: true,
}))
.on('data', (data)=> {
    if(isHabitablePlanet(data)) {
        habitablePlanets.push(data);
    }
})
.on('error', (err)=>{
    console.log(err);
}).on('end', ()=>{
    console.log(`${habitablePlanets.length} habitable palanets found`);
});