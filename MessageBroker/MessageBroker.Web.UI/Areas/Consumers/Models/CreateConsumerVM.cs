namespace MessageBroker.Web.UI.Areas.Consumers.Models
{
    public class CreateConsumerVM
    {
        public string HostName { get; set; } = "10.100.8.65";
        public string? QueueName { get; set; }
        public bool Durable { get; set; } = false;
        public bool Exclusive { get; set; } = false;
        public bool AutoDelete { get; set; } = false;
        public bool AutoAck { get; set; } = true;
    }
}
