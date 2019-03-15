$(function(){
    
    /*Navbar */
    $(window).scroll(function(){
        var scroll = $(this).scrollTop();
        if(scroll > 100)
            {
                
                $('.headeer').slideDown();
            }
        else{
            $('.headeer').slideUp();
        }
        
    });
    
    /*Drobdown */
    
      $(".dropdown").hover(            
            function() {
                $('.dropdown-menu', this).stop( true, true ).fadeIn("fast");
                $(this).toggleClass('open');
                $('b', this).toggleClass("caret caret-up");                
            },
            function() {
                $('.dropdown-menu', this).stop( true, true ).fadeOut("fast");
                $(this).toggleClass('open');
                $('b', this).toggleClass("caret caret-up");                
            });
    
    
    
    /* Arrow*/
    var myButton = document.getElementById('goup');
window.onscroll = function () {
    
    'use strict';
    
    if (window.pageYOffset >= 150)
        {
            
            myButton.style.display = 'block';
            
        
        } else {
            
            myButton.style.display = 'none';
        }
};

$('.up').click(function(){
    $('html, body').animate({scrollTop:0}, 'slow');
}); 
    
    
    
    
    });