var holder = {}; // Global scoped object, holds results for later



//Function 1 gets geolocation inbrowser

function geoLocater1() {
    //This uses navigator.geolocation first, or passes it on to ip otherwise

    /*MiscCounters*/
    //Prevents multiple calls of same api 
    hasGDRUN = 0;


    var options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    function success(pos) {
        var cords = pos.coords;
        // console.log(cords);
        // Test message, comment out in final version TODO
        console.log('Your current position is: [ Latitude : ' + cords.latitude + ", " + 'Longitude: ' + cords.longitude + ']  With an accuracy range of &plusmn;' + cords.accuracy + " meters.");

        //Latitude Defined here
      var lat = cords.latitude;
        holder.lat = lat;

        //Longitude Defined here
      var lon = cords.longitude;
        holder.lon = lon;

        //Calls the calling functions
        callerCaller(lat,lon);
        


    };

    function error(err) {
        console.warn("ERROR");
        console.log("Geolocation permission denied or not working (This will not work in chrome)");


        getIpPermission();

        console.log("google api error - running ipapi");



    };

    //Runs the above geolocater thing
    navigator.geolocation.getCurrentPosition(success, error, options);
}




// Function 2 gets geolocation ip permission
function getIpPermission() {

    if(sessionStorage.permissionGiven == 'Yes'){getIpLocation();}else{
    if (true) {
        /*
        confirm('Our geolocation attempts do not seem to be working. May we use your IP address to get a Geolocation?')
                alert('Thanks for giving us permission. :)');
        */
        //If permission given call ip geolocater
        sessionStorage.permissionGiven = 'Yes'
        getIpLocation();

    } else {
        //Nothing is really needed here
        
                alert('Permission Denied Error - Refresh this page if you change your mind');
        
    }
}
}

//Function 3 gets geolocation through ip
//alternative to countryget
function getIpLocation() {
    g = 0;
    ipApiUsed = 1;

        console.log("ipapi running now");
    
//Limited API Calls - this stores api call in local storage. If not found goes and makes new call
    
if(sessionStorage.jd !== undefined){
    var jd = JSON.parse(sessionStorage.jd);
    console.log('Location has been stored and pulled from session storage - to refresh open in new tab');
    
    //burnaby
        var city = jd.city;
        holder.city = city;
        var adminAreaLong = jd.city;
        holder.adminAreaLong = jd.city;

        var cityLong = jd.city;
        holder.cityLong = jd.city;

        
        //ip
        var ip = jd.ip;
        holder.ip = ip;
        
        var postalCode = jd.postal;
        holder.postalCode = postalCode;
        
        //BC full
        var region = jd.region;
        holder.region = region;
        
        //canadafull
        var country = jd.country_name;
        holder.country = country;
        
        var countryLong = jd.country_name;
        holder.countryLong = countryLong;
        //stuff
        var fullAddress = jd.city + ", " + jd.region_code + ", " + jd.country_name + ", " + jd.postal;
        holder.fullAddress = fullAddress;
    
        
        //These make another call of geocoding unnecessary - however it isn't currently worth optimizing this yet to ensure a single call - key issue is difference between adminAreaLong and City name

        //Latitude Defined here
      var lat = jd.latitude;
        holder.lat = lat;

        //Longitude Defined here
      var lon = jd.longitude;
        holder.lon = lon;


        //Calls the calling functions
        callerCaller(lat,lon);
        
        countrySender(adminAreaLong, cityLong, countryLong, fullAddress);
    
}else{
    $.getJSON("https://ipapi.co/json/?key=xxxxx", function (jd) {
        //https://ipapi.co/json/?key=xxxxxxxx
//        console.log('not stored in session storage');

        
        sessionStorage.jd = JSON.stringify(jd);
        //Assign location values to variables

        //burnaby
        var city = jd.city;
        holder.city = city;
        var adminAreaLong = jd.city;
        holder.adminAreaLong = jd.city;

        var cityLong = jd.city;
        holder.cityLong = jd.city;

        
        //ip
        var ip = jd.ip;
        holder.ip = ip;
        
        var postalCode = jd.postal;
        holder.postalCode = postalCode;
        
        //BC full
        var region = jd.region;
        holder.region = region;
        
        //canadafull
        var country = jd.country_name;
        holder.country = country;
        
        var countryLong = jd.country_name;
        holder.countryLong = countryLong;
        //stuff
        var fullAddress = jd.city + ", " + jd.region_code + ", " + jd.country_name + ", " + jd.postal;
        holder.fullAddress = fullAddress;
    
        
        //These make another call of geocoding unnecessary - however it isn't currently worth optimizing this yet to ensure a single call - key issue is difference between adminAreaLong and City name

        //Latitude Defined here
      var lat = jd.latitude;
        holder.lat = lat;

        //Longitude Defined here
      var lon = jd.longitude;
        holder.lon = lon;


        //Calls the calling functions
        callerCaller(lat,lon);
        
        countrySender(adminAreaLong, cityLong, countryLong, fullAddress);

        

        
    }).fail(function(){
        
        
        jd = {
    "ip": "Out of Calls for Today",
    "city": "Out of Calls for Today",
    "region": "Out of Calls for Today",
    "region_code": "Out of Calls for Today",
    "country": "Out of Calls for Today",
    "country_name": "Out of Calls for Today",
    "postal": "Out of Calls for Today",
    "latitude": "Out of Calls for Today",
    "longitude": "Out of Calls for Today",
    "timezone": "Out of Calls for Today",
    "asn": "Out of Calls for Today",
    "org": "Out of Calls for Today"
    }
            alert("We seem to be out of automatic lookup calls for today. Try the custom location page instead.");    
                
//        
    });
    

    
}
}











//Side Function Country Finder    
function countryGet(lat, lon) {
    //Finds city name and country name in case of non-ip lookup    
    var lat = lat;
    var lon = lon;

    //Send function here


    //Free API Key, very limited
    //Install switch to switch to ip api when free calls are exhausted TODO


    var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + '%2C' + lon + '&key=XXXXXXX';

    $.getJSON(GEOCODING).done(function (location) {handleGeoCode(location, GEOCODING);
    });
};


