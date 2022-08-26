var express = require('express');
var router = express.Router();
const TodoTask = require("../models/TodoTask");
const TodoList = require("../models/TodoList");
const path = require("path");

router.use(express.json());
router.use(express.urlencoded());

/* GET home page. */

router.get("/", (req, res) => {
    TodoList.find({}, (err, lists) => {
        res.render("index.ejs", { todoLists: lists });
    });
});

router.post('/',async (req, res) => {
    console.log(req.body);
    const todoList = new TodoList({
        title: req.body.title
    });
    try {
        await todoList.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// list view
router.get('/list/:title', async (req, res) => {
    let list = await TodoList.findOne({title: req.params['title']}).exec();
    let id = list.id;
    TodoTask.find({list_id: id}, (err, tasks) => {
        list = req.params['title'];
        res.render("list.ejs", {todoTasks: tasks, list: list});
    });
});

router.post('/list/:title', async (req, res) => {
    let list = await TodoList.findOne({title: req.params['title']}).exec();
    let id = list.id;
    const todoTask = new TodoTask({
        title: req.body.title,
        list_id: id
    });
    try {
        await todoTask.save();
        res.redirect(req.get('referer'));
    } catch (err) {
        res.redirect(req.get('referer'));
    }
});

//list edit
router.get('/list/edit/:id', async (req, res) => {
    let list = await TodoList.findOne({id: req.params['id']}).exec();
    let title = list.title;
    res.render("list_edit.ejs", {todoList: title});
})

router.post('/list/edit/:id', async (req, res) => {
    TodoList.findByIdAndUpdate(req.params['id'], { title: req.body.title }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//list remove
router.get('/list/remove/:id', async (req, res) => {
    const result = await TodoTask.deleteMany({ list_id: req.params['id']});
    TodoList.findByIdAndRemove(req.params['id'], err => {
        if (err) return res.send(500, err);
        res.redirect('/');
    });


})

//task edit
router.get('/task/edit/:id', async (req, res) => {
    let task = await TodoTask.findOne({id: req.params['id']}).exec();
    let title = task.title;
    let id = task.list_id
    let list = await TodoList.findOne({id: id}).exec();
    let list_title = list.title;
    res.render("task_edit.ejs", {todoTask: title, todoList: list_title});
})

router.post('/task/edit/:id', async (req, res) => {
    let task = await TodoTask.findOne({id: req.params['id']}).exec();
    let list_id = task.list_id;
    let list = await TodoList.findOne({id: list_id}).exec();
    let list_title = list.title;

    TodoTask.findByIdAndUpdate(req.params['id'], { title: req.body.title }, err => {
        if (err) return res.send(500, err);
        res.redirect(`/list/${list_title}`);
    });
});
//task remove

router.get('/task/remove/:id', async (req, res) => {
    let task = await TodoTask.findOne({id: req.params['id']}).exec();
    let list_id = task.list_id;
    let list = await TodoList.findOne({id: list_id}).exec();
    let list_title = list.title;
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect(`/list/${list_title}`);
    });

})

router.get('/help', (req, res) => {
    res.render('list.ejs')
})



module.exports = router;
