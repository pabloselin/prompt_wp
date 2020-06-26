function setPersonajes(dataAttr) {
	var personajes = [];
	jQuery('.text-item').each(function(idx) {
		var linePersonajes = jQuery(this).attr(dataAttr).split(',');
		for(var i = 0; i < linePersonajes.length; i++) {
			if(linePersonajes[i].length > 0) {
				var cleanPersonaje = jQuery.trim(linePersonajes[i]);
				personajes.push(cleanPersonaje);	
			}
		}
	});

	return unique(personajes);
}

function disableMedia( target ) {
		//jQuery('#' + target).empty();
		console.log(target);
	}

	function loadMediaInModal(mediaid, modal, ispage, type) {
		
		var nextMedia = jQuery('.activeMedia').next('.media-item-wrapper.filtered');
		var prevMedia = jQuery('.activeMedia').prev('.media-item-wrapper.filtered');

		jQuery.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_ajax_get_media",
				mediaid: mediaid,
				type: type,
				ispage: ispage
			},
			error: function( response ) {
				console.log(response);
			},
			success: function( response ) {
				jQuery( '#' + modal + ' .modal-body').empty().append(response);
				if(mediaitem !== null) {
					if(type == 'audio') {
						jQuery('audio').on('play', function(){
							console.log('start');
							var audio = this;
							audioVisStart(this, ['#006CFF', '#006CFF', '#006CFF']);
						});

					}
					var itemInfo = jQuery.parseJSON(mediaitem);
				}
			}
		});

		return [nextMedia, prevMedia];
	}

	function loadMediaInContainer(mediaid, container, type, ispage) {
		
		var nextMedia = jQuery('.activeMedia').next('.media-item-wrapper');
		var prevMedia = jQuery('.activeMedia').prev('.media-item-wrapper');
		
		console.log(ispage);

		jQuery.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_ajax_get_media_in_text",
				mediaid: mediaid,
				type: type,
				ispage: ispage
			},
			error: function( response ) {
				console.log(response);
			},
			success: function( response ) {
				console.log(response);
				//var mediaitem = null;
				jQuery( '#' + container).empty().append(response);
				if(mediaitem !== null) {
					if(type == 'audio') {
						jQuery('audio').on('play', function(){
							console.log('start');
							var audio = this;
							audioVisStart(this, ['#006CFF', '#006CFF', '#006CFF']);
						});

					}
					var itemInfo = jQuery.parseJSON(mediaitem);
				}
			}
		});

		return [nextMedia, prevMedia];
	}

	function enableMedia( mediaids, targetid ) {
		
		var format = 'default';

		if(targetid == 'modal-media-text-lista-materiales') {
			format = 'intext';
		}

		jQuery.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_get_mediazone",
				params: mediaids,
				id: targetid,
				format: format
			},
			error: function( response ) {
				console.log(response);
			},
			success:function(response) {
				console.log(targetid);
				jQuery('#' + targetid + ' .list-materials').empty().append(response);

				jQuery('img.media-item-image').on('load', function() {
					this.style.opacity = 1;
				});
				
				var images = document.querySelectorAll('.media-item-image');
				lazyload(images);
				jQuery('body .media-item-wrapper:first').click();

			}
		});
	}

	function enableAllMedia( playid, target ) {
		jQuery.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_get_all_mediazone",
				playid: playid,
				all: true
			},
			error: function( response ) {
				console.log('error', response);
			},
			success:function(response) {
				console.log(target);
				jQuery(target).empty().append(response);
				
				jQuery('img.media-item-image').on('load', function() {
					this.style.opacity = 1;
				});

				var images = document.querySelectorAll('.media-item-image');
				lazyload(images);

				$grid = jQuery('.mediaitems-gallery').isotope({
					itemSelector: '.media-item-wrapper',
					layoutMode: 'fitRows',
					transitionDuration: 100
				});

				$grid.on('arrangeComplete', function( event, filteredItems) {
					console.log('arrangecomplete');
					jQuery('.filtered').removeClass('filtered');
					var items = $grid.isotope('getFilteredItemElements');
					console.log(items.length);
					jQuery(items).addClass('filtered');
				});

				iso = $grid.data('isotope');

				showCurrentFilterInfo(undefined, undefined, undefined, iso.filteredItems.length);
			}
		});
	}

	function enableMediaPage( pageid, target) {
		console.log('calling media page', pageid);
		jQuery.ajax({
			type: "post",
			url: prompt.ajaxurl,
			data: {
				action: "bit_get_mediapage",
				pageid: pageid
			},
			error: function( response ) {
				console.log( 'error', response);
			},
			success: function( response ) {
				jQuery('#' + target).empty().append(response);

				jQuery('img.media-item-image').on('load', function() {
					this.style.opacity = 1;
				});

				var images = document.querySelectorAll('.media-item-image');
				lazyload(images);

				$grid = jQuery('.mediaitems-gallery').isotope({
					itemSelector: '.media-item-wrapper',
					layoutMode: 'fitRows',
					stagger: 30
				});

				iso = $grid.data('isotope');
				showCurrentFilterInfo(undefined, undefined, undefined, iso.filteredItems.length);
			}
		});
	}

	function getMedia( playid, type, target ) {
		if(!jQuery(target).hasClass('contentloaded')) {
			jQuery.ajax({
				type: "post",
				url: prompt.ajaxurl,
				data: {
					action: 'bit_get_media',
					playid: playid,
					getType: type
				},
				error: function( response ) {
					console.log(response);
				},
				success: function( response ) {
					jQuery(target).append(response);
					jQuery(target).addClass('contentloaded');
				}
			});
		}
	}

	function showCurrentFilterInfo(tax, term, type, itemNumber) {
		console.log(tax, term, type);
		var filterInfo = jQuery('.currentfilterinfo');
		jQuery('.btn.clearfilters').hide();
		if(tax !== undefined && term !== undefined) {
			var taxlabel = prompt.taxlabels[tax];
			var termlabel = prompt.taxinfo[tax][term];

			if(termlabel !== undefined) {
				if(type !== undefined) {
					filterInfo.empty().append('<p><strong>' + itemNumber + ' items.</strong> En ' + taxlabel + ' <i class="fas fa-caret-right"></i> ' + termlabel.name + '. Tipo: ' + type + '</p>');		
				} else {
					filterInfo.empty().append('<p><strong>' + itemNumber + ' items.</strong> En ' + taxlabel + ' <i class="fas fa-caret-right"></i> ' + termlabel.name + '</p>');	
				}
				
			}
			jQuery('.btn.clearfilters').show();
			
		} else if( type !== undefined) {

			filterInfo.empty().append('<p><strong>' + itemNumber + ' items.</strong>  Tipo: ' + type +'</p>');
			jQuery('.btn.clearfilters').show();

		} else {
			
			filterInfo.empty().append('<p><strong>' + itemNumber + ' items.</strong> </p>');

		}
		// var taxlabel = prompt.taxlabels[curtax];
		// var termlabel = prompt.taxinfo[curtax][curterm][name];
		
	}

	function animateCSS(element, animationName, callback) {
		const node = document.querySelector(element)
		node.classList.add('animated', animationName)

		function handleAnimationEnd() {
			node.classList.remove('animated', animationName)
			node.removeEventListener('animationend', handleAnimationEnd)

			if (typeof callback === 'function') callback()
		}

	node.addEventListener('animationend', handleAnimationEnd)
}

function unique(array){
	return array.filter(function(el, index, arr) {
		return index == arr.indexOf(el);
	});
}

function trunc(text, max) {
	return text.substr(0, max -1) + (text.length > max ? '&hellip;' : '');
}