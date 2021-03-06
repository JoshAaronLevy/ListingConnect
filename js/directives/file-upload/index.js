var DEFAULT_UPLOAD_URI = 'http://virtualmls.com/REBeacons/upload.aspx';

module.exports = [fileUploadDirective];

function fileUploadDirective() {
    return {
        restrict: 'E',
        scope: {
            name: '@', // e.g. 'Properties-123abcXYZ', 'Agents-666666',
            number: '@' // e.g. 1-99
        },
        template: require('./index.jade'),
        link: function(scope, element, attrs, controller) {
            var $uploadEl = element.find('.fileupload, form.fileupload');
            var uploadUri = attrs['baseUrl'] || DEFAULT_UPLOAD_URI;

            scope.expectedFileName = expectedFileName;

            scope.$watchGroup(['name', 'number'], _onFileNameChanged);

            /*
            `expectedFileName` is a scope-exposed helper to retrieve *current* file name target
            */
            function expectedFileName() {
                uploadUri = attrs['baseUrl'] || DEFAULT_UPLOAD_URI;
                return scope.name + '-' + scope.number + '.jpg';
            }

            function _onFileNameChanged(oldVal, newVal) {
                if (newVal && oldVal && oldVal !== newVal) {
                    if (_validate() !== true) { return console.error('FAILED TO VALIDATE:', _validate()); }
                    return _updateFileName(scope.name, scope.number);
                }
            }

            function _validate() {
                if (!scope.name && scope.name.length <= 3) {
                    return { error: new TypeError('Invalid Name: ' + scope.name + '.\nCheck your syntax:\n<file-upload name="photoOptions.listingId" number="photoOptions.photoNum"></file-upload>') };
                }
                if (!scope.number) {
                    return { error: new TypeError('Invalid Photo Num: ' + scope.number + '.\nCheck your syntax:\n<file-upload name="photoOptions.listingId" number="photoOptions.photoNum"></file-upload>') };
                }
                return true;
            }

            function _updateFileName(name, index) {
                $uploadEl.fileupload('option', 'url', uploadUri +
                    '?name=' + encodeURIComponent(name) + '&index=' + encodeURIComponent(index));
            }

            function _init() {

                $uploadEl.fileupload({
                        multipart: true,
                        paramName: 'file',
                        forceIframeTransport: true,
                        disableImageMetaDataLoad: true,
                        dataType: 'json',
                        maxFileSize: 25000000,
                        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|docx?|doc|xls.?|eps|ps)$/i,
                        url: uploadUri,
                        always: _showResult,
                        formData: {}
                    })
                    .bind('fileuploadprocessdone', _showResult)
                    .bind('fileuploadprocessfail', _showResult.bind($uploadEl, 'Failed to upload'))
                    .bind('fileuploadprocessalways', _showResult.bind($uploadEl, 'Uploaded!'));
            }

            function _showResult(e, data) {
                $('ul.files').append('<li>' + JSON.stringify(data) + '</li>\n' +
                    '<li>' + JSON.stringify(e) + '</li>');
            }
            // Launch this sucker
            init();
        }
    }
}