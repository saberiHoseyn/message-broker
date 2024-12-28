using MessageBroker.Web.UI.Areas.Producers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using RabbitMQ.Client;
using System.Text;
using System.Threading.Channels;

namespace MessageBroker.Web.UI.Areas.Producers.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    public CreateQueueVM CreateQueueVm { get; set; } = new();
    public List<SelectListItem> ExchangeTypeList { get; set; } =
    [
        new SelectListItem { Text = Models.Enums.ExchangeType.DefaultType.ToString(), Value = ((int)Models.Enums.ExchangeType.DefaultType).ToString() },
        new SelectListItem { Text = Models.Enums.ExchangeType.Direct.ToString(), Value = ((int)Models.Enums.ExchangeType.Direct).ToString() },
        new SelectListItem { Text = Models.Enums.ExchangeType.Fanout.ToString(), Value = ((int)Models.Enums.ExchangeType.Fanout).ToString() },
        new SelectListItem { Text = Models.Enums.ExchangeType.Topic.ToString(), Value = ((int)Models.Enums.ExchangeType.Topic).ToString() },
        new SelectListItem { Text = Models.Enums.ExchangeType.Header.ToString(), Value = ((int)Models.Enums.ExchangeType.Header).ToString() }
    ];
    public List<QueueVM> QueueuList { get; set; } = new List<QueueVM>([new QueueVM()]);
    public string Message { get; set; } = string.Empty;

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    
    public void OnGet()
    {
    }

    public JsonResult OnGetSendMessage(CreateQueueVM command)
    {
        var factory = new ConnectionFactory()
        {
            HostName = command.HostName
        };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();
        //channel.ExchangeDeclare("messageBroker.defaultExchange", ExchangeType.Direct);
        channel.QueueDeclare(
            queue: command.QueueName,
            durable: command.Durable,
            exclusive: command.Exclusive,
            autoDelete: command.AutoDelete,
            arguments: null);

        var msg = Encoding.UTF8.GetBytes(command.MessageBody ?? "Hello world . . .").ToArray();
        var exchangeName = command.SelectedExchange == Models.Enums.ExchangeType.DefaultType ? "" : command.SelectedExchange.ToString();
        var routingKey = command.SelectedExchange == Models.Enums.ExchangeType.DefaultType ? command.QueueName : "TODOEXCHANGETYPE . . .";
        channel.BasicPublish(
            exchange: exchangeName,
            routingKey: routingKey,
            basicProperties: null,
            body: msg);
        Message = "sending message being successful";
        return new JsonResult("Ok");
    }
}
