{
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


            // $('#noty').text(`new Noty({
            //     theme : 'relax',
            //     layout : 'topRight',
            //     text : '${message}',
            //     type : '${type}',
            //     timeout : 1500
            // }).show(); `);
    }


    // method to submit the form data for new post using ajax
    let createPost=function(){
        let newPostForm=$('#new-post-form');

        newPostForm.submit(function(event){
            event.preventDefault();

            $.ajax({
                method : 'post',
                url : '/posts/create',
                data : newPostForm.serialize(),
                success : function(data){
                    console.log('here', data);
                    let newPost=newPostDOM(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));     // to add the delete functionality to the newly formed post

                    likesUsingAjax.addLikeFunctionality($(' .toggle-like-button', newPost));

                    displayNoty('success', data.message);
                    commentUsingAjax.addCreateComment();
                },
                error : function(error){
                    console.log(error.responseText);
                    displayNoty('error', error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
    let newPostDOM=function(post){
        return $(`<li id="post-${post._id}">
                        <p>
                            <small>
                                <a class="delete-post-button" href="/posts/destroy/${post._id}" style="color: red;">X</a>
                            </small>    
                            ${post.content}
                            <br>
                            <small>
                                ${post.user.name}
                            </small>
                            <span>
                                <a class="toggle-like-button" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post">
                                    ${post.likes.length} likes
                                </a>
                            </span>
                        </p>
                        <div class="post-comments">
                            <form action="/comments/create" method="post" class="new-comment-form">
                                <input type="text" name="content" placeholder="Type Here to add comment...">
                                <input type="hidden" name="post" value="${post._id}">
                                <input type="submit" value="Add Comment">
                            </form>
                    
                            <div class="post-comments-list">
                                <ul id="post-comments-${post._id}">
                                    
                                </ul>
                            </div>
                        </div>    
                    </li>`);
    }


    // method to delete a post from DOM
    let deletePost=function(deleteLink){
        deleteLink.click(function(event){
            event.preventDefault();

            $.ajax({
                method : 'get',
                url : deleteLink.attr('href'),
                success : function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    displayNoty('success', data.message);
                },
                error : function(error){
                    console.log(error.responseText);
                    displayNoty('error', error.responseText);
                }
            });
        });
    }

    // adding deletePost method to every delete post button already present
    $('.delete-post-button').each(function(){
        deletePost($(this));
    });

    createPost();
}