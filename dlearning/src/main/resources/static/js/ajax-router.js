$(document).ready(function() {
    $('a').click(function(event) {
        if ($(this).attr('href') && $(this).attr('href') !== '#') {
            event.preventDefault();
            const url = $(this).attr('href');

            $.ajax({
                url: url,
                type: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                success: function(response) {
                    const content = $('<div/>').html(response).addClass('fade-in');
                    $('body').html(content);
                    setTimeout(() => {
                        content.addClass('visible');
                        setupDropdownToggle();
                    }, 5);

                },
                error: function(xhr, status, error) {
                    window.location.href='/login';
                }
            });
        }
    });
});


function setupDropdownToggle() {
    $('.dropdown-toggle').off('click').on('click', function (e) {
        e.preventDefault();

        const $dropdownMenu = $(this).next('.dropdown-menu');


        if ($dropdownMenu.is(':visible')) {
            $dropdownMenu.hide();
        } else {
            $('.dropdown-menu').hide();
            $dropdownMenu.show();
        }
    });

    $('.rounded-circle').off('click').on('click', function (e) {
        e.preventDefault();

        const $dropdownMenu = $(this).next('.dropdown-menu');


        if ($dropdownMenu.is(':visible')) {
            $dropdownMenu.hide();
        } else {
            $('.dropdown-menu').hide();
            $dropdownMenu.show();
        }
    });
}
