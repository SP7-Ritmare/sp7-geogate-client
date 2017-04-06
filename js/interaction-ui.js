/**
 * @author Diego Migliavacca (https://github.com/diegomigliavacca)
 * @copyright SP7 Ritmare (http://www.ritmare.it)
 */

//add a new widget by drag & drop or click
function addWidget(clickedId) {
	var spinner = new Spinner().spin();
	$("body")[0].appendChild(spinner.el);
	$('iframe').on("load", function() {
		spinner.stop();
	});

	var i = 7;
	while (--i) {
		var j = i - 1;
		var fwId = $('#draggable' + j);
		var wId = $('#draggable' + i);
		fwId.attr("id", "draggable" + i);
		var formerClass = "blocco-" + j;
		var widgetClass = "blocco-" + i;
		fwId.removeClass(formerClass);
		fwId.addClass(widgetClass);
		var formerWidget = storage.getWidgetByPosition(j);
		if (formerWidget != null) {
			storage.storeWidget(i, fwId.attr("name"));
			if (fwId.css("visibility") == "hidden") {
				fwId.css("visibility", "visible");
			};
		};
		fwId.animate(widgetData[0][j]).css("position", "absolute");
		fwId.width(widgetData[1][j]);
		fwId.height(widgetData[2][j]);
		fwId.find('.ifb').width(widgetData[3][j]);
		fwId.find('.ifb').height(widgetData[4][j]);
	};

	//	$('#menudx').after('<div id="draggable1" class="block blocco-1" rel="b1" name="' + clickedId + '" style="visibility: visible; background-color: rgb(88, 167, 173); left: 0px; top: 0px; position: absolute; width: 814px; height: 357px;><div class="content"><div id="bar"><div id="blocco-menu-f1"><ul id="dropdown-menu"></ul></div><div class="head-b1"><span></span><a href="#" class="menu-f1"><span></span></a><a href="#" class="forward-f1" title="forward"><span class="fa fa-chevron-right"></span></a><a href="#" class="back-f1" title="back"><span class="fa fa-chevron-left"></span></a><a href="#" class="close-f1"><span class="metro-icon glyphicon glyphicon-remove"></span></a><a href="#" class="full-f1"><span class="metro-icon glyphicon glyphicon-fullscreen"></span></a></div></div><iframe class="ifb" src="blank.html" width="100%" height="100%"></iframe><div class="widget-invisible-overlay"></div></div></div>');

	storage.storeWidget(1, clickedId);
	var fwnId = $('#draggable6');
	var wnId = $('#draggable1');
	if (fwnId.css("visibility") == "hidden") {
		fwnId.css("visibility", "visible");
	};
	utils.loadMenu(clickedId);
	fwnId.attr("id", "draggable1");
	var formerClass = "blocco-6";
	var widgetClass = "blocco-1";
	fwnId.removeClass(formerClass);
	fwnId.addClass(widgetClass);
	fwnId.animate({
		top : 0,
		left : 0
	}).css("position", "absolute");
	fwnId.width(widgetData[1][0]);
	fwnId.height(widgetData[2][0]);
	fwnId.find('.ifb').width(widgetData[3][0]);
	fwnId.find('.ifb').height(widgetData[4][0]);
	fwnId.find("iframe").attr("src", widgetOptions.address(clickedId));
	fwnId.attr("name", clickedId);
	fwnId.css("background-color", widgetOptions.color(clickedId));
	$('#bar').animate({
		top : 0,
		left : 0
	});
	$('#bar').prependTo("#draggable1 .content");
	$('.head-b1 span').first().text(clickedId);
	$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(clickedId));

	utils.reloadWidgetAttivi();
	utils.addBadgeValue();
	widgetData_resize = utils.getWidgetData();
};

