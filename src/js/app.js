import $ from 'jquery'
import Foundation from 'foundation-sites'
import slick from 'slick-carousel'
import getImageBrightness from './getImageBrightness.js'
import barbaApp from './barbaConfig.js'
import Blazy from 'blazy'

var wh = window.innerHeight,
	ww = window.innerWidth,
	headerHeight = $('#header').outerHeight(),
	footerHeight = $('#footer').outerHeight()

function addEventListeners() {
	window.addEventListener('resize', function() {
		wh = window.innerHeight
		ww = window.innerWidth
		fillscreen()
	})

	window.addEventListener('orientationchange', function() {
		wh = window.innerHeight
		ww = window.innerWidth
		$('body').removeClass('menu-open')
		fillscreen()
	})

	// mute button
	var video = $('video')[0]
	var $muteButton = $('.mute')
	var $icon = $muteButton.find('i.fa')

	if (ww < 768 && video) {
		video.muted = true
		$icon.removeClass('fa-volume-up').addClass('fa-volume-off')
	}

	$muteButton.on('click', function(e) {
		e.preventDefault()

		var isMuted = video.muted

		if (isMuted === false) {
			video.muted = true
			$icon.removeClass('fa-volume-up').addClass('fa-volume-off')
		} else {
			video.muted = false
			$icon.removeClass('fa-volume-off').addClass('fa-volume-up')
		}
	})

	// mobile nav
	$('.mobile-nav .menu-item a').on('click', function(e) {
		$('[data-off-canvas]').foundation('close')
	})
}

function fillscreen() {
	var pageTitleHeight = $('.page-title').outerHeight()

	if (ww > 768) {
		var fillHeight = wh - headerHeight - footerHeight - 100

		$('[rel="fullscreen"]').css('min-height', wh)

		$('[rel="fillscreen"]').css('min-height', fillHeight)

		$('[rel="pagefill"]').css('min-height', fillHeight - pageTitleHeight)

		if ($('[rel="pagefill"]').outerHeight() < fillHeight + 80) {
			$('[rel="pagefill"]').addClass('abs-centered')
		} else {
			$('[rel="pagefill"]').removeClass('abs-centered')
		}
	} else {
		$('[rel="fullscreen"]').css('min-height', wh * 0.9)
	}
}

function stickyNav() {
	var $header = $('#header'),
		st = window.scrollY,
		offset = 300,
		tempSt

	$header.addClass('fixed')

	function detectScroll() {
		tempSt = window.scrollY
		if (tempSt > st + offset) {
			$header.addClass('hidden')
			st = tempSt
		} else if (tempSt < st) {
			$header.removeClass('hidden')
			st = tempSt
		}
	}

	if (st) {
		window.scroll(0, 0) // reset the scroll position to the top left of the document.
		st = window.scrollY
	}

	$(window).on('scroll', detectScroll)
}

function albumScripts() {
	if ($('.single-muso-album').length) {
		let $articleBody = $('.single-muso-album .article-body'),
			$albumLinks = $articleBody.find('p a.albumlink'),
			$albumList = $articleBody.find('ol'),
			$albumArt = $('.single-muso-album .album-art')
		let $trackList = $articleBody.find('.track-list')

		if (!$('.album-description').length) {
			$trackList.css('height', $albumArt.innerHeight() - 20)
		}

		if (Foundation.MediaQuery.current == 'Small') {
			$trackList.css('max-height', 'none')
		}

		if ($albumLinks.length) {
			let $albumList = $albumLinks.parent('p').addClass('flex-album-list')
			let $albumclone = $albumList.clone()

			$albumclone.find('br').replaceWith('|')
			$albumList.hide()

			$('.albumlist-wrapper').append($albumclone)
		}
	}
}

function updateBodyClasses(newPageRawHTML) {
	if (!newPageRawHTML) {
		// console.log('!newPageRawHTML')
		return
	}
	var response = newPageRawHTML.replace(
		/(<\/?)body( .+?)?>/gi,
		'$1notbody$2>',
		newPageRawHTML
	)
	var bodyClasses = $(response).filter('notbody').attr('class')
	$('body').attr('class', bodyClasses)
}

function activateLinks() {
	var activeLinks = $('a[href="' + location.href + '"]')

	$('a.active').removeClass('active')

	$('a[href="' + location.href + '"]').addClass('active')
}

function runSlick() {
	$('.carousel').each(function() {
		var slides = $(this).find('.slide')
		if (slides.length > 1) {
			var $slider = $(this).slick({
				arrows: false,
				dots: false,
				centerPadding: '40px',
				focusOnSelect: true
			})
		}
	})
}

