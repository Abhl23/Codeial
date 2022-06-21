{
    // console.log('Script loaded!');


    // method to display notifications using Noty
    function displayNoty(type, message){
        $(`<script>
                new Noty({
                    theme : 'relax',
                    layout : 'topRight',
                    text : '${message}',
                    type : '${type}',
                    timeout : 1500
                }).show();        
            </script>`).appendTo('body');
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
                    console.log(data);
                    let newPost=newPostDOM(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    displayNoty('success', data.message);
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
                        </p>
                        <div class="post-comments">
                            <form action="/comments/create" method="post">
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

    // adding deletePost method to every delete button
    $('.delete-post-button').each(function(){
        deletePost($(this));
    });

    createPost();
}