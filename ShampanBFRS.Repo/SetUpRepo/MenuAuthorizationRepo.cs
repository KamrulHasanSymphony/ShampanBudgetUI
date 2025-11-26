using Newtonsoft.Json;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.CommonKendo;
using System;
using System.Collections.Generic;
using System.Data;

namespace ShampanBFRS.Repo.SetUpRepo
{
    public class MenuAuthorizationRepo
    {

        public GridEntity<UserRoleVM> RoleIndex(GridOptions options)
        {
            try
            {
                var result = new GridEntity<UserRoleVM>();
                result = KendoGrid<UserRoleVM>.GetGridData(options, "sp_Select_RoleIndex_Grid", "get_summary", "H.Id");
                return result;
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public GridEntity<UserGroupVM> UserGroupIndex(GridOptions options)
        {
            try
            {
                var result = new GridEntity<UserGroupVM>();
                result = KendoGrid<UserGroupVM>.GetGridData(options, "sp_Select_UserGroupIndex_Grid", "get_summary", "H.Id");
                return result;
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultVM UserGroupCreateEdit(UserGroupVM model)
        {
            try
            {
                model.Operation = model.Operation.ToLower();
                var respone = KendoGrid<UserGroupVM>.UserGroupCreateEdit("sp_UserGroupCreateEdit", model);
                model.Id = Convert.ToInt32(respone[2]);
                var data = JsonConvert.SerializeObject(model);
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                result.Status = ResultStatus.Success.ToString();
                result.Message = model.Operation.ToLower() == "add" ? MessageModel.InsertSuccess : MessageModel.UpdateSuccess;
                result.Id = respone[2];
                result.DataVM = model;
                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultModel<List<UserGroupVM>> GetUserGroupAll(int id)
        {
            try
            {
                var result = KendoGrid<DataTable>.GetAll("sp_Select_GetUserGroupAll", id, "");

                var model = new List<UserGroupVM>();
                foreach (DataRow row in result.Rows)
                {
                    model.Add(new UserGroupVM
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        Name = row["Name"].ToString(),
                        CreatedBy = row["CreatedBy"].ToString(),
                        CreatedFrom = row["CreatedFrom"].ToString(),
                        LastModifiedBy = row["LastModifiedBy"].ToString(),
                        LastUpdateFrom = row["LastUpdateFrom"].ToString(),
                        CreatedOn = row["CreatedOn"].ToString(),
                        LastModifiedOn = row["LastModifiedOn"].ToString(),
                    });
                }

                return new ResultModel<List<UserGroupVM>>()
                {
                    Status = Status.Success,
                    Message = MessageModel.DataLoaded,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultModel<List<RoleMenuVM>> GetUserGroupWiseMenuAccessData(int id)
        {
            try
            {
                var result = KendoGrid<DataTable>.GetAll("sp_GetUserGroupWiseMenuAccessData", id, "");

                var model = new List<RoleMenuVM>();
                foreach (DataRow row in result.Rows)
                {
                    model.Add(new RoleMenuVM
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        IsChecked = Convert.ToBoolean(row["IsChecked"]),
                        RoleId = row["RoleId"].ToString(),
                        UserGroupId = row["UserGroupId"].ToString(),
                        MenuId = Convert.ToInt32(row["MenuId"]),
                        ParentId = Convert.ToInt32(row["ParentId"]),
                        Url = row["Url"].ToString(),
                        MenuName = row["MenuName"].ToString(),
                        Controller = row["Controller"].ToString(),
                        DisplayOrder = Convert.ToInt32(row["DisplayOrder"]),
                    });
                }

                return new ResultModel<List<RoleMenuVM>>()
                {
                    Status = Status.Success,
                    Message = MessageModel.DataLoaded,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultVM UserGroupMenuCreateEdit(RoleMenuVM model)
        {
            try
            {
                string[] respone = new string[2];

                respone = KendoGrid<RoleMenuVM>.Delete("sp_Delete", "", "", model.UserGroupId);

                foreach (var item in model.roleMenuList)
                {
                    if (item.MenuId > 0 && item.IsChecked)
                    {
                        item.CreatedBy = model.CreatedBy;
                        item.CreatedOn = model.CreatedOn;
                        item.CreatedFrom = model.CreatedFrom;
                        item.RoleId = model.RoleId;
                        item.UserGroupId = model.UserGroupId;
                        respone = KendoGrid<RoleMenuVM>.RoleMenuCreateEdit("sp_RoleMenuCreateEdit", item);
                    }
                }

                var data = JsonConvert.SerializeObject(model);
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                result.Status = ResultStatus.Success.ToString();
                result.Message = MessageModel.SubmissionSuccess;
                result.DataVM = model;
                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public GridEntity<UserMenuVM> UserMenuIndex(GridOptions options)
        {
            try
            {
                var result = new GridEntity<UserMenuVM>();
                result = KendoGrid<UserMenuVM>.GetGridData(options, "sp_Select_UserMenuIndex_Grid", "get_summary", "H.RoleId");
                return result;
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultVM RoleCreateEdit(UserRoleVM model)
        {
            try
            {
                model.Operation = model.Operation.ToLower();
                var respone = KendoGrid<UserRoleVM>.RoleCreateEdit("sp_RoleCreateEdit", model);
                model.Id = Convert.ToInt32(respone[2]);
                var data = JsonConvert.SerializeObject(model);
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                result.Status = ResultStatus.Success.ToString();
                result.Message = model.Operation.ToLower() == "add" ? MessageModel.InsertSuccess : MessageModel.UpdateSuccess;
                result.Id = respone[2];
                result.DataVM = model;
                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultModel<List<UserRoleVM>> GetRoleAll(int id)
        {
            try
            {
                var result = KendoGrid<DataTable>.GetAll("sp_Select_GetRoleAll", id, "");

                var model = new List<UserRoleVM>();
                foreach (DataRow row in result.Rows)
                {
                    model.Add(new UserRoleVM
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        Name = row["Name"].ToString(),
                        CreatedBy = row["CreatedBy"].ToString(),
                        CreatedFrom = row["CreatedFrom"].ToString(),
                        LastModifiedBy = row["LastModifiedBy"].ToString(),
                        LastUpdateFrom = row["LastUpdateFrom"].ToString(),
                        CreatedOn = row["CreatedOn"].ToString(),
                        LastModifiedOn = row["LastModifiedOn"].ToString(),
                    });
                }

                return new ResultModel<List<UserRoleVM>>()
                {
                    Status = Status.Success,
                    Message = MessageModel.DataLoaded,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultModel<List<RoleMenuVM>> GetMenuAccessData(int id)
        {
            try
            {
                var result = KendoGrid<DataTable>.GetAll("sp_GetMenuAccessData", id, "");

                var model = new List<RoleMenuVM>();
                foreach (DataRow row in result.Rows)
                {
                    model.Add(new RoleMenuVM
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        IsChecked = Convert.ToBoolean(row["IsChecked"]),
                        RoleId = row["RoleId"].ToString(),
                        UserGroupId = row["UserGroupId"].ToString(),
                        MenuId = Convert.ToInt32(row["MenuId"]),
                        ParentId = Convert.ToInt32(row["ParentId"]),
                        Url = row["Url"].ToString(),
                        MenuName = row["MenuName"].ToString(),
                        Controller = row["Controller"].ToString(),
                        DisplayOrder = Convert.ToInt32(row["DisplayOrder"]),
                    });
                }

                return new ResultModel<List<RoleMenuVM>>()
                {
                    Status = Status.Success,
                    Message = MessageModel.DataLoaded,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultVM RoleMenuCreateEdit(RoleMenuVM model)
        {
            try
            {
                string[] respone = new string[2];

                respone = KendoGrid<RoleMenuVM>.Delete("sp_Delete", model.RoleId, "", "");

                foreach (var item in model.roleMenuList)
                {
                    if (item.MenuId > 0 && item.IsChecked)
                    {
                        item.CreatedBy = model.CreatedBy;
                        item.CreatedOn = model.CreatedOn;
                        item.CreatedFrom = model.CreatedFrom;
                        item.RoleId = model.RoleId;
                        item.UserGroupId = model.UserGroupId;
                        respone = KendoGrid<RoleMenuVM>.RoleMenuCreateEdit("sp_RoleMenuCreateEdit", item);
                    }
                }

                var data = JsonConvert.SerializeObject(model);
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                result.Status = ResultStatus.Success.ToString();
                result.Message = MessageModel.SubmissionSuccess;
                result.DataVM = model;
                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultModel<List<UserMenuVM>> GetUserMenuAccessData(int RoleId, string UserId)
        {
            try
            {
                var result = KendoGrid<DataTable>.GetAll("sp_GetUserMenuAccessData", RoleId, UserId);

                var model = new List<UserMenuVM>();
                foreach (DataRow row in result.Rows)
                {
                    model.Add(new UserMenuVM
                    {
                        IsChecked = Convert.ToBoolean(row["IsChecked"]),
                        RoleId = Convert.ToInt32(row["RoleId"]),
                        MenuId = Convert.ToInt32(row["MenuId"]),
                        ParentId = Convert.ToInt32(row["ParentId"]),
                        Url = row["Url"].ToString(),
                        MenuName = row["MenuName"].ToString(),
                        Controller = row["Controller"].ToString(),
                        DisplayOrder = Convert.ToInt32(row["DisplayOrder"]),
                    });
                }

                return new ResultModel<List<UserMenuVM>>()
                {
                    Status = Status.Success,
                    Message = MessageModel.DataLoaded,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultModel<List<UserMenuVM>> GetUserRoleWiseMenuAccessData(int roleId)
        {
            try
            {
                var result = KendoGrid<DataTable>.GetAll("sp_GetUserRoleWiseMenuAccessData", roleId, "");

                var model = new List<UserMenuVM>();
                foreach (DataRow row in result.Rows)
                {
                    model.Add(new UserMenuVM
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        IsChecked = Convert.ToBoolean(row["IsChecked"]),
                        RoleId = Convert.ToInt32(row["RoleId"]),
                        MenuId = Convert.ToInt32(row["MenuId"]),
                        ParentId = Convert.ToInt32(row["ParentId"]),
                        Url = row["Url"].ToString(),
                        MenuName = row["MenuName"].ToString(),
                        Controller = row["Controller"].ToString(),
                        DisplayOrder = Convert.ToInt32(row["DisplayOrder"]),
                    });
                }

                return new ResultModel<List<UserMenuVM>>()
                {
                    Status = Status.Success,
                    Message = MessageModel.DataLoaded,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultVM UserMenuCreateEdit(UserMenuVM model)
        {
            try
            {
                string[] respone = new string[2];

                respone = KendoGrid<RoleMenuVM>.Delete("sp_Delete", "", model.UserId, "");

                foreach (var item in model.userMenuList)
                {
                    if (item.MenuId > 0 && item.IsChecked)
                    {
                        item.CreatedBy = model.CreatedBy;
                        item.CreatedOn = model.CreatedOn;
                        item.CreatedFrom = model.CreatedFrom;
                        item.RoleId = model.RoleId;
                        item.UserId = model.UserId;
                        respone = KendoGrid<UserMenuVM>.UserMenuCreateEdit("sp_UserMenuCreateEdit", item);
                    }
                }

                var data = JsonConvert.SerializeObject(model);
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                result.Status = ResultStatus.Success.ToString();
                result.Message = MessageModel.SubmissionSuccess;
                result.DataVM = model;

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public List<UserVM> GetRoleData()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();

                return kendoList.Select_Data_List<UserVM>("sp_GetRoleData", "get_List");
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public List<UserVM> GetUserGroupData()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();

                return kendoList.Select_Data_List<UserVM>("sp_GetUserGroupData", "get_List");
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }



    }
}
