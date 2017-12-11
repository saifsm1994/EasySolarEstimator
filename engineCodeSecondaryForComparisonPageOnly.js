var holder = {}; // Global scoped object, holds results for later



//Function 1 gets geolocation inbrowser





function geoLocater1() {
    //This uses navigator.geolocation first, or passes it on to ip otherwise

    /*MiscCounters*/
    //Prevents multiple calls of same api 
    hasGDRUN = 0;


    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var cords = pos.coords;
        // console.log(cords);
        // Test message, comment out in final version TODO
        console.log('Your current position is: [ Latitude : ' + cords.latitude + ", " + 'Longitude: ' + cords.longitude + ']  With an accuracy range of &plusmn;' + cords.accuracy + " meters.");

        //Latitude Defined here
        lat = cords.latitude;
        holder.lat = lat;

        //Longitude Defined here
        lon = cords.longitude;
        holder.lon = lon;

        //Calls the calling functions
        callerCaller(lat,lon);

    };

    function error(err) {
        console.warn('ERROR');
//        console.log("Geolocation permission denied or not working");

//        getIpPermission();
        getIpLocation();


    };

    //Runs the above geolocater thing
    navigator.geolocation.getCurrentPosition(success, error, options);
}


//Side Function Country Finder    
function countryGet(lat, lon) {
    //Finds city name and country name in case of non-ip lookup    
    var lat = lat;
    var lon = lon;

    //Send function here


    //Free API Key, very limited
    //Install switch to switch to ip api when free calls are exhausted TODO


    var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + '%2C' + lon + '&key=APIKEYHERE';

    $.getJSON(GEOCODING).done(function (location) {handleGeoCoding1(location, GEOCODING);});
};


function handleGeoCoding1(location, GEOCODING){
    
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
        console.log(location)
        var result = location.results;
        //console.log(result)
        //assign results to easy to use variable, remove 1 link in the array

        //finds Country Name
        for (var i = 0; i < result.length; i++) {
            if (result[i].types[0] === "country") {
                var country = result[i].address_components[0].short_name;
                var countryLong = result[i].address_components[0].long_name;
                holder.countryLong = countryLong;
                holder.country = country;
                console.log(" countryGet  country =    " + country)
                //Send function here
                //      countrySender(country, countryLong);
            };
        };

        //Finds City Name
        for (var ii = 0; ii < result.length; ii++) {
            if (result[ii].types[0] === "locality") {
                var city = result[ii].address_components[0].short_name;
                holder.city = city;
                var cityLong = result[ii].address_components[0].long_name;
                console.log(" countryGet  city  =  " + cityLong)
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
        console.log("Address = " + fullAddress)
        holder.fullAddress = fullAddress;

        //Sending function here
        countrySender(adminAreaLong, cityLong, countryLong, fullAddress);

        //placeholder global variable, used to run holdertester function temporarily
        //Remove TODO
        g = 0;    
            
            
        }
}



// Function 2 gets geolocation ip permission
function getIpPermission() {

    if (confirm('Our geolocation attempts do not seem to be working. May we use your IP address to get a Geolocation?')) {
        /*
                alert('Thanks for giving us permission. :)');
        */
        //If permission given call ip geolocater
        getIpLocation();

    } else {
        //Nothing is really needed here
        /*
                alert('Oh, thats too bad then. :( ');
        */
    }
}

//Function 3 gets geolocation through ip
function getIpLocation() {
    g = 0;


    $.getJSON("https://ipapi.co/json/?key=APIKEYHERE", function (jd) {
        //Assign location values to variables


        //burnaby
        var city = jd.city;
        holder.city = city;
        var adminAreaLong = jd.city;
        if(jd.city == null){
            var adminAreaLong = "No City Location Available";
}

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
        lat = jd.latitude;
        holder.lat = lat;

        //Longitude Defined here
        lon = jd.longitude;
        holder.lon = lon;

        //Calls the calling functions
        callerCaller(lat,lon);
        
        countrySender(adminAreaLong, cityLong, countryLong, fullAddress);



    });
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
                console.log("peepapo" + holder.hasMessageRun);
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
        console.log(arrayNumber);



        $.getJSON('https://raw.githubusercontent.com/saifsm1994/SolarKeystone/master/array%20json%20version.json', function (data) {
            //replace json with locally stored version later - currently accessing github - TODO

            //Select the desired row data = full array, array answer = desired data only
            answerArray = data[arrayNumber];


            //Proof this works
            console.log("PROOF selected location GHI Values array =  " + answerArray);


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




            //<!-- General use variables out of this data	 -->
            //<!-- Highest of the given Values -->
            highest = Math.max(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec);
            console.log("highest =" + highest);

            //<!-- Lowest of the given Values -->
            lowest = Math.min(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec);
            console.log("lowest =" + lowest);

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

        });
        hasGDRUN = 2;
    }

}

//Section 3 Sending Functions

