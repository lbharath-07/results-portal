const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');
const { createPool } = require('mysql');
const multer = require('multer');
const xlsx = require('xlsx');

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "results_db",
    connectionLimit: 10
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, ''));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req, res)=>{
    pool.query('SELECT * from regulations LIMIT 15', (err, result, _fields) => {
        if(err){
            console.error(err);
            return res.status(500).send("Error retreiveing from Database");
        }
        res.render('dashboard', {regulations : result});
    });
});

app.get('/students', (req, res)=>{
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const offset = (page - 1) * limit;
const search = req.query.search || '';
const inserted = req.query.inserted || '';
const deleted = req.query.deleted||'';
const updated = req.query.updated||'';
const error = req.query.err || "Error Occured please try again later";

const query = "SELECT * FROM all_students WHERE roll_number LIKE ? LIMIT ? OFFSET ?";
const countQuery = "SELECT COUNT(*) AS total FROM all_students WHERE roll_number LIKE ?";

pool.query(query, [`%${search}%`, limit, offset], (err, result, _fields) => {
    if (err) {
        console.error(err);
        return res.status(500).send("Cannot retrieve data from db");
    }
    pool.query(countQuery, [`%${search}%`], (countErr, countResult, _countFields) => {
        if (countErr) {
            console.error(countErr);
            return res.status(500).send("Cannot retrieve data from db");
        }
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);
        const currentPage = page;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;
        res.render('students', {
            inserted: inserted,
            err: error,
            students: result,
            limit: limit,
            search: search,
            prevPage,
            nextPage,
            currentPage,
            totalPages, 
            deleted, 
            updated
        });
    });
});
});
app.get('/regulations', (req, res) => {
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const offset = (page - 1) * limit;
const search = req.query.search || '';
const deleted = req.query.deleted || '';
const error = req.query.err || "Error occured please try agian later";
const updated = req.query.updated||'';


pool.query(`SELECT COUNT(*) AS total FROM regulations WHERE academic_year LIKE '%${search}%' OR academic_sem LIKE '%${search}%' OR regulation LIKE '%${search}%' OR exam_month LIKE '%${search}%' OR exam_year LIKE '%${search}%'`, (countErr, countResult) => {
    if (countErr) {
        console.error(countErr);
        return res.status(500).send("Cannot retrieve data from db");
    }
    const totalRecords = countResult[0].total;

    pool.query(`SELECT * FROM regulations WHERE academic_year LIKE '%${search}%' OR academic_sem LIKE '%${search}%' OR regulation LIKE '%${search}%' OR exam_month LIKE '%${search}%' OR exam_year LIKE '%${search}%' ORDER BY results_date DESC LIMIT ${limit} OFFSET ${offset}`, (err, result, _fields) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Cannot retrieve data from db");
        }
        const totalPages = Math.ceil(totalRecords / limit);
        const currentPage = page;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;
        res.render('regulations', { regulations: result, currentPage, prevPage, nextPage, totalPages, limit, search, deleted, err:error, updated });
    });
});
app.get('/deleteExam', (req, res)=>{
    id = req.query.id;
    pool.query("DELETE FROM regulations WHERE id=?", [id], (err, result, _fields) => {
        if(err){
            res.redirect('regulations?deleted=false&err='+err);
        }
        else{
            pool.query("DELETE FROM results WHERE regulation_id= ?", [id], (err2, result2, _fields) => {
                if(err2){
                res.redirect('regulations?deleted=false&err='+ err2);
                }
                else{
                    res.redirect('regulations?deleted=true');
                }
            })
        }
    })
})

})

