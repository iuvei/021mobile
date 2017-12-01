/*进入panel时调用*/
function modifyDailyWagesThreeLoadedPanel(){
    catchErrorFun("modifyDailyWagesThreeInit();");
}

/*离开panel时调用*/
function modifyDailyWagesThreeUnloadedPanel(){
    $("#initDailyWages").empty();
    $("#new_daily_wages").empty();
    $("#pending_daily_wages").empty();
}

//@ Init
function modifyDailyWagesThreeInit() {
    var modifyDayWageInfo = jsonUtils.toObject(localStorageUtils.getParam("dailyWagesCttInfo"));
    var myUserID = localStorageUtils.getParam("myUserID");
    $("#modify_daily_wages_username").html("用户名："+modifyDayWageInfo.userName);

    ajaxUtil.ajaxByAsyncPost1(null,'{"InterfaceName":"GetMyDownDayWagesThree","ProjectPublic_PlatformCode":2,"UserID":"'+ myUserID +'","SubordinateUserid":' + modifyDayWageInfo.userID+'}', modifyDailyWagesThree_callBack, '正在加载数据...');

    //Btn
    $("#modifyDailyWagesBtn").off('click');
    $("#modifyDailyWagesBtn").on('click',function () {
        submitModifyDailyWages(modifyDayWageInfo);
    });
}

function modifyDailyWagesThree_callBack(data) {
    var modifyDayWageInfo = jsonUtils.toObject(localStorageUtils.getParam("dailyWagesCttInfo"));
    if (data.SystemState == 64){
        var MyDayWages = data.MyDayWagesThree;
        var SubordinateDayWages = data.SubordinateDayWagesThree;
        var initDailyWages = data.InitDayWagesRules;
        var my_daily_wages = 0;

        //@ 日工资标准，表头
        var $MineUl = $('<ul class="recordDetail my-daywage-ctt-three"><li><span> 日工资标准 </span><span> 销量 </span><span> 活跃人数 </span></li></ul>');

        //initDailyWages:表格数据; my_daily_wages:我的当前日工资;
        if(MyDayWages.length > 0){
            my_daily_wages = MyDayWages[0].DayWagesProportion;
            $("#my_daily_wages").html("我的日工资契约："+ MyDayWages[0].DayWageStandard);
            var maxShowDailyWages = Math.min(0.02, parseFloat(my_daily_wages)); //maxShowDailyWages:表格/选项框 显示的最高范围,为 2% 或我的日工资值取小。

            if (initDailyWages.length > 0){
                for(var i = 0; i < initDailyWages.length && initDailyWages[i].DayWagesProportion <= maxShowDailyWages; i++){
                    var $LiMine = $('<li><span>'+ initDailyWages[i].DayWageStandard +'</span><span>'+initDailyWages[i].DaySales+'</span><span>'+initDailyWages[i].ActiveNumber+'</span></li>');
                    $MineUl.append($LiMine);
                }
            }else {
                $MineUl.append('<p style="text-align:center;"> 无记录 </p>');
            }
        }else{
            $("#my_daily_wages").html("我的日工资契约：0");
            $MineUl.append('<p style="text-align:center;"> 无记录 </p>');
        }

        var current_daily_wages = 0;
        if(SubordinateDayWages.length > 0){
            current_daily_wages = SubordinateDayWages[0].DayWagesProportion;
            $("#current_daily_wages").html("当前日工资："+ SubordinateDayWages[0].DayWageStandard);
        }else{
            $("#current_daily_wages").html("当前日工资：0");
        }

        $("#initDailyWages").append($MineUl);

        $("#new_daily_wages").append('<option value="">请选择新的日工资</option>');

        if (modifyDayWageInfo.State == 2) {  //添加日工资契约
            $("#modifyDailyWagesBtn").show();
            $("#new_daily_wages").show();
            for (var i = 0; i < initDailyWages.length; i++){
                if(parseFloat(initDailyWages[i].DayWagesProportion) <= maxShowDailyWages && bigNumberUtil.multiply(initDailyWages[i].DayWagesProportion,100) >= data.MaxdDayWagesProportion){
                    $("#new_daily_wages").append('<option value="'+initDailyWages[i].ID+'">'+ initDailyWages[i].DayWageStandard +'</option>')
                }
            }
        }else{ //修改日工资契约
            for (var i = 0; i < initDailyWages.length; i++){
                if( (parseFloat(initDailyWages[i].DayWagesProportion) <= maxShowDailyWages) && (parseFloat(initDailyWages[i].DayWagesProportion) > parseFloat(current_daily_wages)) ){
                    $("#new_daily_wages").append('<option value="'+(i+1)+'">'+ initDailyWages[i].DayWageStandard +'</option>')
                }
            }
            $("#new_daily_wages").show();
            $("#modifyDailyWagesBtn").show();

            if(modifyDayWageInfo.State == 0){
                $("#modifyDailyWagesBtn").hide();
                $("#new_daily_wages").hide();
                $("#pending_daily_wages").html('待确认日工资：'+data.SuperiorDayWageStandard);
            }
        }
    }else if(data.SystemState == -1){
        loginAgain();
    }else {
        toastUtils.showToast("当前网络不给力，请稍后再试");
    }
}


//@ 点击按钮
function submitModifyDailyWages(modifyDayWageInfo) {
    if($("#new_daily_wages").find("option:selected").val() == ""){
        toastUtils.showToast("请选择日工资");
        return;
    }

    if (modifyDayWageInfo.State == 2){  //添加日工资契约
        ajaxUtil.ajaxByAsyncPost1(null,'{"InterfaceName":"AddDayWagesThree","ProjectPublic_PlatformCode":2,"UserName":"' + modifyDayWageInfo.userName +'","ID":'+ $("#new_daily_wages").find("option:selected").val() +',"UserID":'+ modifyDayWageInfo.userID +'}', function (data) {

            if(data.Result == 1){
                toastUtils.showToast("添加成功");
                setPanelBackPage_Fun("dailyWagesContractThree");
            }else {
                toastUtils.showToast("当前网络不给力，请稍后再试");
            }
        }, '正在加载数据...');

    }else{  //修改日工资契约
        ajaxUtil.ajaxByAsyncPost1(null,'{"InterfaceName":"ModifyDayWagesThree","ProjectPublic_PlatformCode":2,"UserName":"' + modifyDayWageInfo.userName +'","ModifyId":'+ $("#new_daily_wages").find("option:selected").val() +',"UserID":'+ modifyDayWageInfo.userID +'}', function (data) {

            if(data.Result){
                toastUtils.showToast("修改成功");
                setPanelBackPage_Fun("dailyWagesContractThree");
            }else {
                toastUtils.showToast("当前网络不给力，请稍后再试");
            }
        }, '正在加载数据...');
    }
}

