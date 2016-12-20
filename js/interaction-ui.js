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
		case "Mydata":
			return "#8e44ad";
			break;
		case "News":
			return "#2980b9";
			break;
		case "Metadata":
			return "#27ae60";
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
		case "Mydata":
			return "http://cigno.ve.ismar.cnr.it/uploaded/thumbs/004fb0a385a834aa31b03351f4eb1e1b.png";
			break;
		case "News":
			return "http://cigno.ve.ismar.cnr.it/uploaded/thumbs/002788ceb5d5a5be6ecba8a0f2a4fe82.png";
			break;
		case "Metadata":
			return "http://cigno.ve.ismar.cnr.it/uploaded/thumbs/08feea64443cb014d95cdc2a87cbbdae.png";
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
		case "Mydata":
			return "fa fa-bookmark text-img";
			break;
		case "News":
			return "fa fa-rss-square text-img";
			break;
		case "Metadata":
			return "fa fa-file-text text-img";
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
	storeWidget : function(position, id, xy, name) {
		var widget = {
			position : position,
			id : id,
			xy : xy,
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
		/*	for (var i = 0; i < storageType().length; i++) {
		 var item = storageType().getItem(storageType().key(i));
		 console.log(item);
		 }; */

		var i = 0;
		while (i < storage.countWidgets()) {
			i++;
			var widget = storage.getWidgetByPosition(i);
			if (widget != null && widget.name != 0) {
				if (widget.position == 1) {
					$('.head-b1 span').first().text(widget.name);
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(widget.name));
				};
				$('#draggable' + i).attr("name", widget.name);
				$('#draggable' + i).find("embed").attr("src", widgetOptions.image(widget.name));
				$('#draggable' + i).css("background-color", widgetOptions.color(widget.name));
				$('#draggable' + i).css("visibility", "visible");
				utils.appendToWidgetAttivi(widget.name);
				$('#' + widget.name).prev().attr("data-badge2", storage.countWidgetsByName(widget.name) + "x");
			} else {
				$('#draggable' + i).css("visibility", "hidden");
			};
		};
	}
};

var utils = {
	removeFromWidgetAttivi : function() {
		$('.widget-attivi a:eq(5)').remove();
	},
	appendToWidgetAttivi : function(str) {
		if ($('.widget-attivi a').length > 10) {
			utils.removeFromWidgetAttivi();
		}
		$('.widget-attivi a:first-child').after('<a href="#"><span class="badge" data-badge="0"></span><span id="' + str + '" class="awidg ' + widgetOptions.icon(str) + '"></span><br /><span class="icon-title">' + str + '</span></a>');
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
			if (widget == null || widget.name == 0) {
				return ids[i];
			}
		};
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
			bloccoPos.push($('#draggable' + i).position());
			bloccoWidth.push($('#draggable' + i).width());
			bloccoHeight.push($('#draggable' + i).height());
			ifbHeight.push($('#draggable' + i).find('.ifb').height());
		};
		data = [bloccoPos, bloccoWidth, bloccoHeight, ifbHeight];
		return data;
	}
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
			$('#' + id).find("embed").attr("src", widgetOptions.image(formerWidget.name));
			$('#' + id).attr("name", formerWidget.name);
			$('#' + id).css("background-color", widgetOptions.color(formerWidget.name));
			storage.storeWidget(i, id, $("#" + id).position(), formerWidget.name);
			if ($('#' + id).css("visibility") == "hidden") {
				$('#' + id).css("visibility", "visible");
			};
			if (formerWidget.name == 0) {
				$('#' + actualWidget.id).css("visibility", "hidden");
			};
			if ($('#' + id).css("display") == "none") {
				$('#' + id).css("display", "");
			}
		};
	};

	$('.head-b1 span').first().text(clickedId);
	$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(clickedId));

	if ($("#draggable1").position().top == 0 && $("#draggable1").position().left == 0 || $("#draggable1").position().top == -50 && $("#draggable1").position().left == 0 || $("#draggable1").position().top == 8 && $("#draggable1").position().left == 8) {
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

	if ($('#' + nId).css("visibility") == "hidden") {
		$('#' + nId).css("visibility", "visible");
	};
	if ($('#' + nId).css("display") == "none") {
		$('#' + nId).css("display", "");
	}
	$('#' + nId).find("embed").attr("src", widgetOptions.image(clickedId));
	$('#' + nId).attr("name", clickedId);
	$('#' + nId).css("background-color", widgetOptions.color(clickedId));
	storage.storeWidget(1, nId, {
		"top" : 0,
		"left" : 0
	}, clickedId);

	utils.appendToWidgetAttivi(clickedId);
	utils.addBadgeValue();
};

