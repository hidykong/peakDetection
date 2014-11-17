analyse = function(url) {
  var paramstring, res;
  paramstring = url.substring(1);
  params = paramstring.split('&');
  res = {};
  params.forEach(function(item, index, array) {
    var splits;
    splits = item.split('=');
    return res[splits[0]] = splits[1];
  });
  return res;
};



params = analyse(window.location.hash);
window.onload = function(){
  //change contents based on the postNo - contents and language
  document.getElementById("refNo").innerHTML = params.refNo;
}