function latLonSender(lat, lon) {
    //Sends Latitude and Longitude to someplace on the page

    lat = parseFloat(lat)
    lon = parseFloat(lon)
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


    console.log("Country Sender is running")
    
    
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
            document.getElementById("sendDevsFromMean").innerHTML += " " + stDevsFromAvgRounded + " standard deviations above the mean";
        } else {
            document.getElementById("sendDevsFromMean").innerHTML += " " + stDevsFromAvgRounded + " standard deviations below the mean";
        }
    }

    //    send Level Of Solar Power Potential in words
    var here2 = document.getElementById("sendLevelOfSolarPowerPotential");
    if (here2 !== null) {
        stDPotentialWordsSender(stDevsFromAvgRounded);
    }

    var here2 = document.getElementById("sendStDev");
    if (here2 !== null) {
        document.getElementById("sendStDev").innerHTML = ghiGlobalStDev;
    }

    var here2 = document.getElementById("sendGlobalMean");
    if (here2 !== null) {
        document.getElementById("sendGlobalMean").innerHTML = ghiGlobalAverage;
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
//Below Average (Slightly )
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
//    if (stDevsFromAvg < -2) {
//
//        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Almost None";
//
//    } else if (stDevsFromAvg < -1) {
//        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Very Low";
//
//    } else if (stDevsFromAvg < -0.5) {
//        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Low";
//
//    } else if (stDevsFromAvg < 0) {
//        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Slightly Below Average";
//
//    } else if (stDevsFromAvg < 0.5) {
//        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Average";
//
//    } else if (stDevsFromAvg < 0.75) {
//        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Above Average";
//
//    } else if (stDevsFromAvg < 1) {
//        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "High";
//
//
//    } else if (stDevsFromAvg < 2) {
//        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Very High";
//
//    } else {
//        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Incredibly High";
//
//    }
//
//}


function sendAverageCircle(ghiAnn) {
    //Sends annual ghi, to second circle
    var here2 = document.getElementById("sendGhi");
    if (here2 !== null) {
        document.getElementById("sendGhi").innerHTML = ghiAnn+ " kWh/m<sup>2</sup>";
    }
}

function coordsHoverSender() {


    document.getElementById("sendCountryHover").innerHTML = holder.countryLong;

    document.getElementById("sendLatHover").innerHTML = holder.lat;

    document.getElementById("sendLonHover").innerHTML = holder.lon;
}


//Sends hover ghi to the yellow circle - max min and avg annual
function sendGhiHover(ghiAnn, highest, lowest) {
//    var ghiGrossAnn = ghiAnn * 365;
    var avgGrossAnnualGhi = (ghiJan * 31) +   (ghiFeb * 28) + (ghiMar * 31) + (ghiApr * 30) + (ghiMay * 31) + (ghiJun * 30) + (ghiJul * 31) + (ghiAug * 31) + (ghiSep * 30) + (ghiOct * 31) + (ghiNov * 30) + (ghiDec * 31);
    
    var avgGrossAnnualGhi = avgGrossAnnualGhi.toFixed(3);
    
    document.getElementById("sendGrossAnnualGhiTooltip").innerHTML = avgGrossAnnualGhi + " kWh/m<sup>2</sup>/Year";

    
    document.getElementById("sendAnnualGhiTooltip").innerHTML = ghiAnn  + " kWh/m<sup>2</sup>/Day";

    document.getElementById("sendMaxMonthGhiTooltip").innerHTML = highest  + " kWh/m<sup>2</sup>/Day";

    document.getElementById("sendMinMonthGhiTooltip").innerHTML = lowest  + " kWh/m<sup>2</sup>/Day";


}



//Fills out the hover section of the comparitive ghi circle
function sendComparativeHover(ghiAnn, ghiGlobalAverage, ghiAnnMax, ghiAnnMedian, ghiCompAnn) {

    var here2 = document.getElementById("sendCompGhi");
    if (here2 !== null) {

        $('#sendCompGhi').text(ghiCompAnn + "%");
        //Send to big circle

        //        document.getElementById("sendRelativeToGlobalMax").innerHTML += ":  " + ghiCompAnn + "%";
        //            //Send to hover Text
    }


    var here2 = document.getElementById("sendMedianAnnualGHI");
    if (here2 !== null) {
        document.getElementById("sendMedianAnnualGHI").innerHTML += ":  " + ghiAnnMedian;
    }

    var here2 = document.getElementById("sendGlobalMaximumAnnualGHI");
    if (here2 !== null) {
        document.getElementById("sendGlobalMaximumAnnualGHI").innerHTML += ":  " + ghiAnnMax;
    }

    var here2 = document.getElementById("sendRelativeToMedian");
    if (here2 !== null) {
        ghiCompAnnMedian = ((ghiAnn / ghiAnnMedian) * 100).toFixed(1);

        document.getElementById("sendRelativeToMedian").innerHTML += ":  " + ghiCompAnnMedian + "%";
    }

    var here2 = document.getElementById("sendRelativeToGlobalMax");
    if (here2 !== null) {
        document.getElementById("sendRelativeToGlobalMax").innerHTML += ":  " + ghiCompAnn + "%";
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
    console.log("gross ghi = " + avgGrossAnnualGhi)
    
    var areaOfPanel = 2; 
    var effOfPanel = .167;
    //This is flawed I think - read up later TODO
    
    var perfRatio = .80;
    
    //attainableEnergy = yearly attainable energy
    //max = 12hours of peak voltage
    // = 330 * 7 * 365 * 1/1000
    var attainableEnergy =  areaOfPanel * effOfPanel * avgGrossAnnualGhi * perfRatio;
    var attainableEnergy = attainableEnergy.toFixed(2);
    
    if(attainableEnergy > 843){attainableEnergy = 843;}
    
    document.getElementById("sendNetGHI").innerHTML = attainableEnergy  + " kWh/Year";
    
    
    
    //Cost of panel = 239.5, but this does not include other factors
    //Source says avg cost of installation is $2.80 per watt of capacity
    //Therefore 330W panel = 330*2.8 = $924 // 3.22
    
    var costOf1PanelHigh = 1062.6;
    var costOf1PanelLow = (1849/1200)*330 ;
    var degradationRate = 0.995; // accounts for median .5 percent degredation per year
    var degradationRate10Year = Math.pow(0.995,10); // Photovoltaic Degradation Rates — An Analytical Review
    console.log(degradationRate10Year);
    var degradationRate20Year = Math.pow(0.995,20); // 
    
    var yearlyCost1YrHigh = (costOf1PanelHigh/attainableEnergy).toFixed(2);
    var yearlyCost1YrLow = (costOf1PanelLow/attainableEnergy).toFixed(2);
    
    document.getElementById("sendyear1cost").innerHTML = yearlyCost1YrLow + " - " + yearlyCost1YrHigh;
    
    var yearlyCost10YrHigh =  1/10 * (costOf1PanelHigh/(attainableEnergy*degradationRate10Year));
    var yearlyCost10YrLow =  1/10 * (costOf1PanelLow/(attainableEnergy*degradationRate10Year));
    console.log(attainableEnergy);

    document.getElementById("sendyear10cost").innerHTML = yearlyCost10YrLow.toFixed(2) + " - " +yearlyCost10YrHigh.toFixed(2);
    
    var yearlyCost20YrHigh =  1/20 * (costOf1PanelHigh/(attainableEnergy*degradationRate20Year));
    var yearlyCost20YrLow =  1/20 * (costOf1PanelLow/(attainableEnergy*degradationRate20Year));

    document.getElementById("sendyear20cost").innerHTML = yearlyCost20YrLow.toFixed(2) + " - " + yearlyCost20YrHigh.toFixed(2);
    
    
}



function monthPagePortionOfAnnualSender(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, total) {


    sJan = Math.round((ghiJan / total) * 100);
    document.getElementById("sendJan").innerHTML += sJan + "%";

    sFeb = Math.round((ghiFeb / total) * 100);
    console.log(sFeb);
    document.getElementById("sendFeb").innerHTML += sFeb + "%";

    sMar = Math.round((ghiMar / total) * 100);
    document.getElementById("sendMar").innerHTML += sMar + "%";

    sApr = Math.round((ghiApr / total) * 100);
    document.getElementById("sendApr").innerHTML += sApr + "%";

    sMay = Math.round((ghiMay / total) * 100);
    document.getElementById("sendMay").innerHTML += sMay + "%";

    sJun = Math.round((ghiJun / total) * 100);
    document.getElementById("sendJun").innerHTML += sJun + "%";

    sJul = Math.round((ghiJul / total) * 100);
    document.getElementById("sendJul").innerHTML += sJul + "%";

    sAug = Math.round((ghiAug / total) * 100);
    document.getElementById("sendAug").innerHTML += sAug + "%";

    sSep = Math.round((ghiSep / total) * 100);
    document.getElementById("sendSep").innerHTML += sSep + "%";

    sOct = Math.round((ghiOct / total) * 100);
    document.getElementById("sendOct").innerHTML += sOct + "%";

    sNov = Math.round((ghiNov / total) * 100);
    document.getElementById("sendNov").innerHTML += sNov + "%";

    sDec = Math.round((ghiDec / total) * 100);
    document.getElementById("sendDec").innerHTML += sDec + "%";

    document.getElementById("mbmGhiJan").innerHTML += " " + ghiJan;
    document.getElementById("mbmGhiFeb").innerHTML += " " + ghiFeb;
    document.getElementById("mbmGhiMar").innerHTML += " " + ghiMar;
    document.getElementById("mbmGhiApr").innerHTML += " " + ghiApr;
    document.getElementById("mbmGhiMay").innerHTML += " " + ghiMay;
    document.getElementById("mbmGhiJun").innerHTML += " " + ghiJun;
    document.getElementById("mbmGhiJul").innerHTML += " " + ghiJul;
    document.getElementById("mbmGhiAug").innerHTML += " " + ghiAug;
    document.getElementById("mbmGhiSep").innerHTML += " " + ghiSep;
    document.getElementById("mbmGhiOct").innerHTML += " " + ghiOct;
    document.getElementById("mbmGhiNov").innerHTML += " " + ghiNov;
    document.getElementById("mbmGhiDec").innerHTML += " " + ghiDec;

    //    Chart 1 all months
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
                value: ghiJan
            },
            {
                month: 'Febuary',
                value: ghiFeb
            },
            {
                month: 'March',
                value: ghiMar
            },
            {
                month: 'April',
                value: ghiApr
            },
            {
                month: 'May',
                value: ghiMay
            },
            {
                month: 'June',
                value: ghiJun
            },
            {
                month: 'July',
                value: ghiJul
            },
            {
                month: 'August',
                value: ghiAug
            },
            {
                month: 'September',
                value: ghiSep
            },
            {
                month: 'October',
                value: ghiOct
            },
            {
                month: 'November',
                value: ghiNov
            },
            {
                month: 'December',
                value: ghiDec
            }
			  ],
        // The name of the data record attribute that contains x-values.
        xkey: 'month',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['GHI']
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

    var ghi1 = sortGhi[0]
    var ghi2 = sortGhi[1]
    var ghi3 = sortGhi[2]
    var ghi4 = sortGhi[3]
    var ghi9 = sortGhi[8]
    var ghi10 = sortGhi[9]
    var ghi11 = sortGhi[10]
    var ghi12 = sortGhi[11]


    //
    new Morris.Bar({
        element: 'bar-example',
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
        labels: ['X Higheest GHI', 'X Lowest GHI'],
        fillOpacity: 0.6,
        hideHover: 'auto',
        behaveLikeLine: true,
        resize: true,
        pointFillColors: ['#ffffff'],
        pointStrokeColors: ['black'],
        lineColors: ['gray', 'red']

    });
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




//Special Location Pages


function viableCoordsTester(){
    hasGDRUN = 0;

    var lat = document.getElementById('latInput').value;
    var lon = document.getElementById('lonInput').value;
    
   console.log(lat);
    
    if(90 >= lat){
        
        startTrigger(lat,lon);
//                alert("Those Are Valid Coordinates");

    }else{
//        alert("Those Are Not Valid Coordinates");
    }
    
}

function locationPreset2(latter,lonner){
    hasGDRUN = 0;

    var lat2 = latter;
    var lon2 = lonner;
    
   console.log(lat2);
    
    if(90 >= lat2){
        
        startTrigger2(lat2,lon2);
//                alert("Those Are Valid Coordinates");

    }else{
//        alert("Those Are Not Valid Coordinates");
    }
    
}

//Triggers if enter is pressed
function search(ele) {
    if(event.key === 'Enter') {
//        alert(ele.value);
        viableCoordsTester();
    }
}

function startTrigger(lat,lon){
    //Latitude Defined here
        var lat = lat;
        holder.lat = lat;

        //Longitude Defined here
        var lon = lon;
        holder.lon = lon;

        //Calls the calling functions
        callerCaller(lat,lon);
 
    
    
}


//REMOVED FUNCTIONS



/*


function holdo() {
   alert(holder.city);
    alert(holder.fullAddress);
    replaceFull();
}*/


















































//Function 1 gets geolocation inbrowser




function geoLocater12() {
    //This uses navigator.geolocation first, or passes it on to ip otherwise

    /*MiscCounters*/
    //Prevents multiple calls of same api 
    hasGDRUN2 = 0;


    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var cords = pos.coords;
        // console.log(cords);
        // Test message, comment out in final version TODO
        console.log('Your current position is: [ Latitude : ' + cords.latitude + ", " + 'Longitude: ' + cords.longitude + ']  With an accuracy range of &plusmn;' + cords.accuracy + " meters.");

        //Latitude Defined here
        lat2 = cords.latitude;
        holder.lat2 = lat;

        //Longitude Defined here
        lon2 = cords.longitude;
        holder.lon2 = lon;


        //Calls the calling functions
        callerCaller2(lat2,lon2);

    };

    function error(err) {
        console.warn('ERROR');
//        console.log("Geolocation permission denied or not working");

//        getIpPermission2();
        getIpLocation();

    };

    //Runs the above geolocater thing
    navigator.geolocation.getCurrentPosition(success, error, options);
}


