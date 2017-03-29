/**
 * @author Diego Migliavacca (https://github.com/diegomigliavacca)
 * @copyright SP7 Ritmare (http://www.ritmare.it)
 */

function loadSessionList() {
	var query_listsessions = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?session ?sessionName ?widgetName ?varLabel ?varValue ?varType FROM <http://sp7.irea.cnr.it/rdfdata/widgetDefs> FROM <http://sp7.irea.cnr.it/rdfdata/userDefs> FROM <http://sp7.irea.cnr.it/rdfdata/sessionData> WHERE { ?session def:sessionOwner <" + localStorage.getItem("sessionOwner") + ">; def:sessionName ?sessionName; def:widgetList/rdf:rest*/rdf:first ?widget . ?widget def:widgetName ?widgetName; def:stateVars/rdf:rest*/rdf:first ?variable . ?variable def:varLabel ?varLabel; def:varValue ?varValue; def:varType ?varType . }";
	$.ajax({
		url : utils.endpoint_query,
		type : "POST",
		data : {
			query : query_listsessions,
			format : "json"
		},
		success : function(result) {
			$("#open-session-div").empty();
			var nameArr = [];
			$.each(result.results, function(index, element) {
				if ( typeof element !== 'undefined' && element.length > 0) {
					$.each(element, function(i, el) {
						if ($.inArray(el.sessionName.value, nameArr) < 0) {
							nameArr.push(el.sessionName.value);
							$("#open-session-div").append("<a href='#' class='open-session-a' onclick='openSession(\"" + el.sessionName.value + "\");return false;'>" + el.sessionName.value + "</a><br>");
						}
					});
				} else {
					$("#open-session-div").html("<span>No sessions saved</span>");
				}
			});
		}
	});
};

function loadWidgets(widgetTypes) {
	for (var i = 0; i < widgetTypes.length; i++) {
		var query_widgetdetails = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?varLabel ?var ?itemLabel ?itemAddress ?isVisible ?inHistory ?undoCmd ?item ?itemTooltip ?icon ?label ?color ?address FROM <http://sp7.irea.cnr.it/rdfdata/widgetDefs> FROM <http://sp7.irea.cnr.it/rdfdata/userDefs> WHERE { { def:" + widgetTypes[i] + " def:icon ?icon; rdfs:label ?label; def:color ?color; def:address ?address; def:tooltip ?itemTooltip . } UNION { OPTIONAL { def:" + widgetTypes[i] + " def:apiList/rdf:rest*/rdf:first ?item . ?item def:itemLabel ?itemLabel; def:itemAddress ?itemAddress; def:isVisible ?isVisible; def:inHistory ?inHistory; def:undoCmd ?undoCmd . } } UNION { OPTIONAL { def:" + widgetTypes[i] + " def:varList/rdf:rest*/rdf:first ?var . ?var def:varLabel ?varLabel . } } } LIMIT 40";
		$.ajax({
			url : utils.endpoint_query,
			dataType : "json",
			type : "POST",
			data : {
				query : query_widgetdetails,
				format : "json"
			},
			success : function(i, result) {
				var k = i + 1;
				var wId = $('#draggable' + k);
				$.each(result, function(index, element) {
					$.each(element.bindings, function(j, el) {
						if (el.icon != undefined || el.label != undefined || el.color != undefined || el.address != undefined) {
							var iVal = el.icon.value;
							var lVal = el.label.value;
							var cVal = el.color.value;
							var aVal = el.address.value;
							storage.storeWidget(k, lVal);
							if (i == 0) {
								$('.head-b1 span').first().text(lVal);
								$('.menu-f1 span').removeClass().addClass(iVal);
								utils.loadMenu(lVal);
							};
							wId.attr("name", lVal);
							wId.find("iframe").attr("src", aVal);
							wId.css("background-color", cVal);
							wId.css("visibility", "visible");
						};
					});
				});
				utils.addBadgeValue();
				utils.reloadWidgetAttivi();
			}.bind(null, i)
		});
	};
};

