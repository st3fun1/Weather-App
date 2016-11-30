var weatherApp = (function(){

    var apiKey = '50663459de43ca99f3b63bdc1828332b';
    var openWeatherRequestURL = 'http://api.openweathermap.org/data/2.5/weather?';
    var ipRequestURL = 'http://ip-api.com/json';
    var $weatherImg = $('<img src="">');
    var $locationInfo = $('<p></p>');
    var defaultUnit = 'metric';
    var weatherTemp = null;

    /*Get coords using by using your own IP address */
    function getCoords() {

        $.ajax(
            {
                url:ipRequestURL,
                async:true,
                type:'get'
            }).done(getData);
    }

    function getData(data){
        //get coords from navigator or api
        var lon = data.lon;
        var lat = data.lat;

        $.ajax(
            {
                url:openWeatherRequestURL,
                async:true,
                type:'get',
                data:{
                    'lon':lon,
                    'lat':lat,
                    'APPID':apiKey,
                    'units': defaultUnit
                }
            }).done(showWeather);
    }

    function showWeather(data){

        var $details = $('<p></p>');
        $details.text(data.weather[0].description.slice(0,1).toUpperCase() + data.weather[0].description.slice(1));
        var $weatherIcon = $('<i class="wi"><i>').addClass(changeDefaultWeatherIcons(data.weather[0].id));
        weatherTemp = Math.round(data.main.temp);
        var output =" Wind speed:" + data.wind.speed + 'm/s  Humidity:' + data.main.humidity + '%';
        $locationInfo.text(data.name+', '+data.sys.country + ' ' + new Date().toDateString());
        $weatherIcon.appendTo('.general-info').addClass('weather-img');
        $details.appendTo('.general-info');
        $locationInfo.appendTo('.location-info');
        $('.temp').text(weatherTemp);
        $('.details-row  .row').text(output);
        pickBackground(data.weather[0].description);
        /* Debug */
        //   $('.status').html('<code><pre>'+JSON.stringify(data,null,2)+'</code></pre>');
    }

    function changeScale(){

        $('.scale').on('click',function () {
            console.log('w0',weatherTemp);
            weatherTemp = convertTemp(weatherTemp, defaultUnit);
            console.log('w1',weatherTemp);
            if(defaultUnit == 'metric'){
                $('.temp').text(weatherTemp);
                console.log('w2',weatherTemp);
                $('.um').text('F');
                defaultUnit = 'imperial';
                console.log(defaultUnit);
            }else{
                $('.temp').text(weatherTemp);
                console.log('w3',weatherTemp);
                $('.um').text('C');
                defaultUnit = 'metric';
                console.log(defaultUnit);
            }
        });
    }

    function convertTemp(weatherTemp, um){
        var convertedTemp;
        if(um == 'metric'){
            convertedTemp = weatherTemp * 1.8000 + 32.00;
        }else{
            convertedTemp = (weatherTemp - 32.00)/1.8000;
        }
        return Math.round(convertedTemp);
    }

    function showDetails(){
        $('.details').on('click',function(){
     /*   $('.details-row').slideToggle('slow').children().css({'color':'red'});*/
        var details = $('.details-row');
        if(details.css('visibility') == 'visible') details.css({'visibility':'hidden'});
        else details.css({'visibility':'visible','color':'red'})
        });
    }

    /*By checking the hours we choose the day/night pack of weather icons from the css file*/
    /*Weather Icons css cdn file*/
    function changeDefaultWeatherIcons(iconCode) {
        var wIcon = 'wi-owm-';
        var hour = new Date().getHours();
        var isNight = hour < 6 || hour > 18;
        if(isNight) wIcon += 'night-'+iconCode;
        else wIcon += 'day-'+iconCode;
        return wIcon;
    }

    function pickBackground(description=null) {
        var params = {
            // Request parameters
            "q":  description,
            "count": "10",
            "offset": "0",
            "mkt": "en-us",
            "safeSearch": "Moderate",
        };

        $.ajax({
            url: "https://api.cognitive.microsoft.com/bing/v5.0/images/search?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","4f9cf7378cc74ee598c3d84e5fbc5f13");
            },
            type: "GET",
            // Request body
            data: "{body}",
        })
            .done(function(data) {
            $('body').css('background-image', 'url(' + data.value[Math.floor(Math.random()*9) + 1].contentUrl + ')'
               );
        })
            .fail(function() {
            alert("error");
        });
    }

    changeScale();
    showDetails();
    getCoords(); 
})();

