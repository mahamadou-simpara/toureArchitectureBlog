const express = require('express');
const path = require('path');

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const db = require('./database/connect.js')

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));


app.get('/', function(req, res){
 res.render('index');
});

app.get('/blogs', async function(req, res){
    const [data] = await db.query('SELECT blogs.*, authors.name FROM blogs INNER JOIN authors on blogs.author_id = authors.id ')
    res.render('blogs', {blogs: data})
});

app.get('/create-blog', async function(req, res){
     const [data] = await db.query('SELECT * FROM authors');
    res.render('create-blog', {authors: data})
});

app.post('/blogs', async function(req, res){
    const data = [
        [req.body.title,
        req.body.summary,
        req.body.body,
        req.body.author
        ]
    ];
    const query = `
    INSERT INTO blogs(title, summary, body, author_id) VALUES ?
    `
    await db.query(query, [data]);

    res.redirect('/');
});

app.get('/blog/:id', async function(req, res){

    const [data] = await db.query('SELECT blogs.*, authors.name, authors.email  FROM blogs INNER JOIN authors on blogs.author_id = authors.id WHERE blogs.id = ?', [req.params.id])
    res.render('blog-detail', { data : data });
});

app.post('/blog/:id/delete', async function(req, res){

    const [data] = await db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.redirect('/blogs');
});

app.get('/blog/:id/update', async function(req, res){

    const [data] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id])
    res.render('update', {data: data});
});

// app.post('/blog_update', async function(req, res){
//     // const data = [
//     //     req.body.title,
//     //     req.body.summary,
//     //     req.body.body,
//     //     req.body.author,
//     //     red.body.id
//     // ]
//     try {
//         await db.query(`UPDATE  blogs
//         SET title = ?, summary = ?, body = ?, author_id = ?
//         WHERE id = ? `, [req.body.title,
//             req.body.summary,
//             req.body.body,
//             req.body.author,
//             red.body.id]);
//     } catch(error){
//     error.message();
//     }
    

//     res.redirect('blogs');
// })

// //data[0], data[1], data[2], data[3], data[4]


app.post('/blog_update', async function(req, res) {
    try {
      await db.query(
        `UPDATE blogs
        SET title = ?, summary = ?, body = ?, author_id = ?
        WHERE id = ?`,
        [
          req.body.title,
          req.body.summary,
          req.body.body,
          req.body.author,
          req.body.id
        ]
      );
      res.redirect('/blogs');
    } catch (error) {
      console.error(error);
      // Handle the error appropriately
      res.status(500).send('Internal Server Error');
    }
  });


app.listen(3000);