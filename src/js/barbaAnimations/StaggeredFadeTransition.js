import $ from 'jquery'
import Barba from 'barba.js'

const StaggeredFadeTransition = Barba.BaseTransition.extend({
	start: function() {
		Promise.all([this.newContainerLoading, this.fadeOut()]).then(() =>
			this.fadeIn()
		)
	},
	fadeOut: function() {
		$('body').animate({ scrollTop: 0 }, 500, 'swing', () => {
			return $(this.oldContainer)
				.find('.post-header, .post-body')
				.animate({ opacity: 0 })
				.promise()
		})
	},
	fadeIn: function() {
		var $el = $(this.newContainer),
			$title = $el.find('.post-header'),
			$content = $el.find('.post-body')

		$(this.oldContainer).hide()

		$el.css({
			visibility: 'visible',
			opacity: 1
		})

		$title.css({
			visibility: 'visible',
			opacity: 0
		})

		$content.css({
			visibility: 'visible',
			opacity: 0
		})

		$title.animate({ opacity: 1 }, 400, () => {
			$content.animate({ opacity: 1 }, 400, () => {
				this.done()
			})
		})
	}
})

export default StaggeredFadeTransition
