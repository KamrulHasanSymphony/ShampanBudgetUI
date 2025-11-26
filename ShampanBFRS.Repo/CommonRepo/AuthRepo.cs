using ShampanBFRS.Models.AccountVMs;
using ShampanBFRS.Repo.Configuration;
using System;
using static ShampanBFRS.Models.CommonVMs.CommonModel;

namespace ShampanBFRS.Repo.CommonRepo
{
    public class AuthRepo
    {
        public AuthModel SignInAuthentication(LoginResource model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                var result = httpRequestHelper.GetLoginAuthentication(new CredentialModel { UserName = model.UserName, Password = model.Password });                             

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

    }
}
