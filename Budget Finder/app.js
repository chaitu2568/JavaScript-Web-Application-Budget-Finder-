//BUDGET Controller

var budgetController = (function() {

    //Gives Data Structure to Store the Expenses and Incomes and Later displayed in UI

    //Creating a Custom Constructors for 'Incomes' and 'Expenses', Later create multipe instances

    //Constructor Expense
    var Expense = function(id,description,value){

        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;

    };

    //Prototype which available to all instance of Expense and Calculates the Percentage of that Instance
    Expense.prototype.calculatePercentage = function(totalIncome){

        if (totalIncome > 0)  {
            this.percentage = Math.round((this.value/totalIncome)*100);
        }     
        else {
            this.percentage = -1;
        }
    };

    //Prototype to return the Calculated Percentage
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    //Constructor Income
    var Income = function(id,description,value){

        this.id = id;
        this.description = description;
        this.value = value;

    };

    //To Store all these Object instances, we create separate data structure with properties

    var data = {

        allItems : {
            exp: [],
            inc: []
        },

        total:{
            exp:0,
            inc:0
        },

        budget: 0,

        percentage: -1

    };
    
    //Local Method to Calculate the total expenses or Incomes
    var calcTotal = function(type){

        var sum = 0;

        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });

        data.total[type] = sum;
    };

    return {

        addItem: function(type,des,val){
            var newItem, ID;
            
            //Create New ID
            if (data.allItems[type].length-1 > 0){
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            }
            else{
                ID = 0; 
            }
            

            //Create a New EXP or INC type object
            if (type === 'exp'){
                newItem = new Expense(ID,des,val);
            } else if (type === 'inc'){
                newItem = new Income(ID,des,val);
            }

            //Pushing the object to data Structure;
            data.allItems[type].push(newItem);
 
            return newItem;

        },

        //Method to remove items from the Data Structure created
        deleteItem: function(type,id){

            var ids, req_index;


            //Retrieve all ids from the Data object
            ids = data.allItems[type].map(function(current){
                    return current.id;
            });

            //Getting the index of required id which is to be deleted and used in Splice Method
            req_index = ids.indexOf(id);

            if (req_index !== -1){
                //Delete the element from data object using index
                 data.allItems[type].splice(req_index,1);
            }
        },

        calculateBudget: function(){

            //1. Calculate total income and total expenses
            calcTotal('inc');
            calcTotal('exp');

            //2. Calculate the Budget: Income - Expenses
            data.budget = data.total.inc - data.total.exp;

            //3. Calculate the Percentage of income that we spent
            if (data.total.inc > 0){
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);

            }
            else{
                data.percentage = -1;
            }
            
        },
        
        //Method which calculates the Updated Percentages to every expense
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calculatePercentage(data.total.inc); 
            });
        },

        //Method which retrievs the Updated Percentages to every expense
        getPercentages: function(){
            var allperc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allperc;
        },

        // Method used to return all the values that are Calculated in calculateBudget Function
        getCalcBudget: function(){

            return {

                budget : data.budget,
                totalIncome : data.total.inc,
                totalExp : data.total.exp,
                percentage: data.percentage

            }

        },

        // Test method to do local testing
        testing: function(){
            console.log(data);
        }


    }

})();


