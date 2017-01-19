/**
 * @author Diego Migliavacca (https://github.com/diegomigliavacca)
 * @copyright SP7 Ritmare (http://www.ritmare.it)
 */

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
	utils.loadMenu(clickedId);

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
		var dId = ui.helper.context.id;
		$("#" + dId).css("zIndex", 999);
		draggableClass = ui.draggable.attr('class').substring(0, 5);
		switch (draggableClass) {
		case "cwidg":
			break;
		case "block":
			$("#" + ui.draggable.context.id).css("visibility", "hidden");
			draggedElement = dId.substring(9) - 1;
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
				var draggedName = ui.draggable.attr('name');
				var targetName = $(event.target).attr('name');
				if (targetPosition == 1) {
					$('.head-b1 span').first().text(draggedName);
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(draggedName));
					utils.loadMenu(draggedName);
				} else if (draggedPosition == 1) {
					$('.head-b1 span').first().text(targetName);
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(targetName));
					utils.loadMenu(targetName);
				}
				wdrId.attr("name", targetName);
				wdrId.find("embed").attr("src", widgetOptions.image(targetName));
				wdrId.css("background-color", widgetOptions.color(targetName));
				wtaId.attr("name", draggedName);
				wtaId.find("embed").attr("src", widgetOptions.image(draggedName));
				wtaId.css("background-color", widgetOptions.color(draggedName));
				storage.storeWidget(targetPosition, targetId, draggedName);
				storage.storeWidget(draggedPosition, draggedId, targetName);
				utils.reloadWidgetAttivi();
				break;
			} else {
				wdrId.draggable("option", "revert", true);
			}
		}
	},
	deactivate : function(event, ui) {
		$("#" + ui.draggable.context.id).css("visibility", "visible");
		$("#" + ui.helper.context.id).css("zIndex", 99);
		$('.widget-invisible-overlay', '#' + event.target.id).hide();
	}
});

$('.cwidg').draggable({
	cursor : "pointer",
	helper : "clone",
	revert : "invalid"
});

$('.block').draggable({
	cursor : "move",
	helper : "clone",
	cursorAt : {
		top : 5,
		left : 5
	},
	revert : "invalid"
});

$(".block").on("drag", function(event, ui) {
	ui.helper.css("width", "56px");
	ui.helper.css("height", "56px");
	if (ui.helper.context.id == "draggable1") {
		ui.helper.find("#bar").css("display", "none");
	};
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

$(".cwidg").tooltip({
	content : function() {
		return widgetOptions.tooltip(this.id);
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
				if (nextWidget.name != 0) {
					$('.head-b1 span').first().text(nwName);
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(nwName));
					utils.loadMenu(nwName);
				}
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
	var cwId = $("#" + clickedWidgetId);
	var mwId = $("#" + mainWidgetId);

	if (storage.getWidgetById(mainWidgetId) !== undefined) {
		$("#" + clickedWidgetId).draggable("option", "revert", false);
		var clickedPosition = storage.getWidgetById(clickedWidgetId).position;
		cwId.attr("name", mainWidgetName);
		cwId.find("embed").attr("src", widgetOptions.image(mainWidgetName));
		cwId.css("background-color", widgetOptions.color(mainWidgetName));
		mwId.attr("name", clickedWidgetName);
		mwId.find("embed").attr("src", widgetOptions.image(clickedWidgetName));
		mwId.css("background-color", widgetOptions.color(clickedWidgetName));
		$('.head-b1 span').first().text(clickedWidgetName);
		$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(clickedWidgetName));
		utils.loadMenu(clickedWidgetName);
		storage.storeWidget(1, mainWidgetId, clickedWidgetName);
		storage.storeWidget(clickedPosition, clickedWidgetId, mainWidgetName);
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