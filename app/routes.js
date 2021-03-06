

module.exports = function(app, passport) {
var BackPoc     = require('./models/BackPoc');
var vUsuario     = require('./models/usuario');
var Notificaciones     = require('./models/notificaciones');
var NotificacionesUsuarios     = require('./models/notificaciones_usuario');
var AppVersion     = require('./models/apps_versions');
var vDigitlogin     = require('./login');
var https = require("https");


 


    app.get('/notificaciones', function(req, res, next) {
      res.render('notificaciones', { title: 'Notificaciones.' });
    });
    app.get('/appversion', function(req, res, next) {
      res.render('appversion', { title: 'Versiones.' });
    });

      app.get('/', function(req, res, next) {
      res.render('index', { title: 'Notificaciones' });
    });

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
        console.log("*** Param ***",id);
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


    app.get('/api/getCentros', function(req, res) {
      BackPoc.find(function (err, collections) {
                      if (err) return next(err);
                        res.json(collections);
                    });
    });

    // Notificaciones
    app.get('/api/notificaciones', function(req, res) {
      Notificaciones.find(req.query,function (err, collections) {
                      if (err) return next(err);
                        res.json(collections);
                    });
    });

    app.get('/api/notificaciones/timestamp/gte', function(req, res) {
      Notificaciones.find({timestamp: { $gte: req.query.timestamp}},function (err, collections) {
                      if (err) return next(err);
                        res.json(collections);
                    });
      
    });

    app.param('idNotificacion', function(req, res, next, idNotificacion) {
        console.log("** * * Param  idNotificacion***",idNotificacion);
         Notificaciones.findOne({ '_id': idNotificacion }, function (err, item) {
              if (err) { return next(err); }
              if (!item) { return res.json({error:"No se encontro la notificacion."});}
              req.item = item;   // posible error
              return next();
            }) 
    });
    app.post('/api/notificaciones', function(req, res,next) {
        try {
          console.log("send -> response -> ",req.body);
                      var vNotificationJson= {
                              title: req.body.title,
                              description: req.body.description,
                              link: req.body.link,
                              type:req.body.type,
                              category_str:req.body.category,
                              category: req.body.category_id,
                              inner_id: req.body.innerid
                          }

                var vfcm = require('./code/fcm')
                var c=new vfcm.FcmMan('AIzaSyCaPkK09tHld1r0Wv-2ulDcVfCKwdkRZqQ');
                c.message.to='/topics'+req.body.category; //'dfwIc-cYK6Y:APA91bFn3JvTLkINJP5G7sQ6cKFXL_jgUaMkZ5qDjgTOvKSxJ9g9TiRY4mcFhPjEo-kzHZnOHG18AVtjSTqtkCEHvibmAW105HSg1Z8_W3KvQ_f0tLwzWw3XO5v8ZnwnlDY13XnUmyff' 
                c.message.notification.title=req.body.title;
                c.message.notification.body=req.body.description;
                c.message.data=vNotificationJson;
                c.send(function(err, response){
                  console.log("send -> response -> ",response);
                  if (err) {
                       console.log("send -> err",err);
                       res.json({errors:err});
                  }else{
                         var vNotificaciones = new Notificaciones(vNotificationJson);
                            vNotificaciones.save(function(err, post){
                                if(err){ 
                                  return res.json({errors:err.message}); 
                                }
                                res.json(post);
                            });
                    }
                });
               
            }
            catch(err) {
              console.log("err",err);
            }
    }); 

    app.put('/api/notificaciones/:idNotificacion', function(req, res) {
                req.item.titulo=req.body.titulo;
                req.item.categoria=req.body.categoria;
                req.item.asunto=req.body.asunto;
                req.item.texto= req.body.texto;
                req.item.save(function (err) {
                  if (err) {
                    console.log(err);
                  }
                  return res.send(req.item);
                });
    });

    app.post('/api/notificacionesUsuarios', function(req, res) {
        console.log("req.body",req.body);
          var vNotificacionesUsuario = new NotificacionesUsuarios(req.body);
          vNotificacionesUsuario.save(function(err, post){
              if(err){ return res.json({error:err.message}); }
              res.json(post);
            });
    }); 


  app.post('/api/appversion', function(req, res) {
          console.log("req.body",req.body);

          var vAppVersion = new AppVersion({version: req.body});
          vAppVersion.save(function(err, post){
              if(err){ return res.json({error:err.message}); }
              res.json(post);
            });
    });
  app.get('/api/appversion', function(req, res) {
          console.log("req.query",req.query);
          res.json({  "ios": {
                        "current": "1.1",
                        "stable": "0.1"
                      },
                      "android": {
                        "current": 2,
                        "stable": 1,
                        "name": "1.1"
                      }
                    });
          /*
          AppVersion.findOne({'version.app':"EPOC"},function(err, post){
              if(err){ return res.json({error:err.message}); }
              console.log("post",post);
              res.json(post);
          });
          */
    });
  app.get('/api/appversion2', function(req, res) {
          AppVersion.findOne({'version.app':"EPOC"},function(err, post){
              if(err){ return res.json({error:err.message}); }
              console.log("post",post.version);
              res.json(post.version);
          });
          
    });


    app.get('/api/dashboard', function(req, res) {
       
       function random (low, high) {
          return Math.random() * (high - low) + low;
      }

      var downloads=random(1, 3)*145680 | 0;
      var iphone= Math.floor(downloads / random(1, 6)) | 0;
      var android= downloads-iphone;
        var male= Math.floor(downloads / random(1, 6)) | 0;
      var female= downloads-male;

        
 
          var result={
            "downloads": downloads,
            "os": {
              "iphone": iphone,
              "android": android
            },
            "gender": {
              "male": male,
              "female": female
            }
          }
          res.json(result);
        
    });


    

  
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.json({mesage:"No logueado."});
}

