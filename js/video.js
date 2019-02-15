
	var link='https://www.googleapis.com/youtube/v3/playlistItems?';
	var part='part=snippet';
	var maxRes='maxResults=50';
	var url_string = window.location.href;
	var url = new URL(url_string);
	var pId = url.searchParams.get("id");
	console.log(pId);
	var playListId=pId;
	var play='playlistId='+playListId;
	var key='key=AIzaSyDRhgAYgX00stG8z74M-gz5n4s_gIuwcy4';
	var nextPage='';
	var prevPage='';
	var vId=[];
	var label=[];
	var author;
	var description=[];

	function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getAndAppend(){
var url=link+'&'+nextPage+'&'+part+'&'+maxRes+'&'+play+'&'+key;
console.log(url);
var dataText=httpGet(url);
var data=JSON.parse(dataText);

nextPage='pageToken='+data.nextPageToken;
prevPage='pageToken='+data.prevPageToken;
author=data.items[0].snippet.channelTitle;

//console.log(nextPage);
//console.log(prevPage);
for (var i = 0; i < data.items.length; i++) {
	vId.push(data.items[i].snippet.resourceId.videoId);
	label.push(data.items[i].snippet.title);
	description.push(data.items[i].snippet.description);
}

if(nextPage!='pageToken=undefined'){
	getAndAppend();
}
//console.log(vId);
	var dom="";
	for (var i = 0; i < vId.length; i++) {
		dom=dom+"<li><a href=\"javascript: showVideo("+i+")\" class=\"link \"><i class=\"far fa-play-circle\"></i> &nbsp;"+label[i]+"</li>";
	}
	$("#videoLinks").empty();
	$("#videoLinks").append(dom);
	showVideo(0);
}
function showVideo(id){
	var video="https://www.youtube.com/embed/"+vId[id];
	var dom="<iframe style=\"border-radius:3px; margin:1vw 0vw; width:52vw; height:30vw;\" src=\""+video+"\"></iframe>";
	var head="<h2>"+label[id]+"</h2>";
	$("#title").empty();
  	$("#video").empty();
	$("#title").append(head);
	$("#video").prepend(dom);
	var statUrl='https://www.googleapis.com/youtube/v3/videos?part=statistics&id='+vId[id]+'&'+key;
	var dataText=httpGet(statUrl);
	var data=JSON.parse(dataText);

		var count="&emsp;<i class=\"fa fa-eye\"></i>&nbsp;"+data.items[0].statistics.viewCount;
		$("#count").empty();
		$("#author").empty();
		//console.log(author);
		$("#author").append(author);
		$("#count").append(count);
		$("#discription").empty();
		var desc = description[id];
		var maxLength = 150;
		var trimmedString = desc.substr(0, maxLength);
		var des="<p>"+trimmedString+"</p>";
		$("#discription").append(des);
		var pre=id-1;
		if(pre<0)
			pre=0;
		var next=id+1;
		if(next>vId.length-1)
			next=vId.length-1;
		$("#prev").attr("href", "javascript:showVideo("+pre+")");
		$("#next").attr("href", "javascript:showVideo("+next+")");
}
	$(function() {
   var links = $('a.link').click(function() {
       links.removeClass('active');
       $(this).addClass('active');
   });
});
