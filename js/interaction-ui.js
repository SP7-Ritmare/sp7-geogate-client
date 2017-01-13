/**
 * @author Diego Migliavacca (https://github.com/diegomigliavacca)
 * @copyright SP7 Ritmare (http://www.ritmare.it)
 */

function storageType() {
	if (localStorage.getItem("session") == "l") {
		return localStorage;
	} else {
		return sessionStorage;
	}
};

var widgetOptions = {
	color : function(string) {
		switch (string) {
		case "Discovery":
			return "#d4ac0d";
			break;
		case "Map":
			return "#e74c3c";
			break;
		case "My data":
			return "#8e44ad";
			break;
		case "Feeds":
			return "#2980b9";
			break;
		case "Metadata":
			return "#27ae60";
			break;
		case "About":
			return "#7f8c8d";
			break;
		default:
			return "#ffffff";
		}
	},
	image : function(string) {
		switch (string) {
		case "Discovery":
			return "http://cigno.ve.ismar.cnr.it/uploaded/thumbs/map-28bc6852-6871-11e4-80d1-005056bd48e7-thumb.png";
			break;
		case "Map":
			return "http://cigno.ve.ismar.cnr.it/maps/1247/embed";
			break;
		case "My data":
			return "http://cigno.ve.ismar.cnr.it/uploaded/thumbs/004fb0a385a834aa31b03351f4eb1e1b.png";
			break;
		case "Feeds":
			return "http://cigno.ve.ismar.cnr.it/uploaded/thumbs/002788ceb5d5a5be6ecba8a0f2a4fe82.png";
			break;
		case "Metadata":
			return "http://cigno.ve.ismar.cnr.it/uploaded/thumbs/08feea64443cb014d95cdc2a87cbbdae.png";
			break;
		case "About":
			return "http://sp7.irea.cnr.it/wiki/index.php/Portal_development_-_widget_autenticazione/gestione_profilo";
			break;
		default:
			return "";
		}
	},
	icon : function(string) {
		switch (string) {
		case "Discovery":
			return "fa fa-search text-img";
			break;
		case "Map":
			return "fa fa-map text-img";
			break;
		case "My data":
			return "fa fa-bookmark text-img";
			break;
		case "Feeds":
			return "fa fa-rss-square text-img";
			break;
		case "Metadata":
			return "fa fa-file-text text-img";
			break;
		case "About":
			return "fa fa-info text-img";
			break;
		default:
			return "";
		}
	}
};

var storage = {
	check : function() {
		if ( typeof (Storage) == "undefined") {
			$("#browser_not_supported").dialog({
				buttons : {
					OK : function() {
						$(this).dialog("close");
					}
				},
				modal : true,
				show : "blind",
				hide : "explode"
			});
		}
	},
	storeWidget : function(position, id, name) {
		var widget = {
			position : position,
			id : id,
			name : name
		};
		var record = JSON.stringify(widget);
		storageType().setItem(position, record);
	},
	countWidgets : function() {
		var length = 0;
		for (var i in storageType()) {
			if ($.isNumeric(i)) {
				length = length + 1;
			};
		};
		return length;
	},
	countWidgetsWithout0 : function() {
		var length = 0;
		for (var i in storageType()) {
			val = storageType().getItem(i);
			if (val != null && $.isNumeric(i)) {
				if (JSON.parse(val).name != 0) {
					length = length + 1;
				};
			};
		};
		return length;
	},
	countWidgetsByName : function(name) {
		var count = 0;
		for (var i in storageType()) {
			val = storageType().getItem(i);
			if (val != null && $.isNumeric(i)) {
				if (JSON.parse(val).name == name) {
					count = count + 1;
				};
			};
		};
		return count;
	},
	getWidgetByPosition : function(pos) {
		return JSON.parse(storageType().getItem(pos));
	},
	getWidgetById : function(id) {
		var i = 0;
		while (i < storage.countWidgets()) {
			i++;
			var widget = storage.getWidgetByPosition(i);
			if (widget != null) {
				if (widget.id == id) {
					return widget;
				};
			};
		};
	},
	reloadWidgets : function() {
		/* var st = storageType();
		 for (var i = 0; i < st.length; i++) {
		 var item = st.getItem(st.key(i));
		 console.log(item);
		 }; */

		var i = 0;
		while (i < storage.countWidgets()) {
			i++;
			var widget = storage.getWidgetByPosition(i);
			var wId = $('#draggable' + i);
			if (widget != null && widget.name != 0) {
				var wName = widget.name;
				if (widget.position == 1) {
					$('.head-b1 span').first().text(wName);
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(wName));
				};
				wId.attr("name", wName);
				wId.find("embed").attr("src", widgetOptions.image(wName));
				wId.css("background-color", widgetOptions.color(wName));
				wId.css("visibility", "visible");
				utils.appendToWidgetAttivi(wName);
				$('#' + wName).prev().attr("data-badge2", storage.countWidgetsByName(wName) + "x");
			} else {
				wId.css("visibility", "hidden");
			};
		};
	}
};

