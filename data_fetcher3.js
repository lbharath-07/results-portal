const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const url = require('url');
const querystring = require('querystring');
const http = require('http');
const { createPool } = require('mysql');
require('process');
const { default: Swal } = require('sweetalert2');

const app = express();
const port = 3003;

// const pool = createPool({
//     host: "results-database.cbeomim42od1.us-east-1.rds.amazonaws.com",
//     user: "admin",
//     password: "jntuacek",
//     database: "newschema",
//     connectionLimit: 10
// });
const pool = createPool({
    host: "localhost",  // or use the IP address if it's not on the same machine
    user: "root",
    password: "",
    database: "results_db",
    connectionLimit: 10
});
function getlink(){
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const id = queryParams.id;
        const limit1 = queryParams.limit;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`ID: ${id}`, `LIMIT: ${limit1}`);
    });
}


app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, ''));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    getlink()
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) AS count FROM regulations';

    pool.query(countQuery, async (err, countResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data from database');
        }

        const totalRecords = countResult[0].count; 
        const totalPages = Math.ceil(totalRecords / limit);

        const paginationQuery = `SELECT * FROM regulations WHERE academic_year LIKE '%${search}%' OR academic_sem LIKE '%${search}%' OR results_date LIKE '%${search}%' OR exam_month LIKE '%${search}%' OR regulation LIKE '%${search}%' ORDER BY results_date DESC LIMIT ${limit} OFFSET ${offset}`; // Pagination query

        pool.query(paginationQuery, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving data from database');
            }

            res.render('template1', {
                regulations: result,
                currentPage: page,
                totalPages: totalPages,
                offset : offset, 
                limit : limit
            });
        });
    });
});

app.get('/form', (req, res) => {
    getlink();
    const id = req.query.id;
    pool.query(`SELECT * FROM regulations WHERE id=?`, [id], (err, result, _fields) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data from database');
        }
        res.render('template3', { regulations: result, id:id });
    });
});

app.post('/submit', (req, res) => {
    getlink();
    const id = req.query.id;
    const rollno = req.body.rollno;
    
    if (!rollno || !id) {
        return res.status(400).send('Roll number or ID is missing');
    }
    var result2 = null;
    pool.query(`SELECT * FROM regulations WHERE id=?`, [id], (err, result, _fields) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data from database');
        }
        result2=result;
    });
    pool.query('SELECT student_name, roll_number FROM all_students WHERE roll_number = ?', [rollno], (err, result, _fields) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data from database');
        }
        
        if (result.length === 0) {
            return res.status(404).redirect('form?id='+id+'&noresults=1');
        }
        
        pool.query('SELECT * FROM results WHERE regulation_id = ? and roll_number = ?', [id, rollno], (err, result1, _fields) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving data from database');
            }
            if(result1.length===0){
                res.redirect('/form?noresults=1&id='+id)
            }
            res.render('results', { results: result1, regulations:result2, name: result[0].student_name, rollno: rollno.toUpperCase() });
        });
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
