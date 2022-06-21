var commentUsingAjax=(function(){
    // console.log('Script loaded!');


    // method to display notifications using Noty
    function displayNoty(type, message){

        $('#noty').remove();

        $(`<script>
                new Noty({
                    theme : 'relax',
                    layout : 'topRight',
                    text : '${message}',
                    type : '${type}',
                    timeout : 1500
                }).show();        
            </script>`).attr('id', 'noty').appendTo('body');
    }



    // method to submit the form data for new comment using ajax
    let createComment=function(){
        $('.new-comment-form').each(function(){
            $(this).submit(function(event){
                event.preventDefault();
    
                $.ajax({
                    method : 'post',
                    url : '/comments/create',
                    data : $(this).serialize(),
                    success : function(data){
                        console.log(data);
                        newComment=newCommentDOM(data.data.comment);
                        $(`#post-comments-${data.data.comment.post._id}`).prepend(newComment);
                        deleteComment($(' .delete-comment-button', newComment));
                        displayNoty('success', data.message);
                    },
                    error : function(error){
                        console.log(error.responseText);
                        displayNoty('error', error.responseText);
                    }
                });
            });
        });
    }


    // method to create a comment in DOM
    let newCommentDOM=function(comment){
        return $(`<li id="comment-${comment._id}">
                        <p>
                            <a class="delete-comment-button" href="/comments/destroy/${comment._id}" style="color: red;">X</a>
                            ${comment.content}
                            <br>
                            <small>
                                ${comment.user.name}
                            </small>
                        </p>
                    </li>`);
    }


    // method to delete a comment from DOM
    let deleteComment=function(deleteLink){
        deleteLink.click(function(event){
            event.preventDefault();

            $.ajax({
                method : 'get',
                url : deleteLink.attr('href'),
                success : function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    displayNoty('success', data.message);
                },
                error : function(error){
                    console.log(error.responseText);
                    displayNoty('error', error.responseText);
                }
            });
        });
    };


    // adding deleteComment method to every delete comment button already present
    $('.delete-comment-button').each(function(){
        deleteComment($(this));
    });


    createComment();

    return {
        addCreateComment : createComment
    };

})();