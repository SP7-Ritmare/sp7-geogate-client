function startWidgetInfo(widgetTypes) {
	$("#widgetInfo").dialog({
		modal : true,
		buttons : {
			"Ok" : function() {
				$(this).dialog("close");
				console.log(widgetTypes);
			}
		}
	});
};

if ($("#user-title").text() == "Login") {
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
			$.each(result, function(index, element) {
				$.each(element.bindings, function(i, el) {
					if (i == 0) {
						$("#user-login image").attr("xlink:href", el.picture.value);
					}
				});
			});
		}
	});
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
										}
										widgetTypes.push(el.item.value.substr(el.item.value.lastIndexOf("#") + 1));
									});
								});
								startWidgetInfo(widgetTypes);
							}
						});
					}
				});
			});
		}
	});
};