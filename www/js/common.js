window.onload = function(){
	$(".connect p").eq(0).animate({"left":"0%"}, 600);
	$(".connect p").eq(1).animate({"left":"0%"}, 400);
};
function textName(){
	var user=document.getElementById("user").value;
	var nameDiv=document.getElementById("nameDiv");
	if(0==user.length){
		nameDiv.innerHTML="用户名不能为空！"
		return false;
	}
	var regName=/^\w{3,15}$/
	if(!regName.test(user)){
		nameDiv.innerHTML="用户名为3-16个字符！"
		return false;
	} nameDiv.innerHTML="";
}
function textPwd(){
	var pwd=document.getElementById("pwd").value;
	var pwd_prompt=document.getElementById("pwd_prompt");
	if(0==pwd.length){
		pwd_prompt.innerHTML="密码不能为空！";
		return false;
	}
	var pwd1=document.getElementById("pwd").value;
	var pwd_prompt1=document.getElementById("pwd_prompt");
	if(0==pwd1.length){
		pwd_prompt1.innerHTML="密码不能为空！";
		return false;
	}
	var regName=/^\w{6,18}$/;
	if(!regName.test(pwd)){
		pwd_prompt.innerHTML="密码为6-18个字符！";
		return false;
	} pwd_prompt.innerHTML="";
}
function textRepwd(){
	var pwd=document.getElementById("pwd").value;
	var repwd=document.getElementById("repwd").value;
	if(repwd!=pwd){
		document.getElementById("repwd_prompt").innerHTML="密码不一致！";
		return false
	}document.getElementById("repwd_prompt").innerHTML=""
}