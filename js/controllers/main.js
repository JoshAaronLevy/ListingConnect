var MainController = module.exports = ["$scope", "$timeout", "agentService", "consumerService", "Cache", function($scope, $timeout, agentService, consumerService, Cache) {
  $scope.toolbarUI = [
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'justifyLeft','justifyCenter','justifyRight','indent','outdent'],
    ['bold', 'italics', 'underline', 'ul', 'ol', 'undo', 'redo', 'html', 'insertLink', 'clear']
  ];
  var currentUser = Cache.cache.bind(null, 'user');
  var currentAgent = Cache.cache.bind(null, 'agent');
  var currentConsumer = Cache.cache.bind(null, 'consumer');

  // $('.nav-tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
  //       window.location.hash = e.target.hash.substr(1) ;
  //       return false;
  // });

  // $scope.showTour = function() {
  //   introJs().start();
  // };

  var animationDelay = 2000;

  animateHeadline($('.cd-headline'));

  function animateHeadline($headlines) {
    $headlines.each(function(){
      var headline = $(this);
      //trigger animation
      setTimeout(function(){ hideWord( headline.find('.is-visible') ) }, animationDelay);
      //other checks here ...
    });
  }

  function hideWord($word) {
    var nextWord = takeNext($word);
    switchWord($word, nextWord);
    setTimeout(function(){ hideWord(nextWord) }, animationDelay);
  }

  // function takeNext($word) {
  //   return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
  // }

  function takeNext($word) {
    return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().last($newWord);
  }

  function switchWord($oldWord, $newWord) {
    $oldWord.removeClass('is-visible').addClass('is-hidden');
    $newWord.removeClass('is-hidden').addClass('is-visible');
  }

  singleLetters($('.cd-headline.letters').find('b'));

  function singleLetters($words) {
    $words.each(function(){
      var word = $(this),
        letters = word.text().split(''),
        selected = word.hasClass('is-visible');
      for (i in letters) {
        letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
      }
        var newLetters = letters.join('');
        word.html(newLetters);
    });
  }

  $timeout(function(){
    var navAlt = $('.nav-alt').children();
    // if (self.location.href.indexOf('/agent/dashboard.html') > -1){
    //   $(navAlt[0]).addClass('active');
    // }
    if (self.location.href.indexOf('/agent/leads.html') > -1){
      $(navAlt[0]).addClass('active');
    }
    if (self.location.href.indexOf('/agent/favorites.html') > -1){
      $(navAlt[1]).addClass('active');
    }
    if (self.location.href.indexOf('/agent/messages.html') > -1){
      $(navAlt[2]).addClass('active');
    }
    if (self.location.href.indexOf('/agent/profile.html') > -1){
      $(navAlt[3]).addClass('active');
    }
  },250);

  $timeout(function(){
    var navAlt = $('.nav-alt').children();
    if (self.location.href.indexOf('/consumer/agents.html') > -1){
      $(navAlt[0]).addClass('active');
    }
    if (self.location.href.indexOf('/consumer/favorites.html') > -1){
      $(navAlt[1]).addClass('active');
    }
    if (self.location.href.indexOf('/consumer/messages.html') > -1){
      $(navAlt[2]).addClass('active');
    }
    if (self.location.href.indexOf('/consumer/profile.html') > -1){
      $(navAlt[3]).addClass('active');
    }
  },250);

  (function init() {
    console.log('Current hash: ', '.nav-tabs a[href="' + location.hash + '"]\n',
      'locationHash: ', location.hash);

    if (location.hash !== '') {
        $('.nav-tabs a[href="' + location.hash + '"]').tab('show');
    } else {
        $('.nav-tabs a:first').tab('show');
    }
    try {
      currentUser();
      currentAgent();
      currentConsumer();
      console.log('Initialized $scope.$root Data:', $scope.$root);
    } catch (err) {
      console.error("ERR", err);
    }
  })();

}];