function handleGeoCode(location, GEOCODING){
    if(location.status == "ZERO_RESULTS"){
         var adminAreaLong = "no results";
        var cityLong = "no results";
        var countryLong = "no results";
        var fullAddress = "no results";         
         holder.adminAreaLong =adminAreaLong;
         holder.cityLong = countryLong;
         holder.countryLong =countryLong;
         holder.fullAddress  =    fullAddress    ;
        countrySender(adminAreaLong, cityLong, countryLong, fullAddress);
        }else{
    
        //only here to test code
        console.log(GEOCODING)
//        console.log(location)
        var result = location.results;
        //console.log(result)
        //assign results to easy to use variable, remove 1 link in the array

        //finds Country Name
        for(var iiii = 0; iiii < result.length; iiii++){
            if (result[iiii].types[0] === "country") {
//                alert("hello");
                var country = result[iiii].address_components[0].short_name;
                var countryLong = result[iiii].address_components[0].long_name;
                holder.countryLong = countryLong;
                holder.country = country;
//                console.log(" countryGet  country =    " + country)

            };
        };

        //Finds City Name
        for (var ii = 0; ii < result.length; ii++) {
            if (result[ii].types[0] === "locality") {
                var city = result[ii].address_components[0].short_name;
                holder.city = city;
                var cityLong = result[ii].address_components[0].long_name;
                holder.cityLong = cityLong;

//                console.log(" countryGet  city  =  " + cityLong)
            };
        };

        //Finds region name name
    for (var c3 = 0; c3<1; c3++){
        for (var iii = 0; iii < result.length; iii++) {
            if (result[iii].types[0] === "administrative_area_level_2") {
//             console.log(" countryGet  adminAreaLong  =  " + adminAreaLong)
                var adminArea = result[iii].address_components[0].short_name;
                var adminAreaLong = result[iii].address_components[0].long_name;
                holder.adminAreaLong = adminAreaLong;
//                console.log(" countryGet  adminAreaLong  =  " + adminAreaLong)
            };
        };
       if(holder.adminAreaLong == undefined){
        for (var iii = 0; iii < result.length; iii++) {
            if (result[iii].types[0] === "administrative_area_level_1") {
//             console.log(" countryGet  adminAreaLong  =  " + adminAreaLong)
                var adminArea = result[iii].address_components[0].short_name;
                var adminAreaLong = result[iii].address_components[0].long_name;
                holder.adminAreaLong = adminAreaLong;
//                console.log(" countryGet  adminAreaLong  =  " + adminAreaLong)
            };
        };
           
           
       }
}
        //Finds Full Address
        var fullAddress = result[0].formatted_address;
//        console.log("Address = " + fullAddress)
        holder.fullAddress = fullAddress;

        //Sending function here
        countrySender(adminAreaLong, cityLong, countryLong, fullAddress);

        //placeholder global variable, used to run holdertester function temporarily
        //Remove TODO
        g = 0;
    }
}

// Function 4 passes coordinates to the first row of elements
function sendGeoCoords() {
    //This works, hence variables do pass    
    //alert("Location Retrieved = " + "{City, " + city + " , Country, " + country + " , Coordinates, " + lat + "," + lon +"}" );
    var here1 = document.getElementById("sendCountryDropDown");
    if (here1 !== null) {
        document.getElementById("sendCountryDropDown").innerHTML = "Country: " + country;
    }

    var here1 = document.getElementById("sendCountryJumbotron");
    if (here1 !== null) {
        document.getElementById("sendCountryJumbotron").innerHTML = "Country: " + country;
    }
    var here1 = document.getElementById("sendCityDropDown");
    if (here1 !== null) {
        document.getElementById("sendCityDropDown").innerHTML = "City: " + city;
    }
    var here1 = document.getElementById("sendCoordsDropDown");
    if (here1 !== null) {
        document.getElementById("sendCoordsDropDown").innerHTML = "Co-ordinates:                   ";
    }
    var here1 = document.getElementById("sendLatDropDown");
    if (here1 !== null) {
        document.getElementById("sendLatDropDown").innerHTML = "lat:  " + lat;
    }
    var here1 = document.getElementById("sendLongDropDown");
    if (here1 !== null) {
        document.getElementById("sendLongDropDown").innerHTML += ", long: " + lon;
    }


}





function passNewGeo() {
    // Passes all geo coords back


}


//Section 2

function databaseSelector(lat, lon) {

    //Selects Which database to use TODO

    //Make sure the data is valid
    if (lat >= -90 && lat <= 89) {
        if (lon >= -180 && lon <= 179) {

            // TODO
            if (-999 >= lat && lon <= -9200) {
                //TODO replace with high Database parameters
                alert("wrongDatasetchosen DOTHISLATER");
                highDatabase(lat, lon);
                alert("database 1 is being used");
            } else {
                var hasRun = localStorage.getItem('hasMessageRun')
                if (hasRun !== 'Yes') {
//                    alert("database 2 is being used");
                    localStorage.setItem('hasMessageRun', 'Yes');
                }
//                console.log("database seletor run : " + holder.hasMessageRun);
                globalDatabase(lat, lon);
            }
        }
    }
}

//If global function selected - low accuracy
function globalDatabase(lat, lon) {

    //Called every time by both geolocation functions

    if (hasGDRUN < 1) {
        //prevents this from running twice needlessly 
        var hasRun = localStorage.getItem('hasMessageRun2')
        if (hasRun !== 'Yes') {
//            alert("Our data for this region is of lower accuracy and out results are therefore more likely to be less accurate")
            localStorage.setItem('hasMessageRun2', 'Yes');
        }


        //This reduces lat and lon to whole numbers so they can be used to find  a place on the table
        var latGDRound = Math.floor(lat);
        var lonGDRound = Math.floor(lon);


        //Chooses which entry on the array to pull
        arrayNumber = ((latGDRound + 90) * 360) + lonGDRound + 180;
        holder.arrayNumber = arrayNumber;
//        console.log(arrayNumber);



        $.getJSON('https://raw.githubusercontent.com/saifsm1994/SolarKeystone/master/array%20json%20version.json', function (data) {
            //replace json with locally stored version later - currently accessing github - TODO
            handleJsonReturn(data);

        });
        hasGDRUN = 2;
    }

}

