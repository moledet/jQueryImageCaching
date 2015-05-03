# jQueryImageCaching
jQuery plugin of image caching in localStorage

**NOTICE:** The most of browsers memory limit of localStorage is 5MB.

**NOTICE:** Correct way of image caching is using response of http server cache headers.

### Version
1.0.0

## Requirements ##
* jQuery [https://jquery.com/]

## How to use ##
Simple way
```javascript
<img data-src="path/to/image.(png,jpeg..)">

<script>
    $('img').imageCaching();
</script>
```

May use renderCallback and attach on several images.
```javascript
<div class="user-img not-exist" data-src="path/to/image" data-caching-key="userImage"></div>

<script>
     $('.user-img').imageCaching({
         crossOrigin:null, //need if using cookie or session for render of image
         renderCallback:function(img,div){
                    $(div).removeClass('not-exist').css('background-image', 'url(' + img + ')');
         }});
</script>
```
By default all images save with key nem his url, if you need custom key name - use attribute 'data-caching-key'.

Fore refresh image better save of cachingObject.
```javascript
<img data-src="path/to/image">

<script>
  var cachingObject = $('img').templateLoader();
  
  $('button').on('click',function(){
        cachingObject.refresh();
  });
</script>
```
If you will be delete image from localStorage.removeItem("path/to/image|or key") - new image will be loaded on refresh page.

### More options
> **debugMode** - default false, flag that give some console.log messages of working plugin for debug.

> **sourceKeyAttribute** - default 'data-src', may change it on initialization

> **cachingKeyAttribute** - default 'data-caching-key', may change it on initialization

> **renderCallback** - default null, the callback after render image(change the selected item src). Arguments the image and html object
where was changed attribute src.

> **crossOrigin** - default 'Anonymous', origin of image in default mode not been send cookie or session id to server. Default
mode may do problems for images that need authorization. This parameter change on problems with server headers. In most cases
the set this params to "null" will be remove problems.