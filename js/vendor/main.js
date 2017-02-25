$(document).ready(function() {
  $("[data-toggle='tooltip']").tooltip();
  $("[data-toggle='popover']").popover();
  $(document.body).fitVids();
  var config = {
    easing: 'hustle',
    mobile:  true,
    delay:  'onload'
  }
  window.sr = new scrollReveal( config );

  // // Scroll Feature
  // $('.btn-scroll').on('click', function(event) {
  //     event.preventDefault();
  //     var el = $(this);
  //     var target = $(el.attr('href'));
  //     $('html, body').animate({
  //       scrollTop: (target.offset().top - 130) + 'px'
  //     }, 500 );
  // });

  // $(".dropdown-menu > li > a.trigger").on("click", function(e) {
  //     var current = $(this).next();
  //     current.toggle();
  //     e.stopPropagation();
  // });
  // //side-navbar
  // jQuery("li.list-toggle").bind("click", function() {
  //     jQuery(this).toggleClass("active");
  // });

  // //activate skrollr.js
  // skrollr.init({
  //     forceHeight: false,
  //     smoothScrolling: true,
  //     smoothScrollingDuration: 1500,
  //         mobileCheck: function() {
  //         //hack - forces mobile version to be off
  //         return false;
  //     }
  // });

// //carousel subnav slider
//     var clickEvent = false;
//     $('#carouselSubnav').on('click', '.nav a', function() {
//         clickEvent = true;
//         $('#carouselSubnav .nav li').removeClass('active');
//         $(this).parent().addClass('active');
//     }).on('slid.bs.carousel', function(e) {
//         if (!clickEvent) {
//             var count = $('#carouselSubnav .nav').children().length - 1;
//             var current = $('#carouselSubnav .nav li.active');
//             current.removeClass('active').next().addClass('active');
//             var id = parseInt(current.data('slide-to'));
//             if (count == id) {
//                 $('#carouselSubnav .nav li').first().addClass('active');
//             }
//         }
//         clickEvent = false;
//     });
  // //owl carousel thumbnail caption slider
  // $('#owl-carousel-thumb').owlCarousel({
  //     loop: true,
  //     margin: 30,
  //     nav: true,
  //     navContainer: '#customNav',
  //     navText: ["<span><</span>", "<span>></span>"],
  //     responsive: {
  //         0: {
  //             items: 1
  //         },
  //         600: {
  //             items: 2
  //         },
  //         1000: {
  //             items: 4
  //         }
  //     }
  // });

  // $('#carouselHome, #carouselSubnav').on('slide.bs.carousel', function(e) {
  //     var current = $('.item').eq(parseInt($(e.relatedTarget).index()));
  //     $('[data-animation]').removeClass();
  //     $('[data-animation]', current).each(function() {
  //         var $this = $(this);
  //         var anim_ = $this.data('animation');
  //         animateElement($this, anim_);
  //     });
  // });

  // //carousel animation fix
  // function animateElement(obj, anim_) {
  //     obj.addClass(anim_ + ' animated').one(
  //         'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
  //         function() {
  //             $(this).removeClass();
  //         });
  // }

  // // PRODUCT TOUR

  // jQuery(document).ready(function($){
  //   //check if a .cd-tour-wrapper exists in the DOM - if yes, initialize it
  //   $('.cd-tour-wrapper').exists() && initTour();

  //   function initTour() {
  //     var tourWrapper = $('.cd-tour-wrapper'),
  //       tourSteps = tourWrapper.children('li'),
  //       stepsNumber = tourSteps.length,
  //       coverLayer = $('.cd-cover-layer'),
  //       tourStepInfo = $('.cd-more-info'),
  //       tourTrigger = $('#cd-tour-trigger');

  //     //create the navigation for each step of the tour
  //     createNavigation(tourSteps, stepsNumber);

  //     tourTrigger.on('click', function(){
  //       //start tour
  //       if(!tourWrapper.hasClass('active')) {
  //         //in that case, the tour has not been started yet
  //         tourWrapper.addClass('active');
  //         showStep(tourSteps.eq(0), coverLayer);
  //       }
  //     });

  //     //change visible step
  //     tourStepInfo.on('click', '.cd-prev', function(event){
  //       //go to prev step - if available
  //       ( !$(event.target).hasClass('inactive') ) && changeStep(tourSteps, coverLayer, 'prev');
  //     });
  //     tourStepInfo.on('click', '.cd-next', function(event){
  //       //go to next step - if available
  //       ( !$(event.target).hasClass('inactive') ) && changeStep(tourSteps, coverLayer, 'next');
  //     });

  //     //close tour
  //     tourStepInfo.on('click', '.cd-close', function(event){
  //       closeTour(tourSteps, tourWrapper, coverLayer);
  //     });

  //     //detect swipe event on mobile - change visible step
  //     tourStepInfo.on('swiperight', function(event){
  //       //go to prev step - if available
  //       if( !$(this).find('.cd-prev').hasClass('inactive') && viewportSize() == 'mobile' ) changeStep(tourSteps, coverLayer, 'prev');
  //     });
  //     tourStepInfo.on('swipeleft', function(event){
  //       //go to next step - if available
  //       if( !$(this).find('.cd-next').hasClass('inactive') && viewportSize() == 'mobile' ) changeStep(tourSteps, coverLayer, 'next');
  //     });

  //     //keyboard navigation
  //     $(document).keyup(function(event){
  //       if( event.which=='37' && !tourSteps.filter('.is-selected').find('.cd-prev').hasClass('inactive') ) {
  //         changeStep(tourSteps, coverLayer, 'prev');
  //       } else if( event.which=='39' && !tourSteps.filter('.is-selected').find('.cd-next').hasClass('inactive') ) {
  //         changeStep(tourSteps, coverLayer, 'next');
  //       } else if( event.which=='27' ) {
  //         closeTour(tourSteps, tourWrapper, coverLayer);
  //       }
  //     });
  //   }

  //   function createNavigation(steps, n) {
  //     var tourNavigationHtml = '<div class="cd-nav"><span><b class="cd-actual-step">1</b> of '+n+'</span><ul class="cd-tour-nav"><li><a href="#0" class="cd-prev">&#171; Previous</a></li><li><a href="#0" class="cd-next">Next &#187;</a></li></ul></div><a href="#0" class="cd-close">Close</a>';

  //     steps.each(function(index){
  //       var step = $(this),
  //         stepNumber = index + 1,
  //         nextClass = ( stepNumber < n ) ? '' : 'inactive',
  //         prevClass = ( stepNumber == 1 ) ? 'inactive' : '';
  //       var nav = $(tourNavigationHtml).find('.cd-next').addClass(nextClass).end().find('.cd-prev').addClass(prevClass).end().find('.cd-actual-step').html(stepNumber).end().appendTo(step.children('.cd-more-info'));
  //     });
  //   }

  //   function showStep(step, layer) {
  //     step.addClass('is-selected').removeClass('move-left');
  //     smoothScroll(step.children('.cd-more-info'));
  //     showLayer(layer);
  //   }

  //   function smoothScroll(element) {
  //     (element.offset().top < $(window).scrollTop()) && $('body,html').animate({'scrollTop': element.offset().top}, 100);
  //     (element.offset().top + element.height() > $(window).scrollTop() + $(window).height() ) && $('body,html').animate({'scrollTop': element.offset().top + element.height() - $(window).height()}, 100);
  //   }

  //   function showLayer(layer) {
  //     layer.addClass('is-visible').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
  //       layer.removeClass('is-visible');
  //     });
  //   }

  //   function changeStep(steps, layer, bool) {
  //     var visibleStep = steps.filter('.is-selected'),
  //       delay = (viewportSize() == 'desktop') ? 300: 0;
  //     visibleStep.removeClass('is-selected');

  //     (bool == 'next') && visibleStep.addClass('move-left');

  //     setTimeout(function(){
  //       ( bool == 'next' )
  //         ? showStep(visibleStep.next(), layer)
  //         : showStep(visibleStep.prev(), layer);
  //     }, delay);
  //   }

  //   function closeTour(steps, wrapper, layer) {
  //     steps.removeClass('is-selected move-left');
  //     wrapper.removeClass('active');
  //     layer.removeClass('is-visible');
  //   }

  //   function viewportSize() {
  //     /* retrieve the content value of .cd-main::before to check the actua mq */
  //     return window.getComputedStyle(document.querySelector('.cd-tour-wrapper'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
  //   }
  // });

  //check if an element exists in the DOM
  // jQuery.fn.exists = function(){ return this.length > 0; }
});

