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

export default urlParams;

export function updateUrlParameter(param, value) {
  const regExp = new RegExp(param + "(.+?)(&|$)", "g");
  if (value) {
    const newUrl = window.location.href.replace(regExp, param + "=" + value + "$2");
    window.history.pushState("", "", newUrl);
  } else {
    const newUrl = window.location.href.replace(regExp, "");
    window.history.replaceState("", "", newUrl);
  }
}