//Side Function Country Finder    
function countryGet2(lat2, lon2) {
    //Finds city name and country name in case of non-ip lookup    
    var lat = lat2;
    var lon = lon2;

    //Send function here


    //Free API Key, very limited
    //Install switch to switch to ip api when free calls are exhausted TODO


    var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + '%2C' + lon + '&key=APIKEYHERE';

    $.getJSON(GEOCODING).done(function (location) { handleGeoCoding2(location, GEOCODING)});
};


function handleGeoCoding2(location, GEOCODING){
    
        if(location.status == "ZERO_RESULTS"){
         var adminAreaLong = "no results";
        var cityLong = "no results";
        var countryLong = "no results";
        var fullAddress = "no results";         
         holder.adminAreaLong2 =adminAreaLong;
         holder.cityLong2 =countryLong;
         holder.countryLong2 =countryLong;
         holder.fullAddress2  =    fullAddress    ;
            
            
            
        countrySender2(adminAreaLong, cityLong, countryLong, fullAddress);
        }else{
        //only here to test code
        console.log(GEOCODING)
        console.log(location.status)
        var result = location.results;
        //console.log(result)
        //assign results to easy to use variable, remove 1 link in the array

        //finds Country Name
        for (var i = 0; i < result.length; i++) {
            if (result[i].types[0] === "country") {
                var country = result[i].address_components[0].short_name;
                var countryLong = result[i].address_components[0].long_name;
                holder.countryLong2 = countryLong;
                holder.country2 = country;
//                console.log(" countryGet  country =    " + country)
                //Send function here
                //      countrySender(country, countryLong);
            };
        };

        //Finds City Name
        for (var ii = 0; ii < result.length; ii++) {
            if (result[ii].types[0] === "locality") {
                var city = result[ii].address_components[0].short_name;
                holder.city2 = city;
                var cityLong = result[ii].address_components[0].long_name;
                console.log(" countryGet  city  =  " + cityLong)
            };
        };

        //Finds region name name
    for (var c3 = 0; c3<1; c3++){
        for (var iii = 0; iii < result.length; iii++) {
            if (result[iii].types[0] === "administrative_area_level_2") {
                var adminArea = result[iii].address_components[0].short_name;
                var adminAreaLong = result[iii].address_components[0].long_name;
                holder.adminAreaLong2 = adminAreaLong;
                console.log(" countryGet  adminAreaLong  =  " + adminAreaLong)
            };
        };
        if(holder.adminAreaLong2 == undefined){
        for (var iii = 0; iii < result.length; iii++) {
            if (result[iii].types[0] === "administrative_area_level_1") {
                var adminArea = result[iii].address_components[0].short_name;
                var adminAreaLong = result[iii].address_components[0].long_name;
                holder.adminAreaLong2 = adminAreaLong;
                console.log(" countryGet  adminAreaLong  =  " + adminAreaLong)
            };
        };            
        }
        }

        //Finds Full Address
        var fullAddress = result[0].formatted_address;
        console.log("Address = " + fullAddress)
        holder.fullAddress2 = fullAddress;

        //Sending function here
        countrySender2(adminAreaLong, cityLong, countryLong, fullAddress);

        //placeholder global variable, used to run holdertester function temporarily
        //Remove TODO
        g = 0;}
}




