const Customer = require('../models/customer');
const mongoose = require('mongoose');

exports.homePage = async (req, res) => {
    const messages = await req.flash('info');
    const locals = {
        title: 'NodeJs',
        description: 'User Management System'
    }
    let perPage = 12;
    let page = req.query.page || 1;

    try {
        const customers = await Customer.aggregate([{ $sort: { updatedAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Customer.count();
        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.cell(count / perPage),
            messages
        });
    } catch (error) {
        console.log(error);
    }
}


// exports.homePage=async(req,res)=>{
//     const messages=await req.flash('info');
//     const locals={
//         title:'NodeJs',
//         description:'User Management System'
//     }
//     try{
//         const customers=await Customer.find({}).limit(22);
//         res.render('index',{locals,messages,customers});
//     }catch(error){
//      console.log(error);
//     } 
// }


exports.addCustomer = async (req, res) => {
    const locals = {
        title: 'Add new Customer-NodeJs',
        description: 'User Management System'
    }

    res.render('customer/add', locals);
}

exports.postCustomer = async (req, res) => {
    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details
    });
    try {
        await Customer.create(newCustomer);
        await req.flash('info', 'New customer has been added')
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }

}

exports.view = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: "View customer Data",
            description: "User Management System",
        };
        res.render('customer/view', {
            locals,
            customer
        })
    } catch (error) {
        console.log(error);
    }
}

exports.edit = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: "Edit customer Data",
            description: "User Management System",
        };
        res.render('customer/edit', {
            locals,
            customer
        })
    } catch (error) {
        console.log(error);
    }
}

exports.editPost = async (req, res) => {
    try {
        await Customer.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
            updatedAt: Date.now()
        });
        await res.redirect(`/edit/${req.params.id}`);
        console.log('redirected');
    } catch (error) {
        console.log(error);
    }
}


exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.deleteOne({ _id: req.params.id });
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

exports.searchCustomer = async (req, res) => {

    const locals = {
        title: "Search customer Data",
        description: "User Management System",
    };

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        const customers = await Customer.find({
            $or: [
                { firstName: { $regret: new RegExp(searchNoSpecialChar, "i") } },
                { lastName: { $regret: new RegExp(searchNoSpecialChar, "i") } },
            ]
        });
        res.render("search", {
            customers,
            locals
        })
    } catch (error) {
        console.log(error);
    }
}