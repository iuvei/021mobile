/**
 * vipInfoAll
 */
/**
 * 页面初始化
 */
function vipInfoAllLoadedPanel() {
    catchErrorFun("vipInfoAll_init();");
}
/*
* 离开页面时
*/
function vipInfoAllUnloadedPanel() {
	$("#vipInfoList_div").empty();
}

var titleArr=["青铜","白银","黄金","珀金","钻石","王者"];
var icoArr=["vip_betMoney.png","vip_upgradeMoney.png","vip_keepMoney.png","vip_comfortMoney.png","vip_badge.png","vip_drawNum.png","vip_drawMoney.png","vip_kefu.png","vip_domain.png"];

//@ 入口函数
function vipInfoAll_init(){

	for(var i=0;i<6;i++){
		var $div = $('<div class="vip-items"></div>');
		var $p = $('<p><b>'+ titleArr[i] +'会员特权：' +'</b></p>');
		var $UL = $('<ul></ul>');
		var $Li = $('<li><img src="'+ '././images/vip/' + icoArr[0] +'"/>半月有效投注量</br><span id="'+ 'BetVolume_' + i +'"></span></li>');
		$UL.append($Li);
		var $Li = $('<li><img src="'+ '././images/vip/' + icoArr[1] +'"/>晋升礼金</br><span id="'+ 'PromotionGift_' + i +'"></span></li>');
		$UL.append($Li);
		var $Li = $('<li><img src="'+ '././images/vip/' + icoArr[2] +'"/>维持礼金</br><span id="'+ 'MaintainMoney_' + i +'"></span></li>');
		$UL.append($Li);
		var $Li = $('<li><img src="'+ '././images/vip/' + icoArr[3] +'"/>负盈利安慰奖</br><span id="'+ 'ConsolationPrize_' + i +'"></span></li>');
		$UL.append($Li);
		var $Li = $('<li><img src="'+ '././images/vip/' + icoArr[4] +'"/>专属勋章</br><span id="'+ 'ExclusiveMedal_' + i +'"></span></li>');
		$UL.append($Li);
		var $Li = $('<li><img src="'+ '././images/vip/' + icoArr[5] +'"/>专属取款次数</br><span id="'+ 'WithdrawalsNmuber_' + i +'"></span></li>');
		$UL.append($Li);
		var $Li = $('<li><img src="'+ '././images/vip/' + icoArr[6] +'"/>专属取款额度</br><span id="'+ 'WithdrawalAmount_' + i +'"></span></li>');
		$UL.append($Li);
		var $Li = $('<li><img src="'+ '././images/vip/' + icoArr[7] +'"/>专属客服</br><span id="'+ 'ExclusiveCustomer_' + i +'"></span></li>');
		$UL.append($Li);
		var $Li = $('<li><img src="'+ '././images/vip/' + icoArr[8] +'"/>专属域名</br><span id="'+ 'ExclusiveDomain_' + i +'"></span></li>');
		$UL.append($Li);
		
		$div.append($p);
		$div.append($UL);
		$("#vipInfoList_div").append($div);
	}
	
	//获取VIP表       GetVipTableInfo   GetUserVIPLevelInfo
    ajaxUtil.ajaxByAsyncPost(null,'{"ProjectPublic_PlatformCode":2,"InterfaceName":"GetVipTableInfo"}',function(data){
        set_data(data.VipModel);
    },'正在加载数据');
}
var div_Scroll;
function set_data(value){
	var arr = value;
	for(var i=0;i<arr.length;i++){
		$("#BetVolume_" + i).html(arr[i].BetMoney);//用户半月投注金额
		$("#PromotionGift_" + i).html(arr[i].UpgradeMoney);//晋升礼金
		$("#MaintainMoney_" + i).html(arr[i].KeepMoney);//维持礼金
//		$("#ConsolationPrize_" + i).html(arr[i].ComfortMoney);//负盈利安慰奖
		$("#ConsolationPrize_" + i).html( bigNumberUtil.multiply( Number(arr[i].ComfortMoney),100).toString() + '%' );//负盈利安慰奖
		$("#ExclusiveMedal_" + i).html(titleArr[Number(arr[i].VsID)-1]);//专属勋章
		$("#WithdrawalsNmuber_" + i).html(arr[i].DrawingNum == -1? "不限制" : arr[i].DrawingNum +" 次" ); //专属取款次数
		$("#WithdrawalAmount_" + i).html(arr[i].DrawingMoney);//专属取款额度
		$("#ExclusiveCustomer_" + i).html("无");//专属客服
		if(arr[i].CustomerService)$("#ExclusiveCustomer_" + i).html("有");//专属客服
		$("#ExclusiveDomain_" + i).html("无");//专属域名
		if(arr[i].Domainame)$("#ExclusiveDomain_" + i).html("有");//专属域名
	}
}