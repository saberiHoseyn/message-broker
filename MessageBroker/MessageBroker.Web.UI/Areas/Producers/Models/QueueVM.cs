namespace MessageBroker.Web.UI.Areas.Producers.Models;

public class QueueVM
{
    public string HostName { get; set; } = "10.100.8.65";
    public string QueueName { get; set; } = "hello World";
    public bool Durable { get; set; } = false;
    public bool Exclusive { get; set; } = false;
    public bool AutoDelete { get; set; } = false;
}
