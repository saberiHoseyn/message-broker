using MessageBroker.Web.UI.Areas.Consumers.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Threading;

namespace MessageBroker.Web.UI.Services;

public class RabbitMqConsumerService : BackgroundService
{
    private readonly string _hostname;
    private readonly string _queueName;
    private IConnection _connection;
    private IModel _channel;
    private readonly IMessageService _messageService;

    public RabbitMqConsumerService(string hostname, string queueName, [FromServices] IMessageService messageService)
    {
        _hostname = hostname;
        _queueName = queueName;
        _messageService = messageService;

    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory() { HostName = _hostname };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            _messageService.AddMessage(message);
            Console.WriteLine(" [x] Received {0}", message);
        };

        _channel.BasicConsume(queue: _queueName,
        autoAck: true,
        consumer: consumer);

        return Task.CompletedTask;
    }

    public override void Dispose()
    {
        _channel.Close();
        _connection.Close();
        base.Dispose();
    }
}


public interface IMessageService
{
    void AddMessage(string message);
    void RefreshMessages();
    IEnumerable<string> GetMessages();
}

public class MessageService : IMessageService
{
    private readonly List<string> _messages = new List<string>();

    public void AddMessage(string message)
    {
        _messages.Add(message);
    }

    public IEnumerable<string> GetMessages()
    {
        return _messages;
    }

    public void RefreshMessages()
    {
        _messages.RemoveAll(message => message is not null);
    }
}


public static class RabbitMqConsumerServiceRunner
{
    private static IHost _host;

    public static void Run(string hostname, string queueName, IMessageService messageService)
    {
        var service = new RabbitMqConsumerService(hostname, queueName, messageService);
        _host = Host.CreateDefaultBuilder()
        .ConfigureServices(services =>
        {
            services.AddHostedService(provider => service);
        })
        .Build();

        _host.Run();
    }

    public static async Task StopAsync()
    {
        if (_host != null)
        {
            await _host.StopAsync();
            _host.Dispose();
            _host = null;
            Console.WriteLine("Service has been stopped.");
        }
    }
}