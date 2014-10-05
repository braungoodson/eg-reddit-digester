var http = require('http');

http
  .get('http://www.reddit.com/r/learnprogramming/hot.json')
  .on('response',$ResponseController)
  .on('error',$ErrorController)
  .end()
;

function $ResponseController(message) {

  var response = '';

  if (message.statusCode == 200) {
    message.setEncoding('utf-8');
    message
      .on('data',$DataController)
      .on('end',$EndController)
    ;
  } else {
    console.log(message.statusCode);
  }

  function $DataController(chunk) {
    response += chunk;
  }

  function $EndController() {
    
    try {
      parseJsonResponse(JSON.parse(response));
    } catch (e) {
      console.log(e);
    }

    function parseJsonResponse(json) {
      var c = json.data.children;
      for (var i in c) {
        console.log(c[i].data.title);
      }
    }

  }

}

function $ErrorController(error) {
  console.log(error);
}

