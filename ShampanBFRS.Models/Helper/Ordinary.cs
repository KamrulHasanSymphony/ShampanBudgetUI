using System.Net;
using System.Net.Sockets;

namespace ShampanBFRS.Models.Helper
{
    public class Ordinary
    {
        public static string GetLocalIpAddress()
        {
            string localIpAddress = "";
            foreach (var ip in Dns.GetHostAddresses(Dns.GetHostName()))
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
                {
                    localIpAddress = ip.ToString();
                    break;
                }
            }
            return localIpAddress;
        }

    }

}