//UI Controller
var UIController = (function() {


    //Add all the 'class' Strings here

    var DOM_Strings = {

        inputType: '.add__type',
        inputDescription: '.add__description', 
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeList: '.income__list',
        expensesList: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeValue: '.budget__income--value',
        expenseValue: '.budget__expenses--value',
        percentageValue: '.budget__expenses--percentage',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',

        //Parent Element
        container: '.container'

    };

    return {

        getinput : function(){
           
            return {

                //retrieve type,text and value
                type: document.querySelector(DOM_Strings.inputType).value, //get 'inc' or 'exp
                description: document.querySelector(DOM_Strings.inputDescription).value,
                value: parseFloat(document.querySelector(DOM_Strings.inputValue).value)

            };
        },

        //Function to add New List of EXP or INC to UI
        addListItem: function(obj,type){

            var html,replaceHtml, htmlElement;

            //Create HTML string with Placeholder Text in it.

            if (type === 'inc'){
                htmlElement = DOM_Strings.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type == 'exp'){
                htmlElement = DOM_Strings.expensesList;
                html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            

            //Replace that Place holder string with Object that is inputed.
            replaceHtml = html.replace('%id%',obj.id);
            replaceHtml = replaceHtml.replace('%description%',obj.description);
            replaceHtml = replaceHtml.replace('%value%',obj.value);


            //Insert HTML string into a DOM using 'Insert Adjacent HTML Method'
            document.querySelector(htmlElement).insertAdjacentHTML('beforeend',replaceHtml);

        },

        //Method to clear required UI Incomes List and Expenses Incomes List
        deleteListItemL: function(parentID){

            //In javascript to remove element we need to delete its child
            var par_ele = document.getElementById(parentID);
            par_ele.parentNode.removeChild(par_ele);
        },
        

        //Method to Clear all the Input Fields that are in HTML

        clearInputFields: function(){

            var fields, fieldArr;

            //RETURNS THE LIST
            fields = document.querySelectorAll(DOM_Strings.inputDescription + ", " + DOM_Strings.inputValue);

            //CONVERSION LIST TO ARRAY USING SLICE
            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function(cur,i,array){

                //Clearing all the Input Fields in the Array
                cur.value = "";
            });

            //Adding focus after clearing all the Fields
            fieldArr[0].focus();

        },

        displayBudget: function(obj){

            document.querySelector(DOM_Strings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOM_Strings.incomeValue).textContent = obj.totalIncome;
            document.querySelector(DOM_Strings.expenseValue).textContent = obj.totalExp;
            document.querySelector(DOM_Strings.percentageValue).textContent = obj.percentage;

            if (obj.percentage > 0){
                document.querySelector(DOM_Strings.percentageValue).textContent = obj.percentage+'%';
            }else {
                document.querySelector(DOM_Strings.percentageValue).textContent = '----';
            }

        },

        //Method which display the Updated Percentages after addition and deletion
        displayPercentages: function(percentages){

            var fields = document.querySelectorAll(DOM_Strings.expensesPercLabel);

            var nodeListforEach = function(list,callback){

                for (var i=0; i < list.length; i++){
                    callback(list[i],i); 
                }

            };

            nodeListforEach(fields,function(current,index){

                if (percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
            
        },

        displayMonth: function(){
            var now = new Date();
            var month = now.getMonth();
            var year = now.getFullYear();
            document.querySelector(DOM_Strings.dateLabel).textContent = month+" "+year;

        },
        
        getDOMStrings: function() {
            return DOM_Strings;
        }

    };

})();


// Global Controller

var controller = (function(bugdetCtrl,UICtrl) {

    var setUpEventList = function() {

        var DOM = UIController.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAdditem);
    
        document.addEventListener('keypress',function(event){

            if (event.keyCode === 13 || event.which === 13){
                ctrlAdditem();
            }
        });

        //Adding the Event Handler to parent element of all the child incomes and expenses items
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteitem);

    }; 

    // Adding Budget controller in separate Function. Because during updating the budget while deleting any expense need to be done
    // in Separate Module.

    var updateBudget = function(){

        //1. Calculate Budget
        bugdetCtrl.calculateBudget();


        //2. Return the Budget
        var budget = bugdetCtrl.getCalcBudget();
        // console.log(budget);


        //2. Add the budget to UI
        UICtrl.displayBudget(budget);


    };

    //Method to Update Individual percentages in the DOM
    var updatePercentages =  function(){

        //1. Calculate Percentges 
        bugdetCtrl.calculatePercentages();

        //2. Read Percentages from the Budget Controller
        var percentages = bugdetCtrl.getPercentages();

        //3. Update them in UI with new Percentages
        UICtrl.displayPercentages(percentages);

    };

    var ctrlAdditem = function(){
        
        var input,newItem;
            
        //1. Get the field input data from UI Controller
        input = UICtrl.getinput();

        // Input Description should be different from empty String
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            
            //2. Add the item to Budget Controller
            newItem = bugdetCtrl.addItem(input.type, input.description, input.value);

            //3.Add the item to UI Controller
            UICtrl.addListItem(newItem,input.type);

            
            //4.Clearing all the fields
            UICtrl.clearInputFields();

            //5. Calculate and Update the Budget on UI
            updateBudget();

            //6 Update Percentages
            updatePercentages();
        }
    };

    //method to delete the income or expense item
    // Here the event object is parent event whose property event.target is fired when an event occurs.
    var ctrlDeleteitem = function(event){
        var elementID;

        //Traversing in the DOM to get the required HTML element (Using Event Handlers)
        elementID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (elementID){

            element_split = elementID.split('-');
            type = element_split[0];
            ID = parseInt(element_split[1]); 

            //1. delete the elements from the data structure
            bugdetCtrl.deleteItem(type,ID);

            //2. delete the element from the user interface
            UICtrl.deleteListItemL(elementID);

            //3.Update the total Budget and Show them in user interface
            updateBudget();

            //4. Update Percentages
            updatePercentages();
          
        }

    };

    return {
        
        init: function(){
            console.log('App has Started!!!');
            UICtrl.displayMonth();
            obj = {
                budget : 0,
                totalIncome : 0,
                totalExp : 0,
                percentage: -1
            }
            UICtrl.displayBudget(obj);
            setUpEventList();
        } 
    }


})(budgetController,UIController);

controller.init();