$('[id^=draggable]').droppable({
	tolerance : "pointer",
	activate : function(event, ui) {
		var dId = ui.draggable.context.id;
		$("#" + dId).css("zIndex", 999);
		draggableClass = ui.draggable.attr('class').substring(0, 5);
		switch (draggableClass) {
		case "cwidg":
			break;
		case "block":
			draggedElement = dId.substring(9) - 1;
			$('.widget-invisible-overlay', '#' + event.target.id).show();
			widgetData_resize = utils.getWidgetData();
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
			var targetName = $(event.target).attr('name');
			var draggedName = ui.draggable.attr('name');
			var targetId = event.target.id;
			var draggedId = ui.draggable.context.id;
			var targetElement = targetId.substring(9) - 1;
			var targetPosition = targetId.replace('draggable', '');
			var draggedPosition = draggedId.replace('draggable', '');
			var wdrId = $("#" + draggedId);
			var wtaId = $("#" + targetId);
			if (storage.getWidgetByPosition(targetPosition) !== null) {
				wdrId.draggable("option", "revert", false);
				wdrId.attr("id", targetId);
				wtaId.attr("id", draggedId);
				var draggedClass = "blocco-" + draggedPosition;
				var targetClass = "blocco-" + targetPosition;
				wdrId.removeClass(draggedClass);
				wtaId.removeClass(targetClass);
				wdrId.addClass(targetClass);
				wtaId.addClass(draggedClass);
				wdrId.animate(widgetData[0][targetElement]).css("position", "absolute");
				wtaId.animate(widgetData[0][draggedElement]);
				wdrId.width(widgetData[1][targetElement]);
				wdrId.height(widgetData[2][targetElement]);
				wtaId.width(widgetData[1][draggedElement]);
				wtaId.height(widgetData[2][draggedElement]);
				wdrId.find('.ifb').width(widgetData[3][targetElement]);
				wdrId.find('.ifb').height(widgetData[4][targetElement]);
				wtaId.find('.ifb').width(widgetData[3][draggedElement]);
				wtaId.find('.ifb').height(widgetData[4][draggedElement]);
				storage.storeWidget(targetPosition, draggedName);
				storage.storeWidget(draggedPosition, targetName);
				if (draggedPosition == 1) {
					$('#bar').prependTo("#" + draggedId + " .content");
					$('.head-b1 span').first().text(targetName);
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(targetName));
					utils.loadMenu(targetName);
				} else if (targetPosition == 1) {
					$('#bar').prependTo("#" + targetId + " .content");
					$('.head-b1 span').first().text(draggedName);
					$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(draggedName));
					utils.loadMenu(draggedName);
				}
				var i = 0;
				while (i < 6) {
					i++;
					var j = i - 1;
					if (j == draggedElement || j == targetElement) {
						continue;
					};
					var drId = $('#draggable' + i);
					drId.animate(widgetData[0][j]).css("position", "absolute");
					drId.width(widgetData[1][j]);
					drId.height(widgetData[2][j]);
				};
				utils.reloadWidgetAttivi();
				break;
			} else {
				wdrId.draggable("option", "revert", true);
			}
		}
	},
	deactivate : function(event, ui) {
		$("#" + ui.draggable.context.id).css("visibility", "visible");
		$("#" + ui.draggable.context.id).css("zIndex", "");
		$('.widget-invisible-overlay', '#' + event.target.id).hide();
	}
});

$('.block').draggable({
	cursor : "move",
	/*	helper : "clone",
	 cursorAt : {
	 top : 5,
	 left : 5
	 }, */
	revert : "invalid"
});

$('[id^=draggable]').hover(function() {
	if ($(this).attr('id') != "draggable1") {
		$(this).find('.content').append('<div class="widget-overlay"><span class="fa fa-hand-o-left" title="Click to move the widget to the main position" onclick="switchWidgets($(this).parents(\'.block\').attr(\'id\').replace(\'draggable\', \'\'))"></span></div>');
	}
}, function() {
	$('.widget-overlay').remove();
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
		window.location.href = utils.site_url;
		localStorage.clear();
		$("#user-title").text("Login");
	} else {
		$("#user_login").dialog({
			modal : true,
			show : "blind",
			hide : "explode"
		});
	}
});

function toggleWidget(ths) {
	$(ths).closest('.block').toggleClass('fullscreen');
	$(ths).closest('.block').find('.ifb').removeAttr('style');
	if ($("#draggable1").draggable("option", "disabled") == false) {
		$("#draggable1").draggable("disable");
	} else {
		$("#draggable1").draggable("enable");
	};
};

$('.full-f1').click(function() {
	toggleWidget(this);
});

