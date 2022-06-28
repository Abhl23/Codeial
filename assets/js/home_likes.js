var likesUsingAjax=(function(){

    // console.log('Script Loaded!');

    let addLikeFunctionality=function(likeLink){
        
        likeLink.click(function(event){

            event.preventDefault();

            let likesCount=parseInt(likeLink.attr('data-likes'));

            $.ajax({
                method : 'post',
                url : likeLink.attr('href'),
                success : function(data){
                    if(data.data.deleted){
                        likesCount-=1;
                    }
                    else{
                        likesCount+=1;
                    }

                    likeLink.attr('data-likes', likesCount);
                    likeLink.text(`${likesCount} likes`);
                },
                error : function(err){
                    console.log(err.responseText);
                } 
            });
        })
    }

    $('.toggle-like-button').each(function(){
        addLikeFunctionality($(this));
    });

    return {
        addLikeFunctionality : addLikeFunctionality
    };

})();