function loggedUserDef(orcid) {
	var query_userid = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?userid FROM <http://sp7.irea.cnr.it/rdfdata/widgetDefs> FROM <http://sp7.irea.cnr.it/rdfdata/userDefs> WHERE { ?userid foaf:account/foaf:accountName ?orcid . FILTER(?orcid = '" + orcid + "') }";
	$.ajax({
		url : utils.endpoint_query,
		dataType : "json",
		type : "POST",
		data : {
			query : query_userid,
			format : "json"
		},
		success : function(result) {
			$.each(result, function(index, element) {
				$.each(element.bindings, function(i, el) {
					if (i == 0) {
						var userIdVal = el.userid.value;
						localStorage.setItem("sessionOwner", userIdVal);
						var sessionName = localStorage.getItem("sessionName");
						if (sessionName == "null") {
							var query_listwidgets = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7:	<http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?item ?picture ?profile ?category FROM <http://sp7.irea.cnr.it/rdfdata/widgetDefs> FROM <http://sp7.irea.cnr.it/rdfdata/userDefs> WHERE { " + 'sp7:' + userIdVal.substring(userIdVal.lastIndexOf('/') + 1) + " foaf:img ?picture ; ^foaf:member ?category . ?profile def:owner ?category ; def:entries/rdf:rest*/rdf:first ?item . } LIMIT 5";
							$.ajax({
								url : utils.endpoint_query,
								dataType : "json",
								type : "POST",
								data : {
									query : query_listwidgets,
									format : "json"
								},
								success : function(result) {
									var widgetTypes = [];
									$.each(result, function(index, element) {
										$.each(element.bindings, function(i, el) {
											if (i == 0) {
												var pVal = el.picture.value;
												$("#user-login image").attr("xlink:href", pVal);
												localStorage.setItem("userPicture", pVal);
											};
											var itemVal = el.item.value;
											widgetTypes.push(itemVal.substr(itemVal.lastIndexOf("#") + 1));
										});
									});
									loadWidgets(widgetTypes);
								}
							});
						} else {
							openSession(sessionName);
						};
						loadSessionList();
					}
				});
			});
		}
	});
};

function getWidgetsNotLoggedUser() {
	var query_listwidgets = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?item ?picture ?profile ?category FROM <http://sp7.irea.cnr.it/rdfdata/widgetDefs> FROM <http://sp7.irea.cnr.it/rdfdata/userDefs> WHERE { def:defaultUser foaf:img	?picture; ^foaf:member ?category . ?profile def:owner ?category; def:entries/rdf:rest*/rdf:first ?item . } LIMIT 5";
	$.ajax({
		url : utils.endpoint_query,
		dataType : "json",
		type : "POST",
		data : {
			query : query_listwidgets,
			format : "json"
		},
		success : function(result) {
			var widgetTypes = [];
			$.each(result, function(index, element) {
				$.each(element.bindings, function(i, el) {
					if (i == 0) {
						$("#user-login image").attr("xlink:href", el.picture.value);
					};
					var itemVal = el.item.value;
					widgetTypes.push(itemVal.substr(itemVal.lastIndexOf("#") + 1));
				});
			});
			loadWidgets(widgetTypes);
		}
	});
};