// Function 2 gets geolocation ip permission
function getIpPermission2() {

    if (confirm('Our geolocation attempts do not seem to be working. May we use your IP address to get a Geolocation?')) {
        /*
                alert('Thanks for giving us permission. :)');
        */
        //If permission given call ip geolocater
        getIpLocation2();

    } else {
        //Nothing is really needed here
        /*
                alert('Oh, thats too bad then. :( ');
        */
    }
}

//Function 3 gets geolocation through ip
function getIpLocation2() {
    g = 0;


    $.getJSON("https://ipapi.co/json/?key=APIKEYHERE", function (jd) {
        //Assign location values to variables
        //burnaby
        var city2 = jd.city;
        holder.city2 = city;
        var adminAreaLong2 = jd.city;
        holder.adminAreaLong2 = jd.city;

        var cityLong2 = jd.city;
        holder.cityLong2 = jd.city;

        
        //ip
        var ip2 = jd.ip;
        holder.ip2 = ip;
        
        var postalCode2 = jd.postal;
        holder.postalCode2 = postalCode2;
        
        //BC full
        var region2 = jd.region;
        holder.region2 = region2;
        
        //canadafull
        var country2 = jd.country_name;
        holder.country2 = country2;
        
        var countryLong2 = jd.country_name;
        holder.countryLong2 = countryLong2;
        //stuff
        var fullAddress2 = jd.city + ", " + jd.region_code + ", " + jd.country_name + ", " + jd.postal;
        holder.fullAddress2 = fullAddress2;
    
        
        //These make another call of geocoding unnecessary - however it isn't currently worth optimizing this yet to ensure a single call - key issue is difference between adminAreaLong and City name

        //Latitude Defined here
      var lat2 = jd.latitude;
        holder.lat2 = lat2;

        //Longitude Defined here
      var lon2 = jd.longitude;
        holder.lon2 = lon2;


        //Calls the calling functions
        callerCaller2(lat2,lon2);
        
        countrySender(adminAreaLong2, cityLong2, countryLong2, fullAddress2);



    });
}

