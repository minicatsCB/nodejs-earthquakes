function argsAreValid(magnitude, frequency){
	return allowedMagnitudes.includes(magnitude) && allowedFrequencies.includes(frequency);
}

function printMetadata(metadata){
	console.log("********************");
	console.log(metadata.title);
	console.log("---------------------");
	console.log("Total: " + metadata.count);
	console.log("Status: " + metadata.status);
	console.log("---------------------");
	console.log(new Date(metadata.generated).toLocaleString());
}

function printData(allEarthquakes){
	for(let earthquake of allEarthquakes) {
		let props = earthquake.properties;
		console.log("\n==================");
		console.log(props.title);
		console.log("Date: " + new Date(props.time).toLocaleString());
		console.log("Magnitude: " + props.mag);
		console.log("Status: " + props.status);
		console.log("Type: " + props.type);
		console.log("Place: " + props.place);
		console.log("Coordinates: " + earthquake.geometry.coordinates[0] + ", " + earthquake.geometry.coordinates[1]);
		console.log("Info: " + props.url);
		console.log("Details: " + props.detail);
	}
	console.log("\n********************");
}

const https = require("https");

const allowedMagnitudes = ["significant", "4.5", "2.5", "1.0", "all"];
const allowedFrequencies = ["hour", "day", "week", "month"];

let magnitude = process.argv[2];
let frequency = process.argv[3];
if(!argsAreValid(magnitude, frequency)) {
	console.log("Invalid parameters. Please, provide valid parameters:");
	console.log("\t- First param magnitude: " + allowedMagnitudes.join("|"));
	console.log("\t- Second param frequency: " + allowedFrequencies.join("|"));
	process.exitCode = 1;
} else {
	let url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${magnitude}_${frequency}.geojson`;
	https.get(url, (resp) => {
		let data = "";

		resp.on("data", (chunk) => {
			data += chunk;
		});

		resp.on("end", (resp) => {
			let parsedData = JSON.parse(data);
			printMetadata(parsedData.metadata);
			printData(parsedData.features);
		});
	}).on("error", (error) => {
		console.log("Error: " + error.message);
	});
}
