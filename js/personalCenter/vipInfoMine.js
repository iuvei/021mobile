/**
 * vipInfoMine
 */

//@ loaded
function vipInfoMineLoadedPanel() {
    catchErrorFun("vipInfoMineInit()");
}

//@ Unloaded
function vipInfoMineUnloadedPanel() {
    $("#myVipItems").empty();
}

function vipInfoMineInit() {
    var myUserID = localStorageUtils.getParam("myUserID");
    ajaxUtil.ajaxByAsyncPost(null, '{"ProjectPublic_PlatformCode":2,"UserID":"' + myUserID + '","InterfaceName":"GetUserVIPLevelInfo"}',function (data) {
        if (data.SystemState == 64){
            var VsID = data.VsID,                       // VIP等级
                VsName = data.VsName,                   // VIP名称
                BetMoney = data.BetMoney,               // 半月有效投注量
                ComfortMoney = bigNumberUtil.multiply( Number(data.ComfortMoney),100).toString() + '%', // 负盈利安慰金
                CustomerService = data.CustomerService, // 专属客服
                Domainame = data.Domainame,             // 专用域名
                DrawingNum = data.DrawingNum,           // 专属提款次数  -1 无限制
                DrawingMoney = data.DrawingMoney,       // 专属取款额度
                HeadPortrait = data.HeadPortrait,       // 专用头像
                HalfMonBetMoney = data.HalfMonBetMoney, // 用户半月投注金额
                KeepMoney = data.KeepMoney,             // 维持礼金
                UpgradeMoney = data.UpgradeMoney,       // 晋升礼金
                UpDiffMoney = data.UpDiffMoney,         // 晋级还需投注金额
                ExclusiveBadge = vipLevelContent[VsID]["medal"];//专属勋章

            VsID = parseInt(VsID);

            //@ 标题和头像
            $("#myVip_title").html(vipLevelContent[VsID]["name"]);
            $("#myVip_badge").attr("src",vipLevelContent[VsID]["badge"]);

            //@ 进度条
            //标注UI
            $(".subnum .divnum ul").children("li:nth-of-type("+ VsID +")").removeClass().addClass("z-on");
            $(".subnum .divnum ul").children("li:nth-of-type("+ VsID +")").siblings("li").removeClass().addClass("z-off");

            //条形UI
            if (VsID > 1 && VsID < 6){
                VsID = VsID + 1;
                $(".subnum .divison").children("span").removeClass();
                $(".subnum .divison").children("span:nth-of-type("+ VsID +")").prevAll("span").addClass("jd-on");
                $(".subnum .divison").children("span:nth-of-type("+ VsID +")").nextAll("span").addClass("jd-off");
            }else if (VsID == 1){
                $(".subnum .divison").children("span:nth-of-type("+ VsID +")").removeClass().addClass("jd-on");
                $(".subnum .divison").children("span:nth-of-type("+ VsID +")").nextAll("span").removeClass().addClass("jd-off");
            }else if(VsID == 6){
                $(".subnum .divison").children("span").removeClass().addClass("jd-on");
            }else{
                $(".subnum .divison").children("span").removeClass().addClass("jd-off");
                $(".subnum .divnum ul").children("li").removeClass().addClass("z-off");
            }

            //@ 当前消费 | 晋级还需
            $("#myVip_alreadyBet").html("当前消费：" + HalfMonBetMoney);
            var toBet = (VsID == 6) ? "当前为最高等级VIP" : ("晋级还需：" + UpDiffMoney);
            $("#myVip_needToBet").html(toBet);

            var $p = $('<p><span>我的等级</span><span id="getAllVipInfo">全部等级</span></p>');

            //非VIP
            if (VsID == 0){
                BetMoney = "--";
                UpgradeMoney = "--";
                KeepMoney = "--";
                ComfortMoney = "--";
                ExclusiveBadge = "--";
                DrawingMoney = "--";
            }

            var $ul = $('<ul>'+
                '<li><img src="images/vip/vip_betMoney.png">半月有效投注量<br><span>'+ BetMoney +'</span></li>'+
                '<li><img src="images/vip/vip_upgradeMoney.png">晋升礼金<br><span>'+ UpgradeMoney +'</span></li>'+
                '<li><img src="images/vip/vip_keepMoney.png">维持礼金<br><span>'+ KeepMoney +'</span></li>'+
                '<li><img src="images/vip/vip_comfortMoney.png">负盈利安慰奖<br><span>'+ ComfortMoney +'</span></li>'+
                '<li><img src="images/vip/vip_badge.png">专属勋章<br><span>'+ ExclusiveBadge +'</span></li>'+
                '<li><img src="images/vip/vip_drawNum.png">专属取款次数<br><span>'+ (VsID==0 ? ("--") : (DrawingNum == -1? "不限制" : DrawingNum+" 次")) +'</span></li>'+
                '<li><img src="images/vip/vip_drawMoney.png">专属取款额度<br><span>'+ DrawingMoney +'</span></li>'+
                '<li><img src="images/vip/vip_kefu.png">专属客服<br><span>'+ (VsID==0 ? ("--") : (CustomerService ? "有" : "无")) +'</span></li>'+
                '<li><img src="images/vip/vip_domain.png">专属域名<br><span>'+ (VsID==0 ? ("--") : (Domainame ? "有" : "无")) +'</span></li>'+
                '</ul>');

            $("#myVipItems").append($p).append($ul);

            //点击“全部等级”
            $("#getAllVipInfo").off("click");
            $("#getAllVipInfo").on("click",function () {
                createInitPanel_Fun('vipInfoAll');
            });

        }else if (data.SystemState == "-1"){
            loginAgain();
        }
    },null);
}

var vipLevelContent = {
  "0":{name:"您还不是VIP", medal:"--", badge:"images/vip/badge_0.png"},
  "1":{name:"青铜VIP", medal:"青铜", badge:"images/vip/badge_1.png"},
  "2":{name:"白银VIP", medal:"白银", badge:"images/vip/badge_2.png"},
  "3":{name:"黄金VIP", medal:"黄金", badge:"images/vip/badge_3.png"},
  "4":{name:"铂金VIP", medal:"铂金", badge:"images/vip/badge_4.png"},
  "5":{name:"钻石VIP", medal:"钻石", badge:"images/vip/badge_5.png"},
  "6":{name:"王者VIP", medal:"王者", badge:"images/vip/badge_6.png"}
};