// Function 4 passes coordinates to the first row of elements
function sendGeoCoords2() {
    //This works, hence variables do pass    
    //alert("Location Retrieved = " + "{City, " + city + " , Country, " + country + " , Coordinates, " + lat + "," + lon +"}" );
    var here1 = document.getElementById("sendCountryDropDown2");
    if (here1 !== null) {
        document.getElementById("sendCountryDropDown2").innerHTML = "Country: " + country;
    }

    var here1 = document.getElementById("sendCountryJumbotron2");
    if (here1 !== null) {
        document.getElementById("sendCountryJumbotron2").innerHTML = "Country: " + country;
    }
    var here1 = document.getElementById("sendCityDropDown2");
    if (here1 !== null) {
        document.getElementById("sendCityDropDown2").innerHTML = "City: " + city;
    }
    var here1 = document.getElementById("sendCoordsDropDown2");
    if (here1 !== null) {
        document.getElementById("sendCoordsDropDown2").innerHTML = "Co-ordinates:                   ";
    }
    var here1 = document.getElementById("sendLatDropDown2");
    if (here1 !== null) {
        document.getElementById("sendLatDropDown2").innerHTML = "lat:  " + lat;
    }
    var here1 = document.getElementById("sendLongDropDown2");
    if (here1 !== null) {
        document.getElementById("sendLongDropDown2").innerHTML += ", long: " + lon;
    }


}





function passNewGeo2() {
    // Passes all geo coords back


}


//Section 2

function databaseSelector2(lat2, lon2) {

    //Selects Which database to use TODO

    //Make sure the data is valid
    if (lat2 >= -90 && lat2 <= 89) {
        if (lon2 >= -180 && lon2 <= 179) {

            // TODO
            if (-999 >= lat2 && lon2 <= -9200) {
                //TODO replace with high Database parameters
                alert("wrongDatasetchosen DOTHISLATER");
                highDatabase2(lat2, lon2);
                alert("database 1 is being used");
            } else {
                var hasRun = localStorage.getItem('hasMessageRun2')
                if (hasRun !== 'Yes') {
//                    alert("database 2 is being used");
                    localStorage.setItem('hasMessageRun2', 'Yes');
                }
//                console.log("peepapo" + holder.hasMessageRun);
                globalDatabase2(lat2, lon2);
            }
        }
    }
}

//If global function selected - low accuracy
function globalDatabase2(lat2, lon2) {

    //Called every time by both geolocation functions

    if (hasGDRUN < 1) {
        //prevents this from running twice needlessly 
        var hasRun = localStorage.getItem('hasMessageRun2')
        if (hasRun !== 'Yes') {
//            alert("Our data for this region is of lower accuracy and out results are therefore more likely to be less accurate")
            localStorage.setItem('hasMessageRun2', 'Yes');
        }


        //This reduces lat and lon to whole numbers so they can be used to find  a place on the table
        var latGDRound = Math.floor(lat2);
        var lonGDRound = Math.floor(lon2);


        //Chooses which entry on the array to pull
       var arrayNumber = ((latGDRound + 90) * 360) + lonGDRound + 180;
//        console.log(arrayNumber);



        $.getJSON('https://raw.githubusercontent.com/saifsm1994/SolarKeystone/master/array%20json%20version.json', function (data) {
            //replace json with locally stored version later - currently accessing github - TODO

            //Select the desired row data = full array, array answer = desired data only
            var answerArray = data[arrayNumber];


            //Proof this works
            console.log("PROOF selected location GHI Values array =  " + answerArray);


            //	   <!-- This gets the data from the Ghi Array -->
            var newLat = data[arrayNumber][0];
            var newLon = data[arrayNumber][1];
            var ghiJan = data[arrayNumber][2];
            var ghiFeb = data[arrayNumber][3];
            var ghiMar = data[arrayNumber][4];
            var ghiApr = data[arrayNumber][5];
            var ghiMay = data[arrayNumber][6];
            var ghiJun = data[arrayNumber][7];
            var ghiJul = data[arrayNumber][8];
            var ghiAug = data[arrayNumber][9];
            var ghiSep = data[arrayNumber][10];
            var ghiOct = data[arrayNumber][11];
            var ghiNov = data[arrayNumber][12];
            var ghiDec = data[arrayNumber][13];
            var ghiAnn = data[arrayNumber][14];




            //<!-- General use variables out of this data	 -->
            //<!-- Highest of the given Values -->
           var highest = Math.max(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec);
//            console.log("highest =" + highest);

            //<!-- Lowest of the given Values -->
          var  lowest = Math.min(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec);
//            console.log("lowest =" + lowest);

            //<!-- Total GHI recieved annually -->
         var   total = (ghiJan + ghiFeb + ghiMar + ghiApr + ghiMay + ghiJun + ghiJul + ghiAug + ghiSep + ghiOct + ghiNov + ghiDec).toFixed(3);



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
                stDevSender2(ghiGlobalAverage, ghiGlobalStDev, stDevsFromAvgRounded);
            }




            //Deviations for circle 4, outdated
            //            var sendDeviationsToPage = document.getElementById("sendMeDeviations");
            //            if (sendDeviationsToPage !== null) {
            //                sendDeviations(ghiGlobalStDev, stDevsFromAvg, stDevsFromAvgRounded);
            //            }


            //Sends Comparison stuff for circle 3  
            var sendAveragesToPage = document.getElementById("sendMeAveragesComparativeYes");
            if (sendAveragesToPage !== null) {
                sendComparativeHover2(ghiAnn, ghiGlobalAverage, ghiAnnMax, ghiAnnMedian, ghiCompAnn);
            }


            //Calls Ghi Data for circle 2
            var sendMeGhiDataYes = document.getElementById("sendMeGhiDataYes");
            if (sendMeGhiDataYes !== null) {
                sendAverageCircle2(ghiAnn)
            }

            var sendMeGhiDataHoverYes = document.getElementById("sendMeGhiDataHoverYes");
            if (sendMeGhiDataHoverYes !== null) {
                sendGhiHover2(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, ghiAnn, highest, lowest);
            }

            var sendMonthByMonthYes = document.getElementById("sendMonthByMonthYes")
            if (sendMonthByMonthYes !== null) {
                monthPagePortionOfAnnualSender2(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, total)
            }
            
            var sendNetGhi = document.getElementById("areNetGhiNeededYes")
            if (sendNetGhi !== null) {
                netGhiSender2(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, total)
            }

        });
        hasGDRUN = 2;
    }

}

//Section 3 Sending Functions

