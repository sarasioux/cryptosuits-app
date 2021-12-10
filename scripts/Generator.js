/*
    Generator module.
    
    Handles all of the auto-generation and composition functions previously found in scripts.
*/

// Imports
const { create, globSource } = require('ipfs-http-client');
const fs = require('fs');
const crypto = require('crypto');

// Configs
const inputFolder = '../../art/'
const outputFolder = '../../generated/';
const externalUrl = 'https://cryptosuits.com/suit/';

// IPFS Settings
const ipfsHost = 'ipfs.infura.io';
const ipfsPort = 5001;
const ipfsProtocol = 'https';
const ipfsProjectId = process.env.PROJECT_ID;
const ipfsProjectSecret = process.env.PROJECT_SECRET;

// Generator
const Generator = function() {
  
  this.inputFolder = inputFolder;
  this.outputFolder = outputFolder;
  this.finalFolder = '../../butlers-api/tokens/';
  
  this.prepOutput = async function() {
    const dirs = ['origin', 'image', 'json'];
    let directory;
    for(i in dirs) {
      directory = this.outputFolder + dirs[i];
      try {
        if (!fs.existsSync(directory)) {
          console.log("Directory " + directory + "does not exist, creating it now.");
          fs.mkdirSync(dir);
        }
      } catch(e) {
        console.log("An error occurred.", e);
      }
    }
    
  };
  
  this.makeChoices = async function(build, category, choice) {
  };
  
  // Set environment variables
  this.readDirectory = async function(path) {
    return new Promise(function (resolve, reject) {
      try {
        let returnFiles = [];
        console.log('Reading path', path);
        fs.readdir(path, (err, files) => {
          files.forEach(file => {
            if (file.substr(0,1) !== '.') {
              returnFiles.push(file);
            }
          });
          resolve(returnFiles);
        });
      }
      catch (error) {
        reject(error);
      }
    });
  };
  
  this.loadFiles = async function() {
    let returnFiles = {};
    const files = await this.readDirectory(this.inputFolder);
    for(let i in files) {
      let dir = this.inputFolder + files[i];
      returnFiles[files[i]] = await this.readDirectory(dir);
    }
    return returnFiles;
  };
  
  this.suitChoices = async function() {
    let returnFiles = {};
    const files = await this.readDirectory(this.inputFolder + 'png/');
  
    let goodfiles = 0;
    let missingfiles = 0;
    let emptyfiles = 0;
    
    let missing = [];
    let empty = [];
    
    console.log('Total files', files.length);
    
    for(let i in files) {
      let parts = files[i].split('.');
      let code = parts[0];
      
      // Load associated JSON
      let jsonPath = this.inputFolder + 'json/' + code + '.json';
      if(fs.existsSync(jsonPath)) {
        let rawData = fs.readFileSync(jsonPath, 'utf8');
        let jsonString = rawData.toString();
        if(jsonString.length > 0) {
          jsonString = jsonString.replace(',"Accessory","value":', ',{"trait_type":"Accessory","value":');
          let fileJson = this.looseJsonParse(jsonString);
          goodfiles++;
        } else {
          console.log('empty json file', jsonPath);
          empty.push(code);
          emptyfiles++;
        }
      } else {
        console.log('could not find file', jsonPath);
        missing.push(code);
        missingfiles++;
      }
    }
    console.log('Found good json files', goodfiles);
    console.log('Missing json files', missingfiles);
    console.log('Empty json files', emptyfiles);
    console.log('MISSING', missing);
    console.log('EMPTY', empty);
    return files;
  };
  
  this.looseJsonParse = function(obj) {
    return Function('"use strict";return (' + obj + ')')();
  }
  
  this.parseChoices = async function() {
    let files = await this.loadFiles();
    let choices = {};
    for(let i in files) {
      choices[i] = [];
      for(let k in files[i]) {
        const parts = files[i][k].split('.');
        for(let p=0; p<parts[1]; p++) {
          choices[i].push(files[i][k]);
        }
      }
    }
    return choices;
  };
  
  this.makeRandom = async function() {
    let json = {
      "attributes": []
    };
    const choices = await this.parseChoices();
    
    // Make the choices
    let build = {};
    for(let category in choices) {
      const choice = choices[category][Math.floor(Math.random()*choices[category].length)];
      if(choice) {
        let parts = choice.split('.');
        
        // Make custom fixes
        build[category] = choice;
        this.makeChoices(build, category, parts[0]);
      }
    }
    
    // Save the attributes
    for(let k in build) {
      let typeParts = k.split(' ');
      let valueParts = build[k].split('.');
      if(valueParts[0] !== 'None' && typeParts[1] !== 'Base') {
        json.attributes.push({
          "trait_type": typeParts[1],
          "value": valueParts[0].replaceAll('_', ' ')
        });
      }
    }
    
    // Build the layers on a canvas
    const canvas = createCanvas(4111, 4399);
    for(let b in build) {
      let image = await loadImage(this.inputFolder + b + '/' + build[b]);
      canvas.getContext('2d').drawImage(image, 0, 0);
    }
    
    // Hash and save the file
    const hash = crypto.createHash('sha256').update(canvas.toDataURL()).digest('hex');
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(this.inputFolder + `Generated/${hash}.png`, buffer);
    
    // Save the Json
    json.hash = hash;
    let data = JSON.stringify(json);
    fs.writeFileSync(this.inputFolder + `Generated/${hash}.json`, data);
    
    console.log('Generated image', hash);
  };
  
  this.generate = async function(amount) {
    
    // Make sure the directories exist first
    await this.prepOutput();
    
    if(!amount) {
      console.log('Please specify an amount to generate.');
      return;
    }
    console.log('Generating Images:', amount);
    for(i=0; i<amount; i++) {
      console.log('Making image', i);
      await this.makeRandom();
    }
    
    console.log('Generated ' + amount + ' Images');
  };
  
  this.getGenerated = async function() {
    let files = await this.readDirectory(this.inputFolder + 'Generated/');
    files = files.filter(item => !(/png/g).test(item));
    let data = JSON.stringify(files);
    fs.writeFileSync(this.outputFolder + 'generated.json', data);
  };
  
  this.getGeneratedCounts = async function() {
    const files = await this.readDirectory(this.inputFolder + 'Generated');
    console.log('Total Files:             ', files.length);
    
    let imageCount = 0;
    let sigs = 0;
    for(f in files) {
      let parts = files[f].split('.');
      if(parts[1] === 'png') {
        imageCount++;
      } else {
        // read the file for other counts
        let rawData = fs.readFileSync(this.inputFolder + 'Generated/' + files[f]);
        let fileJson = JSON.parse(rawData);
        for(t in fileJson.attributes) {
          let trait = fileJson.attributes[t];
          if(trait.trait_type === 'Signature' && trait.value === 'Sig') {
            sigs++;
          }
        }
      }
    }
  
    console.log('Total Expected Files:    ', imageCount*2);
    console.log('Total Images:            ', imageCount);
    console.log('Total Signatures:        ', sigs);
  };
  
  this.copy = async function(src, dst) {
    fs.copyFile(src, dst, (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        return true;
      }
    });
  };
  
  this.prep = async function() {
    const files = await this.readDirectory(this.inputFolder + 'Generated');
    let counter = 1;
    for(let f in files) {
      if(files[f].substr(-3) === 'png') {
        let hash = files[f].substr(0, files[f].length-4);
        await this.copy(this.outputFolder + 'origin/' + hash + '.png', this.outputFolder + 'image/' + hash + '.png');
        await this.copy(this.outputFolder + 'origin/' + hash + '.json', this.outputFolder + 'json/' + counter);
        counter++;
        console.log(hash);
      }
    }
    
  };
  
  this.ipfsUpload = async function(path) {
    if(!ipfsProjectId || !ipfsProjectSecret) {
      console.log('Please set PROJECT_ID and PROJECT_SECRET in your shell.');
      return;
    }
    const auth = 'Basic ' + Buffer.from(ipfsProjectId + ':' + ipfsProjectSecret).toString('base64')
    console.log('Creating IPFS connection', auth);
    const ipfs = await create({
      host: ipfsHost,
      port: ipfsPort,
      protocol: ipfsProtocol,
      headers: {
        authorization: auth
      },
      timeout: '20m'
    });
    let cid;
    console.log('Uploading files to IPFS');
    for await (const file of ipfs.addAll(globSource(path, { recursive: true }), { shardSplitThreshold: 11000, wrapWithDirectory: true })) {
      console.log(`${file.path}: ${file.cid}`);
      cid = file.cid;
    }
    return cid;
  };
  
  this.ipfsUploadImages = async function() {
    let path = this.finalFolder + 'image';
    console.log('Uploading images', path);
    let cid = String(await this.ipfsUpload(path));
    const json = {cid: cid};
    const data = JSON.stringify(json);
    fs.writeFileSync(this.finalFolder + 'imagecid.json', data);
  };
  
  this.metadata = async function() {
    const data = fs.readFileSync(this.finalFolder + 'imagecid.json');
    const json = JSON.parse(data);
    const ipfsHash = json.cid;
    
    const files = await this.readDirectory(this.finalFolder + 'json');
    for(let f in files) {
      console.log(f);
      
      const file = files[f];
      const jsonPath = this.finalFolder + 'json/' + file;
      
      // Load the existing JSON
      let rawData = fs.readFileSync(jsonPath);
      let fileJson = JSON.parse(rawData);
      
      // Add the cid URL to the JSON file
      fileJson.image = 'ipfs://' + ipfsHash + '/image/' + fileJson.hash + '.png';
      fileJson.external_url = externalUrl + file;
      
      let data = JSON.stringify(fileJson);
      
      let jsonWritePath = this.finalFolder + 'json/' + file;
      fs.writeFileSync(jsonWritePath, data);
      
      console.log(fileJson);
      console.log('--------');
    }
    
  };
  
  this.ipfsUploadJson = async function() {
    let cid = String(await this.ipfsUpload(this.outputFolder + 'json'));
    const json = {cid: cid};
    const data = JSON.stringify(json);
    fs.writeFileSync(this.outputFolder + 'jsoncid.json', data);
  };
  
  this.ipfsFixOne = async function(id) {
    if(!ipfsProjectId || !ipfsProjectSecret) {
      console.log('Please set PROJECT_ID and PROJECT_SECRET in your shell.');
      return;
    }
    const auth = 'Basic ' + Buffer.from(ipfsProjectId + ':' + ipfsProjectSecret).toString('base64')
    const ipfs = await create({
      host: ipfsHost,
      port: ipfsPort,
      protocol: ipfsProtocol,
      headers: {
        authorization: auth
      },
      timeout: '20m'
    });
  
    const jsonPath = this.finalFolder + id;
  
    // Load the existing JSON
    let rawData = fs.readFileSync(jsonPath);
    let fileJson = JSON.parse(rawData);
    let hash = fileJson.hash;
    
    const { cid } = await ipfs.add(globSource(this.outputFolder + 'rocks/image/' + hash + '.png'));
    fileJson.image = 'https://ipfs.infura.io/ipfs/' + String(cid);
  
    let data = JSON.stringify(fileJson);
    fs.writeFileSync(jsonPath, data);
  
    console.log('json', fileJson);
  
  };
  
};

module.exports = Generator;
