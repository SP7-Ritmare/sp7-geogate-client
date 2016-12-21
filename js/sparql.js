function getWidgetName(w) {
	switch (w) {
	case "widgetDiscovery":
		return "Discovery";
		break;
	case "widgetMappa":
		return "Map";
		break;
	case "widgetMydata":
		return "Mydata";
		break;
	case "widgetNews":
		return "News";
		break;
	case "widgetMetadati":
		return "Metadata";
		break;
	}
};

function loadWidgets(widgetTypes) {
	for (var i = 0; i < widgetTypes.length; i++) {
		var widgetName = getWidgetName(widgetTypes[i]);
		if (i == 0) {
			$('.head-b1 span').first().text(widgetName);
			$('.menu-f1 span').removeClass().addClass(widgetOptions.icon(widgetName));
		};
		$('#draggable' + (i + 1)).attr("name", widgetName);
		$('#draggable' + (i + 1)).find("embed").attr("src", widgetOptions.image(widgetName));
		$('#draggable' + (i + 1)).css("background-color", widgetOptions.color(widgetName));
		$('#draggable' + (i + 1)).css("visibility", "visible");
		utils.appendToWidgetAttivi(widgetName);
		$('#' + widgetName).prev().attr("data-badge2", storage.countWidgetsByName(widgetName) + "x");
	}
};

function startWidgetInfo(widgetTypes, userType) {
	if (userType == "default") {
		$("#widgetInfoDefault").dialog({
			modal : true,
			buttons : {
				"Ok" : function() {
					$(this).dialog("close");
					loadWidgets(widgetTypes);
				}
			}
		});
	} else {
		$("#widgetInfoAuthenticated").dialog({
			modal : true,
			buttons : {
				"Ok" : function() {
					$(this).dialog("close");
					loadWidgets(widgetTypes);
				}
			}
		});
	}
};

if (localStorage.getItem("session") == null) {
	localStorage.setItem("session", "s");
};

function sparql(orcid) {
	var endpoint = "http://geogate.sp7.irea.cnr.it/fuseki/portal/query";

	var query_userid = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?userid WHERE { ?userid foaf:account/foaf:accountName ?orcid . FILTER(?orcid = '" + orcid + "') }";

	$.ajax({
		url : endpoint,
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
						var query_listwidgets = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7:	<http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?item ?picture ?profile ?category WHERE { " + 'sp7:' + el.userid.value.substring(el.userid.value.lastIndexOf('/') + 1) + " foaf:img	?picture ; ^foaf:member	?category . ?profile def:owner ?category ; def:entries/rdf:rest*/rdf:first ?item . } LIMIT 5";

						$.ajax({
							url : endpoint,
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
											localStorage.setItem("userPicture", el.picture.value);
										}
										widgetTypes.push(el.item.value.substr(el.item.value.lastIndexOf("#") + 1));
									});
								});
								startWidgetInfo(widgetTypes, "authenticated");
							}
						});
					}
				});
			});
		}
	});
};

if (window.location.href.indexOf("code") > -1) {
	if (localStorage.getItem("userPicture") == null) {
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
			localStorage.setItem("session", "l");
			sparql(msg.orcid);
			$("#user-title").text("Logout");
		});
	} 
	else {
		$("#user-login image").attr("xlink:href", localStorage.getItem("userPicture"));
		$("#user-title").text("Logout");
	}

} else {
	var endpoint = "http://geogate.sp7.irea.cnr.it/fuseki/portal/query";

	var query = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?item ?picture ?profile ?category WHERE { def:defaultUser foaf:img	?picture; ^foaf:member ?category . ?profile def:owner ?category; def:entries/rdf:rest*/rdf:first ?item . } LIMIT 5";

	$.ajax({
		url : endpoint,
		dataType : "json",
		type : "POST",
		data : {
			query : query,
			format : "json"
		},
		success : function(result) {
			var widgetTypes = [];
			$.each(result, function(index, element) {
				$.each(element.bindings, function(i, el) {
					if (i == 0) {
						$("#user-login image").attr("xlink:href", el.picture.value);
					}
					if (el.item.value.substr(el.item.value.lastIndexOf("#") + 1) != "widgetInfo") {
						widgetTypes.push(el.item.value.substr(el.item.value.lastIndexOf("#") + 1));
					}
				});
			});
			startWidgetInfo(widgetTypes, "default");
		}
	});
};

if (localStorage.getItem("session") == "l" && localStorage.getItem("sessionName") != null) {
	storage.reloadWidgets();
};