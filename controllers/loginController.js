

// const User = require("../models/User");
const axios = require("axios");
const { now } = require("mongoose");
const registerView = (req, res) => {
    res.render("register", {
    });
}
// For View 
const loginView = (req, res) => {
    res.render("login", {
    });
}

const quotationView = (req, res) => {

    axios.get("http://localhost:9144/item").then((response) => {
        const data = {
            users: response.data
        }
        //   console.log(response.data)
        // return response.data;
        res.render("quotation", data);
    });
}

const dashboardView = (req, res) => {
    axios.get("http://localhost:9144/item").then((response) => {
        const data = {
            users: response.data,
            date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
        }

        //   console.log(response.data)
        // return response.data;
        res.render("dashboard", data);
    });

    // console.log(data);
    // return


}

module.exports = {
    registerView,
    loginView,
    dashboardView,
    quotationView,
};