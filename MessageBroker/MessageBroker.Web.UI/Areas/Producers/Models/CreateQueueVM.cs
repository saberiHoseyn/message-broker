using MessageBroker.Web.UI.Areas.Producers.Models.Enums;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace MessageBroker.Web.UI.Areas.Producers.Models;

public class CreateQueueVM
{
    public string HostName { get; set; } = "10.100.8.65";
    public string? QueueName { get; set; }
    public bool Durable { get; set; } = false;
    public bool Exclusive { get; set; } = false;
    public bool AutoDelete { get; set; } = false;
    public ExchangeType SelectedExchange { get; set; }
    public string? RoutingKey { get; set; } //routing key in exchange default is equals by Queue Name
    public string? MessageBody { get; set; }
}
