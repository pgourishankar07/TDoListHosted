exports.getdate = function (){
    let date = new Date();

    let options = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
  
    let day = date.toLocaleString("en-US", options);
    return day;
}
;


exports.getday = function getday(){
    let date = new Date();

    let options = {
      weekday: "long",
    };
  
    let day = date.toLocaleString("en-US", options);
    return day;
};

