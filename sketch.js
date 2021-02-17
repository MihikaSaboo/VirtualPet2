//Create variables here
var dog, happyDog, database, foodS, foodStock,dogImg;
var feed,addFood;
var foodObj,lastFed;
function preload()
{
  happyDog=loadImage("images/dogImg1.png");
  dogImg= loadImage("images/dogImg.png");
  milkimg=loadImage("images/Milk.png");
	//load images here
}

function setup() {
  createCanvas(600, 600);
  database= firebase.database();

  dog= createSprite(300,400,10,10);
  dog.addImage(dogImg);
  dog.scale= 0.4;
  
  foodStock= database.ref('Food');
  foodStock.on("value",readStock);

  foodObj=new Food();

  feed=createButton("Feed the dog");
  feed.position(650,90);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(750,90);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);
  foodObj.display();
  
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 200,90);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 200,90);
   }
 
  drawSprites();
  
}
 
function readStock(data){
foodS=data.val();
foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  milk=createSprite(130,450,10,10);
  milk.addImage(milkimg);
  milk.scale=0.15;
  foodObj.deductFood();
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}