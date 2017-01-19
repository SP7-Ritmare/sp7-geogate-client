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
		for (var key in sessionStorage) {
			if (key.startsWith(string)) {
				return JSON.parse(sessionStorage.getItem(key)).color;
			}
		}
	},
	image : function(string) {
		for (var key in sessionStorage) {
			if (key.startsWith(string)) {
				return JSON.parse(sessionStorage.getItem(key)).address;
			}
		}
	},
	icon : function(string) {
		for (var key in sessionStorage) {
			if (key.startsWith(string)) {
				return JSON.parse(sessionStorage.getItem(key)).icon;
			}
		}
	},
	menu : function(string) {
		var labels = [];
		for (var key in sessionStorage) {
			if (key.startsWith(string)) {
				if (JSON.parse(sessionStorage.getItem(key)).itemLabel != undefined) {
					labels.push(JSON.parse(sessionStorage.getItem(key)).itemLabel);
				}
			}
		}
		return labels;
	},
	tooltip : function(string) {
		for (var key in sessionStorage) {
			if (key.startsWith(string)) {
				return JSON.parse(sessionStorage.getItem(key)).itemTooltip;
			}
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
		while (i < this.countWidgets()) {
			i++;
			var widget = this.getWidgetByPosition(i);
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
		while (i < this.countWidgets()) {
			i++;
			var widget = this.getWidgetByPosition(i);
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
				$('#' + wName).prev().attr("data-badge2", this.countWidgetsByName(wName) + "x");
			} else {
				wId.css("visibility", "hidden");
			};
		};
	}
};

var utils = {
	doAppend : function(str) {
		$('.widget-attivi a:first-child').after('<a href="#"><span class="badge" data-badge="0"></span><span class="awidg ' + widgetOptions.icon(str) + '"></span><br /><span class="icon-title">' + str + '</span></a>');
	},
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
			this.removeFromWidgetAttivi("beforeAppending");
		}
		this.doAppend(str);
	},
	reloadWidgetAttivi : function() {
		$('.widget-attivi a:gt(0)').remove();
		var i = storage.countWidgets() + 1;
		while (--i) {
			if (storage.getWidgetByPosition(i).name != 0) {
				this.doAppend(storage.getWidgetByPosition(i).name);
			}
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
	},
	loadMenu : function(str) {
		var arr = widgetOptions.menu(str);
		if ( typeof arr !== 'undefined' && arr.length > 0) {
			for (var i = 0; i < arr.length; i++) {
				$('div#blocco-menu-f1 ul').html("<li><a href='#'>" + arr[i] + "</a></li>");
			};
		} else {
			$('div#blocco-menu-f1 ul').empty();
		};
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