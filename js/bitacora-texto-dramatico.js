jQuery(document).ready(function($) {
	//var escenaLabel = $('.escenalabel');
	var playtextRow = $('.playtext-row');
	var instanceFull;
	var instanceMini;
	var visibleIds = [];
	var prevScroll = 0;
	var activeId;
	var activeMaterials;
	var activeText;
	var activeParlamento;

	//inView.offset({top: 200});

	$('.texto-mini, .texto-full').addClass('transparent');
	$('#texto-full .playtext-row:first').addClass('active');


	var customScroll = $('.texto-mini, .texto-full').overlayScrollbars({
		autoUpdate: true,
		callbacks: {
			onInitialized: function() {
				$('.texto-mini, .texto-full').removeClass('transparent');
				wrapper = document.querySelector('.os-viewport'), 
				wrapperBox = wrapper.getBoundingClientRect();

				if($(this.getElements().target).attr('id') == 'texto-full') {
					instanceFull = this;
				} else {
					instanceMini = this;
				}
			}
		}
	});

	function scrollOtherInstance(thisInstance, otherInstance) {
		var scrollY = thisInstance.scroll().ratio.y * 100;
		otherInstance.scroll({x:0, y: scrollY + '%'});
		thisInstance.scroll({x:0, y: scrollY + '%'});
	}

	function updateMaterialZone(materialesIds) {
		var matZone = $('.materiales-left');
		if(materialesIds !== undefined && materialesIds.length > 0) {
			activeMaterials = materialesIds;	
			matZone.empty().addClass('withMat').append('<p><span class="multimedia"><i class="fas fa-photo-video"></i> <i class="fas fa-headphones"></i></span> Materiales disponibles</p>');
		} else {
			matZone.empty().removeClass('withMat');
		}
		
	}

	function positionButtonMateriales(x, y) {
		$('.materiales-left').css({left: x, top: y});
	}

	function updatePersonaje(activeParlamento) {
		$('.personajes .personaje').removeClass('active');
		$('.personajes .personaje[data-personaje="' + activeParlamento + '"]').addClass('active');
	}

	instanceFull.options({
		className: 'os-theme-none',
		callbacks: {
			onScrollStart: function() {
				$('#texto-mini .textunit').removeClass('onfield');
				$('.playtext-row').removeClass('active');
			},
			onScroll: function() {
				//instanceMini.sleep();
				//instanceMini.update();
			},
			onScrollStop: function() {
				$('.playtext-row').removeClass('active');
				inView.offset(300);
				//inView.threshold(0.5);
				var visibleRows = inView('.playtext-row').check();
				var current = $(visibleRows.current[0]);
				current.addClass('active');
				var topset = false;
				var offsets = [];
				var viewportOffset = current[0].getBoundingClientRect();
				updateMaterialZone(current.attr('data-ids_asoc'));
				updatePersonaje(current.attr('data-parlamento'));
				positionButtonMateriales(viewportOffset.left, viewportOffset.top);
				activeId = current.attr('data-id');
			}
		}
	});


	instanceMini.options({
		className: 'os-theme-prompt',
		callbacks: {
			onScrollStart: function() {
				instanceFull.update();
			},
			onScroll: function() {
				instanceFull.sleep();
				scrollOtherInstance(this, instanceFull);
				instanceFull.update();
			},
			onScrollStop: function() {
				instanceFull.update();
			}
		}
	});

	inView('#texto-full .scene-row.scene-marker').on('enter', function(el) {
		var activeScene = $(el).attr('id');
		$('#selectScene').val('#' + activeScene);
	});

	// inView('.playtext-row').on('enter', function(el) {	
	// 	visibleIds.push($(el).attr('data-id'));
	// });

	// inView('.playtext-row').on('exit', function(el) {
	// 	var index = visibleIds.indexOf($(el).attr('data-id'));
	// 	if(index > -1) {
	// 		visibleIds.splice(index, 1);
	// 	}
	// });

	
	//console.log(instanceFull);

	$('body').on('change','#selectScene', function(e) {
		var selected = $('option:selected', this).attr('value');
		//var element = document.querySelector(selected);
		//var top = element.offsetTop;

		instanceFull.scroll($(selected));
		
		//$('.texto-full').addClass('smooth');

		$('.escena-nav').removeClass('active');
	});

	$('.textunit').on('click', function(e) {
		var id = $(this).attr('data-id');
		var selected = $('#texto-full .playtext-row[data-id="' + id + '"]');
		selected.addClass('selected active');
		instanceFull.scroll(selected, 500, 'linear');
	});



	// $('.playtext-row').on('hover', function() {
	// 	var curId = $(this).attr('data-id');
	// 	var dataParlamento = $(this).attr('data-parlamento');

	// 	$('.personajes .personaje').removeClass('active');
	// 	$('.personajes .personaje[data-personaje="' + dataParlamento + '"]').addClass('active');

	// 	$('.playtext-row').removeClass('selected');
	// 	//$('.textunit[data-id="' + curId + '"]').addClass('selected');

	// });

	$('.playtext-row').on('click', function() {
		
		$('.playtext-row.active').removeClass('active');
		$(this).addClass('active');
		updateMaterialZone($(this).attr('data-ids_asoc'));
		activeText = $('.text-item', this).text();
		
		activeParlamento = $(this).attr('data-parlamento');

		
		updatePersonaje(activeParlamento);

		if($(this).attr('data-hasmedia') == "true") {
			
			var viewportOffset = this.getBoundingClientRect();
			positionButtonMateriales(viewportOffset.left, viewportOffset.top);
			console.log(viewportOffset);

			
		}
	});

	// $('.trigger-media').on('click', function(event) {
	// 	event.preventDefault();
	// 	var el = $(this);
	// 	var target = el.attr('data-expand');
	// 	var targetel = $(target);
	// 	if(targetel.hasClass('active')) {
	// 		//targetel.slideUp();
	// 		$(this).removeClass('active');
	// 		targetel.removeClass('active').empty();
	// 		disableMedia(targetel);
	// 	} else {
	// 		$('.media-zone.active').removeClass('active');
	// 		$('.trigger-media').removeClass('active');
	// 		//targetel.slideDown();
	// 		targetel.addClass('active');
	// 		$(this).addClass('active');
	// 		enableMedia($(this).attr('data-assoc'), $(this).attr('data-plain-id'));
	// 	}
	// });

	$('.materiales-left').on('click', function(event) {
		event.preventDefault();
		//console.log('materiales-left');
	});

	$('.modal-media-list-text').on('shown.bs.modal', function(e) {
		console.log(activeMaterials);
		$('#content-current-material').empty();
		var shortText = trunc(activeText, 90);
		$('.curText').empty().append('<span class="acot">' + activeParlamento + ':</span> ' + shortText);
		enableMedia(activeMaterials, 'modal-media-text-lista-materiales');

		// var modal = $(this).attr('id');
		// var ispage = $(this).attr('data-ispage');

		// var navMedia = loadMediaInModal(mediaid, modal, ispage, type);
		// nextMedia = navMedia[0];
		// prevMedia = navMedia[1];

	});

	});