// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const axios = require('axios');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
const baseURL = "https://swapi.dev/api/"

// create a function that returns a random number between 1 and 86
let getRandomNumber = () => {
		return Math.floor(Math.random() * (86 - 1) + 1);
}

// create a function that converts centimeters to feet and inches
let convertToFeetAndInches = (cm) => {
	let feet = Math.floor(cm / 30.48);
	let inches = Math.floor((cm % 30.48) / 2.54);
	return `${feet}' ${inches}"`;
}

let getRandomPerson = () => {
	let person = {}
	return axios.get(baseURL + "people/" + getRandomNumber())
		.then(response => {
			return response.data
		}
	)
}

let getData = (conString) => {
	return axios.get(conString)
		.then(response => {
			return response.data
		}
	)
}


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on("message", (message) => {
	if (message.content.startsWith("!person")) {
		let person = {}
		getRandomPerson()
		.then(data => {
			person.name = data.name
			person.height = data.height
			person.gender = data.gender
			person.species = data.species[0]
			console.log(data.species)
			return data
		})
		.then(data2 => {
			return getData(data2.homeworld)
		})
		.then(data3 => {
			person.homeworld = data3.name
			message.reply("Name: " + person.name + "\n" + "Height: " + convertToFeetAndInches(person.height) + "\n" + "Gender: " + person.gender + "\n" + "Homeworld: " + person.homeworld)
			return getData(person.species)
		})
		.then(data4 => {
			console.log(person)
			person.species = data4.name
		})
	}
})




// Login to Discord with your client's token
client.login(token);