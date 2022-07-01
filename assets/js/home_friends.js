{
    var addRemoveFriendFunc=function(removeLink){

        removeLink.click(function(event){

            event.preventDefault();

            let friendId=removeLink.attr('data-friend-id');

            $.ajax({
                method : 'get',
                url : removeLink.attr('href'),
                success : function(data){

                    new Noty({
                        theme : 'relax',
                        layout : 'topRight',
                        text : `${data.message}`,
                        type : 'success',
                        timeout : 1500
                    }).show();

                },
                error : function(error){
                    console.log(error.responseText);
                }
            });

        $(`#${friendId}`).remove();
        // removeLink.remove();

        });

    };

    $('.remove-friend-button').each(function(){
        addRemoveFriendFunc($(this));
    });
}