$(function() {
	storage.check();
	sessionStorage.clear();
	if (localStorage.getItem("session") == null) {
		localStorage.setItem("session", "s");
	};
	if (localStorage.getItem("session") == "l") {
		storage.reloadWidgets();
	};
	// localStorage.clear();
	if (window.location.href.indexOf("code") > -1) {
		$.ajax({
			headers : {
				'Accept' : 'application/json',
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			method : "POST",
			dataType : 'json',
			//url : "https://pub.orcid.org/oauth/token?client_id=APP-KCZPVLP7OMJ1P69L&client_secret=bec72dc4-c107-4fd7-8cda-12ac18ff5fd9&grant_type=authorization_code&code=" + getUrlVars()["code"] + "&redirect_uri=http://localhost/sp7-geogate-client"
			url : "https://pub.orcid.org/oauth/token?client_id=APP-KCZPVLP7OMJ1P69L&client_secret=bec72dc4-c107-4fd7-8cda-12ac18ff5fd9&grant_type=authorization_code&code=" + getUrlVars()["code"] + "&redirect_uri=http://geogate.sp7.irea.cnr.it/client"
		}).done(function(msg) {
			sparql(msg.orcid);
		});

		localStorage.setItem("session", "l");
		/*	if (localStorage.getItem("session") == "s") {
		$("#reload_session").dialog({
		closeOnEscape : false,
		buttons : {
		OK : function() {
		localStorage.setItem("session", "l");
		$(this).dialog("close");
		storage.reloadWidgets();
		},
		Annulla : function() {
		localStorage.setItem("session", "s");
		$('[id^=draggable]').css("visibility", "hidden");
		$('.widget-attivi').find('.badge2').attr("data-badge2", "0x");
		$('.wrap-icons').find('.badge2').attr("data-badge2", "0x");
		sessionStorage.clear();
		$(this).dialog("close");
		}
		},
		modal : true,
		show : "blind",
		hide : "explode"
		});
		}; */
		//	$("#user-login").removeClass("fa fa-user").addClass("fa fa-sign-out");
		$("#user-title").text("Logout");
	} else {
		//	$("#user-login").removeClass("fa fa-sign-out").addClass("fa fa-user");
		$("#user-title").text("Login");
	};

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
});

$(function() {
	$('[id^=draggable]').droppable({
		tolerance : "pointer",
		activate : function(event, ui) {
			draggableClass = ui.draggable.attr('class').substring(0, 5);
			switch (draggableClass) {
			case "cwidg":
				$("#" + ui.helper.context.id).css("zIndex", 999);
				break;
			case "block":
				$("#" + ui.draggable.context.id).css("zIndex", 999);
				draggedElement = ui.draggable.context.id.substring(9) - 1;
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
				var targetElement = event.target.id.substring(9) - 1;
				var targetId = event.target.id;
				var draggedId = ui.draggable.context.id;
				if (storage.getWidgetById(targetId) !== undefined) {
					$("#" + draggedId).draggable("option", "revert", false);
					var targetPosition = storage.getWidgetById(targetId).position;
					var draggedPosition = storage.getWidgetById(draggedId).position;
					var targetXy = storage.getWidgetById(targetId).xy;
					var draggedXy = storage.getWidgetById(draggedId).xy;
					$("#" + draggedId).animate(widgetData[0][targetElement]).css("position", "absolute");
					$("#" + targetId).animate(widgetData[0][draggedElement]);
					$("#" + draggedId).width(widgetData[1][targetElement]);
					$("#" + draggedId).height(widgetData[2][targetElement]);
					$("#" + targetId).width(widgetData[1][draggedElement]);
					$("#" + targetId).height(widgetData[2][draggedElement]);
					$("#" + draggedId).find('.ifb').height(widgetData[3][targetElement]);
					$("#" + targetId).find('.ifb').height(widgetData[3][draggedElement]);
					if (targetPosition == 1) {
						$('#bar').prependTo("#" + draggedId + " .content");
						$('.head-b1 span').first().text(ui.draggable.attr('name'));
						$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(ui.draggable.attr('name')));
					} else if (draggedPosition == 1) {
						$('#bar').prependTo("#" + targetId + " .content");
						$('.head-b1 span').first().text($(event.target).attr('name'));
						$('.menu-f1 span').removeClass().addClass(widgetOptions.icon($(event.target).attr('name')));
					}
					storage.storeWidget(targetPosition, draggedId, targetXy, ui.draggable.attr('name'));
					storage.storeWidget(draggedPosition, targetId, draggedXy, $(event.target).attr('name'));
					var i = 0;
					while (i < 6) {
						i++;
						if (i - 1 == draggedElement || i - 1 == targetElement) {
							continue;
						};
						$('#draggable' + i).animate(widgetData[0][i - 1]).css("position", "absolute");
						$('#draggable' + i).width(widgetData[1][i - 1]);
						$('#draggable' + i).height(widgetData[2][i - 1]);
					};
					break;
				} else {
					$("#" + draggedId).draggable("option", "revert", true);
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
});

$(function() {
	//add a new widget by click
	$('.cwidg').click(function() {
		addWidget($(this).attr('id'));
	});

	$('.user-press-login').click(function() {
		if (window.location.href.indexOf("code") > -1) {
			localStorage.setItem("session", "s");
			//window.location.href = "http://localhost/sp7-geogate-client";
			window.location.href = "http://geogate.sp7.irea.cnr.it/client";
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
				if (i != 1) {
					widget = storage.getWidgetByPosition(i);
				} else {
					if (nextWidget.name == 0) {
						$('.head-b1 span').first().text("");
					} else {
						$('.head-b1 span').first().text(nextWidget.name);
					}
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(nextWidget.name));
				}
				$('#' + widget.id).find("embed").attr("src", widgetOptions.image(nextWidget.name));
				$('#' + widget.id).attr("name", nextWidget.name);
				$('#' + widget.id).css("background-color", widgetOptions.color(nextWidget.name));
				storage.storeWidget(i, widget.id, widget.xy, nextWidget.name);
				if (nextWidget.name == 0) {
					$('#' + widget.id).css("visibility", "hidden");
				}
			} else {
				if (i == 1) {
					$('.head-b1 span').first().text("");
					$('#' + widget.id).css("visibility", "hidden");
				}
			};
		};
		if (storage.countWidgets() > 0) {
			$('#' + storage.getWidgetByPosition(storage.countWidgets()).id).css("visibility", "hidden");
			var position = storage.getWidgetByPosition(storage.countWidgets()).position;
			var id = storage.getWidgetByPosition(storage.countWidgets()).id;
			var value = {
				position : position,
				id : id,
				xy : 0,
				name : 0
			};
			storageType().setItem(storage.countWidgets(), JSON.stringify(value));
		};
		utils.addBadgeValue();
	});

	$(".widget-overlay span").click(function() {
		var mainWidgetId = storage.getWidgetByPosition(1).id;
		var mainWidgetName = storage.getWidgetByPosition(1).name;
		var mainElement = mainWidgetId.substring(9) - 1;
		var clickedWidgetId = $(this).parents(".block").attr("id");
		var clickedWidgetName = $(this).parents(".block").attr("name");
		var clickedElement = clickedWidgetId.substring(9) - 1;
		var widgetData = utils.getWidgetData();

		if (storage.getWidgetById(mainWidgetId) !== undefined) {
			$("#" + clickedWidgetId).draggable("option", "revert", false);
			var clickedPosition = storage.getWidgetById(clickedWidgetId).position;
			var clickedXy = storage.getWidgetById(clickedWidgetId).xy;
			$("#" + clickedWidgetId).animate(widgetData[0][mainElement]).css("position", "absolute");
			$("#" + mainWidgetId).animate(widgetData[0][clickedElement]);
			$("#" + clickedWidgetId).width(widgetData[1][mainElement]);
			$("#" + clickedWidgetId).height(widgetData[2][mainElement]);
			$("#" + mainWidgetId).width(widgetData[1][clickedElement]);
			$("#" + mainWidgetId).height(widgetData[2][clickedElement]);
			$("#" + clickedWidgetId).find('.ifb').height(ifbHeight[mainElement]);
			$("#" + mainWidgetId).find('.ifb').height(ifbHeight[clickedElement]);
			$('#bar').prependTo("#" + clickedWidgetId + " .content");
			$('.head-b1 span').first().text(clickedWidgetName);
			$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(clickedWidgetName));
			storage.storeWidget(1, clickedWidgetId, "{top:0, left:0}", clickedWidgetName);
			storage.storeWidget(clickedPosition, mainWidgetId, clickedXy, mainWidgetName);

			var i = 0;
			while (i < 6) {
				i++;
				if (i - 1 == clickedElement || i - 1 == mainElement) {
					continue;
				};
				$('#draggable' + i).animate(widgetData[0][i - 1]).css("position", "absolute");
				$('#draggable' + i).width(widgetData[1][i - 1]);
				$('#draggable' + i).height(widgetData[2][i - 1]);
			};
		} else {
			$("#" + clickedWidgetId).draggable("option", "revert", true);
		};
	});
});

function openORCID() {
	//window.location.href = 'https://orcid.org/oauth/authorize?client_id=APP-KCZPVLP7OMJ1P69L&response_type=code&scope=/authenticate&redirect_uri=http://localhost/sp7-geogate-client&show_login=true';
	window.location.href = 'https://orcid.org/oauth/authorize?client_id=APP-KCZPVLP7OMJ1P69L&response_type=code&scope=/authenticate&redirect_uri=http://geogate.sp7.irea.cnr.it/client&show_login=true';
	$("#user_login").dialog("close");
};