/* TO DO: randomize obstacle presence on grid*/
// ======================
function Rover(name, x, y, orientation) {
  this.name = name;
  this.x = x; //in a 10x10 grid
  this.y = y;
  this.orientation = orientation; //"N", "S", "E" or "Q"
}
Rover.prototype.travelLog = [];

const rover1 = new Rover("rover1", 0, 0, "N");
const rover2 = new Rover("rover2", 3, 5, "E");

// ======================
// Obstacle array goes here! (10x10, where 1s are obstacles)
// ======================
let obstacleArray = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
// ======================

function setRandomObstacles(matrix, obstaclesPerRow) {
  for (let array of matrix) {
    let obstacleCounter = 0;
    for (i = 0; i< array.length; i++) {
      let newObstacleValue = Math.round(Math.random()); //generates a random integer between 0 and 1
      if (newObstacleValue == 1){
        obstacleCounter++;
        array[i] = newObstacleValue;
        if (obstacleCounter >= obstaclesPerRow){
          break;
        }
      }
    }
  }
}

function setPosition(vehicle, x, y) /*checks whether the rover can move to its new position, if so sets it*/ {
  if (vehicle.orientation == "N" && x < 0)
    return console.log(
      vehicle.name + " Out of bounds" + "[" + vehicle.x + ", " + vehicle.y + "], orientation: " + vehicle.orientation
    );
  if (vehicle.orientation == "E" && y > obstacleArray[x].length - 1)
    return console.log(
      vehicle.name + " Out of bounds" + "[" + vehicle.x + ", " + vehicle.y + "], orientation: " + vehicle.orientation
    );
  if (vehicle.orientation == "S" && x > obstacleArray.length - 1)
    return console.log(
      vehicle.name + " Out of bounds" + "[" + vehicle.x + ", " + vehicle.y + "], orientation: " + vehicle.orientation
    );
  if (vehicle.orientation == "W" && y < 0)
    return console.log(
      vehicle.name + " Out of bounds" + "[" + vehicle.x + ", " + vehicle.y + "], orientation: " + vehicle.orientation
    );
  if (obstacleArray[x][y] == 1) return console.log("Obstacle encountered");
  else {
    obstacleArray[vehicle.x][vehicle.y] = 0;
    vehicle.x = x;
    vehicle.y = y;
    obstacleArray[x][y] = 1;
    console.log(vehicle.name + " [" + vehicle.x + ", " + vehicle.y + "], orientation: " + vehicle.orientation);
    vehicle["travelLog"].push([vehicle.x, vehicle.y]);
  }
}

function turnLeft(vehicle) {
  switch (vehicle.orientation) {
    case "N":
      vehicle.orientation = "W";
      break;
    case "W":
      vehicle.orientation = "S";
      break;
    case "S":
      vehicle.orientation = "E";
      break;
    case "E":
      vehicle.orientation = "N";
      break;
  }
  console.log("turnLeft was called on " + vehicle.name + "! Position: [" + vehicle.x + ", " + vehicle.y + "] orientation: " + vehicle.orientation);
}

function turnRight(vehicle) {
  switch (vehicle.orientation) {
    case "N":
      vehicle.orientation = "E";
      break;
    case "E":
      vehicle.orientation = "S";
      break;
    case "S":
      vehicle.orientation = "W";
      break;
    case "W":
      vehicle.orientation = "N";
      break;
  }
  console.log("turnRight was called on " + vehicle.name + "! Position: [" + vehicle.x + ", " + vehicle.y + "] orientation: " + vehicle.orientation);
}

function moveForward(vehicle) {
  switch (vehicle.orientation) {
    case "N":
      setPosition(vehicle, vehicle.x - 1, vehicle.y);
      break;
    case "E":
      setPosition(vehicle, vehicle.x, vehicle.y + 1);
      break;
    case "S":
      setPosition(vehicle, vehicle.x + 1, vehicle.y);
      break;
    case "W":
      setPosition(vehicle, vehicle.x, vehicle.y - 1);
      break;
  }
  console.log("moveForward was called on " + vehicle.name + "! Position: [" + vehicle.x + ", " + vehicle.y + "] orientation: " + vehicle.orientation);
}

function moveBackwards(vehicle) {
  switch (vehicle.orientation) {
    case "N":
      setPosition(vehicle, vehicle.x + 1, vehicle.y);
      break;
    case "E":
      setPosition(vehicle, vehicle.x, vehicle.y - 1);
      break;
    case "S":
      setPosition(vehicle, vehicle.x - 1, vehicle.y);
      break;
    case "W":
      setPosition(vehicle, vehicle.x, vehicle.y + 1);
      break;
  }
  console.log("moveBackwards was called on " + vehicle.name + "! Position: [" + vehicle.x + ", " + vehicle.y + "] orientation: " + vehicle.orientation);
}

function commandExecution(string, vehicle) {
  switch (string) {
    case "r":
      turnRight(vehicle);
      break;
    case "l":
      turnLeft(vehicle);
      break;
    case "f":
      moveForward(vehicle);
      break;
    case "b":
      moveBackwards(vehicle);
      break;
  }
}

function commandParse(string1, vehicle1, string2, vehicle2) {
  let commandArray = [string1, string2];
  let vehicleArray = [vehicle1, vehicle2];
  for (let commandString of commandArray) { //looking for invalid commands in command strings
    for (let command of commandString) {
      if (command != "r" && command != "l" && command!= "f" && command != "b") {
        console.log("Invalid command string! Please only input f, b, l or r");
        return;
      }
    }
  }
  let longestString = commandArray.reduce(function(a, b) { return a.length > b.length ? a : b; }); //reduces commandArray to find longest string
  for (let column = 0; column < longestString.length; column++) {
    for (let row = 0; row < commandArray.length; row++) {
      if (commandArray[row][column] != undefined) {
        commandExecution(commandArray[row][column], vehicleArray[row]);
      }
    }
  }
}

setRandomObstacles(obstacleArray, 2);

commandParse("frfflflfbbbb", rover1, "fllffrf", rover2)

console.log(obstacleArray);