var likesUsingAjax=function(){let t=function(t){t.click((function(e){e.preventDefault();let n=parseInt(t.attr("data-likes"));$.ajax({method:"post",url:t.attr("href"),success:function(e){e.data.deleted?n-=1:n+=1,t.attr("data-likes",n),t.text(`${n} likes`)},error:function(t){console.log(t.responseText)}})}))};return $(".toggle-like-button").each((function(){t($(this))})),{addLikeFunctionality:t}}();