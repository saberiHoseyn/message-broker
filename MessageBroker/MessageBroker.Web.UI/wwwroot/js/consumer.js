var consumer = {
    intervalId: 0,
    activeMenu: function () {
        var isFind = false;
        var href = `${window.location.origin}/Consumers`;
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
    isValidateQueueNameInput: function () {
        var isValid = false;
        var input = $('#queueName-input').val();

        if (input == null || input == undefined || input == '') {
            $('#queueName-error').text('Enter a queue name please !').show();
        }
        else {
            isValid = true;
            $('#queueName-error').text('').hide();
            $('#durable-form').removeClass('d-none');
            $('#exclusive-form').removeClass('d-none');
            $('#autoDelete-form').removeClass('d-none');
            $('#autoAck-form').removeClass('d-none');
        };

        return isValid;
    },
    isValidateInputs: function () {
        var isValid = false;
        var QueueNameinput = consumer.isValidateQueueNameInput();

        if (QueueNameinput) {
            isValid = true;
        }
        return isValid;
    },
    createConsumerForReceivingMessage: function () {
        var hostName = $('#hostName-input').val();
        var queueName = $('#queueName-input').val();
        var durable = $('#durable-input')[0].checked;
        var exclusive = $('#exclusive-input')[0].checked;
        var autoDelete = $('#autoDelete-input')[0].checked;
        var autoAck = $('#autoAck-input')[0].checked;
        var formData = {
            HostName: hostName,
            QueueName: queueName,
            Durable: durable,
            Exclusive: exclusive,
            AutoDelete: autoDelete,
            AutoAck: autoAck,
        };

        $.ajax({
            type: "Get",
            url: '/Consumers?handler=CreateConsumer',
            data: formData,
            dataType: "JSON",
            success: function (data) {
                if (data == 'Ok') {
                    toastr.success('Create Consumer successfully', "", { timeOut: 2000 });
                    consumer.consumer();
                    consumer.intervalId = setInterval(consumer.receivingMessage, 5000);
                } else {
                    console.log(data);
                    toastr.error(`Error in creating consumer for receiving messasge with error: ${data} Please try again`, "", { timeOut: 2000 });
                }
            },
            error: function (e) {
                if (consumer.intervalId != 0) {
                    setTimeout(() => {
                        clearInterval(intervalId);
                        console.log(e.message);
                        toastr.error("Error in creating consumer for receiving messasge; Please try again", "", { timeOut: 2000 });
                    }, 2000);
                }
            },
            complete: function () {

            }

        });
    },
    consumer: function () {
        var hostName = $('#hostName-input').val();
        var queueName = $('#queueName-input').val();
        var durable = $('#durable-input')[0].checked;
        var exclusive = $('#exclusive-input')[0].checked;
        var autoDelete = $('#autoDelete-input')[0].checked;
        var autoAck = $('#autoAck-input')[0].checked;

        var formData = {
            HostName: hostName,
            QueueName: queueName,
            Durable: durable,
            Exclusive: exclusive,
            AutoDelete: autoDelete,
            AutoAck: autoAck,
        };

        $.ajax({
            type: "Get",
            url: '/Consumers?handler=Consumer',
            data: formData,
            success: function () {
               
            },
            error: function (e) {
                console.log(e.message);
                toastr.error(`Error consuming from queue ${queueName}`, "", { timeOut: 2000 });
            },
            complete: function () {
            }
        });


    },
    receivingMessage: function () {
        $.ajax({
            type: "Get",
            url: '/Consumers?handler=ReceivingMessage',
            dataType: "JSON",
            success: function (messageList) {
                if (messageList != null && messageList != undefined && messageList.length > 0) {
                    $('#messagesList').html('');
                    messageList.forEach(function (value) {
                        var message = value;
                        $('#messagesList').append(`<tr><td>${message}</td></tr>`);
                    });
                }else
                    toastr.info("on messages here", "", { timeOut: 2000 });
            },
            error: function (e) {
                console.log(e.message);
                toastr.error("Error on get Messages", "", { timeOut: 2000 });
            }
        });
    },
    refreshConsumer: function () {
        $.ajax({
            type: "Get",
            url: '/Consumers?handler=Refresh',
            success: function () {
                toastr.success("refresh messasge list.", "", { timeOut: 2000 });
            },
            error: function (e) {
                console.log(e.message);
                toastr.error("Error in refresh messasge list; Please try again", "", { timeOut: 2000 });
            }
        });
    },
};


$(document).ready(function () {

    consumer.activeMenu();
    $('#queueName-input').on('change', function () {
        if ($('#queueName-input').attr("data-focus")) {
            consumer.isValidateQueueNameInput();
        } else {
            $('#queueName-input').attr('data-focus', 'true');
        }
    });

    $('#cancel-btn').on('click', function () {
        var queuename = $('#queueName-input').val();
        $('#queueName-input').val('');
        $('#durable-input')[0].checked = false;
        $('#exclusive-input')[0].checked = false;
        $('#autoDelete-input')[0].checked = false
        $('#autoAck-input')[0].checked = true;
        $('#queueName-error').text('').hide();
        $('#durable-error').text('').hide();
        $('#exclusive-error').text('').hide();
        $('#autoDelete-error').text('').hide();
        $('#autoAck-error').text('').hide();
        $('#durable-form').addClass('d-none');
        $('#exclusive-form').addClass('d-none');
        $('#autoDelete-form').addClass('d-none');
        $('#autoAck-form').addClass('d-none');
        $('#messagesList').html('');
        if (consumer.intervalId != 0) {
            setTimeout(() => {
                clearInterval(consumer.intervalId);
                consumer.refreshConsumer();
                toastr.info(`stop receiving messasge From ${queuename}.`, "", { timeOut: 2000 });
            }, 1000);
        }
    });
});

$(document).on("submit", 'form[data-ajax="true"]', function (e) {
    e.preventDefault();
    if (consumer.isValidateInputs()) {
        consumer.createConsumerForReceivingMessage();
    }
});
