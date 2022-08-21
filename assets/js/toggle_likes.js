class ToggleLike {
    constructor(toggleElement) {
        // 'toggleElement' is the href of <a> tag, on which the user clicked
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike() {
        $(this.toggler).click(function(e) {
            e.preventDefault();
            let self = this;    // 'self' is assigned the <a> tag on which the user clicked

            // send request manually via AJAX
            // promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href')   // this fetches the href of the <a> tag
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                if(data.data.deleted == true){
                    // unlike the post - decrease likesCount
                    likesCount -= 1;
                }else{
                    // like the post - increase likesCount
                    likesCount += 1;
                }

                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount} Likes`);
            })
            .fail(function(err){
                if(err) { console.log(err); return; }
                console.log('error in completing the request');
            });
        });
    }
}


