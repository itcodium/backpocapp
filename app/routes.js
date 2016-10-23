

module.exports = function(app, passport) {
var BackPoc     = require('./models/BackPoc');
var vUsuario     = require('./models/usuario');
var vDigitlogin     = require('./login');
var https = require("https");


 

    
app.use(function(req, res, next) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('Client IP:', ip);

        next(); 
    });

 
    app.post('/api/error', passport.authenticate('local'), function(req, res) {
        console.log("LOGIN Error");
        res.json({res:"Error"});
    });
    
 
    app.post('/login',
              passport.authenticate('local'),
              function(req, res) {
                 console.log("LOGIN Error",req.session);
                   res.json(req.session);
              });
 
 
    app.post('/api/auth', function(req, res) {
        console.log("*** *** *** ");
        var dlogin=new vDigitlogin.DigitsLogin(req, res,"TEST TEST TEST");
            dlogin.https=https;
            dlogin.model=vUsuario;
            dlogin.login(req.body['X-Verify-Credentials-Authorization']);
    });

    app.param('id', function(req, res, next, id) {
        console.log("Param",id);
         vUsuario.findOne({ 'id_str': id }, function (err, item) {
              if (err) { return next(err); }
              if (!item) { return res.json({error:"No se encontro el usuario para :"+ id});}
              req.item = item;   // posible error
              return next();

            }) 
    });

    app.put('/api/usuarios/:id', function(req, res) {
                req.item.nombre=req.body.nombre;
                req.item.apellido=req.body.apellido;
                req.item.fecha_nacimiento=req.body.fecha_nacimiento;
                req.item.sexo= req.body.sexo;
                req.item.save(function (err) {
                  if (err) {
                    console.log(err);
                  }
                  return res.send(req.item);
                });
    });


    app.get('/api/getCentros',isLoggedIn, function(req, res) {
      BackPoc.find(function (err, collections) {
                      if (err) return next(err);
                        res.json(collections);
                    });
    });

  
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.json({mesage:"No logueado."});
}

