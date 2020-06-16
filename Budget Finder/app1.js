//Modules Practice

var budgetController = (function() {

    var x = 22;

    // It is Private as the Function is Immediatly invoked Function expression
    var add = function(a) {
        return x+a;
    }

    //It gives access to local Variable, Because of Closures (It gives innner function 
    //access to varibales of outer function even though outer function is returned.)
    return {
        'publicBudget': function(b){

            return add(b);
        }
    }

})();


var UIController = (function() {



})();


var controller = (function(bugdetCtrl,UICtrl) {

        var z  =bugdetCtrl.publicBudget(5);

        return {
            testPublic : function(){
                console.log(z);
            }
        }

})(budgetController,UIController);