function latLonSender2(lat2, lon2) {
    //Sends Latitude and Longitude to someplace on the page

   var lat = parseFloat(lat2)
    var lon = parseFloat(lon2)
  var  sendlat = lat.toFixed(1);
  var  sendlon = lon.toFixed(1);

    var here2 = document.getElementById("sendLat2");
    if (here2 !== null) {
        document.getElementById("sendLat2").innerHTML += " " + sendlat;
    }

    var here2 = document.getElementById("sendLon2");
    if (here2 !== null) {
        document.getElementById("sendLon2").innerHTML += " " + sendlon;
    }
    //Replace with class later if multiple passes needed


}

function countrySender2(adminAreaLong, cityLong, countryLong, fullAddress) {
    //Sends country name to needed place


    var adminAreaLong = holder.adminAreaLong2;
    var countryLong = holder.countryLong2;
    var cityLong = holder.cityLong2;


    //Homepage

    var here2 = document.getElementById("sendadminAreaLong2");
    if (here2 !== null) {
        document.getElementById("sendadminAreaLong2").innerHTML = holder.adminAreaLong2;
    }

    var here2 = document.getElementById("sendCountryFull2");
    if (here2 !== null) {
        document.getElementById("sendCountryFull2").innerHTML = countryLong;
    }

    var here2 = document.getElementById("sendCityFull2");
    if (here2 !== null) {
        document.getElementById("sendCityFull2").innerHTML = cityLong;
    }

    //Other Pages Here
    //for location page

    var here2 = document.getElementById("sendStreetAddress2");
    if (here2 !== null) {
        document.getElementById("sendStreetAddress2").innerHTML = holder.fullAddress2;
    }

    var here2 = document.getElementById("areCoordsHoverNeededYes");
    if (here2 !== null) {
        coordsHoverSender2();
    }


}

function stDevSender2(ghiGlobalAverage, ghiGlobalStDev, stDevsFromAvgRounded) {

    //    mean  ghiGlobalAverage
    var ghiGlobalAverage = ghiGlobalAverage;

    //    stdev ghiGlobalStDev
    var ghiGlobalStDev = ghiGlobalStDev;

    //    stdevs relative stDevsFromAvgRounded Done
    var stDevsFromAvgRounded = stDevsFromAvgRounded;

    //    percentile

    //  words about level of potential Partial TODO

    //<!-- For Hover Text, deviations from global mean-->
    var here2 = document.getElementById("sendDevsFromMean2");
    if (here2 !== null) {
        if (stDevsFromAvgRounded > 0) {
            document.getElementById("sendDevsFromMean2").innerHTML += " " + stDevsFromAvgRounded + " standard deviations above the mean";
        } else {
            document.getElementById("sendDevsFromMean2").innerHTML += " " + stDevsFromAvgRounded + " standard deviations below the mean";
        }
    }

    //    send Level Of Solar Power Potential in words
    var here2 = document.getElementById("sendLevelOfSolarPowerPotential");
    if (here2 !== null) {
        stDPotentialWordsSender2(stDevsFromAvgRounded);
    }

    var here2 = document.getElementById("sendStDev");
    if (here2 !== null) {
        document.getElementById("sendStDev2").innerHTML = ghiGlobalStDev;
    }

    var here2 = document.getElementById("sendGlobalMean");
    if (here2 !== null) {
        document.getElementById("sendGlobalMean2").innerHTML = ghiGlobalAverage;
    }



}

function stDPotentialWordsSender2(stDevsFromAvgRounded) {
    //Sends only the level of solar power potential in words

    //<!-- NEED JUSTIFICATION FOR THIS - TODO  -->
    var stDevsFromAvg = stDevsFromAvgRounded;

    if (stDevsFromAvg < -2) {
        
        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Very Low";
//Almost None
    } else if (stDevsFromAvg < -1) {
        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Very Low";
//Very Low
    } else if (stDevsFromAvg < -0.5) {
        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Low";
//Low
    } else if (stDevsFromAvg < 0) {
        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Average";
//Below Average (Slightly )
    } else if (stDevsFromAvg < 0.5) {
        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Average";
//Average
    } else if (stDevsFromAvg < 0.75) {
        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Average +";

    } else if (stDevsFromAvg < 1) {
        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "High";


    } else if (stDevsFromAvg < 2) {
        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Very High";

    } else {
        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Max";

    }

}

//        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Almost None";
//
//    } else if (stDevsFromAvg < -1) {
//        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Very Low";
//
//    } else if (stDevsFromAvg < -0.5) {
//        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Low";
//
//    } else if (stDevsFromAvg < 0) {
//        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Slightly Below Average";
//
//    } else if (stDevsFromAvg < 0.5) {
//        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Average";
//
//    } else if (stDevsFromAvg < 0.75) {
//        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Above Average";
//
//    } else if (stDevsFromAvg < 1) {
//        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "High";
//
//
//    } else if (stDevsFromAvg < 2) {
//        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Very High";
//
//    } else {
//        document.getElementById("sendLevelOfSolarPowerPotential2").innerHTML = "Incredibly High";
//
//    }
//
//}


function sendAverageCircle2(ghiAnn) {
    //Sends annual ghi, to second circle
    var here2 = document.getElementById("sendGhi");
    if (here2 !== null) {
        document.getElementById("sendGhi2").innerHTML = ghiAnn + " kWh/m<sup>2</sup>";
    }
}

function coordsHoverSender2() {


    document.getElementById("sendCountryHover2").innerHTML = holder.countryLong2;

    document.getElementById("sendLatHover2").innerHTML = holder.lat2;
    
    document.getElementById("sendLonHover2").innerHTML = holder.lon2;
}


//Sends hover ghi to the yellow circle - max min and avg annual
function sendGhiHover2(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, ghiAnn, highest, lowest) {
//    var ghiGrossAnn = ghiAnn * 365;
    var avgGrossAnnualGhi = (ghiJan * 31) +   (ghiFeb * 28) + (ghiMar * 31) + (ghiApr * 30) + (ghiMay * 31) + (ghiJun * 30) + (ghiJul * 31) + (ghiAug * 31) + (ghiSep * 30) + (ghiOct * 31) + (ghiNov * 30) + (ghiDec * 31);
    
    var avgGrossAnnualGhi = avgGrossAnnualGhi.toFixed(3);

    
    document.getElementById("sendGrossAnnualGhiTooltip2").innerHTML = avgGrossAnnualGhi + " kWh/m<sup>2</sup>/Year";

    
    document.getElementById("sendAnnualGhiTooltip2").innerHTML = ghiAnn  + " kWh/m<sup>2</sup>/Day";

    document.getElementById("sendMaxMonthGhiTooltip2").innerHTML = highest  + " kWh/m<sup>2</sup>/Day";

    document.getElementById("sendMinMonthGhiTooltip2").innerHTML = lowest  + " kWh/m<sup>2</sup>/Day";


}