function handleJsonReturn(data){
    
                //Select the desired row data = full array, array answer = desired data only
    var data = data;        
    var arrayNumber = holder.arrayNumber;
//    console.log(arrayNumber);
    answerArray = data[holder.arrayNumber];


            //Proof this works
//            console.log("PROOF selected location GHI Values array =  " + answerArray);


            //	   <!-- This gets the data from the Ghi Array -->
            newLat = data[arrayNumber][0];
            newLon = data[arrayNumber][1];
            ghiJan = data[arrayNumber][2];
            ghiFeb = data[arrayNumber][3];
            ghiMar = data[arrayNumber][4];
            ghiApr = data[arrayNumber][5];
            ghiMay = data[arrayNumber][6];
            ghiJun = data[arrayNumber][7];
            ghiJul = data[arrayNumber][8];
            ghiAug = data[arrayNumber][9];
            ghiSep = data[arrayNumber][10];
            ghiOct = data[arrayNumber][11];
            ghiNov = data[arrayNumber][12];
            ghiDec = data[arrayNumber][13];
            ghiAnn = data[arrayNumber][14];
    
    localStorage.setItem('ghiAnnStored', ghiAnn);




            //<!-- General use variables out of this data	 -->
            //<!-- Highest of the given Values -->
            highest = Math.max(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec);
//            console.log("highest =" + highest);

            //<!-- Lowest of the given Values -->
            lowest = Math.min(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec);
//            console.log("lowest =" + lowest);

            //<!-- Total GHI recieved annually -->
            total = (ghiJan + ghiFeb + ghiMar + ghiApr + ghiMay + ghiJun + ghiJul + ghiAug + ghiSep + ghiOct + ghiNov + ghiDec).toFixed(3);



            //	Base Values Taken from the source excel sheet - nasa ghi 2008 
            //    mean  ghiGlobalAverage
            //    stdev ghiGlobalStDev
            //    stdevs relative stDevsFromAvgRounded


            //Max global ghi - 1 location
            var ghiAnnMax = 6.98;
            //Avg Global GHI
            var ghiGlobalAverage = 3.9429875;
            //Standard Deviation for Avg
            var ghiGlobalStDev = 1.436094329; //Done in excel, get detailed overview for writeup TODO
            //Present Deviations = CURRENT - GLOBAL / DEV
            var stDevsFromAvg = (ghiAnn - ghiGlobalAverage) / ghiGlobalStDev;
            //3 digits version
            var stDevsFromAvgRounded = stDevsFromAvg.toFixed(3); //Reduced to 3 decimel places for visual ease 
            //Median Global GHI
            var ghiAnnMedian = 3.52;
            //Percentage compared to max
            ghiCompAnn = ((ghiAnn / ghiAnnMax) * 100).toFixed(1);



            //Sending Functions

            //Standard dev, for circle 4        
            var here2 = document.getElementById("isStDevNeededYes");
            if (here2 !== null) {
                stDevSender(ghiGlobalAverage, ghiGlobalStDev, stDevsFromAvgRounded);
            }




            //Deviations for circle 4, outdated
            //            var sendDeviationsToPage = document.getElementById("sendMeDeviations");
            //            if (sendDeviationsToPage !== null) {
            //                sendDeviations(ghiGlobalStDev, stDevsFromAvg, stDevsFromAvgRounded);
            //            }


            //Sends Comparison stuff for circle 3  
            var sendAveragesToPage = document.getElementById("sendMeAveragesComparativeYes");
            if (sendAveragesToPage !== null) {
                sendComparativeHover(ghiAnn, ghiGlobalAverage, ghiAnnMax, ghiAnnMedian, ghiCompAnn);
            }


            //Calls Ghi Data for circle 2
            var sendMeGhiDataYes = document.getElementById("sendMeGhiDataYes");
            if (sendMeGhiDataYes !== null) {
                sendAverageCircle(ghiAnn)
            }

            var sendMeGhiDataHoverYes = document.getElementById("sendMeGhiDataHoverYes");
            if (sendMeGhiDataHoverYes !== null) {
                sendGhiHover(ghiAnn, highest, lowest);
            }

            var sendMonthByMonthYes = document.getElementById("sendMonthByMonthYes")
            if (sendMonthByMonthYes !== null) {
                monthPagePortionOfAnnualSender(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, total)
            }
            
            var sendNetGhi = document.getElementById("areNetGhiNeededYes")
            if (sendNetGhi !== null) {
                netGhiSender(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, total)
            }

}

//Section 3 Sending Functions

function latLonSender(lat, lon) {
    //Sends Latitude and Longitude to someplace on the page

  var lat = parseFloat(lat)
  var lon = parseFloat(lon)
    sendlat = lat.toFixed(1);
    sendlon = lon.toFixed(1);

    var here2 = document.getElementById("sendLat");
    if (here2 !== null) {
        document.getElementById("sendLat").innerHTML += " " + sendlat;
    }

    var here2 = document.getElementById("sendLon");
    if (here2 !== null) {
        document.getElementById("sendLon").innerHTML += " " + sendlon;
    }
    //Replace with class later if multiple passes needed


}

function countrySender(adminAreaLong, cityLong, countryLong, fullAddress) {
    //Sends country name to needed place

//    console.log("Country Sender is running")
    
    
    var adminAreaLong = adminAreaLong;
    //long version of city name
    
    var countryLong = countryLong;
    //country name
    
    var cityLong = cityLong;
    //cityname
    
    var fullAddress = fullAddress;
    //full addresss
    
    //Homepage

    var here2 = document.getElementById("sendadminAreaLong");
    if (here2 !== null) {
        document.getElementById("sendadminAreaLong").innerHTML = holder.adminAreaLong;
    }

    var here2 = document.getElementById("sendCountryFull");
    if (here2 !== null) {
        document.getElementById("sendCountryFull").innerHTML =  holder.countryLong;
    }

    var here2 = document.getElementById("sendCityFull");
    if (here2 !== null) {
        document.getElementById("sendCityFull").innerHTML =  holder.cityLong;
    }

    //Other Pages Here
    //for location page

    var here2 = document.getElementById("sendStreetAddress");
    if (here2 !== null) {
        document.getElementById("sendStreetAddress").innerHTML = fullAddress;
    }

    var here2 = document.getElementById("areCoordsHoverNeededYes");
    if (here2 !== null) {
        coordsHoverSender();
    }


}

