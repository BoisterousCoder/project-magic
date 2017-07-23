export function getJSON(url, callback){
    url = './assets/' + url
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
            let data = JSON.parse(xobj.responseText);
            callback(data);
        }
    };
    xobj.send(null); 
}