//Fills out the hover section of the comparitive ghi circle
function sendComparativeHover2(ghiAnn, ghiGlobalAverage, ghiAnnMax, ghiAnnMedian, ghiCompAnn) {

    var here2 = document.getElementById("sendCompGhi");
    if (here2 !== null) {

        $('#sendCompGhi2').text(ghiCompAnn + "%");
        //Send to big circle

        //        document.getElementById("sendRelativeToGlobalMax").innerHTML += ":  " + ghiCompAnn + "%";
        //            //Send to hover Text
    }


    var here2 = document.getElementById("sendMedianAnnualGHI");
    if (here2 !== null) {
        document.getElementById("sendMedianAnnualGHI2").innerHTML += ":  " + ghiAnnMedian;
    }

    var here2 = document.getElementById("sendGlobalMaximumAnnualGHI");
    if (here2 !== null) {
        document.getElementById("sendGlobalMaximumAnnualGHI2").innerHTML += ":  " + ghiAnnMax;
    }

    var here2 = document.getElementById("sendRelativeToMedian");
    if (here2 !== null) {
        ghiCompAnnMedian2 = ((ghiAnn / ghiAnnMedian) * 100).toFixed(1);

        document.getElementById("sendRelativeToMedian2").innerHTML += ":  " + ghiCompAnnMedian2 + "%";
    }

    var here2 = document.getElementById("sendRelativeToGlobalMax");
    if (here2 !== null) {
        document.getElementById("sendRelativeToGlobalMax2").innerHTML += ":  " + ghiCompAnn + "%";
    }

}


//Replaces the address entirely - lat lon country city and street
function replaceFullAddress2() {

    document.getElementById("sendStreetAddress2").innerHTML = holder.fullAddress2;
    //    document.getElementById("sendCountry2").innerHTML = holder.country;
    document.getElementById("sendLon2").innerHTML = holder.lon2;
    document.getElementById("sendCityFull2").innerHTML = holder.city2;
    document.getElementById("sendLat2").innerHTML = holder.lat2;
}

function netGhiSender2(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, total){
    
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
    console.log("gross ghi = " + avgGrossAnnualGhi)
    
    var areaOfPanel = 2; 
    var effOfPanel = .167;
    //This is flawed I think - read up later TODO
    
    var perfRatio = .80;
    
    var attainableEnergy =  areaOfPanel * effOfPanel * avgGrossAnnualGhi * perfRatio;
    var attainableEnergy = attainableEnergy.toFixed(2);
    
    if(attainableEnergy > 722){attainableEnergy = 722;}

    document.getElementById("sendNetGHI2").innerHTML = attainableEnergy  + " kWh/Year";
    
    
    
    //Cost of panel = 239.5, but this does not include other factors
    //Source says avg cost of installation is $3.22  per watt of capacity
    //Therefore 330W panel = 330*2.8 = $924 330*3.22= 1062.6
    
    var costOf1PanelHigh = 1062.6;
    var costOf1PanelLow = (1849/1200)*330 ;
    var degradationRate = 0.995; // accounts for median .5 percent degredation per year
    var degradationRate10Year = Math.pow(0.995,10); // Photovoltaic Degradation Rates — An Analytical Review
    var degradationRate20Year = Math.pow(0.995,20); //
    
//Old cost per panel - removed for inaccuracy - does not include other incidental costs
//    var costOf1Panel = 239.25;
//    var costOf1PanelCents = 23925;
// source https://www.civicsolar.com/product/canadian-solar-cs6u-330m-330w-mono-quintech-slvwht-solar-panel-5bb
    
    var yearlyCost1YrHigh = (costOf1PanelHigh/attainableEnergy).toFixed(2);
    var yearlyCost1YrLow = (costOf1PanelLow/attainableEnergy).toFixed(2);
    
    document.getElementById("sendyear1cost2").innerHTML = yearlyCost1YrLow + " - " + yearlyCost1YrHigh;
    
    var yearlyCost10YrHigh =  1/10 * (costOf1PanelHigh/(attainableEnergy*degradationRate10Year));
    var yearlyCost10YrLow =  1/10 * (costOf1PanelLow/(attainableEnergy*degradationRate10Year));
    document.getElementById("sendyear10cost2").innerHTML = yearlyCost10YrLow.toFixed(2) + " - " +yearlyCost10YrHigh.toFixed(2);
    
    var yearlyCost20YrHigh =  1/20 * (costOf1PanelHigh/(attainableEnergy*degradationRate20Year));
    var yearlyCost20YrLow =  1/20 * (costOf1PanelLow/(attainableEnergy*degradationRate20Year));

    document.getElementById("sendyear20cost2").innerHTML = yearlyCost20YrLow.toFixed(2) + " - " + yearlyCost20YrHigh.toFixed(2);
    
}
    
    


