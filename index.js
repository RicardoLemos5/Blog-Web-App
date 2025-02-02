import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

var posts = [];
var date = new Date();
var year = date.getFullYear();


function renderPost (post) {
    return `<div class="post-container">
                <form class="post-form" action="/edit" method="POST">
                    <input type="hidden" name="title" value="${post.title}" />
                    <h2>${post.title}</h2>
                
                    <input type="hidden" name="content" value="${post.content}" />
                    <p>${post.content}</p>
                
                    <input type="hidden" name="index" value="${post.index}" />

                    <div class="button-container">
                        <button id="edit-button" class="btn btn-dark" type="submit">Edit</button>
                </form>
                <form action="/delete" method="POST">
                    <input type="hidden" name="index" value="${post.index}" />
                    <button id="delete-button"class="btn btn-danger" type="submit">Delete</button>
                </form>
                    </div>
            </div>`;
}

function renderEditForm (post) {
    return `<div id="edit-post" class="form-container">
                <form class="input-form" action="/confirm" method="POST">
                <h2>Edit:</h2>
                <div class="form-floating my-3">
                    <input type="text" class="input-title form-control" name="title" value="${post.title}" id="floatingInput" required>
                    <label for="floatingInput">Enter your title</label>
                </div>

                <div class="form-floating">
                    <textarea class="input-content form-control" name="content" id="floatingTextarea" required>${post.content}</textarea>
                    <label for="floatingTextarea">Write your post here...</label>
                </div>

                <input type="hidden" name="index" value="${post.index}" />

                <div id="confirm-cancel-buttons">
                    <button class="confirm-button btn btn-primary" type="submit">Confirm</button>
                    <a class="cancel-button btn btn-primary" href="/">Cancel</a>
                </div>
            </form>
        </div>`;
}

// Renders the posts from end to beginning of array
// Last items from "posts" array are more recent
// Displayed from top to bottom of "Recent Posts" in HTML page
function renderAllPosts () {
    let result = "";

    for (let i = posts.length - 1; i >= 0; i--) {
        posts[i].index = i; // Updates the index property of each post, as array sizes changes
        result += renderPost(posts[i]) + "\n";
    }

    return result;
}


// GET
app.get("/", (req, res) => {
    let postHTML = "";

    if (posts.length !== -1) {
        postHTML = renderAllPosts();
    }

    res.render("index.ejs", {
        posts: posts,
        postHTML: postHTML,
        year: year,
        submitted: req.query.submitted === 'true'
    });
});

// SUBMIT POST
app.post("/submit", (req, res) =>{
    let title = req.body.title;
    let content = req.body.content;
    let post = {
        title: title,
        content: content,
        index: posts.length
    }

    posts.push(post);
    // res.redirect("/");
    res.redirect("/?submitted=true");
});

// EDIT POST
app.post("/edit", (req, res) =>{
    let editIndex = posts.findIndex(item => {
        return item.index === Number(req.body.index);
    });

    let currentPost = posts[editIndex];
    let editForm = renderEditForm(currentPost);

    res.render("index.ejs", {
        posts: posts,
        editForm: editForm,
        year: year
    });
});

// CONFIRM POST EDIT
app.post("/confirm", (req, res) =>{
    let currentIndex = Number(req.body.index);
    let editedPost = {
        title: req.body.title,
        content: req.body.content,
        index: currentIndex
    }

    posts[currentIndex] = editedPost;
    res.redirect("/");
});

// DELETE POST
app.post("/delete", (req, res) => {
    let currentIndex = Number(req.body.index);
    posts.splice(currentIndex, 1);
    // res.redirect("/");
    res.redirect("/?submitted=true");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});