function stDevSender(ghiGlobalAverage, ghiGlobalStDev, stDevsFromAvgRounded) {

    //    mean  ghiGlobalAverage
    var ghiGlobalAverage = ghiGlobalAverage;

    //    stdev ghiGlobalStDev
    var ghiGlobalStDev = ghiGlobalStDev;

    //    stdevs relative stDevsFromAvgRounded Done
    var stDevsFromAvgRounded = stDevsFromAvgRounded;

    //    percentile

    //  words about level of potential Partial TODO

    //<!-- For Hover Text, deviations from global mean-->
    var here2 = document.getElementById("sendDevsFromMean");
    if (here2 !== null) {
        if (stDevsFromAvgRounded > 0) {
            document.getElementById("sendDevsFromMean").innerHTML += " " + stDevsFromAvgRounded + " standard deviations<br> above the mean";
        } else {
            document.getElementById("sendDevsFromMean").innerHTML += " " + stDevsFromAvgRounded + " standard deviations<br> below the mean";
        }
    }

    //    send Level Of Solar Power Potential in words
    var here2 = document.getElementById("sendLevelOfSolarPowerPotential");
    if (here2 !== null) {
        stDPotentialWordsSender(stDevsFromAvgRounded);
    }

    var here2 = document.getElementById("sendStDev");
    if (here2 !== null) {
        document.getElementById("sendStDev").innerHTML = ghiGlobalStDev.toFixed(2);
    }

    var here2 = document.getElementById("sendGlobalMean");
    if (here2 !== null) {
        document.getElementById("sendGlobalMean").innerHTML = ghiGlobalAverage.toFixed(2);
    }



}

function stDPotentialWordsSender(stDevsFromAvgRounded) {
    //Sends only the level of solar power potential in words

    //<!-- NEED JUSTIFICATION FOR THIS - TODO  -->
    var stDevsFromAvg = stDevsFromAvgRounded;

    if (stDevsFromAvg < -2) {

        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Very Low";
//Almost None
    } else if (stDevsFromAvg < -1) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Very Low";
//Very Low
    } else if (stDevsFromAvg < -0.5) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Low";
//Low
    } else if (stDevsFromAvg < 0) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Average";
//Below Average (Slightly )f
    } else if (stDevsFromAvg < 0.5) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Average";
//Average
    } else if (stDevsFromAvg < 0.75) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Average +";

    } else if (stDevsFromAvg < 1) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "High";


    } else if (stDevsFromAvg < 2) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Very High";

    } else {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Max";

    }

}


function sendAverageCircle(ghiAnn) {
    //Sends annual ghi, to second circle
    var here2 = document.getElementById("sendGhi");
    if (here2 !== null) {
        document.getElementById("sendGhi").innerHTML = ghiAnn + '<small> kWh/m<sup>2</sup></small>';
    }
}

function coordsHoverSender() {


    document.getElementById("sendCountryHover").innerHTML = holder.countryLong;
    
//    alert(holder.lat);
    holder.lat = parseFloat(holder.lat);
    holder.lat =  holder.lat.toFixed(2);
    document.getElementById("sendLatHover").innerHTML = holder.lat;
    
    holder.lon = parseFloat(holder.lon);
    holder.lon =  holder.lon.toFixed(2);
    document.getElementById("sendLonHover").innerHTML = holder.lon;
}


//Sends hover ghi to the yellow circle - max min and avg annual
function sendGhiHover(ghiAnn, highest, lowest) {
//    var ghiGrossAnn = ghiAnn * 365;
    var avgGrossAnnualGhi = (ghiJan * 31) +   (ghiFeb * 28) + (ghiMar * 31) + (ghiApr * 30) + (ghiMay * 31) + (ghiJun * 30) + (ghiJul * 31) + (ghiAug * 31) + (ghiSep * 30) + (ghiOct * 31) + (ghiNov * 30) + (ghiDec * 31);
    
    avgGrossAnnualGhi = avgGrossAnnualGhi.toFixed(2);
    
    document.getElementById("sendGrossAnnualGhiTooltip").innerHTML = avgGrossAnnualGhi;
//sendGrossAnnualGhiTooltip
    
    document.getElementById("sendAnnualGhiTooltip").innerHTML = ghiAnn ;
// + " kWh/m<sup>2</sup>/Day"
    document.getElementById("sendMaxMonthGhiTooltip").innerHTML = highest;
//  + " kWh/m<sup>2</sup>/Day"
    document.getElementById("sendMinMonthGhiTooltip").innerHTML = lowest;
//  + " kWh/m<sup>2</sup>/Day"

}



//Fills out the hover section of the comparitive ghi circle
function sendComparativeHover(ghiAnn, ghiGlobalAverage, ghiAnnMax, ghiAnnMedian, ghiCompAnn) {

    var here2 = document.getElementById("sendCompGhi");
    if (here2 !== null) {

        $('#sendCompGhi').text(ghiCompAnn + "%");
        //Send to big circle  of Global Maximum

        //        document.getElementById("sendRelativeToGlobalMax").innerHTML += ":  " + ghiCompAnn + "%";
        //            //Send to hover Text
    }


    var here2 = document.getElementById("sendMedianAnnualGHI");
    if (here2 !== null) {
        document.getElementById("sendMedianAnnualGHI").innerHTML = "  " + ghiAnnMedian;
    }

    var here2 = document.getElementById("sendGlobalMaximumAnnualGHI");
    if (here2 !== null) {
        document.getElementById("sendGlobalMaximumAnnualGHI").innerHTML = "  " + ghiAnnMax;
    }

    var here2 = document.getElementById("sendRelativeToMedian");
    if (here2 !== null) {
        ghiCompAnnMedian = ((ghiAnn / ghiAnnMedian) * 100).toFixed(1);

        document.getElementById("sendRelativeToMedian").innerHTML = "  " + ghiCompAnnMedian + "%";
    }

    var here2 = document.getElementById("sendRelativeToGlobalMax");
    if (here2 !== null) {
        document.getElementById("sendRelativeToGlobalMax").innerHTML = "  " + ghiCompAnn + "%";
    }

}


