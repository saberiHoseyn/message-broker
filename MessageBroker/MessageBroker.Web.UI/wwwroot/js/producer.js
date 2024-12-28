var producer = {
    isValidateselectedExchange: function () {
        var isValid = false;
        var selectedselectedExchange = $('#selectedExchange-input').val();
        if (selectedselectedExchange === null || selectedselectedExchange === undefined || selectedselectedExchange === '') {
            $('#selectedExchange-error').text('choose one exchange type please!').show();
        } else {
            isValid = true;
            $('#selectedExchange-error').text('').hide();
            let selectedExchange = $('#selectedExchange-input').val();

            switch (selectedExchange) {
                case '0':
                    isValid = false
                    $('#selectedExchange-error').text('choose one exchange type please!').show();
                    break;
                case '1':
                    $('#queueName-form').removeClass('d-none');
                    $('#routingKey-form').addClass('d-none');
                    $('#routingKey-input').val('');

                    $('#durable-form').removeClass('d-none');
                    $('#exclusive-form').removeClass('d-none');
                    $('#autoDelete-form').removeClass('d-none');
                    $('#messageBody-form').removeClass('d-none');
                    break;
                case '2':
                    $('#queueName-form').addClass('d-none');
                    $('#routingKey-form').removeClass('d-none');

                    $('#durable-form').removeClass('d-none');
                    $('#exclusive-form').removeClass('d-none');
                    $('#autoDelete-form').removeClass('d-none');
                    $('#messageBody-form').removeClass('d-none');
                    break;
                case '3':
                    $('#queueName-form').addClass('d-none');
                    $('#routingKey-form').removeClass('d-none');
                    $('#queueName-input').val('');

                    $('#durable-form').removeClass('d-none');
                    $('#exclusive-form').removeClass('d-none');
                    $('#autoDelete-form').removeClass('d-none');
                    $('#messageBody-form').removeClass('d-none');
                    break;
                case '4':
                    $('#queueName-form').addClass('d-none');
                    $('#routingKey-form').removeClass('d-none');
                    $('#queueName-input').val('');

                    $('#durable-form').removeClass('d-none');
                    $('#exclusive-form').removeClass('d-none');
                    $('#autoDelete-form').removeClass('d-none');
                    $('#messageBody-form').removeClass('d-none');
                case '5':
                    $('#queueName-form').addClass('d-none');
                    $('#routingKey-form').removeClass('d-none');
                    $('#queueName-input').val('');

                    $('#durable-form').removeClass('d-none');
                    $('#exclusive-form').removeClass('d-none');
                    $('#autoDelete-form').removeClass('d-none');
                    $('#messageBody-form').removeClass('d-none');
                    break;
                default:
                    isValid = false;
                    $('#selectedExchange-error').text('choose one exchange type please!').show();

                    $('#durable-form').addClass('d-none');
                    $('#exclusive-form').addClass('d-none');
                    $('#autoDelete-form').addClass('d-none');
                    $('#messageBody-form').addClass('d-none');

                    $('#durable-input').val('false');
                    $('#exclusive-input').val('false');
                    $('#autoDelete-input').val('false');
                    $('#messageBody-input').val('');
                    break;
            }
        }
        return isValid;
    },
    isValidateQueueNameInput: function () {
        var isValid = false;
        var input = $('#queueName-input').val();

        if ($('#queueName-form').hasClass('d-none')) {
            isValid = true;
            return isValid;
        } else if (input == null || input == undefined || input == '') {
            $('#queueName-error').text('Enter a queue name please !').show();
        }
        else {
            isValid = true;
            $('#queueName-error').text('').hide();
            $('#durable-form').removeClass('d-none');
            $('#exclusive-form').removeClass('d-none');
            $('#autoDelete-form').removeClass('d-none');
            $('#messageBody-form').removeClass('d-none');

        };

        return isValid;
    },
    isValidateRutingKeyInput: function () {
        var isValid = false;
        var input = $('#routingKey-input').val();

        if ($('#routingKey-form').hasClass('d-none')) {
            isValid = true;
            return isValid;
        } else if (input == null || input == undefined || input == '') {
            $('#routingKey-error').text('Enter a routing key for publish message please !').show();
        }
        else {
            isValid = true;
            $('#routingKey-error').text('').hide();
        };

        return isValid;
    },
    isValidateInputs: function () {
        var isValid = false;
        var selectedExchangeinput = producer.isValidateselectedExchange();
        var RutingKeyinput = producer.isValidateRutingKeyInput();
        var QueueNameinput = producer.isValidateQueueNameInput();

        if (selectedExchangeinput && RutingKeyinput && QueueNameinput) {
            isValid = true;
        }
        return isValid;
    },
    sendingMessageForProducers: function () {

        var hostName = $('#hostName-input').val();
        var queueName = $('#queueName-input').val();
        var durable = $('#durable-input')[0].checked;
        var exclusive = $('#exclusive-input')[0].checked;
        var autoDelete = $('#autoDelete-input')[0].checked;
        var selectedExchange = $('#selectedExchange-input').val();
        var routingKey = $('#routingKey-input').val();
        var messageBody = $('#messageBody-input').val();

        var formData = {
            HostName: hostName,
            QueueName: queueName,
            Durable: durable,
            Exclusive: exclusive,
            AutoDelete: autoDelete,
            SelectedExchange: selectedExchange,
            RoutingKey: routingKey,
            MessageBody: messageBody
        };

        $.ajax({
            type: "Get",
            url: '/Producers?handler=SendMessage',
            data: formData,
            dataType: "JSON",
            success: function () {
                toastr.success('Message sent successfully', "", { timeOut: 2000 });
            },
            error: function (e) {
                console.log(e.message);
                toastr.error("Error in sending message in queue; Please try again", "", { timeOut: 5000 });
            }
        });
    },
    activeMenu: function () {
        var isFind = false;
        var href = `${window.location.origin}/Producers`;
        var menu = document.querySelector("#menu").querySelectorAll("a");
        menu.forEach(item => {

            if (item.href.toUpperCase() === href.toUpperCase() && !isFind) {
                $(item).parent("li.nav-item").addClass('active');
                isFind = true;
            } else {
                $(item).parent("li.nav-item").removeClass('active');
            }
        });
    },
};


$(document).ready(function () {
    producer.activeMenu();
    let message = $('#message').val();
    if (message !== null && message !== undefined && message !== '') {
        toastr.success(message, "", { timeOut: 5000 });
    }

    $('#selectedExchange-input').on('change', function () {
        if ($('#selectedExchange-input').attr("data-focus")) {
            producer.isValidateselectedExchange();
        } else {
            $('#selectedExchange-input').attr('data-focus', 'true');
        }
    });

    $('#cancel-btn').on('click', function () {
        $('#queueName-input').val('');
        $('#durable-input')[0].checked = false;
        $('#exclusive-input')[0].checked = false;
        $('#autoDelete-input')[0].checked = false
        $('#selectedExchange-input').val('0');
        $('#routingKey-input').val('');
        $('#messageBody-input').val('');
        $('#hostName-error').text('').hide();
        $('#selectedExchange-error').text('').hide();
        $('#queueName-error').text('').hide();
        $('#routingKey-error').text('').hide();
        $('#durable-error').text('').hide();
        $('#exclusive-error').text('').hide();
        $('#autoDelete-error').text('').hide();
        $('#messageBody-error').text('').hide();
    });
});

$(document).on("submit", 'form[data-ajax="true"]', function (e) {
    e.preventDefault();
    if (producer.isValidateInputs()) {
        producer.sendingMessageForProducers();
    }
});

