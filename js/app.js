$(document).ready(function ( ) {
    
    //-----VARIABLES--------------
    //var db = require("db.json");
    var userArray = [];
    
    var groupFilter = ''; //Var for filter by group in group detail page
    
    
    //------------------------------
    
    
    $(document).delegate('.main-left button', 'click', function (){
        groupFilter = $(this)[0].textContent;
        
        readFromDB();
    });
  
    
    //Accordion Effect for new user input
    $('.Adduser').css('display', 'none');
    $('#AddUser').click(function(){
        $('.Adduser').toggle(500);
    });
    
    //Accordion Effect for new Group input
    $('.Addgroup').css('display', 'none');
    $('#AddGroup').click(function(){
        $('.Addgroup').toggle(500);
    });
    
    $('#groupPage').click(function(){
        location.href = "group_detail.html";
    });
    
    $('#userPage').click(function(){
        location.href = "index.html";
    });
    
    
    var groupTable = function(){
        //Clean tbody
        $('tbody').empty();
        
        //If click one button (filter)
        if (groupFilter)
        userArray = $.grep(userArray , function(n ,i){
            return(n.groupName == groupFilter);
        });
        
        //eset groupFilter
        groupFilter = '';
            
            
         $(userArray).each(function(index){
            $('tbody').append('<tr> <td>' + userArray[index].userName +'</td></td><td><button type="button" class="btn btn-danger">Delete</button></td></tr>');
            
        });
    }; //End Group Table
    
    //Function to generate Buttons AJAX
    generateButtons = function(){
        var groupDOM = [];
        
        //Delete div with buttons for new table
        $('.main-left').empty();
        
        
        //Function for unique users and groups
		$(userArray).each(function (index) {
			//inArray - search var in array. If found 1, else -1
            if ($.inArray(userArray[index].groupName, groupDOM) === -1)
				//Sort by name
				groupDOM.push(userArray[index].groupName);
        });
		groupDOM.sort();
		
		//Enter the buttons
		$(groupDOM).each(function (index) {
            $('.main-left').append('<button type="button" id="' + groupDOM[index] + '" class="btn btn-primary btn-block">' + groupDOM[index] + '</button>');
        });
    }; //End generate Buttons AJAX
    
     //Function for showing users table in the User Detail Page
    var userTable = function(){
        //Clean tbody
        $('tbody').empty();
        

        // Filled DOM array Button
        $(userArray).each(function(index){
            $('tbody').append('<tr> <td>' + userArray[index].userName +'</td><td><div class="styled-select"><select>'+ userTableGroup(userArray[index])+'</select></div></td><td><button type="button" class="btn btn-success">Add</button></td><td><button type="button" class="btn btn-danger">Delete</button></td></tr>');
            
        });
            
    };
    
    // automatic add user groupe
    var userTableGroup = function(objectUser){
        var AdminGroup = '<option data-foo="admin" selected="selected">Admin</option><option data-foo="moderator">Moderator</option><option data-foo="journalist">Journalist</option>',
            
            ModeratorGroup = '<option data-foo="moderator" selected="selected">Moderator</option><option data-foo="moderator">Moderator</option><option data-foo="journalist">Journalist</option>',
            
            JournalistGroup = '<option data-foo="admin" selected="selected">Journalist</option><option data-foo="moderator">Moderator</option><option data-foo="journalist">Journalist</option>';
        
        switch (objectUser.groupName){
            case "Admin": {
                return AdminGroup;
                break;
        };
            case "Journalist": {
                return JournalistGroup;
                break;
        };
            case "Moderator": {
                return ModeratorGroup;
                break;
        };
                
        };
    }; // End Add User Group
    
    
    //Function for reading JSON
    var readFromDB = function (groupName){
        
        //Make empty user array
        userArray.length = 0;
        
        //Function for adding variables from JSON
        $.getJSON("./js/db.json", function(result){
        
            //Filled array userArray from JSON
            $.each(result, function(key, field){
                userArray.push(field);
            })
            
            // Choose option for load table by ID
            if ($('#pageID').text()=='UDP'){
                userTable();
            }else{
                generateButtons();
                groupTable();
            }
            
        }) // End Get JSON
        
    }
    //--------------------------------------------
    $("#enterName").on("keyup", function() {
    var value = $(this).val();

    $("table tr").each(function(index) {
        if (index !== 0) {

            $row = $(this);

            var id = $row.find("td:first").text();

            if (id.indexOf(value) !== 0) {
                $row.hide();
            }
            else {
                $row.show();
            }
        }
    });
}); 
    // Sort form
    $('table').each(function () {
        
        var $table = $(this);
        
        $('th', $table).each(function (column) {
            if ($(this).is('.alphabetic')) {
                $(this).click(function () {
                    var sortOrder = $('table').data('order'),
					rows = $table.find('tbody > tr').get();
                    
                    if(sortOrder == 'd' || sortOrder == ''){
                        $('table').data('order','a');
                        rows.sort(function(a,b){
                            var keyA = $(a).children('td').eq(column).text();
                            var keyB = $(b).children('td').eq(column).text();
                            
                            if (keyA < keyB){
                                return 1;
                            }
                            if (keyA > keyB){
                                return -1;
                            }
                            return 0;
                        });
                    }
                    else {
                        $('table').data('order','d');
                        rows.sort(function(a,b){
                            var keyA = $(a).children('td').eq(column).text();
                            var keyB = $(b).children('td').eq(column).text();
                            
                            if (keyA < keyB){
                                return -1;
                            }
                            if (keyA > keyB){
                                return 1;
                            }
                            return 0;
                        });
                        
                        }
                    // Add in the table sorted elements
                    $.each(rows, function(index, row){
                        $table.children('tbody').append(row);
                    });
                });
            }
        });
    }); // End Sort form
    
    
    //Enter this function when page start loaded
    readFromDB();
    
});// End ready

