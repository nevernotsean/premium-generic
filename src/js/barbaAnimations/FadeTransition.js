import $ from 'jquery'
import Barba from 'barba.js'

const FadeTransition = Barba.BaseTransition.extend({
	start: function() {
		Promise.all([this.newContainerLoading, this.fadeOut()]).then(() =>
			this.fadeIn()
		)
	},
	fadeOut: function() {
		$('body').animate({ scrollTop: 0 }, 400, 'swing', () => {
			return $(this.oldContainer)
				.find('.post-body')
				.animate({ opacity: 0 }, 400)
				.promise()
		})
	},
	fadeIn: function() {
		var $el = $(this.newContainer),
			$content = $el.find('.post-body')

		$(this.oldContainer).hide()

		$el.css({
			visibility: 'visible',
			opacity: 1
		})

		$content.css({
			visibility: 'visible',
			opacity: 0
		})

		if (!$content.length) {
			$el.animate({ opacity: 1 }, 400, () => {
				this.done()
			})
		} else {
			setTimeout(() => {
				$content.animate({ opacity: 1 }, 400, () => {
					this.done()
				})
			}, 400)
		}
	}
})

export default FadeTransition
