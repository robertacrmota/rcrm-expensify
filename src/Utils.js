const getTranslateXValue = function(translateString){

    var n = translateString.indexOf("(");
    var n1 = translateString.indexOf(",");
    var res = parseFloat(translateString.slice(n+1,n1-1));
  
    return res; 
}

const getTranslateYValue = function(translateString){
  
   var n = translateString.indexOf(",");
   var n1 = translateString.indexOf(")");
  
   var res = parseFloat(translateString.slice(n+1,n1));
   return res;
}

export { 
    getTranslateXValue, 
    getTranslateYValue 
}