//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb+srv://admin-shivam:psych0boyy@cluster0.wi9pqhf.mongodb.net/todolistDB", {useNewUrlParser: true});

// connection stringURL =  mongodb+srv://admin-shivam:psych0boyy@cluster0.wi9pqhf.mongodb.net/
async function main()
{
  const itemSchema = new mongoose.Schema( {
    name: String
  });

  const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
  });

  const List = new mongoose.model("List", listSchema);
  const Item = mongoose.model("Item" , itemSchema);
  
  const item1 = new Item({
    name: "Welcome to your todolist"
  });
  
  const item2 = new Item({
    name: "Hit the + button to add a new item"
  });
  
  const item3 = new Item({
      name: "<-- Hit this to delete an item"
  });
  
  const item4 = new Item({
    name: "Shivam"
  });
  
  const defaultItem = [item1, item2, item3];
  
  
  app.set('view engine', 'ejs');
  
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static("public"));
  
  const items = ["Buy Food", "Cook Food", "Eat Food"];
  const workItems = [];
  
  app.get("/", function(req, res) {
    
     // Rendering the DB items into main page
     Item.find().then((foundItems) => {

      if(foundItems.length === 0)
      {
        Item.insertMany(defaultItem).then(() => {
          console.log("Succesfully added to DB");
          }).catch(function(err) {
            console.log(err);
          });
      }
      else
      {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
     }).catch(function(err) {
      console.log(err);
     });
     
  });
  
  //To add the db item in the Database and Main Page
  app.post("/", function(req, res){
  
    const itemName = req.body.newItem;
    
    const item = new Item({
      name: itemName
    });
    item.save();
    res.redirect("/");
  });

  //To delete the items from Database and Page
  app.post("/delete", async function(req, res) {
    
    try
    {
      await Item.findByIdAndDelete(req.body.checkbox);
    }catch(err)
    {
      console.log(err);
    }
    res.redirect("/");

  });

  
  //Create custom lists using express route Parameters
  app.get("/:customListName", (req, res) => {
    const customListName = req.params.customListName;

    const list = new List({
      name: customListName,
      items: defaultItem
    });

    list.save();
  });
  
  // Localhost to access the server from the system
  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

}
main();

  