


var wScreen = $(window).width();
var isRunMenu = false;
var ans1;
var ans2;
var ans3;

var AQUA = {
  init: function () {
    // TSUBAKI.global.popup ();
    PRELOADER.hide();
    $('html,body').scrollTop(0);
    AQUA.global.animationScroll();

    AQUA.global.heightSection();
    AQUA.global.tabController();
    AQUA.global.tabControllerSub();

    AQUA.global.quiz();
    AQUA.global.popup();
    AQUA.global.scrollPage();
    AQUA.global.menuMobile();
    AQUA.global.tabControllerMb();
    AQUA.global.deeplinkPage();
    setTimeout(function () {
      AQUA.global.sliderAward();
    }, 1000);
    if ($(window).innerWidth() < 1025) {
      hasTouch();
    } else {

    }

    //AQUA.global.showPopup('#sharePu');
    AQUA.global.gameTuLanh();
    $(window).resize(function () {
      AQUA.global.heightSection();
    })
    $(".nano").nanoScroller();

    $(window).scroll(function (event) {
      if ($(window).innerWidth() < 1025) {
        hasTouch();
      } else {
        AQUA.global.scrollHd();
      }


    });
    lazyloadCustom.checkImageLoaded(function () {
      lazyloadCustom.reCheck();

      $('.gameWrap').fadeIn();
    });
  }

};

