const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const Spritesmith = require('spritesmith');
const Imagemagick = require('imagemagick');
const Tinify = require("tinify");
Tinify.key = "qInLPzbZ40ptUtm-wrd-1BYRnXbcgM5j";
 


const filesEE = new EventEmitter();

const testdir = './sprite-test-images/jpgs/'

let sprites = [];

function createSprite() {
	fs.readdir(testdir, (err, imgs) => {
		if (err) throw err;
		imgs.forEach(img => {
			sprites.push(__dirname + '/sprite-test-images/jpgs/' + img);
		})
		console.log(sprites);
		filesEE.emit('files_ready');
	})


	filesEE.on('files_ready',function(){
		console.log(sprites);
	  Spritesmith.run({src: sprites, engine: require('gmsmith')}, function handleResult (err, result) {
	  	if (err) throw err;
	    console.log(result.coordinates);
	    Tinify.fromBuffer(result.image)
	    	.toFile('./sprite-test-images/a-test-4-opt.png')
	    	.catch(err => console.log(err));
	    // fs.writeFileSync('./sprite-test-images/a-test-3.png',result.image, err => {
	    // 	if (err) throw err;
	    // 	console.log('saved');
	    // }); 
	    // result.coordinates; // Object mapping filename to {x, y, width, height} of image
	    // result.properties; // Object with metadata about spritesheet {width, height}
	  });
	});
}

function convertJpg() {
	// fs.readdir(testdir, (err, imgs) => {
	// 	if (err) throw err;
	// 	imgs.forEach(img => {
	// 		sprites.push(__dirname + '/sprite-test-images/sprites/' + img);
	// 	})
	// 	console.log(sprites);
	// 	filesEE.emit('files_ready');
	// })

	// Trying to get transparencies from white bg
	// Imagemagick.convert([
	// 	'./sprite-test-images/a-test.png', 
	// 	'-alpha', 'set',
	// 	'-channel', 'RGBA',
	// 	'-fuzz', '1%',
	// 	'-floodfill', '+0+0','none',
	// 	'./sprite-test-images/a-test-trans.png'], 
	// function(err, stdout){
	//   if (err) throw err;
	//   console.log('stdout:', stdout);
	// });


	// Imagemagick.convert([
	// 	'./sprite-test-images/a-test-4-opt.png',

	// 	'./sprite-test-images/a-test-4-opt.jpg'], 
	// function(err, stdout){
	//   if (err) throw err;
	//   console.log('stdout:', stdout);
	// });
	

	// Tinify.fromFile('./sprite-test-images/a-test-trans.png')
	// 	.toFile('./sprite-test-images/a-test-trans-opt.png');

}

convertJpg();