function borderImages() {
	$('.article-item, article').each(function() {
		let image = $(this).find('img')[0]

		if (!image) return false

		getImageBrightness(image.src, function(br) {
			if (br > 180) {
				$(image).addClass('border')
			}
		})
	})
}

function reflowEqualizer(parent) {
	if (!parent.length) {
		return
	}
	const plugClass = parent.data('zfPlugin')

	if (!plugClass) {
		parent.foundation()
	}
	parent.foundation('getHeightsByRow', heights => {
		parent.foundation('applyHeightByRow', heights)
	})
}

function PreloadVideo() {
	var xhr = new XMLHttpRequest()
	var video = document.getElementById('player')

	if (!video) {
		return
	}

	if (video.preload == 'none') {
		video.src = video.getAttribute('data-src')

		video.addEventListener('play', () => {
			console.log('animate trigger')
			animateLoadingBar(100)
			animateCurtain(10000)
		})

		$('#loading-bar').remove()

		return
	}

	xhr.open('GET', video.getAttribute('data-src'), true)
	xhr.responseType = 'blob'
	xhr.onload = function(e) {
		if (this.status == 200) {
			var myBlob = this.response
			var vid = (window.URL ? URL : URL).createObjectURL(myBlob)
			video.src = vid
		}
	}

	xhr.addEventListener('progress', function(data) {
		var total = data.total,
			loaded = data.loaded,
			pct = loaded / total * 100,
			rounded = Math.floor(pct)

		// console.log('loaded: ', rounded)

		if ($('#loading-container').length) {
			animateLoadingBar(rounded)
		}
	})

	xhr.addEventListener('load', function() {
		console.log('video loaded')
		$(video).css('background-color', '#000')
		animateCurtain(10000)
	})

	xhr.send()
}

function lazyLoadImages() {
	var bLazy = new Blazy({
		success: function(ele) {
			const parent = $(ele).parents('[data-equalizer]')

			reflowEqualizer(parent)

			// border the image
			getImageBrightness(ele.src, function(br) {
				if (br > 180) {
					$(ele).addClass('border')
				}
			})

			// also load the hover image
			$(ele).siblings('img.hover').each(function() {
				$(this).attr('src', $(this).data('src')).removeAttr('data-src')
			})
		},
		container: '#oc-content',
		offset: 150
	})
}

function animateLoadingBar(pct) {
	var barheight = 350 - 350 * pct / 100
	$('#loading-bar').css('height', barheight + 'px')
}

function animateCurtain(delay) {
	var timeout1, timeout2, timeout3

	window.scrollTo(0, 0)
	$('#loading-container').addClass('skip-reveal')

	timeout1 = setTimeout(function() {
		$('.underside').css('opacity', 0)
		timeout2 = setTimeout(function() {
			$('#oc-content').css('overflow-y', 'auto')
			$('body').addClass('remove-curtain')
			timeout3 = setTimeout(function() {
				$('#loading-container').remove()
				$('#header').removeClass('hidden')
			}, delay)
		}, delay)
	}, 100)

	window.addEventListener('keydown', skipCurtain)
	window.addEventListener('click', skipCurtain)

	function skipCurtain() {
		clearTimeout(timeout1)
		clearTimeout(timeout2)
		clearTimeout(timeout3)
		$('#oc-content').css('overflow-y', 'auto')
		$('body').addClass('remove-curtain')
		setTimeout(function() {
			$('#loading-container').remove()
			$('#header').removeClass('hidden')
		}, 2000)
	}
}

function homeCurtainSetup() {
	if ($('.curtain').length) {
		window.scrollTo(0, 0)
		$('#oc-content').css('overflow-y', 'hidden')
		// $('#header').addClass('hidden')
		$('#content').css('margin-top', 0)
	} else {
		$('body').css('overflow-y', '')
		$('#header').removeClass('hidden')
		$('#content').css('margin-top', '')
	}
}

// Page transition Callbacks

function handleLinkClicked(el, evt) {
	$('.hdr-logo-link').addClass('loading')
}

function handleInitStateChange(currentStatus) {}

function handleNewPageReady(current, prev, elCont, newPageRawHTML) {
	$('.hdr-logo-link').removeClass('loading')
	updateBodyClasses(newPageRawHTML)
	stickyNav()
	fillscreen()
	addEventListeners()
	lazyLoadImages()
	PreloadVideo()
	homeCurtainSetup()
}

function handleTransitionComplete() {
	activateLinks()
	runSlick()
	borderImages()
	albumScripts()

	// run foundation
	$(document).foundation()
}

$(document).ready(function() {
	handleNewPageReady()
	handleTransitionComplete()

	barbaApp(
		handleLinkClicked,
		handleInitStateChange,
		handleNewPageReady,
		handleTransitionComplete
	)
})
