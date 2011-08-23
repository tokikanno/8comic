/*
	8comic comic downloader.
	(c) toki, 2011/7/26
*/

/*
url = "http://img"+d.sid+".8comic.com/"+d.did+"/"+itemid+"/"+d.num+"/"+img+".jpg";
*/

function get_itemid_from_dom(){
	m = /itemid\s*=\s*([^;]+);/m.exec(document.body.innerHTML);
	if (m.length==2)
		return m[1];
	else
		return "";
}

function get_codes_from_dom(){
	m = /codes\s*=\s*([^;]+;)/m.exec(document.body.innerHTML);
	if (m.length==2)
		return eval(m[1]);
	else
		return [];
}

function get_img_str(p, code){
	img = p.toString();
	while (img.length<3){
		img = '0' + img;
	}
	m=(parseInt((p-1)/10)%10)+(((p-1)%10)*3);
	img+="_"+code.substring(m,m+3);
	return img;
}

function is_windows(){
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("win") != -1)
		return true;
	else
		return false;
}

function get_8comic_links(codes, itemid) {
	title = document.title.split(' ')[0];
	sep = '/';
	
	is_win = is_windows();
/*
	if (!is_win)
		sep = '/';
*/
	decodes = [];
	for	(i=0; i<codes.length; i++){
		sp = codes[i].split(' ');
		decodes.push(
		{
			num: sp[0],
			sid: sp[1],
			did: sp[2],
			page: sp[3],
			code: sp[4]
		});
	}
	/*
	chaps = []
	for (i=0; i<decodes.length; i++){
		d = decodes[i];
		imgs = [];
		chaps.push(imgs);
		for (p=1; p<=d.page; p++){	
			img = get_img_str(p, d.code);
			url = "http://img"+d.sid+".8comic.com/"+d.did+"/"+itemid+"/"+d.num+"/"+img+".jpg";
			imgs.push(url);
		}
	}
	*/

	//curls = []
	dlist = [];
	
	config = "# " + title + "\n";
	for (i=0; i<decodes.length; i++){
		d = decodes[i];
		config += "# " + d.num + "\n";
		
		url_prefix = "http://img"+d.sid+".8comic.com/"+d.did+"/"+itemid+"/"+d.num+"/";
		url_suffix = ".jpg";
		urls = [];
		
		url = "http://img"+d.sid+".8comic.com/"+d.did+"/"+itemid+"/"+d.num+"/{"
		for (p=1; p<=d.page; p++){	
			img = get_img_str(p, d.code);
			url += img;
			
			urls.push(img);
			
			if (p!=d.page)
				url += ',';
		}

		url += "}.jpg";
		config += url + '\n';
		
		ch_str = d.num.toString();
		while (ch_str.length<4)
			ch_str = '0' + ch_str;

		dir = title + sep + ch_str;
		// if (is_win){
			// config += ' dir=' + itemid + sep + ch_str + '\n'
		// }else{
			 config += ' dir=' + title + sep + ch_str + '\n'
		// }
		
		dlist.push({itemNo:d.num, urls: urls, dir: dir, prefix: url_prefix, suffix: url_suffix});
/*		
		config += 'url = "' + url + '"\n'
		config += 'create-dirs\n'
		
		ch_str = d.num.toString();
		while (ch_str.length<4)
			ch_str = '0' + ch_str;
		
		config += 'output = "' + title + sep + ch_str + sep + '#1.jpg"\n'
		config += '\n'
*/
	}
/*
	ibox = document.createElement('textarea');
	ibox.rows = 10;
	ibox.cols = 50;
	ibox.style.cssText = "position:fixed;top:0px;left:0px;"
	ibox.textContent = config;
	document.body.appendChild(ibox);
*/	
	return dlist;
	// return dlist;
}

port = chrome.extension.connect();
config = get_8comic_links(get_codes_from_dom(), get_itemid_from_dom());
chrome.extension.sendRequest(config);