//Replaces the address entirely - lat lon country city and street
function replaceFullAddress() {

    document.getElementById("sendStreetAddress").innerHTML = holder.fullAddress;
    //    document.getElementById("sendCountry2").innerHTML = holder.country;
    document.getElementById("sendLon").innerHTML = holder.lon;
    document.getElementById("sendCityFull").innerHTML = holder.city;
    document.getElementById("sendLat").innerHTML = holder.lat;
}

function netGhiSender(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, total){
    
    //Formula 
    //E = A * r * H * PR
    //E = Energy (kWh)
    
    //A = Total solar panel Area (m²)
    //Using a 2m^2 panel
    
    //r = solar panel yield or efficiency(%)
    // 335W / 2m = 16.7% 
    
    //H = Annual average solar radiation on tilted panels (shadings not included)
    // avgGros..
    
    //PR = Performance ratio, coefficient for losses (range between 0.5 and 0.9, default value = 0.75)
    //Not sure about this one yet, using default - source of this is Quora - TODO Find scholarly justification
    
    // Source https://www.irjet.net/archives/V4/i9/IRJET-V4I980.pdf TODO Replace with citation
    //
    //
    //
    
    var avgGrossAnnualGhi = (ghiJan * 31) +   (ghiFeb * 28) + (ghiMar * 31) + (ghiApr * 30) + (ghiMay * 31) + (ghiJun * 30) + (ghiJul * 31) + (ghiAug * 31) + (ghiSep * 30) + (ghiOct * 31) + (ghiNov * 30) + (ghiDec * 31);
//    console.log("gross ghi = " + avgGrossAnnualGhi)
    
    var areaOfPanel = 2; 
    var effOfPanel = .167;
    //This is flawed I think - read up later TODO
    
    var perfRatio = .80;
    
    var attainableEnergy =  areaOfPanel * effOfPanel * avgGrossAnnualGhi * perfRatio;
    var attainableEnergy = attainableEnergy.toFixed(2);
    
    
    //max panel = 330 * 6 = 1.980kWh/ day
    // = 1.98 * 365 = 
    
    if(attainableEnergy > 722){attainableEnergy = 722;}
    
    //caps system at 6hours of peak solar per day
    //TODO PUT IN MONTLY CAP OF 1980 PER DAY

    document.getElementById("sendNetGHI").innerHTML = attainableEnergy  + " kWh/Year";
    
    
    
    //Cost of panel = 239.5, but this does not include other factors
    //Source says avg cost of installation is $2.80 per watt of capacity
    //Therefore 330W panel = 330*2.8 = $924 // 3.22 = 1062.6
    
    var costOf1PanelHigh = 1062.6;
    var costOf1PanelLow = (1849/1200)*330 ;
    var degradationRate = 0.995; // accounts for median .5 percent degredation per year
    var degradationRate10Year = Math.pow(0.995,10); // Photovoltaic Degradation Rates — An Analytical Review
//        console.log(degradationRate10Year);

    var degradationRate20Year = Math.pow(0.995,20); // 
    
    var yearlyCost1DayHigh = (costOf1PanelHigh).toFixed(2);
    var yearlyCost1DayLow = (costOf1PanelLow).toFixed(2);
    var sendDaily = document.getElementById("sendDailyCost").innerHTML;
    if(sendDaily != null){
    document.getElementById("sendDailyCost").innerHTML = '<span class="boldme" style="color: green;">' + yearlyCost1DayLow + " - $" + yearlyCost1DayHigh + '</span>';   
    }
    
    
    var yearlyCost1YrHigh = (costOf1PanelHigh/attainableEnergy).toFixed(2);
    var yearlyCost1YrLow = (costOf1PanelLow/attainableEnergy).toFixed(2);
    
    document.getElementById("sendyear1cost").innerHTML = '<span class="boldme" style="color: green;">' +yearlyCost1YrLow + " - $" + yearlyCost1YrHigh + '</span>';
    
    
    
    var yearlyCost10YrHigh =  1/10 * (costOf1PanelHigh/(attainableEnergy*degradationRate10Year));
    var yearlyCost10YrLow =  1/10 * (costOf1PanelLow/(attainableEnergy*degradationRate10Year));
//    console.log(attainableEnergy);
    document.getElementById("sendyear10cost").innerHTML = '<span class="boldme" style="color: green;">' + yearlyCost10YrLow.toFixed(2) + " - $" +yearlyCost10YrHigh.toFixed(2) + '</span>';
    
    var yearlyCost20YrHigh =  1/20 * (costOf1PanelHigh/(attainableEnergy*degradationRate20Year));
    var yearlyCost20YrLow =  1/20 * (costOf1PanelLow/(attainableEnergy*degradationRate20Year));

    document.getElementById("sendyear20cost").innerHTML = '<span class="boldme" style="color: green;">' + yearlyCost20YrLow.toFixed(2) + " - $" + yearlyCost20YrHigh.toFixed(2) + '</span>';
    
    var needHours = document.getElementById("sendTvHours");
    if (needHours != null){
       //tv wattage
        //.100	
        var holdme = document.getElementById("sendTvHours").innerHTML;
        var tvHours = attainableEnergy/0.1;
         document.getElementById("sendTvHours").innerHTML = tvHours + holdme;
        // home wattage
        //10766kWh/year 
        var homePercent = attainableEnergy/10766;
        var homePercent = homePercent*100;
        var homePercent = Math.round(homePercent);
        var holdme =document.getElementById("sendAverageHomePercent").innerHTML;
         document.getElementById("sendAverageHomePercent").innerHTML = homePercent + holdme ;
        
        var holdme =document.getElementById("send1000WHeaterHours").innerHTML;
        var T1000wattage = Math.round(attainableEnergy/1.5);
         document.getElementById("send1000WHeaterHours").innerHTML =  T1000wattage + holdme;
        
        
        
    }
    
}

