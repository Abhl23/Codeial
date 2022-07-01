{
    $('#toggle-friend-button').click(function(event){
        event.preventDefault();

        let user_id=$(this).attr('data-user-id');

        $.ajax({
            method : 'get',
            url : $(this).attr('href'),
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


        if($(this).text()=='Add Friend'){
            $(this).attr('href', `/users/friendships/destroy/?id=${user_id}`).text('Remove Friend');
        }
        else{
            $(this).attr('href', `/users/friendships/create/?id=${user_id}`).text('Add Friend');
        }
    });
}