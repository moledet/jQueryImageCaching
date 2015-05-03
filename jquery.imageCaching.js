/**
 * jQuery ImageCaching plugin
 * Caching selected images in localStorage
 *
 * Created by Yosef(Vlad) Kaminskyi
 * Mailto: moledet[at]ukr.net
 * Version:  1.0  on 03/05/2015.
 * Dependencies:
 *      jQuery https://jquery.com/
 */
;(function($) {
    function jQueryImageCaching(params){
        var ImageCaching = {
            selector: 'img',
            debugMode: false,
            cachingKeyAttribute:'data-caching-key',
            sourceKeyAttribute:'data-src',
            renderCallback:null,
            crossOrigin: 'Anonymous',
            init: function (params) {
                ImageCaching.log('Initialization of ImageCaching');
                for (var param in params) {
                    ImageCaching[param] = params[param];
                }

                $(ImageCaching.selector).each(function(){
                    ImageCaching.applyToImage($(this));
                });
            },
            getCacheKey:function(element){
                if(element.attr(ImageCaching.cachingKeyAttribute)){
                    return  element.attr(ImageCaching.cachingKeyAttribute);
                }else{
                    return element.attr(ImageCaching.sourceKeyAttribute);
                }
            },
            getCache:function(element){
                var key = this.getCacheKey(element);
                return localStorage.getItem(key);
            },
            setCache:function(element,imageData){
                var key = ImageCaching.getCacheKey(element);
                ImageCaching.log('Set cache',key,imageData,element);
                localStorage.setItem(key, imageData); // save image data
                return true;
            },
            removeCache:function(element){
                var key = ImageCaching.getCacheKey(element);
                ImageCaching.log('Remove cache',key);
                localStorage.removeItem(key);
                return true;
            },
            renderImage:function(element,picture){
                ImageCaching.log('Rendering...',picture,element);
                element.attr('src',picture);

                if(this.renderCallback){
                    ImageCaching.log('Render Callback...',element);
                    this.renderCallback(picture,element);
                }
            },
            applyToImage:function(element,force){
                var cache = null;
                if(!force){
                    cache = this.getCache(element);
                }

                if(cache){
                    ImageCaching.log('Image from cache',element);
                    this.renderImage(element,cache);
                }else{
                    var sourceLink = element.attr(ImageCaching.sourceKeyAttribute);
                    var getParamPrefix = "?";
                    if(sourceLink.indexOf('?')>0){
                        getParamPrefix = "&";
                    }
                    sourceLink+=getParamPrefix+'cacheTime='+Date.now();

                    ImageCaching.log('Request to: '+sourceLink,element);

                    var img = new Image();

                    if(ImageCaching.crossOrigin){
                        img.setAttribute('crossOrigin', 'Anonymous');
                    }

                    img.onload  = function() {
                        ImageCaching.log('Loading completed',img);
                        var canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;

                        // Copy the image contents to the canvas
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);

                        document.body.appendChild(canvas);
                        var context = canvas.getContext('2d');
                        context.drawImage(img, 0, 0);

                        var imageData = canvas.toDataURL("image/png");
                        ImageCaching.setCache(element,imageData);
                        ImageCaching.renderImage(element, imageData);
                    }
                    img.src = sourceLink;
                }
            },
            refresh:function(itemsSelector){
                var selector = null;
                if(itemsSelector){
                    selector = itemsSelector;
                }else{
                    selector = ImageCaching.selector;
                }

                $(selector).each(function(){
                    ImageCaching.applyToImage($(this),true);
                });

            },
            log: function () {
                if (this.debugMode) {
                    console.log(arguments);
                }
            }

        };
        ImageCaching.init(params);
        return ImageCaching;
    }

    $.fn.extend({
        imageCaching: function(options) {
            var params = {selector:this};
            params = $.extend(params,options);

            return new jQueryImageCaching(params);
        }
    });
})(jQuery);