function monthPagePortionOfAnnualSender(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, total) {


    sJan = Math.round((ghiJan / total) * 100);
    document.getElementById("sendJan").innerHTML = "<span style='color: white; font-size: 24px;'>"+sJan + "</span>%";

    sFeb = Math.round((ghiFeb / total) * 100);
//    console.log(sFeb);
    document.getElementById("sendFeb").innerHTML = "<span style='color: white; font-size: 24px;'>"+sFeb + "</span>%";

    sMar = Math.round((ghiMar / total) * 100);
    document.getElementById("sendMar").innerHTML = "<span style='color: white; font-size: 24px;'>"+sMar + "</span>%";

    sApr = Math.round((ghiApr / total) * 100);
    document.getElementById("sendApr").innerHTML = "<span style='color: white; font-size: 24px;'>"+sApr + "</span>%";

    sMay = Math.round((ghiMay / total) * 100);
    document.getElementById("sendMay").innerHTML = "<span style='color: white; font-size: 24px;'>"+sMay + "</span>%";

    sJun = Math.round((ghiJun / total) * 100);
    document.getElementById("sendJun").innerHTML ="<span style='color: white; font-size: 24px;'>"+ sJun + "</span>%";

    sJul = Math.round((ghiJul / total) * 100);
    document.getElementById("sendJul").innerHTML = "<span style='color: white; font-size: 24px;'>"+sJul + "</span>%";

    sAug = Math.round((ghiAug / total) * 100);
    document.getElementById("sendAug").innerHTML ="<span style='color: white; font-size: 24px;'>"+ sAug + "</span>%";

    sSep = Math.round((ghiSep / total) * 100);
    document.getElementById("sendSep").innerHTML = "<span style='color: white; font-size: 24px;'>"+sSep + "</span>%";

    sOct = Math.round((ghiOct / total) * 100);
    document.getElementById("sendOct").innerHTML = "<span style='color: white; font-size: 24px;'>"+sOct + "</span>%";

    sNov = Math.round((ghiNov / total) * 100);
    document.getElementById("sendNov").innerHTML ="<span style='color: white; font-size: 24px;'>"+ sNov + "</span>%";

    sDec = Math.round((ghiDec / total) * 100);
    document.getElementById("sendDec").innerHTML = "<span style='color: white; font-size: 24px;'>"+sDec + "</span>%";

    document.getElementById("mbmGhiJan").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiJan+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiFeb").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiFeb+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiMar").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiMar+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiApr").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiApr+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiMay").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiMay+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiJun").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiJun+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiJul").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiJul+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiAug").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiAug+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiSep").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiSep+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiOct").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiOct+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiNov").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiNov+ "</span>  kWh/m<sup>2</sup>/day";
    document.getElementById("mbmGhiDec").innerHTML = " " +"<span style='color: white; font-size: 24px;'>"+ ghiDec + "</span>  kWh/m<sup>2</sup>/day";
    
    //PanelOutputSection
    var grossGhiJan = (ghiJan * 31)
    var grossGhiFeb = (ghiFeb * 28) 
    var grossGhiMar =  (ghiMar * 31) 
    var grossGhiApr = (ghiApr * 30) 
    var grossGhiMay = (ghiMay * 31) 
    var grossGhiJun = (ghiJun * 30) 
    var grossGhiJul = (ghiJul * 31) 
    var grossGhiAug = (ghiAug * 31) 
    var grossGhiSep = (ghiSep * 30) 
    var grossGhiOct = (ghiOct * 31) 
    var grossGhiNov = (ghiNov * 30) 
    var grossGhiDec = (ghiDec * 31);
    
    var areaOfPanel = 2; 
    var effOfPanel = .167;
    var perfRatio = .85;

    var attainableEnergyJan =  areaOfPanel * effOfPanel * grossGhiJan * perfRatio;
    var attainableEnergyJan = attainableEnergyJan.toFixed(2);
    document.getElementById("pwoJan").innerHTML =attainableEnergyJan + " kWh/Month";
    
        var attainableEnergyFeb =  areaOfPanel * effOfPanel * grossGhiFeb * perfRatio;
    var attainableEnergyFeb = attainableEnergyFeb.toFixed(2);
    document.getElementById("pwoFeb").innerHTML = attainableEnergyFeb + " kWh/Month";
    
        var attainableEnergyMar =  areaOfPanel * effOfPanel * grossGhiMar * perfRatio;
    var attainableEnergyMar = attainableEnergyMar.toFixed(2);
    document.getElementById("pwoMar").innerHTML = attainableEnergyMar + " kWh/Month";
    
        var attainableEnergyApr =  areaOfPanel * effOfPanel * grossGhiApr * perfRatio;
    var attainableEnergyApr = attainableEnergyApr.toFixed(2);
    document.getElementById("pwoApr").innerHTML = attainableEnergyApr + " kWh/Month";
    
        var attainableEnergyMay =  areaOfPanel * effOfPanel * grossGhiMay * perfRatio;
    var attainableEnergyMay = attainableEnergyMay.toFixed(2);
    document.getElementById("pwoMay").innerHTML = attainableEnergyMay + " kWh/Month";
    
        var attainableEnergyJun =  areaOfPanel * effOfPanel * grossGhiJun * perfRatio;
    var attainableEnergyJun = attainableEnergyJun.toFixed(2);
    document.getElementById("pwoJun").innerHTML = attainableEnergyJun + " kWh/Month";
    
        var attainableEnergyJul =  areaOfPanel * effOfPanel * grossGhiJul * perfRatio;
    var attainableEnergyJul = attainableEnergyJul.toFixed(2);
    document.getElementById("pwoJul").innerHTML = attainableEnergyJul + " kWh/Month";
    
        var attainableEnergyAug =  areaOfPanel * effOfPanel * grossGhiAug * perfRatio;
    var attainableEnergyAug = attainableEnergyAug.toFixed(2);
    document.getElementById("pwoAug").innerHTML = attainableEnergyAug + " kWh/Month";
    
        var attainableEnergySep =  areaOfPanel * effOfPanel * grossGhiSep * perfRatio;
    var attainableEnergySep = attainableEnergySep.toFixed(2);
    document.getElementById("pwoSep").innerHTML = attainableEnergySep + " kWh/Month";
    
        var attainableEnergyOct =  areaOfPanel * effOfPanel * grossGhiOct * perfRatio;
    var attainableEnergyOct = attainableEnergyOct.toFixed(2);
    document.getElementById("pwoOct").innerHTML = attainableEnergyOct + " kWh/Month";
    
        var attainableEnergyNov =  areaOfPanel * effOfPanel * grossGhiNov * perfRatio;
    var attainableEnergyNov = attainableEnergyNov.toFixed(2);
    document.getElementById("pwoNov").innerHTML = attainableEnergyNov + " kWh/Month";
    
        var attainableEnergyDec =  areaOfPanel * effOfPanel * grossGhiDec * perfRatio;
    var attainableEnergyDec = attainableEnergyDec.toFixed(2);
    document.getElementById("pwoDec").innerHTML = attainableEnergyDec + " kWh/Month";


    //    Chart 1 all months
        document.getElementById('myfirstchart').innerHTML = "";
        // makes sure charts aren't duplicated
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'myfirstchart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        parseTime: false,
        resize: true,
        data: [
            {
                month: 'January',
                value: ghiJan,
//                value2: attainableEnergyJan
            },
            {
                month: 'Febuary',
                value: ghiFeb,
//                value2: attainableEnergyFeb
            },
            {
                month: 'March',
                value: ghiMar,
//                value2: attainableEnergyMar
            },
            {
                month: 'April',
                value: ghiApr,
//                value2: attainableEnergyApr
            },
            {
                month: 'May',
                value: ghiMay,
//                value2: attainableEnergyMay
            },
            {
                month: 'June',
                value: ghiJun,
//                value2: attainableEnergyJun
            },
            {
                month: 'July',
                value: ghiJul,
//                value2: attainableEnergyJul
            },
            {
                month: 'August',
                value: ghiAug,
//                value2: attainableEnergyAug
            },
            {
                month: 'September',
                value: ghiSep,
//                value2: attainableEnergySep
            },
            {
                month: 'October',
                value: ghiOct,
//                value2: attainableEnergyOct
            },
            {
                month: 'November',
                value: ghiNov,
//                value2: attainableEnergyNov
            },
            {
                month: 'December',
                value: ghiDec,
//                value2: attainableEnergyDec
            }
			  ],
        // The name of the data record attribute that contains x-values.
        xkey: 'month',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
