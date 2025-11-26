using ShampanBFRS.Models.AccountVMs;

namespace ShampanBFRS.Models.CommonVMs
{
    public class CommonModel
    {
        public class CredentialModel
        {
            public string UserName { get; set; }
            public string Password { get; set; }           
        }
        public class AuthModel
        {
            public string token { get; set; }

            public string Token_type { get; set; }

            public string Expires_in { get; set; }

            public AspNetUsersVM userInfo { get; set; }
        }
    }
}
