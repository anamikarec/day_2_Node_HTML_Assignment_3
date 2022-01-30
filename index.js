const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");
const server = http.createServer(function (req, res) {
  if (req.url === "/" && req.method == "GET")
    handleHomePage(req, res);
if(req.url === "/live" && req.method == "GET")
handleLifePage(req, res);
  if (req.url === "/users/1" && req.method === "GET")
    handleUsersPage(req, res, 1);

  if (req.url === "/users/2" && req.method === "GET")
    handleUsersPage(req, res, 2);

  if (req.url === "/users/3" && req.method === "GET")
    handleUsersPage(req, res, 3);
 
  if (req.url === "/users/4" && req.method === "GET")
    handleUsersPage(req, res, 4);
});

const handleUsersPage = (req, res, id) => {
  fs.readFile(
    path.join(__dirname, "templates", "user.html"),
    "utf8",
    (err, data) => {
      if (err) {
        res.writeHead(404);
        res.send("Something went wrong");
        return;
      }
      let template = data;
      https.get("https://reqres.in/api/users/" + id, (httpResponse) => {
        console.log(httpResponse.statusCode);
        let data = "";
        httpResponse.on("data", (chunk) => {
          data += chunk;
        });
        httpResponse.on("end", () => {
          const response = JSON.parse(data);
          console.log(response);
          const options = {
            name: response.data.first_name + " " + response.data.last_name,
            img_src: response.data.avatar,
            email: response.data.email,
          };
          console.log(options);
          for (let key in options) {
            const value = options[key];
            template = template.replace(`{${key}}`, value);
          }

          res.writeHead(200);
          res.end(template);
        });
      });
    }
  );
};

const handleHomePage = (req, res) => {
  fs.readFile(
    path.join(__dirname, "templates", "index.html"),
    "utf8",
    (err, data) => {
      let template = data;

      const options = {
        Document: "Home Page",
        name: "Anamika",
        wlcm_msg: "Welcome to the home page of the website",
      };

      for (let key in options) {
        const value = options[key];
        template = template.replace(`{${key}}`, value);
      }

      console.log(template);
      res.writeHead(200);
      res.end(template);
    }
  );
};

const handleLifePage = (req, res) =>{
fs.readFile(path.join(__dirname,'templates','index2.html'), 'utf8',(err,data)=>{
    let template = data;

    const options = {
        Documents: "How to live Life",
        name:"Anamika",
        lyf_msg: "Live in the moment. We hear it all the time, but the present is really all we have.Share and give love to others. It will only enrich your life further.Keep learning. ...Know that nothing is permanent. ...Practice gratitude. ...Forgive others and yourself. ...Believe and dream. ...Do it."
    };

    for(let key in options) {
        const value = options[key];
        template = template.replace(`{${key}}`,value);
    }
    console.log(template);
    res.writeHead(200);
    res.end(template);
})
}

server.listen("4000", (err) => {
  console.log("listen on port 4000");
});