function getOrcidLoggedUser() {
	if (localStorage.getItem("userPicture") == null) {
		$.ajax({
			headers : {
				'Accept' : 'application/json',
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			method : "POST",
			dataType : 'json',
			url : "https://pub.orcid.org/oauth/token?client_id=APP-KCZPVLP7OMJ1P69L&client_secret=bec72dc4-c107-4fd7-8cda-12ac18ff5fd9&grant_type=authorization_code&code=" + getUrlVars()["code"] + "&redirect_uri=" + utils.site_url
		}).done(function(msg) {
			if (localStorage.getItem("widgetTest_message") != null) {
				localStorage.removeItem("widgetTest_message");
			}
			localStorage.setItem("userOrcid", msg.orcid);
			loggedUserDef(msg.orcid);
		});
	} else {
		loggedUserDef(localStorage.getItem("userOrcid"));
		$("#user-login image").attr("xlink:href", localStorage.getItem("userPicture"));
	};
	$("#user-title").text("Logout");
	$("#menulist").css("visibility", "visible");
	$(".wrap-icons").css("top", "140px");
};

function getUserType() {
	if (window.location.href.indexOf("code") > -1) {
		//user logged
		getOrcidLoggedUser();
	} else {
		//user not logged
		getWidgetsNotLoggedUser();
	};
};

function enableCwidg() {
	$('.cwidg').draggable({
		cursor : "move",
		helper : "clone",
		revert : "invalid"
	});

	$(".cwidg").tooltip({
		content : function() {
			return widgetOptions.tooltip(this.id);
		}
	});
};

function loadData() {
	storage.check();
	sessionStorage.clear();
	if (localStorage.getItem("sessionOwner") == null) {
		localStorage.setItem("sessionOwner", "notlogged");
	};
	if (localStorage.getItem("sessionName") == null) {
		localStorage.setItem("sessionName", "null");
	};
	storage.clearStoredWidgets();

	var spinner = new Spinner().spin();
	$("body")[0].appendChild(spinner.el);
	$('iframe').on("load", function() {
		spinner.stop();
	});

	var query_widgetoptions = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?widget ?varLabel ?itemLabel ?isVisible ?itemTooltip ?icon ?label ?color ?address FROM <http://sp7.irea.cnr.it/rdfdata/widgetDefs> FROM <http://sp7.irea.cnr.it/rdfdata/userDefs> WHERE { ?widget rdf:type def:Widget . { ?widget def:icon ?icon; rdfs:label ?label; def:color ?color; def:address ?address; def:tooltip ?itemTooltip . } OPTIONAL { ?widget def:apiList/rdf:rest*/rdf:first ?item . ?item def:itemLabel ?itemLabel; def:isVisible ?isVisible . } OPTIONAL { ?widget	def:varList/rdf:rest*/rdf:first	?var . ?var	def:varLabel ?varLabel . } }";
	$.ajax({
		url : utils.endpoint_query,
		dataType : "json",
		type : "POST",
		data : {
			query : query_widgetoptions,
			format : "json"
		},
		success : function(result) {
			var labels = [];
			var itemLabels = [];
			var varLabels = [];
			$.each(result, function(index, element) {
				$.each(element.bindings, function(i, el) {
					if (el.itemTooltip != undefined && el.icon != undefined && el.label != undefined && el.color != undefined && el.address != undefined) {
						var widget = {
							itemTooltip : el.itemTooltip.value,
							icon : el.icon.value,
							color : el.color.value,
							address : el.address.value
						};
					};

					if ($.inArray(el.label.value, labels) < 0) {
						itemLabels = [];
						varLabels = [];
						labels.push(el.label.value);
						if ($.isEmptyObject(widget) == false) {
							var record = JSON.stringify(widget);
							sessionStorage.setItem(el.label.value, record);
						};
					};

					if (el.itemLabel != undefined && el.isVisible != undefined && el.isVisible.value == "true") {
						if ($.inArray(el.itemLabel.value, itemLabels) < 0) {
							itemLabels.push(el.itemLabel.value);
						};
					};

					if (el.varLabel != undefined) {
						if ($.inArray(el.varLabel.value, varLabels) < 0) {
							varLabels.push(el.varLabel.value);
						};
					};

					var w = JSON.parse(sessionStorage.getItem(el.label.value));
					w["itemLabel"] = itemLabels;
					w["varLabel"] = varLabels;
					var r = JSON.stringify(w);
					sessionStorage.setItem(el.label.value, r);
				});
			});

			var i = 0;
			while (i < labels.length) {
				$('.wrap-icons').append('<div><!--<span class="badge" data-badge="0"></span>--><span class="badge2" data-badge2=""></span><span id="' + labels[i] + '" class="cwidg ' + widgetOptions.icon(labels[i]) + '" title = "" style="color:' + widgetOptions.color(labels[i]) + '"></span><br /><span class="icon-title" style="color:' + widgetOptions.color(labels[i]) + '">' + labels[i].toLowerCase() + '</span></div>');
				i++;
			}
			enableCwidg();
			getUserType();
		}
	});
};