var utils = {
	removeFromWidgetAttivi : function(str) {
		if (str == "beforeAppending") {
			$('.widget-attivi a:eq(5)').remove();
		} else {
			var cw = storage.countWidgetsWithout0() + 1;
			$('.widget-attivi a:eq(' + cw + ')').remove();
		}
	},
	appendToWidgetAttivi : function(str) {
		if ($('#widget-attivi.widget-attivi a').length > 5 || $('#widget-attivi-top.widget-attivi a').length > 5) {
			utils.removeFromWidgetAttivi("beforeAppending");
		}
		$('.widget-attivi a:first-child').after('<a href="#"><span class="badge" data-badge="0"></span><span id="' + str + '" class="awidg ' + widgetOptions.icon(str) + '"></span><br /><span class="icon-title">' + str + '</span></a>');
	},
	reloadWidgetAttivi : function() {
		$('.widget-attivi a:gt(0)').remove();
		var i = storage.countWidgets() + 1;
		while (--i) {
			var str = storage.getWidgetByPosition(i).name;
			$('.widget-attivi a:first-child').after('<a href="#"><span class="badge" data-badge="0"></span><span id="' + str + '" class="awidg ' + widgetOptions.icon(str) + '"></span><br /><span class="icon-title">' + str + '</span></a>');
		}
	},
	addBadgeValue : function() {
		$('.wrap-icons').find('.badge2').each(function() {
			$(this).attr("data-badge2", storage.countWidgetsByName($(this).parent().find(".cwidg").attr("id")) + "x");
		});
	},
	findMissingId : function() {
		var ids = ["draggable1", "draggable2", "draggable3", "draggable4", "draggable5"];
		for (var i = 0; i < ids.length; i++) {
			var widget = storage.getWidgetById(ids[i]);
			if (widget == null) {
				return ids[i];
			}
		};
		/*	var pos = ["1", "2", "3", "4", "5"];
		 for (var i = 0; i < pos.length; i++) {
		 var widget = storage.getWidgetByPosition(pos[i]);
		 console.log(pos[i]);
		 if (widget != null && widget.name == 0) {
		 var id = storage.getWidgetByPosition(pos[i]).id;
		 console.log(id);
		 return id;
		 }
		 }; */

	},
	getWidgetData : function() {
		bloccoPos = [];
		bloccoWidth = [];
		bloccoHeight = [];
		ifbHeight = [];
		data = [];
		var i = 0;
		while (i < 5) {
			i++;
			var wId = $('#draggable' + i);
			bloccoPos.push(wId.position());
			bloccoWidth.push(wId.width());
			bloccoHeight.push(wId.height());
			ifbHeight.push(wId.find('.ifb').height());
		};
		data = [bloccoPos, bloccoWidth, bloccoHeight, ifbHeight];
		return data;
	},
	endpoint : "http://geogate.sp7.irea.cnr.it/fuseki/portal/query"
};

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = value;
	});
	return vars;
};

