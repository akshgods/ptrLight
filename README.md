# ptrLight

A pull to refresh jQuery plugin for iOS (mobile Safari, Webview) and Android (Chromium).
Based on xpull from [Slobodan Jovanovic](https://github.com/sjovanovic/xpull).

## Install

Include jquery, ptrLight.js and ptrLight.css

```
<link rel="stylesheet" href="ptrLight.css">
<script src="https://code.jquery.com/jquery-2.2.3.min.js" type="text/javascript"></script>
<script src="ptrLight.js"></script>
```

## Usage:

```
  /* all options are optional, but you will want to at least add your refresh() handler */
  var options = {
    paused: false, //disable ptrLight temporarly
    pullThreshold: 200, //amount of pixels the scroll element needs to get pulled down by in order to execute the pull to refresh 'refresh()' function
    maxPullThreshold: 500, //maximum (negative) amount of pixels the scroll element will be allowed to scroll down by
    spinnerTimeout: 10000, //reset the pull to refresh indicator after this amount of time
    scrollingDom: null, //if null, specified element, else node of scrollable parent element
    refresh: function(ptrLightRef) { //is triggered after the pullThreshold is exceeded
      console.log('ptrLight triggered');
      //do some reloading stuff instead of a timeout
      setTimeout(function(){
        ptrLightRef.done(); //let ptrLight know that you are finished reloading your data
      }, 3000);
    }
  }

 $('selector').ptrLight(options);
```

To get the instance of ptrLight:

```
 var ptrLight = $('selector').data("plugin_ptrLight");
```

## Methods:

- `reset()` - cancels - the spinning and resets the plugin to initial state. Example: `$('#container').data('plugin_ptrLight').reset();`

## Pausing:

- You can simply pause the handling of pull event, by simply setting the value of _paused_ property, e.g.: `$('#container').data('plugin_ptrLight').options.paused = true;

## Angular

ptrLight is usable with angular:

```
<!-- html -->
<div ptr-light="reload()"></div>

/* js */
angular.module("ptrLight").directive("ptrLight", function() {
  return function(scope, elm, attr) {
    return $(elm[0]).ptrLight({
      'refresh': function() {
        return scope.$apply(attr.ptrLight);
      }
    });
  };
});
```
