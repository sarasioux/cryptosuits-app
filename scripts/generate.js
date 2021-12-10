// images QmYwc6vwYR2tLyaR1TbQiQpiD5vkU4FCyqLAk37kTMnLZw
// json Qme3X4xgPxgtVABMKXUBA2HKf5pygRaB1BJTg18vNJUfsk

console.log("\n");

const commands = [
  'choices',
  'resize',
  'catalog',
  'count',
  'prep',
  'ipfs-images',
  'metadata',
  'ipfs-json',
  'fix-id 1',
  
];

const command = process.argv[2];

if(!command) {
  console.log('The following commands are listed in the order you should run them.');
  console.log('Commands:');
  for(let i=0; i<commands.length; i++) {
    console.log('   ' + commands[i]);
  }
  console.log("\n");
  return;
}

const Generator = require('./Generator.js');
const generator = new Generator();

const runCommand = async function(cmd) {
  switch(cmd) {
    
    case 'choices':
      let choices = await generator.suitChoices();
      //console.log(choices);
      break;
      
    case 'resize':
      await generator.resizeArt();
      break;
      
    case 'catalog':
      generator.getGenerated();
      break;
    
    case 'count':
      await generator.getGeneratedCounts();
      break;
      
    case 'prep':
      await generator.prep();
      break;
      
    case 'ipfs-images':
      await generator.ipfsUploadImages();
      break;
      
    case 'metadata':
      await generator.metadata();
      break;
      
    case 'ipfs-json':
      await generator.ipfsUploadJson();
      break;
      
    case 'load-names':
      await generator.loadNames();
      break;
      
    case 'fix-id':
      const id = parseInt(process.argv[3]);
      if(!id) {
        console.log('Please specify an id to fix.');
        break;
      }
      await generator.ipfsFixOne(id);
      break;
  
    default:
      console.log(`Unknown command: ${cmd}`);
      break;
  }
  
  console.log("\n");
};

runCommand(command);