//        , 'value2'
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['GHI']
//        , 'kWh'
    });

    //      Chart 2 analysis
    // two colors, top 4, bottom 4, avg hover text

    //8 month variables, assign top and bottom ratings


    var sortGhi = new Array(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec);
    var holdSortedGhi = new Array();
    sortGhi.sort(function (a, b) {
        if (a < b) {
            return 1;
        } else if (a == b) {
            return 0;
        } else {
            return -1;
        }
    });

    //new names for easier sorting
    var ghi1 = sortGhi[0]
    var ghi2 = sortGhi[1]
    var ghi3 = sortGhi[2]
    var ghi4 = sortGhi[3]
    var ghi9 = sortGhi[8]
    var ghi10 = sortGhi[9]
    var ghi11 = sortGhi[10]
    var ghi12 = sortGhi[11]


    //
    document.getElementById('mysecondchart').innerHTML = "";
        // makes sure charts aren't duplicated
    new Morris.Bar({
        element: 'bar-example',
        //bars one atop the other yes or no
        stacked: false,
        // ID of the element in which to draw the chart.
        element: 'mysecondchart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        parseTime: false,
        resize: true,
        data: [
            {
                month: '1',
                value: ghi1,
                value2: ghi12
            },
            {
                month: '2',
                value: ghi2,
                value2: ghi11
            },
            {
                month: '3',
                value: ghi3,
                value2: ghi10
            },
            {
                month: '4',
                value: ghi4,
                value2: ghi9
            }
			  ],

        // The name of the data record attribute that contains x-values.
        xkey: 'month',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value', 'value2'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['X Higheest GHI', 'X Lowest GHI'],
        fillOpacity: 0.6,
        hideHover: 'auto',
        behaveLikeLine: true,
        resize: true,
        pointFillColors: ['#ffffff'],
        pointStrokeColors: ['black'],
        lineColors: ['gray', 'red']

    });

    document.getElementById('myThirdChart').innerHTML = "";
        // makes sure charts aren't duplicated
    new Morris.Bar({
        element: 'bar-example',
        stacked: false,
        // ID of the element in which to draw the chart.
        element: 'myThirdChart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        parseTime: false,
        resize: true,
        data: [
            {
                month: 'Combined 4 month Ghi',
                value: ghi1 + ghi2 + ghi3 + ghi4,
                value2: ghi9 + ghi10 + ghi11 + ghi12
            }
			  ],

        // The name of the data record attribute that contains x-values.
        xkey: 'month',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value', 'value2'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['X Highest GHI', 'X Lowest GHI'],
        fillOpacity: 0.6,
        hideHover: 'auto',
        behaveLikeLine: true,
        resize: true,
        pointFillColors: ['#ffffff'],
        pointStrokeColors: ['black'],
        lineColors: ['gray', 'red']

    });
    
    var sendWWTM = document.getElementById("sendWhatWouldThisMeanYes")
    if(sendWWTM === null){}else{
        
        

    var fourMonthHigh = ghi1 + ghi2 + ghi3 + ghi4;
    var fourMonthLow = ghi12 + ghi9 + ghi10 + ghi11;

    if(ghi1 > 1.75*ghi12){
    document.getElementById("howBigMtMdifference").innerHTML = "large";
    document.getElementById("needForSecondaryPower").innerHTML = "difficult";

    }else{
        if(ghi1>1.5*ghi12){
    document.getElementById("howBigMtMdifference").innerHTML = "medium";
    document.getElementById("needForSecondaryPower").innerHTML = "hard";
    }else{
        if(ghi1>1.2*ghi12){
        document.getElementById("howBigMtMdifference").innerHTML = "small";
        document.getElementById("needForSecondaryPower").innerHTML = "easy";

        }else{
        document.getElementById("howBigMtMdifference").innerHTML = "negligible";
            document.getElementById("needForSecondaryPower").innerHTML = "easy";


        }
    }

        
    }
        
        
    }
}


function fillLocation() //tests if holder contains anything
{
    while (g < 1) {
        if (holder.city !== null) {
            replaceFullAddress()
            g = 2;
        }
    }
}



