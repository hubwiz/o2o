var data = require("fs").readFileSync("users.json","utf-8");
var users = JSON.parse(data);
module.exports = function(app){
    app.get('/',function(req,res){
        res.render('login');
    });
    app.post('/login', function(req,res){
        console.log('用户登录~');
        var name = req.body.name ;
        var user = users[name];
        if(user && user.pwd_s == req.body.pwd && "1" == req.body.role){
            res.cookie('name_s',name);
            res.cookie('role',req.body.role);
            res.cookie('service',user.service);
            res.redirect('/shops');
        }else if(user && user.pwd_u == req.body.pwd && "2" == req.body.role){
            res.cookie('name_u',name);
            res.cookie('role',req.body.role);
            res.cookie('tel',user.tel);
            console.log(user.tel);
            res.redirect('/list');
        }
        else{
            res.sendStatus(404);
        }
    });
    app.get('/list',function(req,res){
        res.render('list');
    });
    app.get('/shops',function(req,res){
        res.render('shops');
    });
};