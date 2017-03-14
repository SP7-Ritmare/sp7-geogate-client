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
			var fwName = formerWidget.name;
			storage.storeWidget(i, fwName);
			var wId = $('#draggable' + i);
			wId.find("iframe").attr("src", widgetOptions.image(fwName));
			wId.attr("name", fwName);
			wId.css("background-color", widgetOptions.color(fwName));
			if (wId.css("visibility") == "hidden") {
				wId.css("visibility", "visible");
			};
			if (wId.css("display") == "none") {
				wId.css("display", "");
			};
		};
	};

	storage.storeWidget(1, clickedId);
	var wnId = $('#draggable1');
	if (wnId.css("visibility") == "hidden") {
		wnId.css("visibility", "visible");
	};
	if (wnId.css("display") == "none") {
		wnId.css("display", "");
	};
	$('.head-b1 span').first().text(clickedId);
	$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(clickedId));
	utils.loadMenu(clickedId);
	wnId.find("iframe").attr("src", widgetOptions.image(clickedId));
	wnId.attr("name", clickedId);
	wnId.css("background-color", widgetOptions.color(clickedId));

	utils.reloadWidgetAttivi();
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
			var targetName = $(event.target).attr('name');
			var draggedName = ui.draggable.attr('name');
			var targetId = event.target.id;
			var draggedId = ui.draggable.context.id;
			var wdrId = $("#" + draggedId);
			var wtaId = $("#" + targetId);
			if (storage.getWidgetByName(targetName) !== undefined) {
				wdrId.draggable("option", "revert", false);
				var targetPosition = storage.getWidgetByName(targetName).position;
				var draggedPosition = storage.getWidgetByName(draggedName).position;
				storage.storeWidget(targetPosition, draggedName);
				storage.storeWidget(draggedPosition, targetName);
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
				wdrId.find("iframe").attr("src", widgetOptions.image(targetName));
				wdrId.css("background-color", widgetOptions.color(targetName));
				wtaId.attr("name", draggedName);
				wtaId.find("iframe").attr("src", widgetOptions.image(draggedName));
				wtaId.css("background-color", widgetOptions.color(draggedName));
				utils.reloadWidgetAttivi();
				break;
			} else {
				wdrId.draggable("option", "revert", true);
			}
		}
	},
	deactivate : function(event, ui) {
		$("#" + ui.draggable.context.id).css("visibility", "visible");
		$("#" + ui.helper.context.id).css("zIndex", "");
		$('.widget-invisible-overlay', '#' + event.target.id).hide();
	}
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
	if ($(this).attr('id') != "draggable1") {
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
$(document).on('click', '.cwidg', function() {
	addWidget(this.id);
});

//logout + login dialog
$('.user-press-login').click(function() {
	if (window.location.href.indexOf("code") > -1) {
		localStorage.setItem("session", "s");
		//window.location.href = "http://localhost/sp7-geogate-client";
		window.location.href = "http://geogate.sp7.irea.cnr.it/client";
		localStorage.removeItem("userPicture");
		$("#user-title").text("Login");
		localStorage.removeItem("sessionOwner");
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
	var i = 0;
	while (i < storage.countWidgets()) {
		i++;
		var nextWidget = storage.getWidgetByPosition(i + 1);
		if (nextWidget != null) {
			var widget = storage.getWidgetByPosition(i);
			var nwName = nextWidget.name;
			storage.storeWidget(i, nwName);
			$('#draggable' + (i + 1)).css("visibility", "hidden");
			$('#draggable' + (i + 1)).attr("name", "");
			if (i == 1) {
				$('.head-b1 span').first().text(nwName);
				$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(nwName));
				utils.loadMenu(nwName);
			}
			$('#draggable' + i).find("iframe").attr("src", widgetOptions.image(nwName));
			$('#draggable' + i).attr("name", nwName);
			$('#draggable' + i).css("background-color", widgetOptions.color(nwName));
			$('#draggable' + i).css("visibility", "visible");
		} else {
			if (i == 1) {
				$('#draggable1').css("visibility", "hidden");
				$('#draggable1').attr("name", "");
			}
		};
	};
	storageType().removeItem(storage.countWidgets());

	utils.addBadgeValue();
	utils.removeFromWidgetAttivi("onClosing");
});

function switchWidgets(clickedWidgetName) {
	var mainWidgetName = storage.getWidgetByPosition(1).name;
	var clickedPosition = storage.getWidgetByName(clickedWidgetName).position;
	var cwId = $("#draggable" + clickedPosition);
	var mwId = $("#draggable1");
	if (storage.getWidgetByPosition("1") !== undefined) {
		$("#draggable" + clickedPosition).draggable("option", "revert", false);
		storage.storeWidget(1, clickedWidgetName);
		storage.storeWidget(clickedPosition, mainWidgetName);
		cwId.attr("name", mainWidgetName);
		cwId.find("iframe").attr("src", widgetOptions.image(mainWidgetName));
		cwId.css("background-color", widgetOptions.color(mainWidgetName));
		mwId.attr("name", clickedWidgetName);
		mwId.find("iframe").attr("src", widgetOptions.image(clickedWidgetName));
		mwId.css("background-color", widgetOptions.color(clickedWidgetName));
		$('.head-b1 span').first().text(clickedWidgetName);
		$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(clickedWidgetName));
		utils.loadMenu(clickedWidgetName);
	} else {
		cwId.draggable("option", "revert", true);
	};
	utils.reloadWidgetAttivi();
};

$(".widget-overlay span").click(function() {
	var clickedWidgetName = $(this).parents(".block").attr("name");
	switchWidgets(clickedWidgetName);
});

function clickSwitchWidgets(pos) {
	if (pos != 1) {
		var clickedWidgetName = storage.getWidgetByPosition(pos).name;
		switchWidgets(clickedWidgetName);
	}
};

function openORCID() {
	//window.location.href = 'https://orcid.org/oauth/authorize?client_id=APP-KCZPVLP7OMJ1P69L&response_type=code&scope=/authenticate&redirect_uri=http://localhost/sp7-geogate-client&show_login=true';
	window.location.href = 'https://orcid.org/oauth/authorize?client_id=APP-KCZPVLP7OMJ1P69L&response_type=code&scope=/authenticate&redirect_uri=http://geogate.sp7.irea.cnr.it/client&show_login=true';
	$("#user_login").dialog("close");
};