var holder = {}; // Global scoped object, holds results for later



//Function 1 gets geolocation inbrowser

function viableCoordsTester() {
    hasGDRUN = 0;

    var lat = document.getElementById('latInput').value;
    var lon = document.getElementById('lonInput').value;
    
    console.log(lat);
    
    if (90 >= lat) {
        
        startTrigger(lat, lon);
//                alert("Those Are Valid Coordinates");

    } else {
//        alert("Those Are Not Valid Coordinates");
    }
    
}

//Triggers if enter is pressed
function search(ele) {
    if (event.key === 'Enter') {
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

        //DataBase Calling Function here - returns ghi
        databaseSelector(lat, lon);

        //Calls function which sends lat and lon to a place on the page 
        //Replace with a better trigger TODO
        var myElem = document.getElementById('isLatLonSendNeededYes');
        if (myElem === null) {} else {
            latLonSender(lat, lon);
        };


        //Gets country information only, for information panel Needs Trigger
        var myElem = document.getElementById('isCountryNeededYes');
        if (myElem == null) {} else {
            countryGet(lat, lon);
        };
 
    
    
}




function geoLocater1() {
    //This uses navigator.geolocation first, or passes it on to ip otherwise

    /*MiscCounters*/
    //Prevents multiple calls of same api 
    hasGDRUN = 0;


    var options = {
        enableHighAccuracy: true,
        timeout: 20000,
//        maximumAge: 0
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

        //DataBase Calling Function here - returns ghi
        databaseSelector(lat, lon);

        //Calls function which sends lat and lon to a place on the page 
        //Replace with a better trigger TODO
        var myElem = document.getElementById('isLatLonSendNeededYes');
        if (myElem === null) {} else {
            latLonSender(lat, lon);
        };


        //Gets country information only, for information panel Needs Trigger
        var myElem = document.getElementById('isCountryNeededYes');
        if (myElem == null) {} else {
            countryGet(lat, lon);
        };

    };

    function error(err) {
        console.warn('ERROR');
//        console.log("Geolocation permission denied or not working");

/*
        getIpPermission();
*/
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


    var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + '%2C' + lon + '&key=AIzaSyCOePagk89VcwuNpkiLItJbzi0YqYQcr90';

    $.getJSON(GEOCODING).done(function (location) {
        //only here to test code
        console.log(GEOCODING)
        console.log(location)
        var result = location.results;
        //console.log(result)
        //assign results to easy to use variable, remove 1 link in the array

        //finds Country Name
        for(var iiii = 0; iiii < result.length; iiii++){
            if (result[iiii].types[0] === "country") {
//                alert("hello");
                var country = result[iiii].address_components[0].short_name;
                var countryLong = result[iiii].address_components[0].long_name;
//                var countryLong = country;
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
        for (var iii = 0; iii < result.length; iii++) {
            if (result[iii].types[0] === "administrative_area_level_2") {
                var adminArea = result[iii].address_components[0].short_name;
                var adminAreaLong = result[iii].address_components[0].long_name;
                console.log(" countryGet  adminAreaLong  =  " + adminAreaLong)
            };
        };

        //Finds Full Address
        var fullAddress = result[0].formatted_address;
        console.log("Address = " + fullAddress)
        holder.fullAddress = fullAddress;

        //Sending function here
        countrySender(adminAreaLong, cityLong, countryLong, fullAddress);

        //placeholder global variable, used to run holdertester function temporarily
        //Remove TODO
        g = 0;
    });
};

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


    $.getJSON("https://ipapi.co/json", function (jd) {
        //Assign location values to variables

        var city = jd.city;
        holder.city = city;
        var ip = jd.ip;
        var region = jd.region;
        holder.region = region;
        var country = jd.country_name;
        holder.country = country;

        //These make another call of geocoding unnecessary - however it isn't currently worth optimizing this yet to ensure a single call - key issue is difference between adminAreaLong and City name

        //Latitude Defined here
      var lat = jd.latitude;
        holder.lat = lat;

        //Longitude Defined here
      var lon = jd.longitude;
        holder.lon = lon;

        //DataBase Calling Function here - returns ghi
        databaseSelector(lat, lon);

        //Calls function which sends lat and lon to a place on the page 
        //Replace with a better trigger TODO
        var myElem = document.getElementById('isLatLonSendNeededYes');
        if (myElem === null) {} else {
            latLonSender(lat, lon);
        };


        //Gets country information only, for information panel Needs Trigger
        var myElem = document.getElementById('isCountryNeededYes');
        if (myElem == null) {} else {
            countryGet(lat, lon);
        };



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


    var adminAreaLong = adminAreaLong;
    var countryLong = countryLong;
    var cityLong = cityLong;


    //Homepage

    var here2 = document.getElementById("sendadminAreaLong");
    if (here2 !== null) {
        document.getElementById("sendadminAreaLong").innerHTML = adminAreaLong;
    }

    var here2 = document.getElementById("sendCountryFull");
    if (here2 !== null) {
        document.getElementById("sendCountryFull").innerHTML = countryLong;
    }

    var here2 = document.getElementById("sendCityFull");
    if (here2 !== null) {
        document.getElementById("sendCityFull").innerHTML = cityLong;
    }

    //Other Pages Here
    //for location page

    var here2 = document.getElementById("sendStreetAddress");
    if (here2 !== null) {
        document.getElementById("sendStreetAddress").innerHTML = holder.fullAddress;
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

        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Almost None";

    } else if (stDevsFromAvg < -1) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Very Low";

    } else if (stDevsFromAvg < -0.5) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Low";

    } else if (stDevsFromAvg < 0) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Slightly Below Average";

    } else if (stDevsFromAvg < 0.5) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Average";

    } else if (stDevsFromAvg < 0.75) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Above Average";

    } else if (stDevsFromAvg < 1) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "High";


    } else if (stDevsFromAvg < 2) {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Very High";

    } else {
        document.getElementById("sendLevelOfSolarPowerPotential").innerHTML = "Incredibly High";

    }

}


