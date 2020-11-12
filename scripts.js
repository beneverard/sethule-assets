// if the donate handle function exists, fire it
if (typeof handleDonatePage === "function") { 
    handleDonatePage(jQuery);
}


// if a URL hash exists, attempt to click the corresponding element
jQuery(document).ready(function($) {

    if (window.location.hash && $(window.location.hash).length) {
        $(window.location.hash).trigger('click');
    }
  
});
