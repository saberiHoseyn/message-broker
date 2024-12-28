namespace MessageBroker.Web.UI.Areas.Consumers.Models
{
    public class ConsumerVM
    {
        public string HostName { get; set; } = "10.100.8.65";
        public string QueueName { get; set; } = "hello World";
        public bool Durable { get; set; } = false;
        public bool Exclusive { get; set; } = false;
        public bool AutoDelete { get; set; } = false;
        public bool AutoAck { get; set; } = true;
        public List<string> MessagesReceived { get; set; } = new();
    }
}
