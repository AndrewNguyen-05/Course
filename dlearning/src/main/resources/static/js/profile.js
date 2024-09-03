$(document).ready(function(){

    $('#url-update-avatar').change(function(){
        previewFile(this);
    })

    function previewFile(selectFile){
        let file = selectFile.files[0];
        let reader = new FileReader();

        reader.onload = function(){
            $("#avatar-preview").attr('src', reader.result);
        }

        if(file){
            reader.readAsDataURL(file);
        }
    }

})