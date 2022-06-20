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
                },
                error : function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM

    createPost();
}