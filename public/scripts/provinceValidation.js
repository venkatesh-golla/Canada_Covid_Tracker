function myFunction() {
    var x = document.getElementById("searchProvince").value;
	if(x == "Alberta"){
	document.getElementById("searchProvinceValue").innerHTML = x;
	}
	else if(x=="British Columbia"){
        document.getElementById("searchProvinceValue").innerHTML = x;
    }
    else if(x=="Manitoba"){
        document.getElementById("searchProvinceValue").innerHTML = x;  
    }
    else if(x=="New Brunswick"){
        document.getElementById("searchProvinceValue").innerHTML = x;   
    }
    else if(x=="Newfoundland and Labrador"){
        document.getElementById("searchProvinceValue").innerHTML = x;
    }
    else if(x=="Nova Scotia"){
        document.getElementById("searchProvinceValue").innerHTML = x;
    }
    else if(x=="Ontario"){
        document.getElementById("searchProvinceValue").innerHTML = x;
    }
    else if(x=="Prince Edward Island"){
        document.getElementById("searchProvinceValue").innerHTML = x;
    }
    else if(x=="Quebec"){
        document.getElementById("searchProvinceValue").innerHTML = x;
    }
    else if(x=="Saskatchewan"){
        document.getElementById("searchProvinceValue").innerHTML = x;  
    }
    else{
        window.alert("Enter a valid province name");
    }
    var today = moment().format('YYYY-MM-DD');
 $('#txtDate').val(today);
}
