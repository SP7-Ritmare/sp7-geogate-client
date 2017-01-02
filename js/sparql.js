/**
 * @author Diego Migliavacca (https://github.com/diegomigliavacca)
 * @copyright SP7 Ritmare (http://www.ritmare.it)
 */

function getWidgetName(w) {
	switch (w) {
	case "widgetDiscovery":
		return "Discovery";
		break;
	case "widgetMappa":
		return "Map";
		break;
	case "widgetMydata":
		return "My data";
		break;
	case "widgetNews":
		return "Feeds";
		break;
	case "widgetMetadati":
		return "Metadata";
		break;
	case "widgetInfo":
		return "About";
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
		var wId = $('#draggable' + (i + 1));
		wId.attr("name", widgetName);
		wId.find("embed").attr("src", widgetOptions.image(widgetName));
		wId.css("background-color", widgetOptions.color(widgetName));
		wId.css("visibility", "visible");
		$('#' + widgetName).prev().attr("data-badge2", storage.countWidgetsByName(widgetName) + "x");
		storage.storeWidget(i + 1, 'draggable' + (i + 1), widgetName);
	};
	var i = widgetTypes.length;
	while (i--) {
		var widgetName = getWidgetName(widgetTypes[i]);
		utils.appendToWidgetAttivi(widgetName);
		utils.addBadgeValue();
	}
};

function sparql(orcid) {
	var query_userid = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?userid WHERE { ?userid foaf:account/foaf:accountName ?orcid . FILTER(?orcid = '" + orcid + "') }";
	$.ajax({
		url : utils.endpoint(),
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
						var query_listwidgets = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7:	<http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?item ?picture ?profile ?category WHERE { " + 'sp7:' + userIdVal.substring(userIdVal.lastIndexOf('/') + 1) + " foaf:img	?picture ; ^foaf:member	?category . ?profile def:owner ?category ; def:entries/rdf:rest*/rdf:first ?item . } LIMIT 5";

						$.ajax({
							url : utils.endpoint(),
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
	} else {
		$("#user-login image").attr("xlink:href", localStorage.getItem("userPicture"));
		$("#user-title").text("Logout");
	}
} else {
	var query = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?item ?picture ?profile ?category WHERE { def:defaultUser foaf:img	?picture; ^foaf:member ?category . ?profile def:owner ?category; def:entries/rdf:rest*/rdf:first ?item . } LIMIT 5";
	$.ajax({
		url : utils.endpoint(),
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
					};
					var itemVal = el.item.value;
					widgetTypes.push(itemVal.substr(itemVal.lastIndexOf("#") + 1));
				});
			});
			loadWidgets(widgetTypes);
		}
	});
};