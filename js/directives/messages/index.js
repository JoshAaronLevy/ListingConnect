module.exports = ['$interval', 'messageService', Messages];

const REFRESH_DELAY = 2500;
var {isVisible, onVisible} = require('../../utils/visible');

function Messages($interval, messageService) {
  return {
    scope: {
      'recipient': '=',
      'sender': '=',
      'senderType': '=',
      'recipientType': '='
    },
    restrict: 'EC',
    template: require('./index.jade'),
    link: function(scope, element, attrs, controller) {
      var messagesSinceDate = moment().add(-90, 'days').toDate();
      
      function resetChatRecipient() {
        messagesSinceDate = moment().add(-90, 'days').toDate();
        scope.msg = '';
        scope.$root.currentMessages = [];
        scope.load();
      }
      
      function scrollToEnd() {
        var chatBox = $('.chat-history');
        var contentsHeight = chatBox.children().height();
        return chatBox.scrollTop(contentsHeight);
      }
      
      scope.$watch('recipient', function _recipient(newVal, oldVal) {
        if ( newVal && newVal !== oldVal ) {
          // Reset for new recipient
          resetChatRecipient();
        }
      });
      
      element.find('input').on('keydown', function _keyDown(e) {
        var txt = e.target.value.trim();
        // Check if ENTER pressed (e.keyCode === [ENTER])
        if ( (txt && txt.length >= 1) && (e.keyCode === 13) ) {
          scope.send(txt);
        }        
      });
      
      // Auto-check inbox
      $interval(() => scope.load(), REFRESH_DELAY);
      
      scope.load = () => {
        var currMsgCount = scope.$root.currentMessages.length;// for auto-scroll adjustment
        // ensure chat element is visible
        if ( !isVisible(element.find('.chat')) ) {
          return false;
        }
        scope.$root.loading = 'Messages';
        
        messageService.get({'date': messagesSinceDate, 'toUser': scope.recipient, 'user': scope.sender})
        .then(() => {
          // messages loaded to rootScope in service!!!
          scope.$root.loading = null;
          var msgs = scope.$root.currentMessages;
          var last = msgs.length >= 1 ? msgs[msgs.length - 1] : null;
          // messagesSinceDate = moment(last ? last.createdAt : new Date()).add(1, 'seconds').toDate();
          messagesSinceDate = moment(new Date()).add(1, 'seconds').toDate();
          if ( currMsgCount !== scope.$root.currentMessages.length ) {
            // new msgs detected, autoscroll
            scrollToEnd();
          }
        })
      }
      scope.send = (message) => {
        scope.$root.loading = 'Sending';
        messageService.send({'message': message, 'toUser': scope.recipient, 'user': scope.sender})
        .then(() => {
          scope.msg = '';
          scope.$root.loading = false;
          scope.$root.$broadcast('status', {message: 'Message sent!', timeout: 5000});
          scope.load();
        })
      }
      
    }
  }
}