AQUA.global = {

  // accorMenu: function () {

  // },
  deeplinkPage: function () {
    var idSec = location.hash;
    if (idSec.length) {
      $('html, body').stop().animate({
        scrollTop: $(idSec).offset().top - $('.heightscroll').innerHeight() + 10
      }, 600);
    }
  },
  menuMobile: function () {
    $('.hamburger-menu').on('click', function () {
      if ($('.menuWrap').hasClass('active')) {
        $('.bar').removeClass('animate');
        $('.menuWrap').removeClass('active').stop(true, true).fadeOut(function () {
          //$('html,body').css({ 'overflow': 'auto' });
        });
        $('.topHd').fadeOut();
      } else {
        $('.bar').addClass('animate');
        $('.menuWrap').addClass('active').stop(true, true).fadeIn(function () {
          TweenMax.staggerTo($('.menu li'), 1.5, { y: 0, autoAlpha: 1, ease: Power4.easeOut }, 0.2);
          //$('html,body').css({ 'overflow': 'hidden' });
        });

      }
    });
  },
  scrollPage: function () {
    $(document).on("scroll", onScroll);
    $('.js-scrollPage').on('click', function () {
      if (!$(this).hasClass('active')) {
        $('.js-scrollPage').removeClass('active');
        $(this).addClass('active');
        var theClass = $(this).attr("href");
        if ($(window).innerWidth() < 1025) {
          $('.bar').removeClass('animate');
          $('.menuWrap').removeClass('active').stop(true, true).fadeOut(function () {
            //$('html,body').css({ 'overflow': 'auto' });
          });
          $('.topHd').fadeOut();
        }
        $('html, body').stop().animate({
          scrollTop: $($(this).attr('href')).offset().top - $('.heightscroll').innerHeight() + 10
        }, 600);
      }
      return false;
    });

    function onScroll(event) {
      var scrollPos = $(document).scrollTop();
      $('.js-scrollPage').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top - $('.heightscroll').innerHeight() <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
          $('.js-scrollPage').removeClass("active");
          currLink.addClass("active");
        }
        else {
          currLink.removeClass("active");
        }
      });
    }
  },
  gameTuLanh: function () {
    var isDrop = false;
    var ansWrong = 0;
    var ansRight = 0;
    var indexTurn = 0;
    var indexAns = 1;
    $(".ctPdGame .item img").draggable({
      revert: "invalid",
      revertDuration: 200,
      cursor: "move",
      //helper: "clone",
      // cursorAt: { 
      //   left: Math.floor(this.clientWidth / 2),
      //   top: Math.floor(this.clientHeight / 2) },
      start: function (event, ui) {
        isDrop = false;
        // $( ".magicRoom" ).droppable( "enable" );
      },
      drag: function (event, ui) {



      },
      stop: function (event, ui) {
        if (isDrop) {

          if (indexAns < 6) {
            $(this).hide();
            var tempPd = $(this).attr('data-temp');
            var tempMl = $('.ctTl span.active').attr('data-temp-ml');
            if (tempPd == tempMl) {
              $('.rightAns,.wrongAns').fadeOut(function () {
                $('.rightAns').fadeIn();
              });

              indexAns++;
              console.log(indexAns);
              $('.gameWrap .copy .right .ctTl h4 span').removeClass('active').hide();
              $("#temp" + indexAns).fadeIn().addClass('active');

              // $( ".ctPdGame .item img" ).draggable( "option", "refreshPositions", true );
              $(".ctPdGame .item img").css({
                "position": 'relative',
                'width': "100%",
                "right": "auto",
                "height": "auto",
                "bottom": "auto",
                "left": "auto",
                'top': "auto"
              });
              setTimeout(function () {
                $(".ctPdGame .item img").fadeIn();
              }, 300);

              if (indexAns == 6) {
                AQUA.global.hidePopup();
                endGame();

              }
            } else {
              $('.rightAns,.wrongAns').fadeOut(function () {
                $('.wrongAns').fadeIn();
              });

            }
          }
          // $(this).fadeOut();

        }

      }
    });

    $(".magicRoom").droppable({
      activeClass: "ui-hover",
      hoverClass: "ui-active",
      drop: function (event, ui) {
        isDrop = true;
        $(this).addClass("active");
        //setTimeout(function(){ 
        //$(".ctPdGame .item img").draggable( "option", "revert", true ); 
        //}, 500);

        // $(this)
        //   .addClass("ui-highlight")
        //   .find("p")
        //     .html("Got it !");
      }
    });

    // var changesTemp = setInterval(myTimer, 3000);
    // var index = 1;
    // function myTimer() {
    //   if(index < 5) {
    //     index++;
    //     $('.gameWrap .copy .right .ctTl h4 span').removeClass('active').hide();
    //     $("#temp"+index).fadeIn().addClass('active');

    //     if(index == 5) {
    //       AQUA.global.hidePopup();
    //     }
    //   }


    // }

    // function myStopFunction() {
    //   clearInterval(changesTemp);
    // }

  },
  popup: function () {
    $('.js-openPopup').on('click', function () {
      var data = $(this).attr('href');
      AQUA.global.showPopup(data);
      $(this).addClass('active');
      return false;
    });

    $('.js_ClosePopup').on('click', function () {
      AQUA.global.hidePopup();
      $('.js-openPopup').removeClass('active');
    });
  },
  showPopup: function (selector) {
    var self = this;
    if (selector === '#successOnline') {
    }
    this.$popup = $(selector);
    TweenMax.set(self.$popup.find('.content'), { top: 70 + '%', autoAlpha: 0 });
    TweenMax.to(self.$popup, 1, {
      css: { zIndex: 1000, visibility: 'visible', display: 'block' },
    });
    TweenMax.to($(self.$popup).find('.ovl'), 1, {
      autoAlpha: 1,
      ease: Power2.easeOut,
    });

    TweenMax.to($(self.$popup), 0.5, {
      css: { visibility: 'visible' },
      onComplete: function () {
        TweenMax.to(self.$popup.find('.content'), 0.5, {
          top: 50 + '%',
          autoAlpha: 1,
          ease: Power2.easeOut,
        });
        $('html,body').css({ overflow: 'hidden' });
      },
    });
  },
  hidePopup: function (selector) {
    TweenMax.to('.ovl', 1, { autoAlpha: 0, ease: Power2.easeOut });
    TweenMax.to('.popupPage .content', 0.5, {
      top: 70 + '%',
      autoAlpha: 0,
      ease: Power2.easeOut,
      onComplete: function () {
        $('.popupPage').css({ visibility: 'hidden', 'z-index': -1, display: 'none' });
        $('html,body').css({ overflow: 'auto' });
      },
    });
  },
  quiz: function () {
    var indexQ = 0;

    $('body').on('click', '.ctStep a', function () {
      var dataAns = $(this).attr('data-id');
      var indexQues = $(this).attr('data-ques');
      $('.ctStep').hide();
      TweenMax.set($('.ctStep ul li'), { y: 50, autoAlpha: 0 });
      TweenMax.set($('.ctStep h3'), { y: 50, autoAlpha: 0 });
      if (indexQ == "0") {
        ans1 = dataAns;
        $('.stepQuiz span').removeClass('active');
        $('.stepQuiz span').eq(1).addClass('active');
        $('#step2').fadeIn(100, function () {
          var tl = new TimelineMax();
          tl
            .to($(this).find('h3'), 1, { y: 0, autoAlpha: 1, ease: Power4.easeOut })
            .staggerTo($(this).find('li'), 1, { y: 0, autoAlpha: 1, ease: Power4.easeOut }, 0.2, '-=1')
        });
      }
      if (indexQ == "1") {
        ans2 = dataAns;
        $('.stepQuiz span').removeClass('active');
        $('.stepQuiz span').eq(2).addClass('active');
        $('#step3').fadeIn(100, function () {
          var tl = new TimelineMax();
          tl
            .to($(this).find('h3'), 1, { y: 0, autoAlpha: 1, ease: Power4.easeOut })
            .staggerTo($(this).find('li'), 1, { y: 0, autoAlpha: 1, ease: Power4.easeOut }, 0.2, '-=1')
        });
      }
      if (indexQ == "2") {
        ans3 = dataAns;
        AQUA.global.hidePopup();
        AQUA.global.showPopup('#gameTulanh');
        gameResult(ans1, ans2, ans3);
        // console.log(ans1, ans2 , ans3);
        // resultGame(ans1, ans2 , ans3 , gameTulanh)
      }
      indexQ++;


      return false;
    });
  },
  sliderAward: function () {
    $('.sliderAward').on('init', function (event, slick) {
      $('.termAwardWrap ').animate({
        'opacity': 1
      });
    });
    var slider = $('.sliderAward').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      fade: true,
      arrows: false,
      autoplay: false,
      speed: 500,
      lazyLoad: 'ondemand',
      autoplaySpeed: 5000,
      adaptiveHeight: true,
      responsive: [

        {
          breakpoint: 813,
          settings: {
            arrows: true,
            dots: true,
            fade: false,
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });

    slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {

    });
    slider.on('afterChange', function (event, slick, currentSlide, nextSlide) {

    });

    $('body').on('click', '.tabSub a', function () {
      if (!$(this).hasClass('active')) {
        var data = $(this).attr('data-tab');
        $('.tabSub a').removeClass('active');
        $(this).addClass('active');
        $('.sliderAward .slick-dots li').eq(data).click()
      }


      return false;
    });

  },
  scrollHd: function () {
    var scrollPos = $(window).scrollTop();
    if (scrollPos > 1) {
      $('header').addClass('fixHd');
    } else {
      $('header').removeClass('fixHd');
    }

  },
  tabControllerSub: function () {
    $('body').on('click', '.js-openTabSub', function () {
      if (!$(this).hasClass('active')) {
        var data = $(this).attr('data-tab');
        $('.tabContentSub').hide();
        $('.js-openTabSub').removeClass('active');
        $(this).addClass('active');
        $(data).fadeIn(1200);
      }


      return false;
    });
  },
  tabController: function () {
    $('body').on('click', '.js-openTabMain', function () {
      if (!$(this).hasClass('active')) {
        var data = $(this).attr('data-tab');
        $(this).parent().next().find('.tabContentMain').hide();
        $('.js-openTabMain').removeClass('active');
        $(this).addClass('active');
        $(data).fadeIn(1200, function () {
          $(".nano").nanoScroller();
        });
      }


      return false;
    });
  },
  tabControllerMb: function () {
    $('body').on('click', '.js-tabMb', function () {
      var data = $(this).attr('data');
      $(this).parents('.tabContentMain').hide();
      $(data).fadeIn(1200, function () {
        $(".nano").nanoScroller();
      });
      return false;
    });
  },
  heightSection: function () {
    //if($(window).innerHeight() < 1025){
    $('.fullScreen').height($(window).innerHeight() - $('header').innerHeight());
    //}

    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    //let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    //document.documentElement.style.setProperty('--vh', `${vh}px`);

  },

  animationScroll: function () {
    var tl = new TimelineLite();
    var itemAwPageU = $('.stagger-up:visible');
    var goU = $('.go-up:visible');
    var itemAwPageL = $('.stagger-left:visible');
    var itemAwPageR = $('.stagger-right:visible');
    var itemAwPageD = $('.stagger-down:visible');
    tl.set(itemAwPageU, { visibility: 'visible' });
    tl.set(itemAwPageL, { visibility: 'visible' });
    tl.set(itemAwPageR, { visibility: 'visible' });
    tl.set(itemAwPageD, { visibility: 'visible' });
    tl.set(goU, { visibility: 'visible' });
    tl.staggerFrom(itemAwPageD, 2, { y: -50, autoAlpha: 0, ease: Power4.easeOut }, 0.2)
    tl.staggerFrom(itemAwPageU, 2, { y: 050, autoAlpha: 0, ease: Power4.easeOut }, 0.2, '-=2')
    tl.staggerFrom(itemAwPageL, 2, { x: -50, autoAlpha: 0, ease: Power4.easeOut }, 0.2, '-=2')
    tl.staggerFrom(itemAwPageR, 2, { x: 50, autoAlpha: 0, ease: Power4.easeOut }, 0.2, '-=2')
    tl.staggerFrom(goU, 2, { y: 50, autoAlpha: 0, ease: Power4.easeOut }, 0.2, '-=2')

    var controller = new ScrollMagic.Controller();

    $('.animate').each(function (index, el) {
      var currentItem = this;
      TweenMax.set($('.animate'), { y: 50, autoAlpha: 0 });
      var scene = new ScrollMagic.Scene({ triggerElement: currentItem, triggerHook: .95 })
        .on("enter", function (e) {
          TweenMax.to(currentItem, 2, { y: 0, autoAlpha: 1, ease: Power4.easeOut })
        })
        .addTo(controller);
    });



    $('.paralax').each(function (index, el) {
      var _this = $(this);
      var dataPos = _this.attr('data');
      var sectionTrigger = _this.attr('section');
      TweenMax.set(_this, { y: dataPos, autoAlpha: 0.4 });
      var bigTitle = new TimelineMax();
      bigTitle
        .to(_this, 1, { y: 0, autoAlpha: 1 })
      var pinIntroScene = new ScrollMagic.Scene({
        triggerElement: sectionTrigger,
        triggerHook: 1,
        duration: '60%',
        reverse: false
      })
        .setTween(bigTitle)
        .addTo(controller);
    });

    $('.paralax-hor').each(function (index, el) {
      var _this1 = this;
      var _this2 = $(this);
      var dataPos = _this2.attr('data');
      //var sectionTrigger = _this.attr('section');
      TweenMax.set(_this2, { x: dataPos, autoAlpha: 1 });
      var bigTitle = new TimelineMax();
      bigTitle
        .to(_this2, 2, { x: 0, autoAlpha: 1, ease: Power4.easeOut }, 0.2)
      var pinIntroScene = new ScrollMagic.Scene({
        triggerElement: _this1,
        triggerHook: 1,
        duration: '100%',
        reverse: false
      })
        .setTween(bigTitle)
        .addTo(controller);
    });
  },


}
AQUA.init();

function hasTouch() {
  return 'ontouchstart' in document.documentElement
    || navigator.maxTouchPoints > 0
    || navigator.msMaxTouchPoints > 0;
}

if (hasTouch()) { // remove all :hover stylesheets
  try { // prevent exception on browsers not supporting DOM styleSheets properly
    for (var si in document.styleSheets) {
      var styleSheet = document.styleSheets[si];
      if (!styleSheet.rules) continue;

      for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
        if (!styleSheet.rules[ri].selectorText) continue;

        if (styleSheet.rules[ri].selectorText.match(':hover')) {
          styleSheet.deleteRule(ri);
        }
      }
    }
  } catch (ex) { }
}
