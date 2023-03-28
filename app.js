const express = require("express");
const bp = require("body-parser");
const date = require(__dirname + "/public/js/date.js");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

app.set("view engine", "ejs"); //setting a new template engine as ejs
app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));

// ___________________________________________________________________________

// mongoose.connect("mongodb://localhost:27017/todolistdb");  // for connecting with the local DB storage

//_______next line is for connecting with the cloud storage atalas
mongoose.connect("mongodb+srv://pgourishankar04:XSdUNIQINFe8UeX9@cluster0.shn3qtn.mongodb.net/todolistdb");
//replace                       |admin        | |    password  |                              | dbname

const taskSchema = new mongoose.Schema({
  Name: String,
});
const custSchema = new mongoose.Schema({
  Name: String,
  list: [taskSchema],
});

const tasks = mongoose.model("tasks", taskSchema);
const cust = mongoose.model("custs", custSchema);
// ___________________________________________________________________________
const task1 = new tasks({
  Name: "JSRead",
});
const task2 = new tasks({
  Name: "Exercise",
});
const task3 = new tasks({
  Name: "Breakfast",
});

const homeTask = [task1, task2, task3];
const custTask = [];

// ____________________Rendering the home page_________________________________________

app.get("/", (req, res) => {
  tasks.find((err, data) => {
    if (data.length == 0) {
      tasks.insertMany(homeTask, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("");
        }
      });
      res.redirect("/");
    } else {
      let day = date.getdate();
      res.render("list", {
        place: "Home",
        DayName: day,
        nwItm: data,
      });
    }
  });
});
console.log();
// ____________________Rendering the custom page_____________________________________

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/:custsname", (req, res) => {
  const domName = _.capitalize(req.params.custsname);
  cust.findOne({ Name: domName }, (err, data) => {
    if (!err) {
      if (!data) {
        const list = new cust({
          Name: domName,
          list: custTask,
        });
        list.save();
        res.redirect("/" + domName);
      } else {
        let day = date.getdate();
        res.render("list", {
          place: data.Name,
          DayName: day,
          nwItm: data.list,
        });
      }
    }
  });
});

// ____________________Rendering the home page_____________

app.post("/", (req, res) => {
  let itmData = req.body.item;
  let listName = req.body.button; //getting the custom name when added a taask
  const lis = new tasks({
    Name: itmData,
  });

  if (listName == "Home") {
    lis.save();
    res.redirect("/");
  } else {
    cust.findOne({ Name: listName }, (err, data) => {
      data.list.push(lis);
      data.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  const taskId = req.body.chk;
  const listName = req.body.title;
  // console.log(req.body.title);

  if (listName == "Home") {
    //deleting task from home page
    tasks.deleteOne({ _id: taskId }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("");
      }
    });
    res.redirect("/");
  } else {
    //deleting task from customed pages
    cust.findOneAndUpdate(
      { Name: listName },
      { $pull: { list: { _id: taskId } } },
      (err, data) => {
        if (!err) {
          console.log("");
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.listen(3000, () => {
  console.log("Server has started");
});
