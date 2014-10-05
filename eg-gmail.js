var nodemailer = require('nodemailer');

var wellknown = require('nodemailer-wellknown');

var gmail = wellknown('Gmail');

gmail.auth = {
	user:'sundaysatan@gmail.com',
	pass:'nietzsche45'
};

var transporter = nodemailer.createTransport(gmail);

transporter.sendMail({
	from:'bot@braun',
	to:'braungoodson@gmail.com',
	subject:'eg-subject',
	text:'eg-text'
},function(e,i){
	console.log(e||i.response);
});