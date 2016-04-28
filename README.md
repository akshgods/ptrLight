# ptrLight

A pull to refresh jQuery plugin for iOS (mobile Safari, WebView) and Android (Chromium/Webkit). Based on xpull from [Slobodan Jovanovic](https://github.com/sjovanovic/xpull).

A live demo is [available here](http://aurasalexander.github.io/demo.html). On desktop: please consider using the development tools of your browser to switch into mobile device mode. This will allow you to emulate touch events. Your default mouse cursor won't be able to trigger anything.

![QR code with demo page url](http://aurasalexander.github.io/github_io_ptrLight.png)

## Install

Include jQuery, ptrLight.js and ptrLight.css

```html
  <link rel="stylesheet" href="ptrLight.css">
  <script src="https://code.jquery.com/jquery-2.2.3.min.js" type="text/javascript"></script>
  <script src="ptrLight.js"></script>
```

## Use

- craft your options
- call ptrLight on your desired node

```javascript
  /* all options are optional, but you will want to at least add your refresh() handler */
  var options = {
    paused: false, //disable ptrLight temporarly
    pullThreshold: 200, //amount of pixels the scroll element needs to get pulled down by in order to execute the pull to refresh 'refresh()' function on drag stop
    maxPullThreshold: 500, //maximum (negative) amount of pixels the scroll element will be allowed to scroll down by
    spinnerTimeout: 10000, //reset the pull to refresh indicator after this amount of time
    scrollingDom: null, //if not otherwise specified here, the parent node of your selected element is assumed as the scroll element of your page
    refresh: function(ptrLightInstance) { //is triggered after the pullThreshold is exceeded
      console.log('Updating...');
      //do some reloading stuff instead of a timeout
      setTimeout(function(){
        console.log('Updated!');
        ptrLightInstance.done(); //let ptrLight know that you have finished reloading your data
      }, 2000);
    }
  }

  $('selector').ptrLight(options);
```

- get the instance of ptrLight

```javascript
  var ptrLight = $('selector').data("plugin_ptrLight");
```

## Style

- change the spinner
- hint: you can edit the reload.svg itself to change its appearance (e.g. the color)

```css
  #ptr-light-spinner {
      /*icon by loading.io, overwrite background attribute with your own loading indicator if you want*/
      background: url('reload.svg');
  }
```

- style sizes and paddings

```css
  #ptr-light-indicator {
    /* will (by default) indirectly change the spinner size */
    height: 35px;
    width: 35px;
    /* define a padding above and under the spinner */
    padding: 15px 0;
  }
```

## Methods

- end the spinning and reset ptrLight to its initial state

```javascript
  $('selector').data('plugin_ptrLight').done();
```

- enable or disable pull to refresh handling

```javascript
  $('selector').data('plugin_ptrLight').options.paused = true;
```

## Angular

- ptrLight is usable with angular:

```html
  <div ptr-light="reload()"></div>
```

```javascript
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