function addWidget(clickedId) {
	//add a new widget by drag & drop or click
	var i = 6;
	while (--i) {
		var formerWidget = storage.getWidgetByPosition(i - 1);
		if (formerWidget != null) {
			var actualWidget = storage.getWidgetByPosition(i);
			if (actualWidget == null) {
				id = utils.findMissingId();
			} else {
				id = actualWidget.id;
			};
			var wId = $('#' + id);
			var fwName = formerWidget.name;
			wId.find("embed").attr("src", widgetOptions.image(fwName));
			wId.attr("name", formerWidget.name);
			wId.css("background-color", widgetOptions.color(fwName));
			storage.storeWidget(i, id, fwName);
			if (wId.css("visibility") == "hidden") {
				wId.css("visibility", "visible");
			};
			if (actualWidget != null && fwName == 0) {
				$('#' + actualWidget.id).css("visibility", "hidden");
			};
			if (wId.css("display") == "none") {
				wId.css("display", "");
			}
		};
	};

	$('.head-b1 span').first().text(clickedId);
	$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(clickedId));

	var d1Pos = $("#draggable1").position();
	if (d1Pos.top == 0 && d1Pos.left == 0 || d1Pos.top == -50 && d1Pos.left == 0 || d1Pos.top == 8 && d1Pos.left == 8) {
		var nId = "draggable1";
	} else if ($("#draggable2").position().top == 0 && $("#draggable2").position().left == 0 || $("#draggable2").position().top == -50 && $("#draggable2").position().left == 0 || $("#draggable2").position().top == 8 && $("#draggable2").position().left == 8) {
		var nId = "draggable2";
	} else if ($("#draggable3").position().top == 0 && $("#draggable3").position().left == 0 || $("#draggable3").position().top == -50 && $("#draggable3").position().left == 0 || $("#draggable3").position().top == 8 && $("#draggable3").position().left == 8) {
		var nId = "draggable3";
	} else if ($("#draggable4").position().top == 0 && $("#draggable4").position().left == 0 || $("#draggable4").position().top == -50 && $("#draggable4").position().left == 0 || $("#draggable4").position().top == 8 && $("#draggable4").position().left == 8) {
		var nId = "draggable4";
	} else if ($("#draggable5").position().top == 0 && $("#draggable5").position().left == 0 || $("#draggable5").position().top == -50 && $("#draggable5").position().left == 0 || $("#draggable5").position().top == 8 && $("#draggable5").position().left == 8) {
		var nId = "draggable5";
	}

	var wnId = $('#' + nId);
	if (wnId.css("visibility") == "hidden") {
		wnId.css("visibility", "visible");
	};
	if (wnId.css("display") == "none") {
		wnId.css("display", "");
	}
	wnId.find("embed").attr("src", widgetOptions.image(clickedId));
	wnId.attr("name", clickedId);
	wnId.css("background-color", widgetOptions.color(clickedId));
	storage.storeWidget(1, nId, clickedId);

	utils.appendToWidgetAttivi(clickedId);
	utils.addBadgeValue();
};

