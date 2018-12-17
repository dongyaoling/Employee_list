var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EmployeeSchema   = new Schema({
    name          : String,
    title         : String,
	sex           : String,
	start_date    : String,
	office_number : String,
	cell_number   : String,
	sms           : String,
	email         : String,
	manager       : { _id: String, name: String },
	report        : [String],
	photo         : { data: Buffer, contentType: String }
}, { versionKey : false });

module.exports = mongoose.model('Employee', EmployeeSchema);
