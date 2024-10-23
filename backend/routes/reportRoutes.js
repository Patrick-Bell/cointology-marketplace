const express = require('express')
const router = express.Router()
const Report = require('../models/Report')
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')
const verifyUser = require('../middleware/verifyUser')
const { v4: uuidv4 } = require('uuid')



// route to get all reports
router.get('/reports', verifyUser, async (req, res) => {
    try{
        const reports = await Report.find()

        res.status(200).json(reports)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: e })
    }
})

// route to get specific report
router.get('/get-report/:id', async (req, res) => {
    const { id } = req.params
    try{

        const report = await Report.findOne({ id: id })

        if (!report) {
            return res.status(404).json({ message: 'Report not found!' })
        }

        res.status(200).json({ message: report })

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: e })
    }
})


// route to generate order report
router.get('/generate-:name/report', verifyUser, async (req, res) => {
    const { name } = req.params;
    const { reportName, startDate, endDate } = req.query; // Change req.body to req.query

    console.log(name);
    console.log(startDate, endDate);

    // Validate date input
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required.' });
    }

    try {
        let reports;

        // Determine whether to use the User or Order model
        if (name === 'users') {
            // Query the User model
            reports = await User.find({
                joined: {
                    $gte: new Date(startDate), // Greater than or equal to startDate
                    $lte: new Date(endDate)    // Less than or equal to endDate
                }
            });
        } else if (name === 'orders') {
            // Query the Order model
            reports = await Order.find({
                order_date: {
                    $gte: new Date(startDate), // Greater than or equal to startDate
                    $lte: new Date(endDate)    // Less than or equal to endDate
                }
            });

        } else if (name === 'products') {
            reports = await Product.find({
                date_added: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            })
        } else {
            return res.status(404).json({ message: 'Report type not found' })
        }

        const newReport = new Report({
            id: uuidv4(),
            report_name: reportName,
            report_type: name,
            report_data: reports,
            date_range: {
                start_date: startDate,
                end_date: endDate
            },
            generated: Date.now()
        })

        await newReport.save()

        // Send back the report data
        return res.status(200).json(reports);

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'An error occurred while generating the report.' });
    }
});


// route to delete report
router.delete(`/delete-report/:id`, async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {

        const report = await Report.findOneAndDelete({ id: id })

        if (!report) {
            return res.status(404).json({ message: 'Report not found!'})
        }

        res.status(200).json({ message: 'Report successfully deleted!' })

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: e })
    }
})


module.exports = router