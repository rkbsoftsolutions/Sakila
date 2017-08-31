//forever start -c \"node --harmony\" koa.js
const express = require('express');
const app = express();
var router = express.Router();
var session = require('express-session');
var Path = require('path'),
 address=require("./routes/address");
  rental=require("./routes/rental");
  city=require("./routes/city")
  auth=require("./routes/auth")
  country=require("./routes/country")
  customers=require("./routes/customer")
  var bodyParser = require('body-parser');


  
 

  var sess = {
    secret: 'keyboard cat',
    cookie: {}
  }

  app.use(bodyParser.json())
   
app.use(session(sess));
//  app.use(serve('www'));
 app.use(express.static('www'))


// var isAuthenticated = function *(next){
//   console.log("authentication check point", this.session.loggedInUser);
//   if(this.session.loggedInUser) {
//     yield next;
//   }
//   else this.res.statusCode = 401;
// }

app.use("/api/address",address);
app.use('/api/rental',rental);
app.use("/api/city",city);
app.use('/api/login', auth);
app.use('/api/country', country);
app.use('/api/customers', customers);

// app.use(router.get('/api/customers/loadstores', customerApi.getStoreList));
// app.use(router.get('/api/customers/loadcountries', customerApi.getCountryList));
// app.use(router.get('/api/customers/loadcities/:countryId', customerApi.getCityListByCountryId));

// app.use(router.get('/api/customers/count', customerApi.getCustomerTotalCount));
// app.use(router.get('/api/customers/:page/:limit/:orderby?/:ascdesc?', customerApi.list));
// app.use(router.get('/api/customers/next/:customerId/:page', customerApi.getNextCustomerID));
// app.use(router.get('/api/customers/:customerId', customerApi.getACustomer));
// app.use(router.post('/api/customers/delete/:customerId', customerApi.deleteCustomer));
// app.use(router.post('/api/customers/savechanges', customerApi.saveUpdateCustomer));

// app.use(router.get('/api/country/count', countryApi.getCountryTotalCount));
// app.use(router.get('/api/country/:page/:limit/:orderby?/:ascdesc?', countryApi.list));
// app.use(router.get('/api/country/next/:countryId/:page', countryApi.getNextCountryID));
// app.use(router.get('/api/country/:countryId', countryApi.getACountry));
// app.use(router.post('/api/country/delete/:countryId', countryApi.deleteCountry));
// app.use(router.post('/api/country/savechanges', countryApi.saveUpdateCountry));

// // app.use(router.get('/api/city/count', cityApi.getCityTotalCount));
// // app.use(router.get('/api/city/:page/:limit/:orderby?/:ascdesc?', cityApi.list));
// app.use(router.get('/api/city/next/:cityId/:page', cityApi.getNextCityID));
// app.use(router.get('/api/city/:cityId', cityApi.getACity));
// app.use(router.post('/api/city/delete/:cityId', cityApi.deleteCity));
// app.use(router.post('/api/city/savechanges', cityApi.saveUpdateCity));


// //app.use(router.get('/api/address/count', addressApi.getAddressTotalCount));
// //app.use(router.get('/api/address/:page/:limit/:orderby?/:ascdesc?', addressApi.list));
// app.use(router.get('/api/address/next/:addressId/:page', addressApi.getNextAddressID));
// app.use(router.get('/api/address/:addressId', addressApi.getAnAddress));
// app.use(router.post('/api/address/delete/:addressId', addressApi.deleteAddress));
// app.use(router.post('/api/address/savechanges', addressApi.saveUpdateAddress));





// app.use(router.get('/api/rental/loadinventory', rentalApi.getInventoryListRental));
// app.use(router.get('/api/rental/loadcustomer', rentalApi.getCustomerListRental));
// app.use(router.get('/api/rental/loadstaff', rentalApi.getStaffListRental));

// // app.use(router.get('/api/rental/count', rentalApi.getRentalTotalCount));
// // app.use(router.get('/api/rental/:page/:limit/:orderby?/:ascdesc?', rentalApi.list));
// app.use(router.get('/api/rental/next/:rentalId/:page', rentalApi.getNextRentalID));
// app.use(router.get('/api/rental/:rentalId', rentalApi.getARental));
// app.use(router.post('/api/rental/delete/:rentalId', rentalApi.deleteRental));
// app.use(router.post('/api/rental/savechanges', rentalApi.saveUpdateRental));



app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });


// render(app, options);
// app.context.render = co.wrap(app.context.render);

// render(app, {
//   root: path.join(__dirname,'views'),
//   layout: 'layout',
//   viewExt: 'ejs',
//   cache: false,
//   debug: true
// });


app.use(function (req,res) {  
  // if(req.url != '/' && req.url != '/login'){
  //   if(!this.session.loggedInUser) return this.res.statusCode = 401;
  // }
  res.render('layout', {data: {}});
});

app.listen(3000);
console.log('listening on port 3000');