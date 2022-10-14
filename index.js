const express = require('express');
var path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');
app.use(bodyParser());
app.use(cors());

//Routes
app.use('/', require('./routes/login'));

const db = mysql.createPool({
    host: '192.168.107.1',
    database: 'ch_sale',
    user: 'root',
    password: 'admin@2020!'
});

app.get("/item", (req, res) => {
    db.query("SELECT * FROM item", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result)

            // data = JSON.stringify(result);
            res.send(result);

            // res.send(result);
        }
    });
});


app.get("/type", (req, res) => {
    db.query("SELECT * FROM type", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result)

            // data = JSON.stringify(result);
            res.send(result);

            // res.send(result);
        }
    });
});


app.post("/calculate_furniture", (req, res) => {
    const item_id = req.body.item_id;
    const type_id = req.body.type_id;

    db.query("SELECT * FROM tear_furniture where type_id=? and item_id=?", [type_id, item_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    });
});


app.post("/calculate_build_in", (req, res) => {
    const item_id = req.body.item_id;
    const type_id = req.body.type_id;
    const calculate_sqm = req.body.calculate_sqm;
    db.query("SELECT * FROM tear_build_in where type_id=? and item_id=? and sqm_start < ? and sqm_end > ?", [type_id, item_id, calculate_sqm, calculate_sqm], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    });
});

app.get("/get_addon/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM material_addon left join add_on on add_on.id=material_addon.addon_id where material_addon.item_id=?", [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    });
});



app.get("/get_material/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM item_material left join Material on item_material.material_id=Material.id where item_material.item_id=?", [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    });
});

app.get("/getQuotation", (req, res) => {

    db.query("SELECT * FROM quotation left join customer on quotation.customer_id=customer.customer_id", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    });
});

app.post("/request", (req, res) => {
    res.json([{
        name_recieved: req.body.dd,

    }])
})

app.post("/getCity", (req, res) => {
    var cityname = req.body.city;
    var country = req.body.country;
    city.findCity(cityname, country).then((cityID) => {
        res.status(200).send({ cityID: '123' });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post("/save_quotation", async (req, res) => {
    var data = req.body.dd;
    console.log(data)
    for (var i in data) {
        console.log();
        console.log('name' + data[i].name + 'value' + data[i].value);
    }
    return
    db.query(
        "INSERT INTO quotation (quotation_id,customer_id,created_at) VALUES ( (SELECT concat('A00',counter + 1) FROM (SELECT Max(id) counter FROM quotation WHERE customer_id = '1') t),?,(SELECT CURDATE()))",
        [1, 1, 1],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("insert item success");
                // res.redirect('/quotation');
            }
        }
    );

    // // return
    for (var i in data) {

        db.query(
            "INSERT INTO quotation_detail (quotation_id,detail) VALUES ( (SELECT concat('A00',counter + 1) FROM (SELECT Max(id) counter FROM quotation WHERE customer_id = '1') t),?)",
            [1, 1, 1],
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    // res.send("insert item success");
                    // res.redirect('/quotation');
                }
            }
        );


        // console.log(data[i].value);
    }
    return

})

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM quotation WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/quotation');
        }
    })
});

app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM quotation left join customer on customer.customer_id=quotation.customer_id left join quotation_detail on quotation.quotation_id =quotation_detail.quotation_id WHERE quotation.quotation_id=?', [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            console.log(results)
            res.render('edit.ejs', { user: results[0], data: results });
        }
    });
});

app.get('/open/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM quotation WHERE id=?', [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('edit.ejs', { user: results[0] });
        }
    });
});



const PORT = process.env.PORT || 9144;
app.listen(PORT, console.log("Server has started at port " + PORT))