function monthPagePortionOfAnnualSender2(ghiJan, ghiFeb, ghiMar, ghiApr, ghiMay, ghiJun, ghiJul, ghiAug, ghiSep, ghiOct, ghiNov, ghiDec, total) {


    var sJan = Math.round((ghiJan / total) * 100);
    document.getElementById("sendJan").innerHTML += sJan + "%";

    var sFeb = Math.round((ghiFeb / total) * 100);
    console.log(sFeb);
    document.getElementById("sendFeb").innerHTML += sFeb + "%";

    var sMar = Math.round((ghiMar / total) * 100);
    document.getElementById("sendMar").innerHTML += sMar + "%";

    var sApr = Math.round((ghiApr / total) * 100);
    document.getElementById("sendApr").innerHTML += sApr + "%";

    var sMay = Math.round((ghiMay / total) * 100);
    document.getElementById("sendMay").innerHTML += sMay + "%";

    var sJun = Math.round((ghiJun / total) * 100);
    document.getElementById("sendJun").innerHTML += sJun + "%";

    var sJul = Math.round((ghiJul / total) * 100);
    document.getElementById("sendJul").innerHTML += sJul + "%";

    var sAug = Math.round((ghiAug / total) * 100);
    document.getElementById("sendAug").innerHTML += sAug + "%";

    var sSep = Math.round((ghiSep / total) * 100);
    document.getElementById("sendSep").innerHTML += sSep + "%";

    var sOct = Math.round((ghiOct / total) * 100);
    document.getElementById("sendOct").innerHTML += sOct + "%";

    var sNov = Math.round((ghiNov / total) * 100);
    document.getElementById("sendNov").innerHTML += sNov + "%";

    var sDec = Math.round((ghiDec / total) * 100);
    document.getElementById("sendDec").innerHTML += sDec + "%";

    document.getElementById("mbmGhiJan").innerHTML += " " + ghiJan;
    document.getElementById("mbmGhiFeb").innerHTML += " " + ghiFeb;
    document.getElementById("mbmGhiMar").innerHTML += " " + ghiMar;
    document.getElementById("mbmGhiApr").innerHTML += " " + ghiApr;
    document.getElementById("mbmGhiMay").innerHTML += " " + ghiMay;
    document.getElementById("mbmGhiJun").innerHTML += " " + ghiJun;
    document.getElementById("mbmGhiJul").innerHTML += " " + ghiJul;
    document.getElementById("mbmGhiAug").innerHTML += " " + ghiAug;
    document.getElementById("mbmGhiSep").innerHTML += " " + ghiSep;
    document.getElementById("mbmGhiOct").innerHTML += " " + ghiOct;
    document.getElementById("mbmGhiNov").innerHTML += " " + ghiNov;
    document.getElementById("mbmGhiDec").innerHTML += " " + ghiDec;

    //    Chart 1 all months
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
                value: ghiJan
            },
            {
                month: 'Febuary',
                value: ghiFeb
            },
            {
                month: 'March',
                value: ghiMar
            },
            {
                month: 'April',
                value: ghiApr
            },
            {
                month: 'May',
                value: ghiMay
            },
            {
                month: 'June',
                value: ghiJun
            },
            {
                month: 'July',
                value: ghiJul
            },
            {
                month: 'August',
                value: ghiAug
            },
            {
                month: 'September',
                value: ghiSep
            },
            {
                month: 'October',
                value: ghiOct
            },
            {
                month: 'November',
                value: ghiNov
            },
            {
                month: 'December',
                value: ghiDec
            }
			  ],
        // The name of the data record attribute that contains x-values.
        xkey: 'month',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['GHI']
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

    var ghi1 = sortGhi[0]
    var ghi2 = sortGhi[1]
    var ghi3 = sortGhi[2]
    var ghi4 = sortGhi[3]
    var ghi9 = sortGhi[8]
    var ghi10 = sortGhi[9]
    var ghi11 = sortGhi[10]
    var ghi12 = sortGhi[11]


    //
    new Morris.Bar({
        element: 'bar-example',
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
        labels: ['X Higheest GHI', 'X Lowest GHI'],
        fillOpacity: 0.6,
        hideHover: 'auto',
        behaveLikeLine: true,
        resize: true,
        pointFillColors: ['#ffffff'],
        pointStrokeColors: ['black'],
        lineColors: ['gray', 'red']

    });
}


function fillLocation2() //tests if holder contains anything
{
    while (g < 1) {
        if (holder.city2 !== null) {
            replaceFullAddress2()
            g = 2;
        }
    }
}



function callerCaller2(lat2,lon2){
// Function contains main 3 calls
    // starts the database for GHI data
    // starts the lat lon sending
    // starts the country sending
    console.log("callerCaller function called");
    var lat2 = lat2;
    var lon2 = lon2;
            //DataBase Calling Function here - returns ghi
        databaseSelector2(lat2, lon2);

        //Calls function which sends lat and lon to a place on the page 
        //Replace with a better trigger TODO
        var myElem = document.getElementById('isLatLonSendNeededYes');
        if (myElem === null) {} else {
            latLonSender2(lat2, lon2);
        };


        //Gets country information only, for information panel Needs Trigger
    //aletnative to getiplocation
        var myElem = document.getElementById('isCountryNeededYes');
        if (myElem == null) {} else {
            if (this.ipApiUsed == 1){}else{
            countryGet2(lat2, lon2);
            };
        };
}



//Special Locations Pages


function viableCoordsTester2(){
    hasGDRUN = 0;

    var lat2 = document.getElementById('latInput2').value;
    var lon2 = document.getElementById('lonInput2').value;
    
//   console.log(lat);
    
    if(90 >= lat2){
        
        startTrigger2(lat2,lon2);
//                alert("Those Are Valid Coordinates");

    }else{
//        alert("Those Are Not Valid Coordinates");
    }
    
}

//Triggers if enter is pressed
function search2(ele) {
    if(event.key === 'Enter') {
//        alert(ele.value);
        viableCoordsTester2();
    }
}

function startTrigger2(lat2,lon2){
    //Latitude Defined here
        var lat2 = lat2;
        holder.lat2 = lat2;

        //Longitude Defined here
        var lon2 = lon2;
        holder.lon2 = lon2;

        //Calls the calling functions
        callerCaller2(lat2,lon2);
    
 
    
    
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
var here111 = document.getElementById("isInputMapStyleNeededYes");
    if (here111 !== null) {
//            alert("i am alice");

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















function loadMapper2(){
//    alert("i am alice");
var here111 = document.getElementById("isInputMapStyleNeededYes");
    if (here111 !== null) {
//            alert("i am alice");

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
    };
 
    //Create the map object.
    map = new google.maps.Map(document.getElementById('map2'), options);
 
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
    document.getElementById('latInput2').value = currentLocation.lat(); //latitude
    document.getElementById('lonInput2').value = currentLocation.lng(); //longitude
}
        
        
//Load the map when the page has finished loading.
google.maps.event.addDomListener(window, 'load', initMap);
    
$(function() {
    $('#toogleDeMap2').click();
});
    
    
    }
    
}