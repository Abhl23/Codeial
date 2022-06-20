{
    // console.log('Script loaded!');


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
                },
                error : function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
    let newPostDOM=function(post){
        return $(`<li id="post-${post._id}">
                        <p>
                            <small>
                                <a class="delete-post-button" href="/posts/destroy/${post.id}" style="color: red;">X</a>
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

    createPost();
}