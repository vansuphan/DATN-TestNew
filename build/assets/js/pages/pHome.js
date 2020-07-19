var pHome = {
    init: function(){
        console.log("<pHome> => INIT!");
        //pHome.galleryInit();
        $(window).on('resize', pHome.onResize);
        pHome.onResize();

        // PRELOADER.hide();

        $("#btn-ok").on("click", function(e){
            swal('Haha - OK!');
        });

        $("#btn-upload").on("click", function(e){
            e.preventDefault();
            // Browse photo from library
            DUpload.browse();
            DUpload.onSelect = function(base64){
                console.log(base64);
                var img = new Image();
                img.src = base64;
                img.style.width = "300px";
                img.style.height = "auto";
                $(".imgContainer")[0].appendChild(img);
            };
        });
    },

    onResize: function(e){
        // do your fucking resizing
        console.log("Browser size: " + window.innerWidth + "x" + window.innerHeight);
    },

    galleryInit: function(){
        //console.log("INIT GALLERY");
        
    }
}

