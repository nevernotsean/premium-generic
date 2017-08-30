<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::get_context();
$post = Timber::query_post();
$context['post'] = $post;

$args = array(
	'posts_per_page' => -1,
	'post_type' => $post->post_type,
	'post_status' => 'publish'
);
$posts = Timber::get_posts($args);
shuffle($posts);

$more_posts = array_slice($posts, 1, 3);

$context['more_posts'] = $more_posts;

echo "<script> console.dir(" . json_encode($context) . ")</script>";

if ( post_password_required( $post->ID ) ) {
	Timber::render( 'single-password.twig', $context );
} else {
	Timber::render( array( 'single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig' ), $context );
}
