jQuery(document).ready(function($){
  var fileUploadControl = $("#profilePhotoFileUpload");
  fileUploadControl.on("change drop", function(e) {
    if (fileUploadControl[0].files.length > 0) {
      var file = fileUploadControl[0].files[0];
      var name = "photo.jpg";

      var parseFile = new Parse.File(name, file);
      console.log("Initializing Save", parseFile);
      parseFile.save().then(function() {
        console.log("Success", arguments, parseFile);
        // The file has been saved to Parse.
      }, function(error) {
        console.log("Upload Failed", arguments, parseFile);
        // The file either could not be read, or could not be saved to Parse.
      });
    }
  });
});
