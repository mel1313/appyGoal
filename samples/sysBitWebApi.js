var objXXXX = {}
objXXXX.data = {};
objXXXX.dbAction = "" // execSp, find, findOne, remove, aggregate, update, insert

// for MonogDb
objXXXX.collectionName =  ""  // name of MongoDb collection

// for Sql
//objXXXX.dbSp =  ""  // stored procedure to execute


sysBitApi.webApi(objXXXX).then(

                                    function (objResponse) {


                                    },
                                    function (objErr) {

                                        sysBitApi.showHttpErr(objErr);

                                    }
                            );

