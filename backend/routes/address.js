var express = require('express');
var router = express.Router();
addressApi = require('../api/address-api'),

    router.get("/:page/:limit/:orderby?/:ascdesc?", function (req, res) {
        var parameter=	req.params;
        console.log(parameter);
        addressApi.list(parameter.page,parameter.limit,parameter.orderby,parameter.ascdesc).then(function (response) {
            res.status(200).json(response)
        })
            .catch(function (error) {
                res.status(500).json(error)
            })
    })
   router.get("/count", function (req, res) {
     addressApi.getAddressTotalCount()
        .then(function (response) {
            res.status(200).json(response)
        })
        .catch(function (error) {
            res.status(500).json(error)
        })

})

module.exports = router;