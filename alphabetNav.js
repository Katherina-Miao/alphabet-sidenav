(function(d){
	var inited = false; // 是否已经初始化
	
	/**
	 * 初始化方法
	 *
	 * @param {Array} 要添加导航的锚点列表
	 * @param {Object} 配置选项
	 * 
	 * 配置项：top {int|string}、bottom {int|string}、showIndicator {boolean}、useHash {boolean}
	 *
	 */
	function init(pAnchorList, pOptions){
		var i, list, listUl, listLi, indicator;
		
		// 如果已经初始化过，提醒并返回
		if(inited){
			console.log("alphabetList is already inited");
			return;
		}
		
		// 检查参数类型
		if(Object.prototype.toString.call(pAnchorList) !== "[object Array]"){
			throw new TypeError("first parameter of alphabet must be an Array");
		}
		if(typeof pOptions !== "undefined" && typeof pOptions !== "object"){
			throw new TypeError("second parameter of alphabet must be an Object");
		}
		
		
		// 新建列表
		list = myCreateElement("nav", "alphabetList")
		d.body.appendChild(list);
		listUl = myCreateElement("ul")
		list.appendChild(listUl);
		
		for(i = 0; i < pAnchorList.length; i++){
			// 检测数组元素类型
			if(typeof pAnchorList[i] !== "object") continue;
			listLi = myCreateElement("li", "alphabet", pAnchorList[i].display);
			listLi.setAttribute("to", pAnchorList[i].id);
			listUl.appendChild(listLi);	
		}
		
		// 处理位置属性
		if(pOptions && typeof pOptions.top !== "undefined"){
			if(typeof pOptions.top === "number"){
				list.style.top = pOptions.top + "px";
			}
			if(typeof pOptions.top === "string"){
				list.style.top = pOptions.top;
			}
		}
		if(pOptions && typeof pOptions.bottom !== "undefined"){
			if(typeof pOptions.bottom === "number"){
				list.style.bottom = pOptions.bottom + "px";
			}
			if(typeof pOptions.bottom === "string"){
				list.style.bottom = pOptions.bottom;
			}
		}
		if(typeof pOptions === "undefined" ||
				typeof pOptions.top === "undefined" &&
				typeof pOptions.bottom === "undefined"){
			list.style.top = "50%";
			list.style.marginTop = "-" + list.clientHeight/2 + "px";
		}
		
		// 新建指示器
		indicator = d.createElement("div");
		indicator.className = "alphabetIndicator";
		d.body.appendChild(indicator);
		
		//绑定事件
		list.addEventListener("touchstart", function(e){
			alphabetMove(e.changedTouches[0].clientY);
		})
		
		list.addEventListener("touchmove",function(e){
			e.preventDefault();
			alphabetMove(e.changedTouches[0].clientY);
		});

		if(typeof pOptions === "undefined" ||
				typeof pOptions.showIndicator === "undefined" ||
				pOptions.showIndicator){
			list.addEventListener("touchend", function(e){
				indicator.style.display = "none";
			});
		}
		
		function alphabetMove (pPositionY){
			var currentItem, targetItem;
			currentItem = d.elementFromPoint(d.body.clientWidth-1, pPositionY);
			if(!currentItem || currentItem.className.indexOf("alphabet") < 0) return;
			
			// 使用 url hash 进行跳转
			if(typeof pOptions !== "undefined" && 
					typeof pOptions.useHash !== "undefined" &&
					pOptions.useHash){
				location.hash = currentItem.getAttribute("to");
			}
			// 不使用 url hash 进行跳转
			else{
				targetItem = d.getElementById(currentItem.getAttribute("to"));
				if(targetItem){
					d.body.scrollTop += targetItem.getBoundingClientRect().top;
				}
			}
			
			// 显示指示器
			if(typeof pOptions === "undefined" ||
					typeof pOptions.showIndicator === "undefined" ||
					pOptions.showIndicator){
				indicator.innerText = currentItem.innerText;
				indicator.style.display = "block";
			}

		}
		
		// 初始化完毕
		inited = true;
	}
	
	function myCreateElement(pTagName, pClassName, pInnerText){
		var newElement = d.createElement(pTagName);
		if(pClassName){
			newElement.className = pClassName;
		}
		if(pInnerText){
			newElement.innerText = pInnerText;
		}
		return newElement;
	}
	
	window.alphabetNav = init;
})(document)