app.get('/AdminResults', async (req, res) => {
    const inserted = req.query.inserted||'';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const deleted = req.query.deleted || '';
    var error = req.query.err||"Cannot Insert Results Check For duplicate entries";
    const updated = req.query.updated||'';
    try {
        const counts = await new Promise((resolve, reject) => {
            pool.query("SELECT regulation_id, COUNT(*) AS row_count FROM results WHERE roll_number LIKE ? GROUP BY regulation_id ORDER BY regulation_id ASC LIMIT ? OFFSET ?", [`%${search}%`, limit, offset], (err, result, _fields) => {
                if (err) {
                    console.error(err);
                    reject("Cannot retrieve data from db");
                } else {
                    resolve(result);
                }
            });
        });
        const counts2 = await new Promise((resolve, reject) => {
            pool.query("SELECT regulation_id, COUNT(*) AS row_count FROM results WHERE roll_number LIKE ? GROUP BY regulation_id ORDER BY regulation_id ASC", [`%${search}%`], (err, all_regs, _fields) => {
                if (err) {
                    console.error(err);
                    reject("Cannot retrieve data from db");
                } else {
                    resolve(all_regs);
                }
            });
        });

        const fetchResultsPromises = counts.map(regulation => {
            return new Promise((resolve, reject) => {
                pool.query(`SELECT * FROM results WHERE regulation_id = ? AND roll_number LIKE '%${search}%' ORDER BY regulation_id ASC`, [regulation.regulation_id], (err, result, _fields) => {
                    if (err) {
                        console.error(err);
                        reject("Cannot retrieve results");
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        const regResults = await Promise.all(fetchResultsPromises);

        const regulationPromises = counts.map(regulation => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM regulations WHERE id = ?", [regulation.regulation_id], (err, result, _fields) => {
                    if (err) {
                        console.error(err);
                        reject("Cannot retrieve regulation data");
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        const regulations = await Promise.all(regulationPromises);
        const totalRecords = counts2.length;
        const totalPages = Math.ceil(totalRecords / limit);
        const currentPage = page;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;
        console.log(currentPage)
        console.log(totalPages)
        console.log(totalRecords)

        res.render('all_results', { counts: counts, regResults: regResults, regulations: regulations, inserted:inserted, err:error, search, limit, currentPage, nextPage, totalPages, prevPage, deleted, updated });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Cannot retrieve data from db");
    }
});

app.get('/deleteResult', (req, res) => {
    id = req.query.id;
    pool.query("DELETE FROM results WHERE id = ?", [id], (err, result, _fields) =>{
        if(err){
            res.redirect('AdminResults?deleted=false&err='+err);
        }
        else{
            res.redirect('AdminResults?deleted=true')
        }
    })
})

function computeSem(a, b) {
    if (a === 1 && b === 1) {
        return 1;
    } else if (a === 1 && b === 2) {
        return 2;
    } else if (a === 2 && b === 1) {
        return 3;
    } else if (a === 2 && b === 2) {
        return 4;
    } else if (a === 3 && b === 1) {
        return 5;
    } else if (a === 3 && b === 2) {
        return 6;
    } else if (a === 4 && b === 1) {
        return 7;
    } else if (a === 4 && b === 2) {
        return 8;
    } else {
        return -1; 
    }
}

app.get('/backlogs', async (req, res) => {
    let search = req.query.search||'';
    try {
        const fail = "FAIL";
        const result = await new Promise((resolve, reject) => {
            pool.query("SELECT roll_number, regulation_id FROM results WHERE pass_or_fail = ? AND roll_number LIKE ? ORDER BY regulation_id ASC", [fail, '%'+search+'%'], (err, result, _fields) => {
                if (err) {
                    reject("Cannot retrieve data:" + err);
                }
                resolve(result);
            });
        });
        const result2 = await new Promise((resolve, reject) => {
            pool.query("SELECT roll_number, regulation_id FROM results WHERE pass_or_fail = ? AND roll_number LIKE ? AND regulation_id IN (SELECT id from regulations WHERE reg_or_sup = ?) ORDER BY regulation_id ASC", ['PASS','%'+search+'%',  0], (err, result2, _fields) => {
                if (err) {
                    reject("Cannot retrieve data:" + err);
                }
                resolve(result2);
            });
        });

        const getFailCountForRegulation = async (pool, regulationID, roll_no) => {
            try {
                const failCount = await new Promise((resolve, reject) => {
                    pool.query("SELECT COUNT(*) AS fail_count FROM results WHERE pass_or_fail = 'FAIL' AND regulation_id = ? AND roll_number = ?", [regulationID, roll_no], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        const failCount = result[0].fail_count;
                        resolve(failCount);
                    });
                });
                return failCount;
            } catch (error) {
                console.error("Error:", error);
                return -1; 
            }
        };

        const getPassCountForRegulation = async (pool, regulationID, roll_no) => {
            try {
                const passCount = await new Promise((resolve, reject) => {
                    pool.query("SELECT COUNT(*) AS pass_count FROM results WHERE pass_or_fail = 'PASS' AND roll_number = ? AND regulation_id = ?", [roll_no, regulationID], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        const passCount = result[0].pass_count;
                        resolve(passCount);
                    });
                });
                return passCount;
            } catch (error) {
                console.error("Error:", error);
                return -1; 
            }
        };

        const getRegulationIDs = (rollNumber, data) => {
            const regulationIDs = [];
            for (const entry of data) {
                if (entry.roll_number === rollNumber) {
                    regulationIDs.push(entry.regulation_id);
                }
            }
            return [...new Set(regulationIDs)];
        };

        const backlogRollNumbers = [...new Set(result.map(obj => obj.roll_number))];
        const backlogPassNumbers = [...new Set(result2.map(obj => obj.roll_number))];
        let backlogCounts = [];
        let backlogPassCounts = [];
        let backlogSems = [];
        let PassSems = [];

        for (const rollNumber of backlogRollNumbers) {
            let regulationIDs = getRegulationIDs(rollNumber, result);
            regulationIDs = [...new Set(regulationIDs)];

            backlogCounts.push(await Promise.all(regulationIDs.map(async (regulationID) => {
                return getFailCountForRegulation(pool, regulationID, rollNumber);
            })));

            let passRegulationIDs = getRegulationIDs(rollNumber, result2);
            passRegulationIDs = [...new Set(passRegulationIDs)];

            backlogPassCounts.push(await Promise.all(passRegulationIDs.map(async (regulationID) => {
                return getPassCountForRegulation(pool, regulationID, rollNumber);
            })));

            const backlogRegulationSemsPromises = regulationIDs.map(async (regulationID) => {
                try {
                    const regulations = await new Promise((resolve, reject) => {
                        pool.query("SELECT * FROM regulations WHERE id=? AND reg_or_sup = 1", [regulationID], (err, regulations, _fields) => {
                            if (err) {
                                reject("Cannot retrieve year and sem");
                            }
                            resolve(regulations);
                        });
                    });
                    const semesters = regulations.map(backlogRegulation => {
                        return computeSem(backlogRegulation.academic_year, backlogRegulation.academic_sem);
                    });
                    return semesters;
                } catch (error) {
                    console.error("Error:", error);
                    return [];
                }
            });

            const backlogPassSemsPromises = passRegulationIDs.map(async (regulationID) => {
                try {
                    const regulations = await new Promise((resolve, reject) => {
                        pool.query("SELECT * FROM regulations WHERE id=? AND reg_or_sup = 0", [regulationID], (err, regulations, _fields) => {
                            if (err) {
                                reject("Cannot retrieve year and sem");
                            }
                            resolve(regulations);
                        });
                    });
                    const semesters = regulations.map(backlogPassRegulation => {
                        return computeSem(backlogPassRegulation.academic_year, backlogPassRegulation.academic_sem);
                    });
                    return semesters;
                } catch (error) {
                    console.error("Error:", error);
                    return [];
                }
            });

            const backlogRegulationSemsArray = await Promise.all(backlogRegulationSemsPromises);
            const backlogPassSemsArray = await Promise.all(backlogPassSemsPromises);

            backlogSems.push(backlogRegulationSemsArray.flat());
            PassSems.push(backlogPassSemsArray.flat());
        }

        res.render('backlogs', { backlogs: result, rolls: backlogRollNumbers, backlogSems: backlogSems, backlogCounts: backlogCounts, backlogPassCounts: backlogPassCounts, result2: PassSems, backlogPassNumbers: backlogPassNumbers, search });
    } catch (error) {
        res.status(500).send(error);
    }
});



    app.get('/studentPerformance', async (req, res)=>{
        const rollNo = req.query.roll_no;
        try {
            const counts = await new Promise((resolve, reject) => {
                pool.query("SELECT regulation_id, COUNT(*) AS row_count FROM results WHERE roll_number=? GROUP BY regulation_id ORDER BY regulation_id ASC", [rollNo],  (err, result, _fields) => {
                    if (err) {
                        console.error(err);
                        reject("Cannot retrieve data from db");
                    } else {
                        resolve(result);
                    }
                });
            });
    
            const fetchResultsPromises = counts.map(regulation => {
                return new Promise((resolve, reject) => {
                    pool.query("SELECT * FROM results WHERE regulation_id = ? AND roll_number = ? ORDER BY regulation_id ASC", [regulation.regulation_id, rollNo], (err, result, _fields) => {
                        if (err) {
                            console.error(err);
                            reject("Cannot retrieve results");
                        } else {
                            resolve(result);
                        }
                    });
                });
            });
    
            const regResults = await Promise.all(fetchResultsPromises);
    
            const regulationPromises = counts.map(regulation => {
                return new Promise((resolve, reject) => {
                    pool.query("SELECT * FROM regulations WHERE id = ?", [regulation.regulation_id], (err, result, _fields) => {
                        if (err) {
                            console.error(err);
                            reject("Cannot retrieve regulation data");
                        } else {
                            resolve(result);
                        }
                    });
                });
            });
    
            const regulations = await Promise.all(regulationPromises);
    
            // Add a query to retrieve data from the all_students table
            pool.query("SELECT * FROM all_students WHERE roll_number = ?", [rollNo], (err, allStudentsResult, _fields) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Cannot retrieve data from all_students table");
                } else {
                    res.render('studentPerformance', { counts: counts, regResults: regResults, regulations: regulations, allStudentsResult: allStudentsResult });
                }
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).send("Cannot retrieve data from db");
        }
    });
    

    function getMaxId(table_name, callback) {
        const query = "SELECT MAX(id) AS maxID FROM ??";
        pool.query(query, [table_name], (err, result, _fields) => {
            if (err) {
                console.error(err);
                callback(err, null);
            } else {
                const maxID = result[0].maxID !== null ? result[0].maxID : 0;
                callback(null, maxID);
            }
        });
    }
    app.post('/addStudent', (req, res) => {
        var studentName = req.body.newStudentName;
        var studentRollNo = req.body.newRollNumber;
        var branch = req.body.newBranch;
        var joinYear = req.body.newJoiningYear;
        
        insertStudent(studentRollNo, studentName, branch, joinYear, (err) => {
            if (err) {
                console.error('Error inserting student:', err);
                res.redirect('/students?inserted=false&err='+err);
            } else {
                console.log(`Student Name: ${studentName}, Roll Number: ${studentRollNo}, Branch: ${branch},`);
                res.redirect('/students?inserted=true');
            }
        });
    });
    app.get('/deleteStudent', (req, res) => {
        rollNo = req.query.id;
        pool.query("DELETE FROM all_students WHERE roll_number = ?", [rollNo], (err, result, _fields) => {
            if(err){
                console.error('Error deleting student:', err);
                res.redirect('/students?deleted=false&err='+err);
            }
            else {
                res.redirect('/students?deleted=true');
            }
        })
    });
    
    function insertStudent(rollNo, name, branch, joinYear, callback) {
        pool.query("INSERT INTO all_students (student_name, roll_number, branch, joining_year) VALUES (?, ?, ?, ?)",
            [name, rollNo, branch, joinYear], (err, result, _fields) => {
                if (err) {
                    console.error("Error inserting student:", err);
                    callback(err);
                } else {
                    console.log("Student Inserted");
                    callback(null);
                }
            }
        );
    }

    
    
    app.post('/addStudents', (req, res) => {
        let responseSent = false; // Flag to track whether a response has been sent
    
        const storage = multer.diskStorage({
            destination: './uploads/',
            filename: function(req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        const upload = multer({
            storage: storage,
            limits: { fileSize: 1000000 }
        }).single('studentExcelSheet');
    
        upload(req, res, (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).send('Error uploading file');
            }
    
            console.log('File uploaded successfully');
            const filePath = req.file.path;
    
            try {
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = xlsx.utils.sheet_to_json(worksheet);
                const sql = 'INSERT INTO all_students (roll_number, student_name, joining_year, branch) VALUES ?';
                const values = jsonData.map(row => [row.roll_number, row.student_name, row.joining_year, row.branch]);
    
                pool.query(sql, [values], (err, results) => {
                    if (err) {
                        console.error('Error inserting data into MySQL:', err);
                        if (!responseSent) {
                            responseSent = true;
                            res.redirect('/students?inserted=false&err=' + err);
                        }
                    } else {
                        console.log('Data inserted into MySQL successfully');
                        if (!responseSent) {
                            responseSent = true;
                            res.redirect('/students?inserted=true');
                        }
                    }
                });
            } catch (error) {
                console.error('Error processing file:', error);
                if (!responseSent) {
                    responseSent = true;
                    return res.status(500).send('Error processing file');
                }
            }
        });
    });
    app.use((req, res, next) => {
        console.log(req.body);
        next();
    });
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/'); // Destination folder for uploaded files
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname); // Use original filename for the uploaded file
        }
    });
    
    const upload = multer({ storage: storage });
    
    app.post('/addResults', upload.single('resultExcelSheet'), (req, res) => {
        const academicYear = req.body.newAcademicYear;
        const academicSemester = req.body.newAcademicSem;
        const monthOfExam = req.body.newMonthOfExam;
        const yearOfExam = req.body.newYearOfExam;
        const regOrSup = req.body.newRegOrSupp;
        const Regulation = req.body.newRegulation;
        const today = new Date();
    
        let regulation_id;
    
        getMaxId('regulations', (err, maxID) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).send("Cannot get max ID for regulations: " + err);
            }
            console.log('Maximum ID:', maxID);
            var ins_id = maxID + 1;
            pool.query("INSERT INTO regulations (id, academic_year, academic_sem, regulation, reg_or_sup, exam_month, exam_year, results_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [ins_id, academicYear, academicSemester, Regulation, regOrSup, monthOfExam, yearOfExam, today], (err, result) => {
                    if (err) {
                        console.error('Error inserting regulation:', err);
                        return res.status(500).send("Cannot Create Regulation: " + err);
                    }
                    console.log('Regulation inserted Successfully');
                    regulation_id = ins_id;
    
                    readAndInsertResults(req.file.path, regulation_id, res);
                });
        });
    });
    
    function readAndInsertResults(filePath, regulation_id, res) {
        let responseSent = false;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        const values = jsonData.map(row => [regulation_id, row.roll_number, row.subject_code, row.subject_name, row.internal_marks, row.external_marks, row.total_marks, row.grade, row.credits, row.pass_or_fail]);
    
        // Generate placeholders for the bulk insertion
        const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
    
        const query = `INSERT INTO results (regulation_id, roll_number, subject_code, subject_name, internal_marks, external_marks, total_marks, grade, credits, pass_or_fail) VALUES ${placeholders}`;
    
        // Flatten the array of values
        const flattenedValues = values.flat();
    
        pool.query(query, flattenedValues, (err, result) => {
            if (err) {
                console.error('Error inserting data into MySQL:', err);
                if (!responseSent) {
                    responseSent = true;
                    res.redirect('/AdminResults?inserted=false&err=' + err);
                }
            } else {
                console.log('Data inserted into MySQL successfully');
                if (!responseSent) {
                    responseSent = true;
                    res.redirect('/AdminResults?inserted=true');
                }
            }
        });
    }
