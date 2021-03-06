// Config
var defaultErrorHeading = 'There\'s been a problem';
var defaultErrorDescription = 'Check the following';
var defaultErrorMessage = 'There is an error';

function clearValidation() {
    $('.error-summary').remove();

    $('.form-control-error').each(function () {
        $(this).removeClass('form-control-error');
    });

    $('.error-message').each(function () {
        $(this).remove();
    });

    $('.form-group-error').each(function(){
        $(this).removeClass('form-group-error');
    });
}

function checkTextFields(errors) {
    $(document).find('input[type="text"],input[type="password"], textarea').each(function () {
        var $formgroup = $(this).parents('.form-group');
        var label = $(this).parent().find('label').clone().children().remove().end().text();

        if ($formgroup.attr('data-required') !== undefined && $(this).val() === '' && !$(this).parent().hasClass('js-hidden')) {
            if ($(this).attr('id') === undefined) {
                $(this).attr('id', $(this).attr('name'));
            }

            errors.push(
                {
                    id: $(this).attr('id'),
                    name: $(this).attr('name'),
                    errorMessage: $formgroup.attr('data-error').toLowerCase() || defaultErrorMessage.toLowerCase(),
                    label: label,
                    type: 'text, password'
                }
            );
        }
    });
    return;
}

function checkSelectors(errors) {
    var checked = [];

    $(document).find('input[type="radio"], input[type="checkbox"]').each(function () {
        var $fieldset = $(this).parents('fieldset');
        var label = $fieldset.find('legend').clone().children().remove().end().text();

        if ($fieldset.attr('data-required') !== undefined && $fieldset.find(':checked').length === 0) {
            if ($(this).attr('id') === undefined) {
                $(this).attr('id', $(this).attr('name'));
            }

            if (checked.indexOf($(this).attr('name')) < 0) {
                checked.push($(this).attr('name'));
                errors.push(
                    {
                        id: $(this).attr('id'),
                        name: $(this).attr('name'),
                        errorMessage: $fieldset.attr('data-error').toLowerCase() || defaultErrorMessage.toLowerCase(),
                        label: label,
                        type: 'text, password'
                    }
                );
            }
        }
    });
}

function appendErrorSummary() {
    var summaryNotPresent = $(document).find('.error-summary').length === 0;
    var summary = '<div class="error-summary" role="group" aria-labelledby="error-summary-heading" tabindex="-1">' +
        '<h1 class="heading-medium error-summary-heading" id="error-summary-heading">' +
        defaultErrorHeading +
        '</h1>' +
        '<p>' +
        defaultErrorDescription +
        '</p>' +
        '<ul class="error-summary-list">' +
        '</ul>' +
        '</div>';

    if (summaryNotPresent) {
        $('form').before(summary);
    }
}

function appendErrorMessages(errors) {
    for (var i = 0; i < errors.length; i++) {
        if ($(document).find('a[href="#' + errors[i].id + '"]').length === 0) {
            $('.error-summary-list').append(
                '<li><a href="#' + errors[i].id + '">' + errors[i].label + ' - ' + errors[i].errorMessage + '</a></li>'
            );
            var $formgroup = $(document).find('#' + errors[i].id).parents('.form-group');
            $formgroup.addClass('form-group-error');

            if ($formgroup.find('.error-message').length === 0) {
                if ($formgroup.find('input[type="text"], input[type="password"]').length > 0 || $formgroup.find('textarea').length > 0) {
                    if ($formgroup.find('.form-date').length > 0) {
                        $formgroup.find('.form-date').before(
                            '<span class="error-message">' +
                            errors[i].errorMessage +
                            '</span>'
                        );
                    } else {
                        $formgroup.find('label').append(
                            '<span class="error-message">' +
                            errors[i].errorMessage +
                            '</span>'
                        );
                        $formgroup.find('.form-control').addClass('form-control-error');
                    }
                } else if ($formgroup.find('input[type="radio"]').length > 0 || $formgroup.find('input[type="checkbox"]')) {
                    $formgroup.find('legend').append(
                        '<span class="error-message">' +
                        errors[i].errorMessage +
                        '</span>'
                    );
                }
            }
        }
    }
}

$(document).on('submit', 'form', function (e) {
    var requiredFieldsPresent = $(document).find('[data-required]').length > 0;

    clearValidation();

    if (requiredFieldsPresent) {
        var errors = [];

        checkTextFields(errors);
        checkSelectors(errors);

        if (errors.length > 0) {
            e.preventDefault();
            appendErrorSummary();
            appendErrorMessages(errors);
            $(document).scrollTop(0);
        }

    }
});