$('[id^=draggable]').droppable({
	tolerance : "pointer",
	activate : function(event, ui) {
		draggableClass = ui.draggable.attr('class').substring(0, 5);
		switch (draggableClass) {
		case "cwidg":
			$("#" + ui.helper.context.id).css("zIndex", 999);
			break;
		case "block":
			var dId = ui.draggable.context.id;
			$("#" + dId).css("zIndex", 999);
			draggedElement = dId.substring(9) - 1;
			widgetData = utils.getWidgetData();
			$('.widget-invisible-overlay', '#' + event.target.id).show();
			break;
		};
	},
	drop : function(event, ui) {
		switch (draggableClass) {
		case "cwidg":
			//add a new widget by drag & drop
			addWidget(ui.draggable.context.id);
			break;
		case "block":
			//change the widget position by drag & drop
			var targetId = event.target.id;
			var targetElement = targetId.substring(9) - 1;
			var draggedId = ui.draggable.context.id;
			var wdrId = $("#" + draggedId);
			var wtaId = $("#" + targetId);
			if (storage.getWidgetById(targetId) !== undefined) {
				wdrId.draggable("option", "revert", false);
				var targetPosition = storage.getWidgetById(targetId).position;
				var draggedPosition = storage.getWidgetById(draggedId).position;
				wdrId.animate(widgetData[0][targetElement]).css("position", "absolute");
				wtaId.animate(widgetData[0][draggedElement]);
				wdrId.width(widgetData[1][targetElement]);
				wdrId.height(widgetData[2][targetElement]);
				wtaId.width(widgetData[1][draggedElement]);
				wtaId.height(widgetData[2][draggedElement]);
				wdrId.find('.ifb').height(widgetData[3][targetElement]);
				wtaId.find('.ifb').height(widgetData[3][draggedElement]);
				var draggedName = ui.draggable.attr('name');
				var targetName = $(event.target).attr('name');
				if (targetPosition == 1) {
					$('#bar').prependTo("#" + draggedId + " .content");
					$('.head-b1 span').first().text(draggedName);
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(draggedName));
				} else if (draggedPosition == 1) {
					$('#bar').prependTo("#" + targetId + " .content");
					$('.head-b1 span').first().text(targetName);
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(targetName));
				}
				storage.storeWidget(targetPosition, draggedId, draggedName);
				storage.storeWidget(draggedPosition, targetId, targetName);
				var i = 0;
				while (i < 6) {
					i++;
					if (i - 1 == draggedElement || i - 1 == targetElement) {
						continue;
					};
					var drId = $('#draggable' + i);
					drId.animate(widgetData[0][i - 1]).css("position", "absolute");
					drId.width(widgetData[1][i - 1]);
					drId.height(widgetData[2][i - 1]);
				};
				utils.reloadWidgetAttivi();
				break;
			} else {
				wdrId.draggable("option", "revert", true);
			}
		}
	},
	deactivate : function(event, ui) {
		$("#" + ui.draggable.context.id).css("zIndex", 99);
		$('.widget-invisible-overlay', '#' + event.target.id).hide();
	}
});

$('.cwidg').draggable({
	cursor : "crosshair",
	helper : "clone",
	revert : "invalid"
});

$('.block').draggable({
	cursor : "move",
	revert : "invalid"
});

$('.block').hover(function() {
	if (storage.getWidgetById(this.id) != undefined && storage.getWidgetById(this.id).position != "1") {
		$('.widget-overlay', this).show();
	}
}, function() {
	$('.widget-overlay', this).hide();
});

$(".widget-overlay span").tooltip({
	position : {
		my : "right-15 bottom+35"
	}
});

//add a new widget by click
$('.cwidg').click(function() {
	addWidget($(this).attr('id'));
});

$('.user-press-login').click(function() {
	if (window.location.href.indexOf("code") > -1) {
		localStorage.setItem("session", "s");
		//window.location.href = "http://localhost/sp7-geogate-client";
		window.location.href = "http://geogate.sp7.irea.cnr.it/client";
		localStorage.removeItem("userPicture");
		$("#user-title").text("Login");
	} else {
		$("#user_login").dialog({
			modal : true,
			show : "blind",
			hide : "explode"
		});
	}
});

$('.full-f1').click(function() {
	$(this).closest('.block').toggleClass('fullscreen');
});