function sendAverageCircle(ghiAnn) {
    //Sends annual ghi, to second circle
    var here2 = document.getElementById("sendGhi");
    if (here2 !== null) {
        document.getElementById("sendGhi").innerHTML = ghiAnn;
    }
}

function coordsHoverSender() {


    document.getElementById("sendCountryHover").innerHTML = holder.countryLong;
    
    holder.lat =  holder.lat.toFixed(2);
    document.getElementById("sendLatHover").innerHTML = holder.lat;
    
    holder.lon =  holder.lon.toFixed(2);
    document.getElementById("sendLonHover").innerHTML = holder.lon;
}


//Sends hover ghi to the yellow circle - max min and avg annual
function sendGhiHover(ghiAnn, highest, lowest) {
//    var ghiGrossAnn = ghiAnn * 365;
    var avgGrossAnnualGhi = (ghiJan * 31) +   (ghiFeb * 28) + (ghiMar * 31) + (ghiApr * 30) + (ghiMay * 31) + (ghiJun * 30) + (ghiJul * 31) + (ghiAug * 31) + (ghiSep * 30) + (ghiOct * 31) + (ghiNov * 30) + (ghiDec * 31);
    
    avgGrossAnnualGhi = avgGrossAnnualGhi.toFixed(2);
    
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
    console.log("gross ghi = " + avgGrossAnnualGhi)
    
    var areaOfPanel = 2; 
    var effOfPanel = .167;
    //This is flawed I think - read up later TODO
    
    var perfRatio = .75;
    
    var attainableEnergy =  areaOfPanel * effOfPanel * avgGrossAnnualGhi * perfRatio;
    var attainableEnergy = attainableEnergy.toFixed(2);
    
    document.getElementById("sendNetGHI").innerHTML = attainableEnergy  + " kWh/Year";
    
    
    
    //Cost of panel = 239.5, but this does not include other factors
    //Source says avg cost of installation is $2.80 per watt of capacity
    //Therefore 330W panel = 330*2.8 = $924
    
    var costOf1Panel = 924;
    
//Old cost per panel - removed for inaccuracy - does not include other incidental costs
//    var costOf1Panel = 239.25;
//    var costOf1PanelCents = 23925;
// source https://www.civicsolar.com/product/canadian-solar-cs6u-330m-330w-mono-quintech-slvwht-solar-panel-5bb
    
    var yearlyCost1Yr = costOf1Panel/attainableEnergy;
    document.getElementById("sendyear1cost").innerHTML = yearlyCost1Yr.toFixed(2);
    var yearlyCost10Yr =  1/10 * (costOf1Panel/attainableEnergy);
    document.getElementById("sendyear10cost").innerHTML = yearlyCost10Yr.toFixed(3);
    var yearlyCost20Yr =  1/20 * (costOf1Panel/attainableEnergy);
    document.getElementById("sendyear20cost").innerHTML = yearlyCost20Yr.toFixed(3);
    
    
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









//REMOVED FUNCTIONS



/*


function holdo() {
   alert(holder.city);
    alert(holder.fullAddress);
    replaceFull();
}*/
