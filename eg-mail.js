var email = require('emailjs');

var config = {
	ssl: true,
	host: 'smtp.gmail.com',
	user: 'sundaysatan@gmail.com',
	password: 'nietzsche45'
};

var server = email.server.connect(config);

var mail = {
	to: 'braungoodson@gmail.com',
	from: 'eg-reddit@nebuchadnezzar.local',
	subject: 'eg-subject',
	text: 'eg-text'
};

server.send(mail,function(error,message){
	console.log(error||message);
});