$('.close-f1').click(function() {
	var widget = storage.getWidgetByPosition(1);
	storageType().removeItem("1");
	utils.addBadgeValue();
	var i = 0;
	while (i < 5) {
		i++;
		var nextWidget = storage.getWidgetByPosition(i + 1);
		if (nextWidget != null) {
			var nwName = nextWidget.name;
			if (i != 1) {
				widget = storage.getWidgetByPosition(i);
			} else {
				if (nextWidget.name == 0) {
					$('.head-b1 span').first().text("");
				} else {
					$('.head-b1 span').first().text(nwName);
				}
				$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(nwName));
			}
			$('#' + widget.id).find("embed").attr("src", widgetOptions.image(nwName));
			$('#' + widget.id).attr("name", nwName);
			$('#' + widget.id).css("background-color", widgetOptions.color(nwName));
			storage.storeWidget(i, widget.id, nwName);
			if (nwName == 0) {
				$('#' + widget.id).css("visibility", "hidden");
			}
		} else {
			if (i == 1) {
				$('.head-b1 span').first().text("");
				//	$('#' + widget.id).css("visibility", "hidden");
			}
		};
	};
	var stcW = storage.countWidgets();
	if (stcW > 0) {
		$('#' + storage.getWidgetByPosition(stcW).id).css("visibility", "hidden");
		var position = storage.getWidgetByPosition(stcW).position;
		var id = storage.getWidgetByPosition(stcW).id;
		var value = {
			position : position,
			id : id,
			name : 0
		};
		storageType().setItem(stcW, JSON.stringify(value));
	};

	utils.addBadgeValue();
	utils.removeFromWidgetAttivi("onClosing");
});

$(".widget-overlay span").click(function() {
	var widget1 = storage.getWidgetByPosition(1);
	var mainWidgetId = widget1.id;
	var mainWidgetName = widget1.name;
	var mainElement = mainWidgetId.substring(9) - 1;
	var blockElement = $(this).parents(".block");
	var clickedWidgetId = blockElement.attr("id");
	var clickedWidgetName = blockElement.attr("name");
	var clickedElement = clickedWidgetId.substring(9) - 1;
	var widgetData = utils.getWidgetData();
	var cwId = $("#" + clickedWidgetId);
	var mwId = $("#" + mainWidgetId);

	if (storage.getWidgetById(mainWidgetId) !== undefined) {
		$("#" + clickedWidgetId).draggable("option", "revert", false);
		var clickedPosition = storage.getWidgetById(clickedWidgetId).position;
		cwId.animate(widgetData[0][mainElement]).css("position", "absolute");
		mwId.animate(widgetData[0][clickedElement]);
		cwId.width(widgetData[1][mainElement]);
		cwId.height(widgetData[2][mainElement]);
		mwId.width(widgetData[1][clickedElement]);
		mwId.height(widgetData[2][clickedElement]);
		cwId.find('.ifb').height(ifbHeight[mainElement]);
		mwId.find('.ifb').height(ifbHeight[clickedElement]);
		$('#bar').prependTo("#" + clickedWidgetId + " .content");
		$('.head-b1 span').first().text(clickedWidgetName);
		$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(clickedWidgetName));
		storage.storeWidget(1, clickedWidgetId, clickedWidgetName);
		storage.storeWidget(clickedPosition, mainWidgetId, mainWidgetName);

		var i = 0;
		while (i < 6) {
			i++;
			if (i - 1 == clickedElement || i - 1 == mainElement) {
				continue;
			};
			var dId = $('#draggable' + i);
			dId.animate(widgetData[0][i - 1]).css("position", "absolute");
			dId.width(widgetData[1][i - 1]);
			dId.height(widgetData[2][i - 1]);
		};
	} else {
		cwId.draggable("option", "revert", true);
	};
	utils.reloadWidgetAttivi();
});

function openORCID() {
	//window.location.href = 'https://orcid.org/oauth/authorize?client_id=APP-KCZPVLP7OMJ1P69L&response_type=code&scope=/authenticate&redirect_uri=http://localhost/sp7-geogate-client&show_login=true';
	window.location.href = 'https://orcid.org/oauth/authorize?client_id=APP-KCZPVLP7OMJ1P69L&response_type=code&scope=/authenticate&redirect_uri=http://geogate.sp7.irea.cnr.it/client&show_login=true';
	$("#user_login").dialog("close");
};

storage.check();
sessionStorage.clear();
// localStorage.clear();
if (localStorage.getItem("session") == null) {
	localStorage.setItem("session", "s");
} else if (localStorage.getItem("session") == "l" && localStorage.getItem("sessionName") != null) {
	storage.reloadWidgets();
}
