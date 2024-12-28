using Microsoft.AspNetCore.Mvc.RazorPages;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using MessageBroker.Web.UI.Areas.Consumers.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using MessageBroker.Web.UI.Services;

namespace MessageBroker.Web.UI.Areas.Consumers.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly IMessageService _messageService;
    //private static List<string> MessageList = new List<string>();

    //public string Message { get; set; } = string.Empty;
    public CreateConsumerVM CreateConsumerVm { get; set; } = new();
    public List<ConsumerVM> ConsumerVMList { get; set; } = [new ConsumerVM()];

    public IndexModel(ILogger<IndexModel> logger, IMessageService messageService)
    {
        _logger = logger;
        _messageService = messageService;
    }

    public void OnGet()
    {

    }

    public IActionResult OnGetCreateConsumer(CreateConsumerVM command)
    {
        try
        {
            InitRabbitMQ(command);
            AddConsumerToConsumerVMList(command);
            Console.WriteLine($"Create Queue {command.QueueName}----------");

            return new JsonResult("Ok");
        }
        catch (Exception e)
        {
            return new JsonResult(e.Message);
        }
    }


    public JsonResult OnGetReceivingMessage()
    {
        Console.WriteLine($"Get MessageList----------");

        var messages = _messageService.GetMessages();
        return new JsonResult(messages);
    } 

    public void OnGetConsumer(CreateConsumerVM command)
    {
        Console.WriteLine($"On Get Consumer On Queue {command.QueueName}----------");
        RabbitMqConsumerServiceRunner.Run(command.HostName, command.QueueName, _messageService);

        //var factory = new ConnectionFactory() { HostName = command.HostName };
        //using (var connection = factory.CreateConnection())
        //using (var channel = connection.CreateModel())
        //{
        //    // نام queue را مشخص کنید
        //    string queueName = command.QueueName;

        //    Console.WriteLine($"On queue {command.QueueName}");
        //    // اطمینان از وجود queue
        //    channel.QueueDeclare(queue: queueName,
        //    durable: command.Durable,
        //    exclusive: command.Exclusive,
        //    autoDelete: command.AutoDelete,
        //    arguments: null);

        //    var consumer = new EventingBasicConsumer(channel);
        //    consumer.Received += (ch, ea) =>
        //    {
        //        Console.WriteLine($"on reveived from {command.QueueName}");
        //        var message = Encoding.UTF8.GetString(ea.Body.ToArray());
        //        Console.WriteLine($"on reveived message: {message}");
        //        Console.WriteLine(message);
        //        if (!string.IsNullOrWhiteSpace(message))
        //        {
        //            MessageList.Add(message);
        //            Console.WriteLine($"add message to messageList----------");
        //        }
        //        if (!command.AutoAck)
        //        {
        //            channel.BasicAck(ea.DeliveryTag, false);
        //        }
        //    };
        //    Console.WriteLine($"On Basic Consume Queue {command.QueueName}----------");
        //    channel.BasicConsume(command.QueueName, command.AutoAck, consumer);
        //}
    }

    public async Task OnGetRefresh()
    {
        Console.WriteLine($"Refresh MessageList----------");
        _messageService.RefreshMessages();
        await RabbitMqConsumerServiceRunner.StopAsync();
        //MessageList = new();
    }

    private void InitRabbitMQ(CreateConsumerVM command)
    {
        var factory = new ConnectionFactory { HostName = command.HostName };
        var connection = factory.CreateConnection();
        var channel = connection.CreateModel();
        //_channel.ExchangeDeclare("messageBroker.defaultExchange", ExchangeType.Direct);
        channel.QueueDeclare(
            queue: command.QueueName,
            durable: command.Durable,
            exclusive: command.Exclusive,
            autoDelete: command.AutoDelete,
            arguments: null
        );

        //_channel.QueueBind(queue: command.QueueName, exchange: "", routingKey: command.QueueName);
        channel.BasicQos(0, 100, false);
        //_connection.ConnectionShutdown += RabbitMQ_ConnectionShutdown;
    }

    private void RabbitMQ_ConnectionShutdown(object sender, ShutdownEventArgs e)
    {
        _logger.LogInformation("RabbitMQ connection shutdown");
    }
    private void AddConsumerToConsumerVMList(CreateConsumerVM command)
    {
        ConsumerVMList.Clear();
        ConsumerVMList.Add(new ConsumerVM
        {
            HostName = command.HostName,
            QueueName = string.IsNullOrWhiteSpace(command.QueueName) ? string.Empty : command.QueueName,
            AutoAck = command.AutoAck,
            AutoDelete = command.AutoDelete,
            Durable = command.Durable,
            Exclusive = command.Exclusive
        });
    }
}