function closeWidget() {
	var nextId = $('#draggable6');
	var widgetId = $('#draggable1');
	widgetId.attr("id", "draggable6");
	var nextClass = "blocco-6";
	var widgetClass = "blocco-1";
	widgetId.removeClass(widgetClass);
	widgetId.addClass(nextClass);
	widgetId.animate(widgetData[0][4]);
	widgetId.width(widgetData[1][4]);
	widgetId.height(widgetData[2][4]);
	widgetId.find('.ifb').width(widgetData[3][4]);
	widgetId.find('.ifb').height(widgetData[4][4]);
	if (widgetId.css("visibility") == "visible") {
		widgetId.css("visibility", "hidden");
	};
	widgetId.attr("name", "");

	var i = 0;
	while (i < 6) {
		i++;
		var k = i + 1;
		if (storage.getWidgetByPosition(k) != null) {
			var wId = $('#draggable' + i);
			var nwId = $('#draggable' + k);
			var nwName = nwId.attr('name');
			storage.storeWidget(i, nwName);
			nwId.attr("id", "draggable" + i);
			var nextClass = "blocco-" + k;
			var widgetClass = "blocco-" + i;
			nwId.removeClass(nextClass);
			nwId.addClass(widgetClass);
			var j = i - 1;
			nwId.animate(widgetData[0][j]).css("position", "absolute");
			nwId.width(widgetData[1][j]);
			nwId.height(widgetData[2][j]);
			nwId.find('.ifb').width(widgetData[3][j]);
			nwId.find('.ifb').height(widgetData[4][j]);
		};
	};
	storageType().removeItem(storage.countWidgets());

	if (storage.getWidgetByPosition(1) != null) {
		$('#bar').animate({
			top : 0,
			left : 0
		});
		$('#bar').prependTo("#draggable1 .content");
		var widgetName = storage.getWidgetByPosition(1).name;
		$('.head-b1 span').first().text(widgetName);
		$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(widgetName));
		utils.loadMenu(widgetName);
	} else {
		$('#draggable1').css("visibility", "hidden");
		$('#draggable1').attr("name", "");
	};

	utils.addBadgeValue();
	utils.removeFromWidgetAttivi();
	widgetData_resize = utils.getWidgetData();
};

$('.close-f1').click(function() {
	closeWidget();
});

function switchWidgets(clickedPosition) {
	var widget1 = storage.getWidgetByPosition(1);
	var mainWidgetId = "draggable1";
	var mainWidgetName = widget1.name;
	var mainElement = mainWidgetId.substring(9) - 1;
	var clickedWidgetId = "draggable" + clickedPosition;
	var clickedWidgetName = storage.getWidgetByPosition(clickedPosition).name;
	var clickedElement = clickedWidgetId.substring(9) - 1;
	var cwId = $("#" + clickedWidgetId);
	var mwId = $("#" + mainWidgetId);

	if (storage.getWidgetByPosition(1) !== null) {
		$("#" + clickedWidgetId).draggable("option", "revert", false);
		cwId.attr("id", mainWidgetId);
		mwId.attr("id", clickedWidgetId);
		var draggedClass = "blocco-" + clickedPosition;
		var targetClass = "blocco-1";
		cwId.removeClass(draggedClass);
		mwId.removeClass(targetClass);
		cwId.addClass(targetClass);
		mwId.addClass(draggedClass);
		cwId.animate(widgetData[0][mainElement]).css("position", "absolute");
		mwId.animate(widgetData[0][clickedElement]);
		cwId.width(widgetData[1][mainElement]);
		cwId.height(widgetData[2][mainElement]);
		mwId.width(widgetData[1][clickedElement]);
		mwId.height(widgetData[2][clickedElement]);
		cwId.find('.ifb').width(widgetData[3][mainElement]);
		cwId.find('.ifb').height(widgetData[4][mainElement]);
		mwId.find('.ifb').width(widgetData[3][clickedElement]);
		mwId.find('.ifb').height(widgetData[4][clickedElement]);
		$('#bar').prependTo("#draggable1 .content");
		$('.head-b1 span').first().text(clickedWidgetName);
		$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(clickedWidgetName));
		utils.loadMenu(clickedWidgetName);
		storage.storeWidget(1, clickedWidgetName);
		storage.storeWidget(clickedPosition, mainWidgetName);

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
	widgetData_resize = utils.getWidgetData();
};

function clickSwitchWidgets(pos) {
	if (pos != 1) {
		switchWidgets(pos);
		widgetData_resize = utils.getWidgetData();
	};
};

function openORCID() {
	window.location.href = 'https://orcid.org/oauth/authorize?client_id=APP-KCZPVLP7OMJ1P69L&response_type=code&scope=/authenticate&redirect_uri=' + utils.site_url + '&show_login=true';
	$("#user_login").dialog("close");
};