function callerCaller(lat,lon){
// Function contains main 3 calls
    // starts the database for GHI data
    // starts the lat lon sending
    // starts the country sending
    console.log("callerCaller function called");
    var lat = lat;
    var lon = lon;
            //DataBase Calling Function here - returns ghi
        databaseSelector(lat, lon);

        //Calls function which sends lat and lon to a place on the page 
        //Replace with a better trigger TODO
        var myElem = document.getElementById('isLatLonSendNeededYes');
        if (myElem === null) {} else {
            latLonSender(lat, lon);
        };


        //Gets country information only, for information panel Needs Trigger
    //aletnative to getiplocation
        var myElem = document.getElementById('isCountryNeededYes');
        if (myElem == null) {} else {
            if (this.ipApiUsed == 1){}else{
            countryGet(lat, lon);
            };
        };
}






//Special Location pages


//This function is for custom location pages - it tests whether the inputs are valid and starts the process if they are
//No api calls in this case except for geocoding 
function viableCoordsTester() {
    hasGDRUN = 0;
    ipApiUsed =0;
    console.log("viableCoordsTester" + " is running");
    

    var lat = document.getElementById('latInput').value;
    var lon = document.getElementById('lonInput').value;
    
    
    if (90 >= lat && lat > -90) {
    if (179 >= lon && lon > -179) {

        startTrigger(lat, lon);
//                alert("Those Are Valid Coordinates");
    }else{
        alert("Those Are Not Valid Coordinates. \nPlease remain within the ranges listed in the input boxes. \n>Valid characters include: '0-9', '.', '+', and '-'  only");
    }
    
    }else{
        alert("Those Are Not Valid Coordinates. \nPlease remain within the ranges listed in the input boxes. \n>Valid characters include: '0-9', '.', '+', and '-'  only");
    }
    
}


function locationPreset2(latter,lonner){
    hasGDRUN = 0;

    var lat2 = latter;
    var lon2 = lonner;
    
   console.log(lat2);
    
    if(90 >= lat2){
        
        startTrigger(lat2,lon2);
//                alert("Those Are Valid Coordinates");

    }else{
//        alert("Those Are Not Valid Coordinates");
    }
    
}

//For custom location pages, tests if/Triggers if enter is pressed
function search(ele) {
    if (event.key === 'Enter') {
//        alert(ele.value);
        viableCoordsTester();
    }
}

// Used with custom location pages, if everything is in order this starts the engine
function startTrigger(lat,lon){
    //Latitude Defined here
        var lat = lat;
        holder.lat = lat;

        //Longitude Defined here
        var lon = lon;
        holder.lon = lon;

        //Calls the calling functions
        callerCaller(lat,lon);
    
//    if(document.getElementById("sendTvHours")!= null){
////        (lat,lon);
//    }
    

    
    
}



function runEquation(){
    //this equation is for the solar power equation page
    // It allows users to try out different arrays
//    console.log("you called?");
var energy; var area = 2; var sunlight = 3.52; var eff = 0.169; var perf = 0.8;
        
        var sunStore = localStorage.getItem('ghiAnnStored');
        var newSunLight = document.getElementById('ghiInput').value;
        if (newSunLight) { sunlight = newSunLight;}        
    
    
    
    console.log(newSunLight);
        if (sunStore && !newSunLight) { 
            // ensures that no new sunlight has been entered manually 
            // if so replaces sunlight entry with given for location
        sunlight = sunStore;
          document.getElementById('ghiInput').value = sunlight;
           console.log('pulled sunlight data for your location');

                      }
    

    
    var newArea = document.getElementById('arInput').value;
        if (newArea) { area = newArea;}    
   
    var newEff = document.getElementById('effInput').value;
        if (newEff) { eff = newEff;}
    var newPerf = document.getElementById('perfInput').value;
        if (newPerf) { perf = newPerf;}
//        console.log(newArea);

    
    
    
    energy = area * sunlight * eff * perf;
    energy = energy.toFixed(4);
    
    
    document.getElementById('energyReturn').innerHTML = energy;
    document.getElementById('enInput').value = energy;
    
}





function openHelp(){
    
    window.open("helpBox.html", "myWindow", 'width=500,height=400');
}
//REMOVED FUNCTIONS



/*


function holdo() {
   alert(holder.city);
    alert(holder.fullAddress);
    replaceFull();
}*/



///Functions from elsewhere
//for the map lookup


function loadMapper(){
//    alert("i am alice");
//    console.log(google);
    //checks if this code needs to run
var here111 = document.getElementById("isInputMapStyleNeededYes");
    if (here111 !== null) {
            console.log(google.maps);

    var map; //Will contain map object.
var marker = false; ////Has the user plotted their location marker? 
        
//Function called to initialize / create the map.
//This is called when the page has loaded.
function initMap() {
 
    //The center location of our map.
    var centerOfMap = new google.maps.LatLng(25.27, 55.29);
 
    //Map options.
    var options = {
      center: centerOfMap, //Set center.
      zoom: 7 //The zoom value.
//      key: XXXXXXXXXX    //api key
    };
 
    //Create the map object.
    map = new google.maps.Map(document.getElementById('map'), options);
 
    //Listen for any clicks on the map.
    google.maps.event.addListener(map, 'click', function(event) {                
        //Get the location that the user clicked.
        var clickedLocation = event.latLng;
        //If the marker hasn't been added.
        if(marker === false){
            //Create the marker.
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true //make it draggable
            });
            //Listen for drag events!
            google.maps.event.addListener(marker, 'dragend', function(event){
                markerLocation();
            });
        } else{
            //Marker has already been added, so just change its location.
            marker.setPosition(clickedLocation);
        }
        //Get the marker's location.
        markerLocation();
    });
}
        
//This function will get the marker's current location and then add the lat/long
//values to our textfields so that we can save the location.
function markerLocation(){
    //Get location.
    var currentLocation = marker.getPosition();
    //Add lat and lng values to a field that we can save.
    document.getElementById('latInput').value = currentLocation.lat(); //latitude
    document.getElementById('lonInput').value = currentLocation.lng(); //longitude
}
        
        
//Load the map when the page has finished loading.
google.maps.event.addDomListener(window, 'load', initMap);
    
    
$(function() {
    $('#toogleDeMap').click();
});
    
    
    
    }
    
}

function modalShow(){
    var aaa = document.getElementById("showModal");
    if(aaa !== null){
    document.getElementById("showModal").click();
    }

}