// ALL UPDATIONS
// Student Update
app.post('/updateStudent', (req, res) => {
    ed_roll = req.body.editRollNumber;
    ed_name = req.body.editStudentName;
    branch_ = req.body.editBranch;
    ed_year = req.body.editJoiningYear;
    edit_id = req.body.rollID;

    pool.query("UPDATE all_students SET student_name=?, branch=?, joining_year=?, roll_number=? WHERE roll_number = ?", [ ed_name, branch_, ed_year, ed_roll, edit_id], (err, result, _fields) => {
        if (err) {
            res.redirect('/students?inserted=false&err=' + encodeURIComponent(err.message));
        } else {
            res.redirect('/students?updated=true');
        }
    });
    
});
//Regulation Update
app.post('/updateRegulation', (req, res) => {
    ed_roll = req.body.editRollNumber;
    ed_name = req.body.editStudentName;
    branch_ = req.body.editBranch;
    ed_year = req.body.editJoiningYear;
    e_month = req.body.editMonth;
    ex_year = req.body.editYear
    edit_id = req.body.id;

    pool.query("UPDATE regulations SET academic_year=?, academic_sem=?, reg_or_sup=?, exam_month=?, exam_year=? WHERE id = ?", [ ed_roll, ed_name, branch_, ed_year, e_month, ex_year, edit_id], (err, result, _fields) => {
        if (err) {
            res.redirect('/regulations?deleted=false&err=' + encodeURIComponent(err.message));
        } else {
            res.redirect('/regulations?updated=true');
        }
    });
    
});
app.post('/updateResult', (req, res) => {
    rNum = req.body.rNum
    sCode = req.body.sCode
    sName = req.body.sName
    int_M = req.body.int_M
    ext_M = req.body.ext_M
    tot_M = req.body.tot_M
    credits = req.body.credits
    grade = req.body.grade
    pof = req.body.pof
    id = req.body.id

    pool.query("UPDATE results SET roll_number=?, subject_code=?, subject_name=?, internal_marks=?, external_marks=?, total_marks=?, credits=?, grade=?, pass_or_fail=? WHERE id = ?", [ rNum, sCode, sName, int_M, ext_M, tot_M, credits, grade, pof, id], (err, result, _fields) => {
        if (err) {
            res.redirect('/AdminResults?deleted=false&err=' + encodeURIComponent(err.message));
        } else {
            res.redirect('/AdminResults?updated=true');
        }
    });
    
});
    
app.listen(port, () => {
    console.log('Server Running @ port'+port);
});