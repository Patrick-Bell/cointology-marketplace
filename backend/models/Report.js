const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    id: String,
    report_name: String,
    report_type: { type: String, required: true }, // Type of report, e.g., 'orders', 'users'
    report_data: { type: Array, required: true }, // Store the data (orders, users, etc.)
    date_range: {
        start_date: { type: Date }, // Optional: to store date range if needed
        end_date: { type: Date }
    },
    generated: { type: Date, default: Date.now } // Timestamp of when the report was generated
});

const Report = mongoose.model('Report', reportSchema);


module.exports = Report;
