/**
 * @author Diego Migliavacca (https://github.com/diegomigliavacca)
 * @copyright SP7 Ritmare (http://www.ritmare.it)
 */

storage.check();
sessionStorage.clear();
// localStorage.clear();
if (localStorage.getItem("session") == null) {
	localStorage.setItem("session", "s");
} else if (localStorage.getItem("session") == "l" && localStorage.getItem("sessionName") != null) {
	storage.reloadWidgets();
}

function loadWidgets(widgetTypes) {
	for (var i = 0; i < widgetTypes.length; i++) {
		var query_widgetdetails = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?varLabel ?var ?itemLabel ?itemAddress ?isVisible ?inHistory ?undoCmd ?item ?itemTooltip ?icon ?label ?color ?address WHERE { { def:" + widgetTypes[i] + " def:icon ?icon; rdfs:label ?label; def:color ?color; def:address ?address; def:tooltip ?itemTooltip . } UNION { OPTIONAL { def:" + widgetTypes[i] + " def:apiList/rdf:rest*/rdf:first ?item . ?item def:itemLabel ?itemLabel; def:itemAddress ?itemAddress; def:isVisible ?isVisible; def:inHistory ?inHistory; def:undoCmd ?undoCmd . } } UNION { OPTIONAL { def:" + widgetTypes[i] + " def:varList/rdf:rest*/rdf:first ?var . ?var def:varLabel ?varLabel . } } } LIMIT 40";
		$.ajax({
			url : utils.endpoint,
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
						var iVal = el.icon.value;
						var lVal = el.label.value;
						var cVal = el.color.value;
						var aVal = el.address.value;
						if (i == 0) {
							$('.head-b1 span').first().text(lVal);
							$('.menu-f1 span').removeClass().addClass(iVal);
						}
						wId.attr("name", lVal);
						wId.find("embed").attr("src", aVal);
						wId.css("background-color", cVal);
						wId.css("visibility", "visible");
						storage.storeWidget(k, 'draggable' + k, lVal);
					});
				});
				utils.addBadgeValue();
			}.bind(null, i)
		});
	};
	var i = widgetTypes.length;
	while (i--) {
		var widgetName = utils.getWidgetName(widgetTypes[i]);
		utils.appendToWidgetAttivi(widgetName);
	}
};

function sparql(orcid) {
	var query_userid = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?userid WHERE { ?userid foaf:account/foaf:accountName ?orcid . FILTER(?orcid = '" + orcid + "') }";
	$.ajax({
		url : utils.endpoint,
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
							url : utils.endpoint,
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
			$("#menulist").css("visibility", "visible");
		});
	} else {
		$("#user-login image").attr("xlink:href", localStorage.getItem("userPicture"));
		$("#user-title").text("Logout");
	}
} else {
	var query = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?item ?picture ?profile ?category WHERE { def:defaultUser foaf:img	?picture; ^foaf:member ?category . ?profile def:owner ?category; def:entries/rdf:rest*/rdf:first ?item . } LIMIT 5";
	$.ajax({
		url : utils.endpoint,
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