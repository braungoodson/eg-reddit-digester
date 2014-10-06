var http = require('http');
var exec = require('child_process').exec;

function log(l) {
  process.stdout.write(l+'\033[0m ');
}

function logCycle(l) {
  process.stdout.write(l+'\033[0m ');
}

var reddit = {

  subscriptions: [],

  subscribe: function(subreddit) {
    this.subscriptions.push({
      subreddit: subreddit,
      posts: []
    });
    return this;
  },

  cycles: 0,

  digest: function(init) {

    this.cycles += 1;

    //logCycle('\033[33m'+this.cycles);

    for (var s in this.subscriptions) {
      var request = http.get('http://www.reddit.com/r/'+this.subscriptions[s].subreddit+'.json');
      request.on('response',$ResponseController(this.subscriptions[s],this.cycles))
        .on('error',$ErrorController)
        .end()
      ;
    }

    return this;

    function $ErrorController(error) {
      //
      log(error);
    }

    function $ResponseController(subscription,cycle) {
      return function ResponseController(message) {

        var response = '';

        message.setEncoding('utf-8');
        message.on('data',$DataController)
          .on('end',$EndController)
        ;

        function $DataController(chunk) {
          response += chunk;
        }

        function $EndController() {

          try {

            parseJsonResponse(JSON.parse(response));

          } catch (error) {

            log(error);

          }

          function parseJsonResponse(json) {

            var posts = json.data.children;

            if ((subscription.posts.length) > 5000 || (subscription.posts.length) == 0) {
              subscription.posts = [];
            }

            for (var p in posts) {
              for (var q in subscription.posts) {
                if (posts[p].data.title == subscription.posts[q].data.title) {
                  posts[p]._old = true;
                }
              }
              if (!posts[p]._old) {
                subscription.posts.push(posts[p]);
                handleNewPost(posts[p],subscription.subreddit);
              }
            }

            function handleNewPost(post,subreddit) {
              if (!init) {
                sendEmail(post,subreddit);
              }
              function sendEmail(p,s) {
                var url = p.data.url.toString();
                var title = p.data.title.toString();
                var date = new Date().toString();
                while (title.indexOf("'") > -1) {
                  title = title.replace("'","");
                }
                while (title.indexOf("`") > -1) {
                  title = title.replace("`","");
                }
                while (title.indexOf('"') > -1) {
                  title = title.replace('"','');
                }
                var args = ''+
                  'echo "'+
                    url+
                    ' @cycle '+cycle+
                    ' #posts '+subscription.posts.length+
                    ' digested on ' +date+
                  '" | mail -a "From: '+
                  s+'@blgse.com" -s "'+
                  title+'" bgforhire@icloud.com'
                ;
                //log('\033[35m'+s+'\033[34m '+p.data.title+'\033[37m '+p.data.url+'\033[33m '+cycle+'c'+subscription.posts.length+'p');
                //log('\033[30m >>> '+args);
                var stuff = '\033[35m'+s+'\033[34m '+title+'\033[37m '+url+'\033[33m '+cycle+'c'+subscription.posts.length+'p'+' -> \033[37m'+args;
                var child = exec(args,$ArgsController);
                function $ArgsController(error,stdout,stderr) {
                  if (error !== null) {
                    log('\033[31mERROR '+error+' :: '+stderr+' :: '+stuff);
                  } else {
                    log('\033[32mSUCCESS '+stuff);
                  }
                }
              }
            }

          }

        }

      };
    }

  }

};

reddit
  .subscribe('usnews/new')
  .subscribe('worldnews/new')
  .subscribe('usnews/hot')
  .subscribe('worldnews/hot')
  .subscribe('learnprogramming/new')
  .digest(true)
;

setInterval(reddit.digest.bind(reddit),30000);