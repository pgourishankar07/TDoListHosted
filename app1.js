const express = require("express");
const bp = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
// const path = require("path");
const app = express();

app.set("view engine", "ejs"); //setting a new template engine as ejs
app.use(bp.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));
// express only serves app.js on the server so to serve css and html files ,we create a folder and
// put all those files inside that folder named public
// let itmDatas = ["Study", "JSRead", "BookExercise"];
// let work = [];

mongoose.connect("mongodb://localhost:27017/ToDoListDB");
const taskSchema = new mongoose.Schema({
  Name: String,
});

const tasks = mongoose.model("tasks", taskSchema);
const work = mongoose.model("works", taskSchema);

// const task1 = new tasks({
//   Name: "JSRead",
// });
// const task2 = new tasks({
//   Name: "Exercise",
// });
// const task3 = new tasks({
//   Name: "Breakfast",
// });

const homeTask = [];
const workTask = [];

tasks.find((err, data) => {
  if (err) {
    console.log(err);
  } else {
    data.forEach((dat) => {
      homeTask.push(dat);
    });
  }
});

work.find((err, data) => {
  if (err) {
    console.log(err);
  } else {
    data.forEach((dat) => {
      workTask.push(dat);
    });
  }
});

// tasks.insertMany(homeTask, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully added");
//   }
// });
// work.insertMany(workTask, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully added");
//   }
// });
app.get("/", (req, res) => {
  let day = date.getdate(); // importing from my package
  res.render("list", {
    //setting up template page from view/list.ejs "list" name of the template file
    place: "Home",
    DayName: day,
    nwItm: homeTask,
  });
});

app.post("/", (req, res) => {
  let itmData = req.body.item;

  if (req.body.button == "Work") {
    const task = new work({
      Name: itmData,
    });
    task.save();
    workTask.push(task);
    res.redirect("/work");
  } else {
    const task = new tasks({
      Name: itmData,
    });
    task.save();

    homeTask.push(task);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  let day = date.getday(); // importing from my package

  res.render("list", {
    place: "Work",
    DayName: day,
    nwItm: workTask,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server has started");
});
