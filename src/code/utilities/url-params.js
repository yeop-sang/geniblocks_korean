// http://stackoverflow.com/a/2880929
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while ((match = search.exec(query)))
       urlParams[decode(match[1])] = decode(match[2]);
})();

export function getClassId() {
  // Pull the class number out of the class info
  let regex = /classes\/(\d*)/g,
      matches = regex.exec(urlParams.class_info_url);

  return matches ? matches[1] : null;
}

export function getUserId() {
  return urlParams.domain_uid;
}

export default urlParams;
